---
title: kitex-framework
categories:
  - SE
  - Go
date: 2024-10-23 16:23:17
tags:
---


Kitex 框架下的项目结构（包括如何创建）

<!--more-->

### 编写 IDL 并生成接口框架

一般不同的服务都会使用不同的 IDL，我的理解在微服务的场景下应该会是一个服务定义至少一个 IDL

```bash
# 项目根目录下
# 创建一个 idl目录用于存放所有的idl信息
mkdir idl
cd idl
touch user.thrift
```

```
namespace go music.service.user

// User 结构体定义了用户的属性。
struct User {
    1: i64 id,
    2: string username,
    3: string phone,
    4: string password,
    5: string avatar,
    6: string role,
}
struct GetUserResp{
    1: User user,
    2: string code,
}

struct GetUserReq{
    1: i64 id,
}
// UserService 定义了用户服务的接口。
service UserService {
    User GetUser(1: GetUserReq req)
    bool CreateUser(1: User user)
    bool UpdateUser(1: User user)
    bool DeleteUser(1: i64 id)
}

```



### Kitex 生成带有脚手架的代码

#### 生成 go.mod 以及 kitex_gen 

这里 Kitex 根据用户在 idl 中编写的接口定义生成了以下的内容（位于 kitex_gen 中 ｜go 代码）：

-  idl 中定义的接口的一些数据结构的具体实现
- 服务 service 接口
- 服务的**客户端代码**（客户端用于当网关接收到请求时，向对应服务的服务端发送请求并获得返回值）

```bash
# module 用于后面的依赖的导入 可以使用仓库的地址
kitex -module music_service idl/user.thrift 
# 更加推荐的方式
kitex -module git.xxx/xxx idl/user.thrift

```

1. `-module` : 指定生成代码的 Go 模块名称 (music_service -> music.service)
2. 后面加上对应 .thrift 文件的位置

#### 生成服务端脚手架

```bash
# 在 rpc/user 目录下
kitex -module music_service -service music_service.user -use music_service/kitex_gen ../../idl/user.thrift

# 更加推荐的方式
kitex -module git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server -service UserService -use git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/kitex_gen/ ../../idl/user.thrift
```

1. `-module` ：指定生成代码的 Go 模块名称
2. `-service` ：参数表明我们要生成脚手架代码，后面加上的为该服务的名称
3. `-use` ：参数表示让 kitex 不生成 `kitex_gen` 目录，而使用该选项给出的 `import path`。因为上面的命令已经生成 `kitex_gen` 目录了，后面都可以复用。
4. 后面加上对应 .thrift 文件的位置

#### 生成后的项目结构

```
── go.mod // go module 文件
├── go.sum
├── idl   // 示例 idl 存放的目录
│   ├── base.thrift
│   ├── user.thrift
├── kitex_gen
│   └── music
│          |
│          ├── base
│          │   ├── base.go // 根据 IDL 生成的编解码文件，由 IDL 编译器生成
│          │   ├── k-base.go // kitex 专用的一些拓展内容
│          │   └── k-consts.go
│          ├── user
│               ├── user.go // 根据 IDL 生成的编解码文件，由 IDL 编译器生成
│               ├── userservice // kitex 封装代码主要在这里
│               │   ├── client.go  // 客户端代码
│               │   ├── invoker.go
│               │   ├── userservice.go
│               │   └── server.go
│               ├── k-consts.go
│               └── k-user.go // kitex 专用的一些拓展内容
│   
└── rpc
    ├── user
        ├── build.sh   // 用来编译的脚本，一般情况下不需要更改
        ├── handler.go // 服务端的业务逻辑都放在这里，这也是我们需要更改和编写的文件
        ├── kitex_info.yaml
        ├── main.go
        └── script
            └── bootstrap.sh

```

### 拉取依赖

```bash
# 在项目主目录下 与go.mod同级 运行
go mod tidy
```





