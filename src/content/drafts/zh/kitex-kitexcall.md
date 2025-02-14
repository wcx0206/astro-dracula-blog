---
title: kitex-kitexcall
tags:
---

### kitex-kitexcall 进行 rpc 测试

<!--more-->

参考 [kitex-kitexcall](https://www.cloudwego.io/zh/blog/2024/05/31/kitexcall%E7%94%A8-json-%E5%8F%91%E8%B5%B7-rpc-%E8%AF%B7%E6%B1%82%E7%9A%84%E5%91%BD%E4%BB%A4%E8%A1%8C%E7%A5%9E%E5%99%A8/)

### 痛点

给 Kitex 服务发送 RPC 测试请求的过程通常包括：

1. 生成客户端代码：根据 IDL 文件生成 Kitex Client 相关代码。
2. 构造测试请求：构建请求、调用方法、处理响应。
3. 配置多种选项：设置传输协议、元信息、异常处理等。 这一过程不仅耗时，且在频繁测试时，每次都需修改和编译代码，效率较低。一个能简化这些步骤、快速发送 RPC 请求的工具，将大幅提升开发效率。

### 安装依赖

```go
go install github.com/kitex-contrib/kitexcall@latest

```

### 遇到的问题

![image-20241122111312623](/Users/wcx/Library/Application Support/typora-user-images/image-20241122111312623.png)

### 使用步骤

#### 命令行直接请求

使用 kitexcall 发起请求非常简单，只要在命令行中指定 IDL 文件、方法名称、请求报文（JSON 格式）和 Server 地址即可：

```bash
kitexcall -idl-path echo.thrift -m echo -d '{"message": "hello"}' -e 127.0.0.1:8888

```

#### 从文件中读入请求数据

如果你希望从文件中读入请求数据，也可以先创建请求数据文件 input.json：

并在 kitexcall 的参数中用 -f 参数指定文件名：

```bash
kitexcall -idl-path echo.thrift -m echo -f input.json -e 127.0.0.1:8888
```

