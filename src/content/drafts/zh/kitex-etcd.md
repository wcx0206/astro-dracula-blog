---
title: kitex-etcd
tags:

---

什么是 `etcd` 以及如何在 `Kitex` 微服务项目中使用 `etcd` 实现服务的注册和发现

<!--more-->

### 什么是 `etcd`

etcd 是一个分布式键值存储系统，主要用于分布式系统中的配置共享和服务发现。它由 CoreOS 开发，使用 Raft 共识算法来保证数据的高可用性和一致性。

etcd 的主要用途包括：

1. **配置管理**：etcd 可以存储分布式系统的配置数据，确保所有节点都能访问到最新的配置。
2. **服务发现**：etcd 可以用于注册和发现服务，使得分布式系统中的各个服务能够相互找到并通信。
3. **分布式锁**：etcd 提供了分布式锁的功能，可以用于协调多个节点之间的操作，防止资源竞争。
4. **元数据存储**：etcd 可以存储各种元数据，如集群状态、任务调度信息等。

### `etcd` 安装与配置

MacOS

```bash
brew install etcd
```

使用 docker 进行部署（更加推荐）

```yml
services:
  # 定义服务名称
  etcd:
    # 指定服务使用的 Docker 镜像
    image: bitnami/etcd:3.5
    # 设置容器的自定义名称
    container_name: etcd
    # 映射主机和容器之间的端口
    ports:
      # 将主机的 2379 端口映射到容器的 2379 端口
      - 2379:2379
      # 将主机的 2380 端口映射到容器的 2380 端口
      - 2380:2380
    # 挂载主机路径或命名卷
    volumes:
      # 将主机目录 `./etcd/data` 挂载到容器中的 `/bitnami/etcd-data`
      - ./etcd/data:/bitnami/etcd-data
    # 设置容器的环境变量
    environment:
      # 设置时区为 Asia/Shanghai
      - TZ=Asia/Shanghai
      # 允许无认证连接
      - ALLOW_NONE_AUTHENTICATION=yes
      # 设置 etcd 的广告客户端 URL
      - ETCD_ADVERTISE_CLIENT_URLS=http://etcd:2379
```



### 如何使用 `etcd` 实现服务注册  (Service)

1. 传入 etcd 服务的地址
2. 解析 TCP 地址（解析 TCP 地址是为了将字符串形式的地址转换为 `net.TCPAddr` 结构体，以便在后续的网络操作中使用。`net.TCPAddr` 结构体包含了 IP 地址和端口号等信息，便于网络连接的建立和管理。）
3. 创建 Kitex 服务器实例，指定etcd注册器地址和当前服务的服务地址
4. 在 server 配置中配置服务的名称用于服务发现

```go
func main() {

	// 使用时请传入真实 etcd 的服务地址，本例中为 127.0.0.1:2379
	r, err := etcd.NewEtcdRegistry([]string{"127.0.0.1:2379"})
	if err != nil {
		log.Fatal(err) // 如果创建注册器失败，记录错误并退出程序
	}

	// 解析 TCP 地址
	addr, _ := net.ResolveTCPAddr("tcp", "127.0.0.1:8888")

	// 创建一个 Kitex 服务器实例
	svr := user.NewServer(new(UserServiceImpl),
		server.WithServiceAddr(addr), // 指定服务地址
		server.WithRegistry(r),       // 指定注册器
		server.WithServerBasicInfo(
			&rpcinfo.EndpointBasicInfo{
				ServiceName: "service.music.user", // 指定服务名称
			},
		),
	)
	// 初始化数据库
	db.Init()
	// 启动服务器
	log.Println("user service start...")
	err = svr.Run()

	if err != nil {
		log.Println(err.Error())
	}
}
```



### 如何使用 `etcd` 实现服务发现 (API Gateway)

#### 流程

1. Hertz 服务器根据请求路径将请求发送到对应的 Handle
2. Handle 调用对应服务的 client 进行处理
   1. 在 Hertz 服务器启动之前需要调用一个 Init 方法对所有服务的 client 进行初始化
   2. 所以这里 Handle 调用的 client 已经是通过初始化，实现了服务发现 
3. 接着调用对应服务 client 中的具体方法处理请求 获得返回值并返回

#### 框架结构

```
- api  // 顶级目录，包含 API 相关的代码
  |-- handlers  // 处理请求的处理器（handlers）目录
  |      |
  |      |-- handler_user  // 用户相关的处理器目录
  |               |
  |               |-- register.go  // 处理用户注册请求的代码 处理后将请求交与客户端处理
  |
  |-- infras  // 基础设施相关的代码目录
  |     |
  |     |-- client  // 客户端相关的代码目录
  |            |
  |            |-- init.go // 初始化所有远程客户端的代码 也是真正实现服务发现的地方
  |            |-- user.go  // 客户端调用远端服务的代码并获得返回值
  |
  |-- model  // 通用的数据模型目录
  |     |
  |     |-- model.go  // 定义应用程序使用的通用数据模型
```



#### 代码逻辑

1. api/main.go 

   1. Hertz http 服务器主函数

   2. 根据用户请求调用不同的 handler 进行处理

      ```go
      func main() {
      	Init()
      
      	// 创建一个 Hertz 服务器实例，并指定监听地址为 localhost:8889
      	h := server.New(server.WithHostPorts("localhost:8889"))
      
      	// user service
      	userGroup := h.Group("/api/user")   // 根据用户请求调用不同的 handler 进行处理
      	userGroup.POST("/register", handler_user.CreateUser)
      	userGroup.POST("/login", handler_user.Login)
      
      	h.Spin()
      }
      ```
      
      

