---
title: hertz-cors
tags:
categories:
  - SE
  - Go
---

为 Hertz Http 服务器配置 CORS 跨域资源共享

<!--more-->

### 安装所需要的包

```go
go get github.com/hertz-contrib/cors
```



### 在 Hertz 服务器中配置并使用 CORS 中间件

1. 使用 cors.New 函数创建一个新的 CORS 中间件，并指定配置。
2. AllowOrigins 字段设置为 * 以允许所有来源。你可以根据需要指定特定的来源。
3. AllowMethods 字段指定允许的 HTTP 方法。
4. AllowHeaders 字段指定允许的头。
5. ExposeHeaders 字段指定可以暴露给浏览器的头。
6. AllowCredentials 字段设置为 true 以允许凭证

```go
package main

import (
    "context"
    "github.com/cloudwego/hertz/pkg/app"
    "github.com/cloudwego/hertz/pkg/app/server"
    "github.com/hertz-contrib/cors"
    "git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/pkg/conf"
)

func main() {
    // 初始化 Hertz 服务器
    h := server.New(server.WithHostPorts(conf.ApiAddress))

    // 配置 CORS 中间件
    corsConfig := cors.New(cors.Config{
        AllowOrigins:     []string{"*"}, // 允许所有来源，你可以指定特定的来源
        AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
        ExposeHeaders:    []string{"Content-Length"},
        AllowCredentials: true,
    })

    // 使用 CORS 中间件
    h.Use(corsConfig)

    // 定义路由
    userGroup := h.Group("/user")
    userGroup.POST("/register", handler_user.CreateUser)
    userGroup.POST("/login", handler_user.Login)

    toolGroup := h.Group("/tool")
    toolGroup.POST("/uploadMusic", handler_tool.UploadMusicToCos)

    managerGroup := h.Group("/manager")
    managerGroup.POST("/upload", handler_manager.UploadMusicInfo)

    // 启动服务器
    h.Spin()
}
```





