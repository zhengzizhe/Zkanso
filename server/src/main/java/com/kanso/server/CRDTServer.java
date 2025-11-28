package com.kanso.server;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * CRDT WebSocket 转发服务器
 * 负责接收和转发 CRDT 操作
 */
public class CRDTServer extends WebSocketServer {
    
    private static final int DEFAULT_PORT = 8080;
    private final Gson gson = new Gson();
    
    // 文档ID -> 连接的客户端集合
    private final Map<String, Set<WebSocket>> docClients = new ConcurrentHashMap<>();
    
    // 客户端ID -> 文档ID映射
    private final Map<WebSocket, String> clientDocs = new ConcurrentHashMap<>();
    
    // 客户端ID -> 站点ID映射
    private final Map<WebSocket, String> clientSites = new ConcurrentHashMap<>();
    
    // 文档ID -> 文档状态缓存（完整文档）
    private final Map<String, JsonObject> docCache = new ConcurrentHashMap<>();
    
    // 文档ID -> 最后更新时间
    private final Map<String, Long> docLastModified = new ConcurrentHashMap<>();
    
    // 文档ID -> 文档版本号（用于增量更新）
    private final Map<String, Long> docVersions = new ConcurrentHashMap<>();
    
    // 文档ID -> 操作历史（用于恢复）
    private final Map<String, List<JsonObject>> docHistory = new ConcurrentHashMap<>();
    
    public CRDTServer(int port) {
        super(new InetSocketAddress(port));
    }
    
    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        System.out.println("客户端连接: " + conn.getRemoteSocketAddress());
        
        // 从查询参数获取 docId 和 siteId
        String query = handshake.getResourceDescriptor();
        String docId = extractParam(query, "docId");
        String siteId = extractParam(query, "siteId");
        
        if (docId == null || docId.isEmpty()) {
            System.err.println("缺少 docId 参数，关闭连接");
            conn.close();
            return;
        }
        
        if (siteId == null || siteId.isEmpty()) {
            siteId = "site-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        }
        
        // 注册客户端
        clientDocs.put(conn, docId);
        clientSites.put(conn, siteId);
        
        // 添加到文档客户端集合
        docClients.computeIfAbsent(docId, k -> ConcurrentHashMap.newKeySet()).add(conn);
        
        System.out.println("客户端注册: docId=" + docId + ", siteId=" + siteId);
        
        // 发送连接成功消息
        sendMessage(conn, createMessage("connected", null, null, siteId));
        
        // 如果有缓存的文档状态，发送完整文档给新连接的客户端
        if (docCache.containsKey(docId)) {
            JsonObject cachedDoc = docCache.get(docId);
            JsonObject syncMessage = new JsonObject();
            syncMessage.addProperty("type", "sync");
            syncMessage.addProperty("siteId", siteId);
            syncMessage.add("document", cachedDoc);
            syncMessage.addProperty("version", docVersions.getOrDefault(docId, 0L));
            syncMessage.addProperty("lastModified", docLastModified.getOrDefault(docId, System.currentTimeMillis()));
            sendMessage(conn, syncMessage.toString());
            System.out.println("发送完整文档给新客户端: docId=" + docId + 
                ", blocks=" + (cachedDoc.has("blocks") ? cachedDoc.getAsJsonArray("blocks").size() : 0));
        }
    }
    
    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        System.out.println("客户端断开: " + conn.getRemoteSocketAddress());
        
        String docId = clientDocs.remove(conn);
        String siteId = clientSites.remove(conn);
        
