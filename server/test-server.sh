#!/bin/bash

# CRDT 服务器测试脚本

echo "=== CRDT WebSocket 服务器测试 ==="

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "错误: 未找到 Java"
    exit 1
fi

# 检查端口是否被占用
PORT=${1:-8080}
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "警告: 端口 $PORT 已被占用"
    echo "尝试停止占用端口的进程..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# 下载依赖（如果需要）
if [ ! -f "lib/Java-WebSocket-1.5.3.jar" ]; then
    echo "下载依赖..."
    mkdir -p lib
    curl -L -o lib/Java-WebSocket-1.5.3.jar \
        https://repo1.maven.org/maven2/org/java-websocket/Java-WebSocket/1.5.3/Java-WebSocket-1.5.3.jar
    curl -L -o lib/gson-2.10.1.jar \
        https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
fi

# 编译 Java 文件
echo "编译 Java 文件..."
mkdir -p target/classes/com/kanso/server
javac -cp "lib/*" -d target/classes src/main/java/com/kanso/server/CRDTServer.java

if [ $? -ne 0 ]; then
    echo "编译失败"
    exit 1
fi

# 启动服务器
echo "启动服务器在端口 $PORT..."
java -cp "lib/*:target/classes" com.kanso.server.CRDTServer $PORT &
SERVER_PID=$!

# 等待服务器启动
sleep 2

# 检查服务器是否启动成功
if ! ps -p $SERVER_PID > /dev/null; then
    echo "服务器启动失败"
    exit 1
fi

echo "服务器已启动 (PID: $SERVER_PID)"
echo "WebSocket URL: ws://localhost:$PORT"
echo ""
echo "按 Ctrl+C 停止服务器"

# 等待用户中断
trap "kill $SERVER_PID 2>/dev/null; exit" INT TERM
wait $SERVER_PID



