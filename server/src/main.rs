use dashmap::DashMap;
use futures_util::{SinkExt, StreamExt};
use std::sync::Arc;
use tokio::net::{TcpListener, TcpStream};
use tokio::sync::broadcast;
use tokio_tungstenite::{accept_async, tungstenite::Message};
use tracing::{info, warn, error};
use yrs::{Doc, ReadTxn, StateVector, Transact, Update};
use yrs::updates::decoder::Decode;

type Clients = Arc<DashMap<String, broadcast::Sender<Vec<u8>>>>;
type Docs = Arc<DashMap<String, Arc<Doc>>>;

#[tokio::main]
async fn main() {
    // 初始化日志
    tracing_subscriber::fmt::init();

    let addr = "127.0.0.1:1234";
    let listener = TcpListener::bind(addr).await.expect("无法绑定端口");
    
    info!("🚀 Yjs WebSocket 服务器启动在 {}", addr);

    let clients: Clients = Arc::new(DashMap::new());
    let docs: Docs = Arc::new(DashMap::new());

    while let Ok((stream, peer_addr)) = listener.accept().await {
        info!("新连接来自: {}", peer_addr);
        tokio::spawn(handle_connection(
            stream,
            clients.clone(),
            docs.clone(),
        ));
    }
}

async fn handle_connection(stream: TcpStream, clients: Clients, docs: Docs) {
    let ws_stream = match accept_async(stream).await {
        Ok(ws) => ws,
        Err(e) => {
            error!("WebSocket 握手失败: {}", e);
            return;
        }
    };

    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
    let mut doc_id: Option<String> = None;
    let mut rx: Option<broadcast::Receiver<Vec<u8>>> = None;

    loop {
        tokio::select! {
            // 接收客户端消息
            msg = ws_receiver.next() => {
                match msg {
                    Some(Ok(Message::Binary(data))) => {
                        if data.is_empty() {
                            continue;
                        }

                        let msg_type = data[0];
                        
                        match msg_type {
                            // Sync Step 1: 客户端发送状态向量
                            0 => {
                                if let Some(id) = extract_doc_id(&data) {
                                    info!("📄 客户端请求文档: {}", id);
                                    doc_id = Some(id.clone());

                                    // 获取或创建文档
                                    let doc = docs.entry(id.clone()).or_insert_with(|| {
                                        info!("✨ 创建新文档: {}", id);
                                        Arc::new(Doc::new())
                                    }).clone();

                                    // 创建广播通道
                                    let (tx, new_rx) = broadcast::channel(100);
                                    clients.insert(id.clone(), tx);
                                    rx = Some(new_rx);

                                    // 发送完整文档状态
                                    let state_vector = StateVector::default();
                                    let update = {
                                        let txn = doc.transact();
                                        txn.encode_state_as_update_v1(&state_vector)
                                    };
                                    
                                    let mut response = Vec::new();
                                    response.push(1); // Sync Step 2
                                    response.extend_from_slice(&update);
                                    
                                    if let Err(e) = ws_sender.send(Message::Binary(response)).await {
                                        error!("发送文档状态失败: {}", e);
                                    }
                                }
                            }
                            // Update: 客户端发送更新
                            2 => {
                                if let Some(ref id) = doc_id {
                                    if let Some(doc) = docs.get(id) {
                                        // 应用更新到文档
                                        if data.len() > 1 {
                                            let update_data = &data[1..];
                                            if let Ok(update) = Update::decode_v1(update_data) {
                                                let mut txn = doc.transact_mut();
                                                txn.apply_update(update);
                                                info!("✅ 应用更新到文档: {}", id);
                                                    
                                                // 广播给其他客户端
                                                if let Some(tx) = clients.get(id) {
                                                    let _ = tx.send(data.clone());
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            _ => {
                                warn!("未知消息类型: {}", msg_type);
                            }
                        }
                    }
                    Some(Ok(Message::Text(_))) => {}
                    Some(Ok(Message::Close(_))) => {
                        info!("客户端断开连接");
                        break;
                    }
                    Some(Err(e)) => {
                        error!("WebSocket 错误: {}", e);
                        break;
                    }
                    None => break,
                    _ => {}
                }
            }

            // 接收广播消息并转发给客户端
            update = async {
                if let Some(ref mut receiver) = rx {
                    receiver.recv().await.ok()
                } else {
                    None
                }
            } => {
                if let Some(data) = update {
                    if let Err(e) = ws_sender.send(Message::Binary(data)).await {
                        error!("转发更新失败: {}", e);
                        break;
                    }
                }
            }
        }
    }

    // 清理
    if let Some(id) = doc_id {
        info!("🧹 清理文档: {}", id);
        // 这里可以添加持久化逻辑
    }
}

// 从消息中提取文档 ID
fn extract_doc_id(data: &[u8]) -> Option<String> {
    if data.len() < 2 {
        return None;
    }
    
    // 简单实现：假设文档 ID 在消息的特定位置
    // 实际使用中可能需要更复杂的解析
    let id_bytes = &data[1..];
    String::from_utf8(id_bytes.to_vec()).ok()
}