        if (docId != null) {
            Set<WebSocket> clients = docClients.get(docId);
            if (clients != null) {
                clients.remove(conn);
                if (clients.isEmpty()) {
                    docClients.remove(docId);
                }
            }
            
            // 通知其他客户端用户离开
            broadcastToDoc(docId, conn, createMessage("user-leave", null, null, siteId));
        }
    }
    
    @Override
    public void onMessage(WebSocket conn, String message) {
        try {
            if (message == null || message.trim().isEmpty()) {
                System.err.println("收到空消息，忽略");
                return;
            }
            
            JsonObject json = JsonParser.parseString(message).getAsJsonObject();
            
            if (!json.has("type")) {
                System.err.println("消息缺少 type 字段，忽略");
                return;
            }
            
            String type = json.get("type").getAsString();
            String docId = clientDocs.get(conn);
            String siteId = clientSites.get(conn);
            
            if (docId == null) {
                System.err.println("未注册的客户端发送消息，忽略");
                return;
            }
            
            switch (type) {
                case "operation":
                    // 转发单个操作
                    handleOperation(conn, json, docId, siteId);
                    break;
                    
                case "batch":
                    // 转发批量操作
                    handleBatch(conn, json, docId, siteId);
                    break;
                    
                case "sync":
                    // 同步请求
                    handleSync(conn, json, docId, siteId);
                    break;
                    
                case "join":
                    // 用户加入
                    handleJoin(conn, json, docId, siteId);
                    break;
                    
                case "cursor":
                    // 光标更新
                    handleCursor(conn, json, docId, siteId);
                    break;
                    
                default:
                    System.err.println("未知消息类型: " + type + "，忽略");
                    // 不关闭连接，只记录错误
            }
        } catch (com.google.gson.JsonSyntaxException e) {
            System.err.println("JSON 解析错误: " + e.getMessage());
            // 不关闭连接，只记录错误
        } catch (Exception e) {
            System.err.println("处理消息错误: " + e.getMessage());
            e.printStackTrace();
            // 不关闭连接，只记录错误
        }
    }
    
    @Override
    public void onError(WebSocket conn, Exception ex) {
        System.err.println("WebSocket 错误: " + ex.getMessage());
        ex.printStackTrace();
    }
    
    @Override
    public void onStart() {
        System.out.println("CRDT 服务器启动在端口: " + getPort());
    }
    
    /**
     * 处理单个操作
     */
    private void handleOperation(WebSocket conn, JsonObject json, String docId, String siteId) {
        JsonObject operation = json.getAsJsonObject("operation");
        if (operation == null) {
            return;
        }
        
        // 检查是否是增量更新
        boolean isIncremental = json.has("isIncremental") && json.get("isIncremental").getAsBoolean();
        
        // 更新文档缓存（如果有完整文档状态，且不是增量更新）
        JsonObject documentToCache = null;
        if (json.has("document") && !isIncremental) {
            JsonObject document = json.getAsJsonObject("document");
            if (document != null && document.size() > 0) {
                docCache.put(docId, document);
                docLastModified.put(docId, System.currentTimeMillis());
                docVersions.put(docId, docVersions.getOrDefault(docId, 0L) + 1);
                documentToCache = document;
                System.out.println("更新文档缓存: docId=" + docId + ", blocks=" + 
                    (document.has("blocks") ? document.getAsJsonArray("blocks").size() : 0) +
                    ", version=" + docVersions.get(docId));
            }
        }
        
        // 创建转发消息
        JsonObject forwardMessage = new JsonObject();
        forwardMessage.addProperty("type", "operation");
        forwardMessage.addProperty("siteId", siteId);
        forwardMessage.add("operation", operation);
        
        // 【关键修复】对于增量更新，不添加 document 字段，只转发 operation
        // 对于非增量更新（初始同步等），才添加 document 字段
        if (!isIncremental) {
            if (documentToCache != null) {
                forwardMessage.add("document", documentToCache);
            } else if (docCache.containsKey(docId)) {
                // 如果没有新文档，使用缓存的文档（仅非增量更新时）
                forwardMessage.add("document", docCache.get(docId));
            }
        } else {
            // 增量更新：明确标记为增量，不包含 document
            forwardMessage.addProperty("isIncremental", true);
        }
        
        // 转发给同一文档的其他客户端
        broadcastToDoc(docId, conn, forwardMessage.toString());
        
        System.out.println("转发操作: docId=" + docId + ", siteId=" + siteId + 
            ", isIncremental=" + isIncremental +
            ", hasDocument=" + forwardMessage.has("document"));
    }
    
    /**
     * 处理批量操作
     */
    private void handleBatch(WebSocket conn, JsonObject json, String docId, String siteId) {
        if (!json.has("operations")) {
            return;
        }
        
        // 更新文档缓存（如果有完整文档状态）
        if (json.has("document")) {
            JsonObject document = json.getAsJsonObject("document");
            if (document != null && document.size() > 0) {
                docCache.put(docId, document);
                docLastModified.put(docId, System.currentTimeMillis());
                System.out.println("更新文档缓存（batch）: docId=" + docId + ", blocks=" + 
                    (document.has("blocks") ? document.getAsJsonArray("blocks").size() : 0));
            }
        }
        
        // 转发给同一文档的其他客户端
        broadcastToDoc(docId, conn, createMessage("batch", null, json.getAsJsonArray("operations"), siteId));
        
        System.out.println("转发批量操作: docId=" + docId + ", siteId=" + siteId);
    }
    
    /**
     * 处理同步请求 - 发送完整文档
     */
    private void handleSync(WebSocket conn, JsonObject json, String docId, String siteId) {
        // 发送缓存的完整文档状态
        if (docCache.containsKey(docId)) {
            JsonObject cachedDoc = docCache.get(docId);
            JsonObject syncMessage = new JsonObject();
            syncMessage.addProperty("type", "sync");
            syncMessage.addProperty("siteId", siteId);
            syncMessage.add("document", cachedDoc);
            syncMessage.addProperty("version", docVersions.getOrDefault(docId, 0L));
            syncMessage.addProperty("lastModified", docLastModified.getOrDefault(docId, System.currentTimeMillis()));
            sendMessage(conn, syncMessage.toString());
            System.out.println("同步完整文档状态: docId=" + docId + ", siteId=" + siteId + 
                ", blocks=" + (cachedDoc.has("blocks") ? cachedDoc.getAsJsonArray("blocks").size() : 0));
        } else {
            // 如果没有缓存，返回空文档
            JsonObject syncMessage = new JsonObject();
            syncMessage.addProperty("type", "sync");
            syncMessage.addProperty("siteId", siteId);
            JsonObject emptyDoc = new JsonObject();
            emptyDoc.add("blocks", new com.google.gson.JsonArray());
            syncMessage.add("document", emptyDoc);
            syncMessage.addProperty("version", 0L);
            syncMessage.addProperty("lastModified", System.currentTimeMillis());
            sendMessage(conn, syncMessage.toString());
            System.out.println("同步空文档: docId=" + docId);
        }
    }
    
    /**
     * 处理用户加入
     */
    private void handleJoin(WebSocket conn, JsonObject json, String docId, String siteId) {
        // 如果客户端发送了文档状态，更新缓存
        if (json.has("state")) {
            JsonObject state = json.getAsJsonObject("state");
            docCache.put(docId, state);
            docLastModified.put(docId, System.currentTimeMillis());
            System.out.println("更新文档缓存（join）: docId=" + docId);
        }
        
        // 通知其他客户端用户加入
        broadcastToDoc(docId, conn, createMessage("user-join", null, null, siteId));
    }
    
    /**
     * 处理光标更新
     */
    private void handleCursor(WebSocket conn, JsonObject json, String docId, String siteId) {
        JsonObject cursor = json.getAsJsonObject("cursor");
        if (cursor == null) {
            return;
        }
        
        // 转发光标更新给其他客户端
        JsonObject message = new JsonObject();
        message.addProperty("type", "cursor");
        message.addProperty("siteId", siteId);
        message.add("cursor", cursor);
        
        broadcastToDoc(docId, conn, message.toString());
    }
    
    /**
     * 广播消息到文档的所有客户端（除了发送者）
     */
    private void broadcastToDoc(String docId, WebSocket exclude, String message) {
        Set<WebSocket> clients = docClients.get(docId);
        if (clients == null) {
            return;
        }
        
        for (WebSocket client : clients) {
            if (client != exclude && client.isOpen()) {
                client.send(message);
            }
        }
    }
    
    /**
     * 发送消息给单个客户端
     */
    private void sendMessage(WebSocket conn, String message) {
        if (conn.isOpen()) {
            conn.send(message);
        }
    }
    
    /**
     * 创建消息
     */
    private String createMessage(String type, JsonObject operation, com.google.gson.JsonElement operations, String siteId) {
        JsonObject message = new JsonObject();
        message.addProperty("type", type);
        message.addProperty("siteId", siteId);
        
        if (operation != null) {
            message.add("operation", operation);
        }
        
        if (operations != null) {
            message.add("operations", operations);
        }
        
        return message.toString();
    }
    
    /**
     * 从查询字符串提取参数
     */
    private String extractParam(String query, String paramName) {
        if (query == null || !query.contains("?")) {
            return null;
        }
        
        String[] parts = query.split("\\?");
        if (parts.length < 2) {
            return null;
        }
        
        String[] params = parts[1].split("&");
        for (String param : params) {
            String[] kv = param.split("=");
            if (kv.length == 2 && kv[0].equals(paramName)) {
                return kv[1];
            }
        }
        
        return null;
    }
    
    /**
     * 主方法
     */
    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.err.println("无效的端口号，使用默认端口: " + DEFAULT_PORT);
            }
        }
        
        CRDTServer server = new CRDTServer(port);
        server.start();
        
        System.out.println("CRDT WebSocket 服务器运行在 ws://localhost:" + port);
        System.out.println("按 Ctrl+C 停止服务器");
    }
}

