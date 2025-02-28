---
title: Hertz + Gorm
categories:
  - SE
  - Go
tags:
 - SE
 - Go
date: 2024-10-23 16:23:50
---


什么是 Hertz ，以及如何在项目中去使用 Hertz

什么是 Gorm ，以及如何在项目中去使用 Gorm

<!--more-->

## Hertz

### 什么是 `Hertz`

Hertz 是由字节跳动（ByteDance）开发的一个高性能、可扩展的 HTTP 框架，主要用于构建高性能的 Web 服务和 API。它基于 Go 语言开发，旨在提供高效、灵活的 HTTP 处理能力。

### `Hertz` 有什么用

1. **构建 RESTful API**：
   - Hertz 提供了高效的路由和请求处理能力，非常适合用于构建 RESTful API 服务。
2. **微服务架构**：
   - Hertz 可以作为微服务框架的一部分，处理 HTTP 请求，并与其他微服务进行通信。
   - 使用 Hertz 服务器示例作为网关，将用户的请求转发到对应的微服务上进行处理
3. **高并发 Web 应用**：
   - 由于其高性能和高并发处理能力，Hertz 适用于需要处理大量并发请求的 Web 应用。



### 如何使用 `Hertz`

#### 代码配置

```go
package main

import (
    "github.com/cloudwego/hertz/pkg/app"
    "github.com/cloudwego/hertz/pkg/app/server"
    "github.com/cloudwego/hertz/pkg/route"
)

func main() {
    // 创建 Hertz 服务器实例
    h := server.Default()

    // 定义路由和处理函数
    h.GET("/ping", func(c context.Context, ctx *app.RequestContext) {
        ctx.JSON(200, map[string]string{
            "message": "pong",
        })
    })

    // 启动服务器
    h.Spin()
}
```

#### 服务器启动

- `h.Spin()`：快速启动服务器，使用默认配置，适合开发和调试。
- `h.Run()`：启动服务器并指定监听地址和端口，适合生产环境。

## Grom

### 什么是 `Gorm`

GORM 是一个用于 Go 语言的 ORM（对象关系映射）库，它提供了简洁且强大的 API，用于与关系型数据库进行交互。GORM 支持多种数据库，包括 MySQL、PostgreSQL、SQLite 和 SQL Server 等。

### `Gorm` 有什么用

类似于 JPA 提供各种 API 帮助开发者与数据库进行更高效的交互

### 如何在项目中配置  `Gorm`

#### 安装 GORM 和 MySQL 驱动

```bash
go get gorm.io/gorm
go get gorm.io/driver/mysql
```

#### 连接数据库

1. 使用配置文件存储连接数据库的密钥等重要信息
2. 这些配置信息存储在 pkg/conf

```go
package db

import (
	"git.nju.edu.cn/.../conf"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
)

var DB *gorm.DB

func Init() {

	var err error
	DB, err = gorm.Open(mysql.Open(conf.MySQLDefaultDSN), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database: ", err)
	}

	// 自动迁移 User 模型  自动创建或者跟新数据库中的表结构
	err = DB.AutoMigrate(&User{})
	if err != nil {
		log.Fatal("failed to migrate database: ", err)
	}
}

```



### 如何使用  `Gorm`

```go
package main

import (
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "log"
)

func main() {
    // 连接数据库
    db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
    
    // 创建
    db.Create(&User{Name: "John", Email: "john@example.com"})

    // 读取
    var user User
    db.First(&user, 1) // 根据主键查找
    db.First(&user, "email = ?", "john@example.com") // 查找 email 为 john@example.com 的用户

    // 更新 - 更新用户的名字为 Bob
    db.Model(&user).Update("Name", "Bob")

    // 删除 - 删除用户
    db.Delete(&user, 1)
}
```

#### 自动迁移模式

自动迁移模式（Auto Migration）是 GORM 提供的一种功能，用于根据模型结构自动创建、更新或删除数据库表和字段。它可以帮助开发者在开发过程中自动同步数据库表结构与代码中的模型定义，减少手动管理数据库表结构的工作量。

自动迁移模式的作用

1. **创建表**：如果数据库中不存在与模型对应的表，自动迁移模式会自动创建该表。
2. **添加字段**：如果模型中新增了字段，自动迁移模式会自动在表中添加相应的字段。
3. **更新字段类型**：如果模型中字段的类型发生了变化，自动迁移模式会自动更新表中字段的类型。
4. **删除字段**：自动迁移模式不会自动删除表中不再使用的字段，这是为了防止数据丢失。如果需要删除字段，需要手动进行。
