---
title: kitex
tags:
---

Kitex 是由字节跳动开源的高性能 RPC 框架，以 Golang 语言为基础，实现了高吞吐、高负载、高性能等特点

本文介绍有关于 RPC 、IDL 以及 Kitex 框架的基本配置

<!--more-->

参考：[CloudWeGo](https://www.cloudwego.cn/zh/docs/kitex/getting-started/pre-knowledge/)



### IDL (Interface Definition Language) 接口定义语言。

如果我们要使用 RPC 进行调用，就需要知道对方的接口是什么，需要传什么参数，同时也需要知道返回值是什么样的，就好比两个人之间交流，需要保证在说的是同一个语言、同一件事。IDL 就是为了解决这样的问题，通过 IDL 来约定双方的协议，就像在写代码的时候需要调用某个函数，我们需要知道 `签名`一样。

对于 RPC 框架，IDL 不仅作为接口描述语言，还会根据 IDL 文件生成指定语言的**接口定义模块**，这样极大简化了开发工作。

服务提供方（服务端）需要做的变为 编写 IDL -> 使用代码生成工具生成代码 -> 实现接口；

服务调用方（客户端）只需根据服务提供方（服务端）提供的 IDL 生成代码后进行调用。



### Apache Thrigt

Apache Thrift 是一个用于可伸缩的跨语言服务开发的框架。它结合了一个软件栈和代码生成引擎，用于构建高效、无缝的跨语言服务。Thrift 支持多种编程语言，包括 Java、C++、Python、PHP、Ruby、Erlang、Perl、Haskell、C#、Go 等。

#### Thrift 的主要特点：

1. **跨语言支持**：允许不同编程语言之间进行通信。
2. **高效的二进制协议**：提供高效的序列化和反序列化机制。
3. **可扩展性**：支持多种传输协议和传输层。
4. **代码生成**：通过定义接口和数据类型，自动生成客户端和服务器端代码。

#### Thrift 的工作流程：

1. **定义接口**：使用 Thrift 的接口定义语言（IDL）编写服务接口和数据类型。
2. **生成代码**：使用 Thrift 编译器生成目标语言的代码。
3. **实现服务**：在生成的代码基础上实现服务逻辑。
4. **部署服务**：启动服务器并使用客户端进行调用。



### RPC(Remote Procedure Call) 远程调用

简单来说就是各个服务并不是运行在一起，在实现某些业务需求时需要去请求远端某个方法，并且获得响应

#### RPC 调用的流程

一次 rpc 调用包括以下基本流程，分为客户端和服务端两个部分：

1. （客户端）构造请求参数，发起调用
2. （客户端）通过服务发现、负载均衡等得到服务端实例地址，并**建立连接**（服务治理）
3. （客户端）请求参数**序列化**成二进制数据
4. （客户端）通过网络将数据发送给服务端
5. （服务端）服务端接收数据
6. （服务端）**反序列**化出请求参数
7. （服务端）handler **处理请求并返回**响应结果
8. （服务端）将响应结果**序列化**成二进制数据
9. （服务端）通过网络将数据返回给客户端
10. （客户端）接收数据
11. （客户端）**反序列化**出结果
12. （客户端）得到调用的结果

### RPC 服务开发流程

例如基于 Thrift 的 RPC 服务开发，通常包括如下过程：

**写接口 -> 生成支持代码 -> 写请求处理逻辑** 

1. 编写 IDL，定义服务 (Service) 接口。
2. 使用 thrift（或者等价的生成代码工具，如 kitex 等）生成客户端、服务端的**支持代码**。
3. 服务端开发者**编写 handler** ，即请求的处理逻辑。
4. 服务端开发者运行服务监听端口，处理请求。
5. 客户端开发者编写客户端程序，经过服务发现连接上服务端程序，发起请求并接收响应。



### Kitex 项目创建与配置

#### 配置 Go 环境

```bash
# MacOS
# 使用 HomeBrew 进行下载
brew update
brew install go
# 配置环境变量 后面的配置环境请自行修改
echo 'export GOPATH=$HOME/go' >> ~/.bash_profile
echo 'export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin' >> ~/.bash_profile
source ~/.bash_profile
# 验证
go version
# 设置国内代理
go env -w GOPROXY=https://goproxy.cn

```

#### 安装 IDL 编译器 `thriftgo`

```bash
go install github.com/cloudwego/thriftgo@latest
# 验证
thriftgo --version
```

#### 安装 `kitex tool`

**kitex** 是 Kitex 框架提供的用于生成代码的一个命令行工具。目前，kitex 支持 thrift 和 protobuf 的 IDL，并支持生成一个服务端项目的骨架。

```bash
go install github.com/cloudwego/kitex/tool/cmd/kitex@latest
# 验证
kitex --version
```

