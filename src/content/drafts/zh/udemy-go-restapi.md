---
title: udemy-go-restapi
tags:
---
udemy
如何使用 Go 语言构建 RESTful API
<!--more-->

### 搭建整体框架 -- 使用 gin 框架

#### gin 简介

Gin is a web framework written in Go (Golang). It features a martini-like API with much better performance -- up to 40 times faster. If you need smashing performance, get yourself some Gin.(GPT)

#### 安装 gin

```bash
go mod init udemy-go-restapi // if you don't have a go.mod file
go get -u github.com/gin-gonic/gin
```

### 使用 Gin 构建 RESTful API

这部分内容可以参照仓库中的具体代码

### 如何从请求中获取参数

#### 获取 Json 数据(从body中获取)

```go
func createEvent(context *gin.Context) {
	var event models.Event // create a new event
	context.ShouldBindJSON(&event) // bind the request body to the event
	event.Save() // save the event to the database
	context.JSON(http.StatusCreated, event) // return a JSON response with the event
}
```

>[!TIP]
> 你可以通过 struct tag 来指定 json 字段名


#### 获取 Query 参数

```go
```

>[!TIP]
> 如果使用 VSCode 中的 REST Client 插件，可以直接在编辑器中发送请求
> 如果出现 403 错误时 可以尝试将 localhost 改为 本地的 ip 地址


### 连接数据库

#### 安装 go-sqlite3 依赖

```bash
go get -u github.com/mattn/go-sqlite3
```

#### 数据操作

- 这部分内容可以参照仓库中的具体代码
- 需要关注的是，对于 `update` 和 `delete` 等对数据库数据进行修改的操作，需要使用 `db.Prepare` 和 `db.Exec` 方法


### 项目结构的优化

- 如果将所有对与请求路径的处理代码都放在 `main.go` 中，会使得代码变得难以维护
  - `server.GET()`
- 所以可以将这个路径注册的过程也进行封装，构建一个 `routes` 包，用于注册所有的路由
- 同时将每个路由对应的处理函数也进行封装，可以放在这个包中，也可以放在 `controllers` 包中
  
```go
package routes

import "github.com/gin-gonic/gin"

// RegisterRoutes registers all the routes of the application

func RegisterRoutes(server *gin.Engine) {
	server.GET("/hello", helloWorld)
	server.GET("/events", getEvents)
	server.POST("/events", createEvent)
	server.GET("/events/:id", getEvent)
}

```

### 用户登陆验证与接口鉴权 - 基于 Json Web Token

- 需要安装 `jwt` 相关依赖，具体请参考 Golang 官方文档和 github 仓库
- 实现用户鉴权的过程实际上与 Java (SpringSecurity) 类似，都是通过用户登陆的信息生成 token，然后在后续的请求中携带这个 token，进行鉴权
- 具体请参考仓库中的代码