2. api/handlers/handler_user/register.go

   1. Http 服务器处理用户请求的代码

   2. 主要作用是对参数进行识别，并将请求转发到服务对应的 client 客户端

      ```go
      package handler_user
      
      import (
      	"context"
      	"git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/api/infras/client"
      	"git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/api/model"
      	"git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/kitex_gen/music/service/user"
      	"git.nju.edu.cn/13_2024_fall_devops/13_2024_fall_devops_server/pkg/errno"
      	"github.com/cloudwego/hertz/pkg/app"
      )
      
      // createUserHandler 处理 /api/user/create 请求
      
      func CreateUser(ctx context.Context, c *app.RequestContext) {
      	var req user.CreateUserReq // 定义为 req 为 user.CreateUserReq 类型
        
        //这里判断 c 中传递的参数是否满足 user.CreateUserReq 格式 如果不符合直接报错返回 400
      	if err := c.BindAndValidate(&req); err != nil {
      		c.JSON(400, map[string]string{"error": err.Error()})
      		return
      	}
        // 调用远端服务的 client 客户端进行进一步处理 (这里的返回值是自定义的不一定是 err)
      	err := client.CreateUser(ctx, &req)
      	if err != nil {
      		model.SendResponse(c, errno.ConvertErr(err), nil)
      		return
      	}
      
      	model.SendResponse(c, errno.Success, nil)
      }
      
      ```

      

3. api/infras/client/init.go

   1. 初始化所有远端服务客户端的代码

   2. 服务发现就是在这里被实现的

   3. 实现的方式就是调用定义在每个远端服务 client 客户端处理方法中的 Init 方法

      ```go
      package client
      // Init init rpc client
      func Init() {
      	initUserRpc()
      }
      ```

      

4. api/infras/client/user.go

   1. 定义了一个类型为 userservice.Client 的 userClient 变量

   2. 这个类型是 Kitex 根据我们的 idl 文件自动生成的远端服务的客户端类型（保存在 kitex_gen 中）

   3. 这里在 initUserRpc 对这个变量进行初始化，根据服务的地址从 etcd 中找到其对应的远端服务（服务发现）并且注入给 client

   4. 上面的 handler 调用了这里的 CreateUser 方法，这个方法的作用就是向真正的远端服务服务端发送请求，获得相应后返回

      ```go
      package client
      
      import (
      	"context"
      	"git.nju.edu.cn/kitex_gen/music/service/user"
      	"git.nju.edu.cn/kitex_gen/music/service/user/userservice"
      	"git.nju.edu.cn/pkg/conf"
      	"git.nju.edu.cn/pkg/errno"
      	"github.com/cloudwego/kitex/client"
      	"github.com/cloudwego/kitex/pkg/retry"
      	etcd "github.com/kitex-contrib/registry-etcd"
      	"time"
      )
      
      var userClient userservice.Client
      
      // initUserRpc initializes the user rpc client  使用 etcd 进行服务发现 并且初始化 rpc
      func initUserRpc() {
      	r, err := etcd.NewEtcdResolver([]string{conf.EtcdAddress})
      	if err != nil {
      		panic(err)
      	}
      
      	c, err := userservice.NewClient(
      		conf.UserRpcServiceName,
      		client.WithRPCTimeout(3*time.Second),              // rpc timeout
      		client.WithConnectTimeout(50*time.Millisecond),    // conn timeout
      		client.WithFailureRetry(retry.NewFailurePolicy()), // retry
      		client.WithResolver(r),                            // resolver
      	)
      	if err != nil {
      		panic(err)
      	}
      	userClient = c // assign the client to the global variable 找到远端服务
      }
      
      func CreateUser(ctx context.Context, req *user.CreateUserReq) error {
      	// 初始化 rpc 调用远端服务
      	resp, err := userClient.CreateUser(ctx, req)
      	if err != nil {
      		return err
      	}
      	if resp.BaseResp.StatusCode != 0 {
      		return errno.NewErrNo(int64(resp.BaseResp.StatusCode), resp.BaseResp.StatusMessage)
      	}
      	return nil
      }
      ```

      

5. api/model/model.go

   1. 这里用于定义一些向前端（客户请求）发送请求响应结果的结构体，以及发送请求结果的方法。后续与前端交互的数据结构都可以在这里进行定义

   2. Response 是定义的一个响应结构体，有一个 Data 属性为 interface 。`interface{}` 是 Go 语言中的空接口，表示可以接受任何类型的值。这使得 `Data` 属性可以存储任意类型的数据，从而提高了结构体的通用性和灵活性。

   3. SendResponse 方法的作用就是很简单的将请求的响应结果传回请求端（使用 Response）

      ```go
      package model
      
      import (
      	"git/pkg/errno"
      	"github.com/cloudwego/hertz/pkg/app"
      	"github.com/hertz-contrib/jwt"
      	"net/http"
      )
      
      
      type Response struct {
      	Code    int64       `json:"code"`
      	Message string      `json:"message"`
      	Data    interface{} `json:"data"`
      }
      
      // SendResponse pack response
      func SendResponse(c *app.RequestContext, err error, data interface{}) {
          // 将错误转换为标准错误格式
          Err := errno.ConvertErr(err)
          
          // 以 JSON 格式返回 HTTP 响应，状态码为 200 OK
          c.JSON(http.StatusOK, Response{
              // 设置响应码为转换后的错误码
              Code:    Err.ErrCode,
              // 设置响应消息为转换后的错误消息
              Message: Err.ErrMsg,
              // 设置响应数据为传入的数据
              Data:    data,
          })
      }
      
      ```

      

6. d

   

   







