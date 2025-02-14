---
title: gin
date: 2024-10-21 14:32:26
categories:
  - SE
  - Go
tags:
---


关于 Golang 框架 Gin 的使用

<!--more-->

### Gin 是什么

### 如何创建 Gin 项目

#### 1. 创建项目目录

```bash
mkdir my-gin-project

cd my-gin-project
```

#### 2. 初始化 Go 模块

```bash
go mod init my-gin-project
```

#### 3. 获取 Gin 包

```bash
go get github.com/gin-gonic/gin@latest
```

#### 4. 创建主应用程序文件

在 `cmd/yourapp/main.go` 中创建主应用程序文件：

```bash
mkdir -p cmd/yourapp
touch cmd/yourapp/main.go
```

```go
// cmd/yourapp/main.go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default()
    
    r.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello, World!",
        })
    })
    
    r.Run() // 默认监听并在 0.0.0.0:8080 上启动服务
}
```



#### 5. 项目的大致结构

```
my-gin-project/
├── cmd/
│   └── yourapp/
│       └── main.go
├── go.mod
└── go.sum
```

