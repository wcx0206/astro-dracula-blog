---
title: api-gateway
tags:
---

API 网关相关内容，以及对应的基础实践（基于 Golang）

<!--more-->

参考的文章：[微服务为什么要用到 API 网关？](https://apisix.apache.org/zh/blog/2023/03/08/why-do-microservices-need-an-api-gateway/) 值得一读的文章，尤其是其中的图示

## 微服务于 API 网关

### 什么是微服务，为什么需要微服务

- 微服务是一种软件架构风格，其中应用程序被构建为若干小的、互相独立的服务，这些服务可以独立部署、操作，并通过网络协议进行通信。每个微服务通常专注于执行一个特定的功能，并彼此协作提供完整的系统功能。
- 微服务的出现是因为现在的软件系统的复杂度远超从前，如果依旧使用单体架构那么在耦合程度以及可修改性、可拓展性、稳定性上都会有很多问题。
- 简单来说，如果采用单体架构一个功能出现问题或者需要进行更新那么我需要将整个系统停机、重启，这在目前的实际应用上显然是不可取的。而微服务理念的出现，使得只需要对出问题的服务进行修改、重启而不会影响到其他的正常服务，这才符合当下对于软件产品设计的需要。



### 什么是 RPC，为什么需要有 RPC

- RPC（Remote Procedure Call，远程过程调用）是一种计算机通信协议，允许一个计算机程序调用另一个地址空间（通常是远程服务器上的程序）的子程序或方法，就像调用本地方法一样。
- 原本我们需要让远程服务器上运行的服务处理一些问题，那么我们就需要发送一个 HTTP 请求然后等待返回值。显然这需要开发者去关注底层的网络通信的内容，而RPC 的核心概念是对网络通信的抽象，使开发者在调用远程服务时不必关心底层的网络细节。你所需要的做的就是传递参数调用一个函数然后获得返回值，其余的会有框架完成。

### 微服务与 RPC

- 在微服务架构中，服务之间的通信通常依赖于 RPC。因为微服务需要通过网络调用彼此提供的功能，而 RPC 提供了一种高效、抽象的通信机制，使得服务间调用变得更容易实现和维护。
- 而且各种 RPC 框架的出现，可以允许开发人员用不同的语言开发微服务，然后使用 RPC 方式进行调用，在某些场景下可以为开发者提供很多的便利。
  - 比如：我需要开发一个基于 LLM 的微服务，我的其他服务都是基于 Golang 或者 Java 但是在调用 LLM 的服务上我可以使用 Python，使用 Python 中各种已经开发号的包和框架。



### 为什么需要有 API 网关

- 现在我们使用的 web 应用以及各种移动端的应用在功能上都十分的复杂，其背后都有很多的微服务在进行工作，而这些微服务可能运行在不同的地址和端口上。
- 如果客户端要去直接调用这些微服务就需要编写很多的调用代码，并且需要知道对应的微服务具体运行的地址和端口。显然这种情况下耦合程度大大增加，如果后端的微服务运行地址发生改变还需要对客户端代码进行重构，不符合软件开发低耦合的核心准则。
- 为了解决这个问题，开发者提出了 API 网关这个技术方案。

### 什么是 API 网关

- API 网关是一个位于**客户端和后端服务之间**的服务器，它充当所有 API 调用的入口，将请求分发到适当的服务上，并将服务响应返回给客户端。
  - 当我们引入了 API 网关，那么客户端对我们具体的微服务服务端就不可见了（实际上也不需要可见），客户端唯一可见就是 API 网关，所有请求都会发送到 API 网关上。
  - API 网关将原本直接发送到服务上的请求进行的截断和处理，包括：过滤无用请求，拦截错误请求等。之后再将处理过的请求继续送往对应的微服务进行处理（请求路由的过程）。
  - 这或许体现另一个软件开发核心思想：隐藏
- API 网关通常作为**单一入口点**来管理多个分布式系统的服务。
- 在执行这些功能的同时，API 网关也可以提供一些其他的附加值功能，例如**日志记录、监控、缓存、缓存、身份验证和速率限制**等。



### API 网关与 HTTP 服务器

- **HTTP 服务器** ：主要用于处理 HTTP 请求，将请求转发到相应的应用程序处理。
  - 只是根据请求的路径去调用对应的处理函数，但在微服务结构下只有这样的 HTTP 服务器是不够的。一般简单的 HTTP 服务器只会应用于单体的架构中。
- **API 网关** ：API 网关不仅仅处理 HTTP 请求，还充当所有 API 调用的管理中心，提供复杂请求路由、聚合、协议转换和各种服务管理功能。

### API 网关可以实现哪些功能

1. **请求路由** ：将客户端请求路由到相应的后端服务。
2. **协议转换** ：支持多种协议之间的转换，如从HTTP到gRPC。
   - 假如你的客户端只可以发送简单的 HTTP/JSON 请求，但是你的后端微服务是基于 RPC 框架进行开发的，那么显然你无法在你的客户端直接调用这样的微服务。所以 API 网关可以请求的中转站，帮助你去调用 基于 RPC 的服务，然后将结果返回给你。
3. **负载均衡** ：在多个服务实例之间分配请求负载。
4. **认证和授权** ：统一验证请求的身份，例如通过OAuth、JWT。
5. **监控和日志记录** ：记录请求日志，监控请求性能和系统健康状况。
6. **限流和熔断** ：保护后端服务不受到请求洪流的冲击，并在服务不可用时提供降级响应。
7. **CORS支持** ：管理跨域资源共享，确保API被合适的客户端访问。
8. **缓存** ：对常见请求的响应进行缓存以加速服务和减少负载。



### 在微服务架构下一个请求的完整过程

1. **客户端请求** ：客户端（如浏览器或移动应用）发起请求。
2. **API 网关接收请求** ：API网关接收到客户端请求，通过统一入口点的配置来处理请求。
3. **认证和授权** ：API网关验证客户端的身份和访问权限（例如，检查JWT token）。
4. **请求路由** ：确定请求应路由至哪个服务，可能包含服务发现的步骤。
5. **负载均衡** ：在合适的后端服务实例中选择一个以处理请求。
6. **服务处理** ：后端微服务接收请求，执行具体的业务逻辑。
7. **响应处理** ：微服务处理完请求后，生成响应数据并返回给API网关。
8. **返回响应** ：API网关可以对响应数据进行处理（如聚合多个服务响应），最终将处理后的响应返回给客户端。

```
+-------------+       +-----------+       +-----------------------+
|  Client     |       | API Gate- |       |  Backend Microservice |
| (Browser/   | ----> |  way      | ----> |  (Service A, B, C,...)|
|  Mobile App)|       |           |       |                       |
+-------------+       +-----------+       +-----------------------+
    |                      |                        |
    V                      V                        V
1. Send Request       3. AuthN/AuthZ           6. Process Request
    |                      |                        |
    V                      V                        V
2. Reach Gateway      4. Route Request         7. Generate Response
    |                      |                        |
    V                      V                        V
+-----+               5. Load Balance         8. Return Response
|     |                    |                        |
|     |<-------------------V------------------------+
|     |
|  9. Return Final Response |
|     |
+---------------------------+

```



## 如何构建一个 API 网关

- 现在有很多用于实现 API 网关的框架或者工具。比如 Spring Cloud Gateway、Kong、APISIX 。在基于的不同业务场景下需要去选择不同的框架和工具进行构建
  - Spring Cloud Gateway ： JAVA 生态
  - Kong ：开源 API 网关的鼻祖 生态丰富
  - APISIX ：更新更强、基于 Etcd 可能适合 Golang 生态

- 下面我会基于一个 Golang 的基本项目和 APISIX 来构建一个 API 网关

### 环境准备

启动 APISIX 需要 Docker 以及 curl 两个依赖，具体流程可以[参考官网](https://apisix.apache.org/docs/apisix/getting-started/README/)

```bash
curl -sL https://run.api7.ai/apisix/quickstart | sh
```

验证是否安装成功

```
curl "http://127.0.0.1:9080" --head | grep Server
```

![image-20250201004333953](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20250201004333953.png)

>[!tip]
>
>如果你希望使用其他方式启动 APISIX 可以参照文档中的 Installation 部分，实际上应该更加推荐其他的方式

### 构建一个基本应用 （此例基于 gRPC）

这个过程可以参考另一篇： [gRPC 初次尝试](./grpc-1)   下面我只给出简单的定义 proto

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



### APISIX 配置请求路由

#### 使用 APISIX 本身提供的 Admin API 进行配置

- **Admin API** 是 APISIX 提供的一组 HTTP API，用于管理和配置路由、上游、服务等资源。它是最常用的方式之一。
- 具体的配置过程可以参考[官网示例](https://apisix.apache.org/docs/apisix/getting-started/configure-routes/) 
- 下面我给出的是如何对一个 gRPC 对微服务进行路由配置
  - 由于是对于 gRPC 的用例，所以需要使用 grpc-transcode 插件，具体见[文档](https://apisix.apache.org/docs/apisix/plugins/grpc-transcode/)



1. 将 proto 文件保存到对应的 `content` 区域

	- 这里路径最后的数字表示 `proto` 的序号，下面的例子中是 2
	- 如果你的 `proto` 文件中 import 了其他的 proto 文件，那么需要参照文档打包成一个 `pb` 文件
	
   ```bash
   curl http://127.0.0.1:9180/apisix/admin/protos/2  -X PUT -d '
   {
    "content" : "syntax = \"proto3\";
    package hello;
    service Greeter {
        rpc SayHello (HelloRequest) returns (HelloReply) {}
    }
    message HelloRequest {
        string name = 1;
    }
	 message HelloReply {
	     string message = 1;
	 }"
	}'
	
	```



2. 将路由信息注册进入 APIXIS

   - 这里我个人在 `node` 字段使用 127.0.0.1地址无法成功，但是换成本机 IP 成功了


   ```bash
   curl http://127.0.0.1:9180/apisix/admin/routes/111 -X PUT -d '
   {
       "methods": ["GET"],
       "uri": "/grpctest",
       "plugins": {
           "grpc-transcode": {
               "proto_id": "2",
               "service": "hello.Greeter",
               "method": "SayHello"
           }
       },
       "upstream": {
           "scheme": "grpc",
           "type": "roundrobin",
           "nodes": {
               "192.168.2.7:50051": 1
           }
       }
   }'
   ```

   

2. 查看已注册的所有路由信息

```bash
curl http://127.0.0.1:9180/apisix/admin/routes
```

4. 发送请求进行验证（请先确保你的微服务和 APISIX 在正常运行状态）

```
curl -i http://127.0.0.1:9080/grpctest?name=world
```



#### 使用 Dashboard 配置 （出现了一些小问题）

需要按照[文档](https://apisix.apache.org/docs/dashboard/USER_GUIDE/)进行安装和配置，这里我采用的方式是修改部署 APISIX 的 `docker-compose.yanl` 文件，将 dashbord 作为一个 docker 容器放置在整个 compose 中。

- 修改 Dashboard 配置文件 （[初始文件获取路径](https://github.com/apache/apisix-dashboard/blob/master/api/conf/conf.yaml)）

  ```yaml
  	allow_list:  # 直接滞空允许所有
    etcd:
      endpoints: # 修改为下面你 docker-compose.yaml 文件中etcd容器的服务名          
        - etcd:2379
  ```

- 修改 docker-compose.yaml 文件 （这个文件来自与你使用 docker-compose 部署 APISIX 的目录中，修改你对应系统的 yaml 文件即可） [文档](https://apisix.apache.org/docs/apisix/installation-guide/)

  ```yaml
    dashboard: # service 添加一个新的可以命名为 dashboard
      image: apache/apisix-dashboard
      restart: always
      volumes:
        - <path-to-your-conf>:/usr/local/apisix-dashboard/conf/conf.yaml
        # 将这里的conf路径修改为你上面修改的关于dashboard的配置文件路径
      ports:
        - "9000:9000/tcp"
      networks:
        - apisix
      depends_on:
        - apisix
        - etcd
  ```

  

- 一键启动（ARM ｜ Mac M1）

  ```bash
  docker-compose -p docker-apisix -f docker-compose-arm64.yml up -d
  ```

  



![image-20250202224317851](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20250202224317851.png)
