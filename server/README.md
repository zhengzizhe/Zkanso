# CRDT WebSocket 转发服务器

## 功能

- 接收客户端 CRDT 操作
- 转发操作到同一文档的其他客户端
- 管理文档和客户端连接
- 支持批量操作
- 支持光标同步

## 编译和运行

### 使用 Maven

```bash
# 编译
mvn clean package

# 运行
java -jar target/crdt-server-1.0.0.jar [端口号]

# 默认端口 8080
java -jar target/crdt-server-1.0.0.jar
```

### 直接运行

```bash
# 编译
javac -cp "lib/*:." src/main/java/com/kanso/server/CRDTServer.java

# 运行
java -cp "lib/*:." com.kanso.server.CRDTServer [端口号]
```

## WebSocket 连接

客户端连接 URL:
```
ws://localhost:8080?docId=<文档ID>&siteId=<站点ID>
```

## 消息协议

### 客户端 → 服务器

**单个操作**:
```json
{
  "type": "operation",
  "operation": { ... },
  "siteId": "site-xxx"
}
```

**批量操作**:
```json
{
  "type": "batch",
  "operations": [ ... ],
  "siteId": "site-xxx"
}
```

### 服务器 → 客户端

**操作转发**:
```json
{
  "type": "operation",
  "operation": { ... },
  "siteId": "site-xxx"
}
```

**用户加入/离开**:
```json
{
  "type": "user-join" | "user-leave",
  "siteId": "site-xxx"
}
```

## 日志

服务器会输出以下日志：
- 客户端连接/断开
- 操作转发
- 错误信息



