---
title: grpc-1
tags:
---

grpc 基本知识

<!--more-->

## 什么是 `grpc`

>- In gRPC, a client application can directly call a method on a server application on a different machine as if it were a local object, making it easier for you to create distributed applications and services. 
>
>- As in many RPC systems, gRPC is based around the idea of defining a service, specifying the methods that can be called remotely with their parameters and return types. 
>
>- On the server side, the server implements this interface and runs a gRPC server to handle client calls. 
>
>- On the client side, the client has a stub (referred to as just a client in some languages) that provides the same methods as the server. 									
>
>  ​																		--  https://grpc.io/



## 如何创建一个 `grpc` 项目 -- 基于 `Golang`

### 补充知识：`golang` 中设置命令行参数 -- `flag`

##### 语法说明

- name: 参数名
- defaultValue: 默认值
- usage: 帮助说明

```go
flag.Type(name string, defaultValue Type, usage string) *Type
// 支持的类型
flag.String()  // 字符串
flag.Int()     // 整数
flag.Bool()    // 布尔值
flag.Float64() // 浮点数
```

##### 解析并获取命令行参数值

```go
flag.Parse() // 解析命令行参数
value := *stringFlag  // 使用指针解引用获取值
```

##### 查看帮助信息

```go
./program -h
# 或
./program --help
```

##### 使用示例

```go
package main

import (
	"context"
	"flag"
	"log"
)
var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
	name = flag.String("name", defaultName, "Name to greet")
)

func main(){
  flag.Parse() 
}
```



### 安装对应的依赖

- **Go plugins** for the protocol compiler:

  1. 安装 `protocol` 编译插件

     ```sh
     go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
     go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
     ```

  2. 更新 `PATH`，以便 `protoc` 编译器能找到插件：

     ```sh
     export PATH="$PATH:$(go env GOPATH)/bin"
     ```

- 创建项目并初始化

  ```bash
  go mod init grpc-demo
  go get -u google.golang.org/grpc
  ```

  

### 编写 `proto` 文件

#### 什么是 `proto`

`Protobuf` 是一种由 `Google`开发的接口描述语言，用于数据结构的序列化。它通过 `.proto` 文件定义数据结构和服务接口，然后通过编译器生成多种编程语言的代码

#### 文件的组成部分

1. 声明语法版本
2. 包声明
3. `Go` 包路径
4. 服务定义
5. 消息定义

#### `proto` 简单示例

```protobuf
syntax = "proto3";

package hello;
option go_package = "./hello";

service Greeter {
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}
```



### 通过 `proto` 文件生成 `grpc`代码

会自动根据你在上面 `proto` 文件中定义的包名创建一个文件夹

```bash
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative proto/hello.proto
```

1. **基本命令**

   ```bash
   protoc  # Protocol Buffers 编译器
   ```

2. **Go 代码生成选项**

   ```bash
   --go_out=.  # 生成 Go 数据结构代码的输出目录(当前目录)
   --go_opt=paths=source_relative  # 使用源文件相对路径生成代码0
   ```

3. **gRPC 服务代码生成选项**

   ```bash
   --go-grpc_out=.  # 生成 gRPC 服务代码的输出目录(当前目录)
   --go-grpc_opt=paths=source_relative  # 使用源文件相对路径生成代码 如果不加就相对于当前路径
   ```

4. **目标文件**

   ```bash
   proto/hello.proto  # 要编译的 proto 文件路径
   ```



### 编写服务端代码

这里主要需要关注一个 `server` 结构体的实现，实现这个结构体后如果在 `proto` 文件中添加了新的服务方法，直接可以在这里对其具体逻辑进行实现 `implemen`

```go
package main

import (
	"context"
	"flag"
	"fmt"
	pb "grpc-demo/rpc/hello"
	"log"
	"net"
	"google.golang.org/grpc"
)

var (
	port = flag.Int("port", 50051, "服务器端口")
)

// 定义服务结构体
type server struct {
	pb.UnimplementedGreeterServer // 保持实现接口的兼容性
}

// 实现 SayHello 方法
func (s *server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {
	log.Printf("收到请求: %v", in.GetName())
	return &pb.HelloReply{
		Message: "Hello " + in.GetName(),
	}, nil
}

func main() {
	// 解析命令行参数
	flag.Parse()

	// 监听端口
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", *port))
	if err != nil {
		log.Fatalf("监听失败: %v", err)
	}

	// 创建 gRPC 服务
	s := grpc.NewServer()
	pb.RegisterGreeterServer(s, &server{})

	log.Printf("服务器监听端口: %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("服务启动失败: %v", err)
	}
}

```



### 编写客户端代码

```go
package main

import (
	"context"
	"flag"
	pb "grpc-demo/rpc/hello" // Protocol Buffers
	"log"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

var (
	addr = flag.String("addr", "localhost:50051", "the address to connect to")
	name = flag.String("name", "hello world", "Name to greet")
)

func main() {
	flag.Parse()
	// 1. 创建连接
	conn, err := grpc.NewClient(*addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()

	// 2. 创建客户端
	c := pb.NewGreeterClient(conn)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second) // 设置超时时间
	defer cancel()                                          // 调用 cancel 函数释放资源
	// 3. 调用服务
	r, err := c.SayHello(ctx, &pb.HelloRequest{Name: *name})
	if err != nil {
		log.Fatalf("could not greet: %v", err)
	}
	// 4. 打印返回结果
	log.Printf("Greeting: %s", r.GetMessage())
}

```



### 使用 `buf` 工具来生成你的代码

```bash
go install github.com/bufbuild/buf/cmd/buf@latest
buf config init
```

