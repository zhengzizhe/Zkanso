#!/bin/bash

# CRDT WebSocket 服务器启动脚本

PORT=${1:-8080}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== CRDT WebSocket 服务器 ==="
echo "端口: $PORT"
echo ""

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "❌ 错误: 未找到 Java"
    exit 1
fi

# 检查并下载依赖
if [ ! -f "lib/Java-WebSocket-1.5.3.jar" ]; then
    echo "📦 下载依赖..."
    mkdir -p lib
    curl -L -s -o lib/Java-WebSocket-1.5.3.jar \
        https://repo1.maven.org/maven2/org/java-websocket/Java-WebSocket/1.5.3/Java-WebSocket-1.5.3.jar
    curl -L -s -o lib/gson-2.10.1.jar \
        https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
    curl -L -s -o lib/slf4j-api-1.7.36.jar \
        https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar
    curl -L -s -o lib/slf4j-simple-1.7.36.jar \
        https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/1.7.36/slf4j-simple-1.7.36.jar
    echo "✅ 依赖下载完成"
fi

# 编译
echo "🔨 编译 Java 文件..."
mkdir -p target/classes/com/kanso/server
javac -cp "lib/*" -d target/classes src/main/java/com/kanso/server/CRDTServer.java

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

# 检查端口
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  端口 $PORT 已被占用"
    read -p "是否停止占用端口的进程? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
        sleep 1
    else
        exit 1
    fi
fi

# 启动服务器
echo "🚀 启动服务器..."
java -cp "lib/*:target/classes" com.kanso.server.CRDTServer $PORT



