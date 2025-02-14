---
title: go-websocket
tags:
---

如何基于 `Golang` 实现 `websocket` 通信

<!--more-->

### websocket 通信的过程简述

### 初始化模块并获得相关依赖

创建一个新的目录用于该项目，并初始化 Go 模块：

```bash
mkdir websocket-chat
cd websocket-chat
go mod init websocket-chat
```

使用 `Gorilla WebSocket` 库来简化 WebSocket 的处理

使用 `gin` 作为 http server

```bash
go get -u github.com/gorilla/websocket
go get github.com/gin-gonic/gin
```

### websocket 如何接发信息

- 首先需要将 `HTTP` 连接升级至 `WebSocket` 连接
  - 在这一步中需要定义一个 `WebSocket` 升级器，用于将 `HTTP` 连接升级至 `WebSocket` 连接
  - 并且需要对请求的 `Origin` 进行检查，以确保连接的安全性
- 升级完成之后可以得到一个类型为 `*websocket.Conn` 的 `WebSocket` 连接，通过该连接可以进行信息的接收和发送
- 通过 `ReadMessage` 方法可以接收客户端发送的信息
- 通过 `WriteMessage` 方法可以向客户端发送信息

> [!caution]
> WebSocket 协议的握手请求**必须是一个 HTTP GET 请求**，这是 WebSocket 协议规范所要求的。

### websocket 简单代码实现

```go
package main

import (
	"log"
	"net/http"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// 定义 WebSocket 升级器
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		log.Println("Origin:", r.Header.Get("Origin"))
		return true // 实际应用中应检查 origin
	},
}

// 处理 WebSocket 连接的函数
func websocketHandler(c *gin.Context) {
	log.Println("WebSocket connection established")
	// 将 HTTP 连接升级至 WebSocket
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer ws.Close()

	// 简单的 echo 逻辑
	for {
		mt, message, err := ws.ReadMessage() // 读取客户端发送的信息
		if err != nil {
			log.Println("Read error:", err)
			break
		}
		log.Printf("Received: %s", message)
		str_message := string(message) + " from server"
		err = ws.WriteMessage(mt, []byte(str_message))  // 向客户端发送信息
		if err != nil {
			log.Println("Write error:", err)
			break
		}
	}
}

func main() {
	r := gin.Default()
	r.GET("/ws", websocketHandler)
	r.Run(":8080") // 启动 HTTP 服务器
}

```

### websocket 如何将信息传递给指定的客户端

在实际的应用中我们往往需要将从一个客户端接收到的信息传递给其他的客户端，这就需要我们维护一个客户端的连接池，以便能够根据客户端的标识符找到对应的连接。

- 通过 `map` 来存储 `WebSocket` 连接，以便能够根据客户端的标识符找到对应的连接
- 在收到信息后，根据请求中带有的 `client_id` 找到对应的连接，并将信息发送给该连接

### 验证 `websocket` 的实现（无前端）

1. **安装 `wscat`**

   如果你使用的是 Node.js 环境，可以通过 npm 来安装：

   ```
   npm install -g wscat
   ```

2. **连接 WebSocket 服务器**

   使用 `wscat` 客户端连接至你的 WebSocket 服务：

   ```bash
   wscat -c ws://localhost:8080/ws
   ```


3. 连接成功后，你可以在命令行中输入消息并发送，服务器会回显收到的消息。
