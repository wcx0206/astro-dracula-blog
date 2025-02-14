---
title: k8s
tags:
---

<!--more-->

参考文章 [史上最全干货！Kubernetes 原理+实战总结（全文6万字，90张图，100个知识点）（上）](https://developer.aliyun.com/article/1366693)

## Kubernetes 理论

### **什么是 Kubernetes (k8s)？**

Kubernetes（简称 **k8s**）是一个开源的 **容器编排工具**，用于自动化部署、扩展和管理容器化应用程序。

#### 什么是容器编排

对于应用程序的部署方式如今发展到了容器化部署，这种部署方式带来了很多的便利（共享操作系统、环境隔离等），但是在实际应用时任然存在很多问题：

- 一个应用/服务的容器停机了如何自动的去启动一个新的容器？
- 当请求的并发量提高时，如何实现横向拓展容器的数量；反之如何减少容器的数量，实现缩容？

**容器编排问题就是指**：自动化管理容器化应用的部署、扩展、网络、存储和生命周期等任务的过程。

#### Docker-compose 与 k8s

Docker Compose 可以解决容器编排中的一些基本问题，例如通过一个简单的 YAML 文件定义多个容器及其**相互关系，快速启动、停止和管理这些容器**。它非常适合开发和测试环境，能够帮助开发者快速搭建本地开发环境，简化多容器应用的部署流程。

然而，在此基础上需要进一步提出 Kubernetes 这种形式，是因为 Docker Compose 在功能和适用场景上存在一定的局限性。Docker Compose 主要面向**单机环境**，虽然可以通过 Docker Swarm 扩展，但在分布式系统下的功能有限。而 Kubernetes 是一个更为复杂的平台，提供了全面的**服务发现、负载均衡、滚动更新、自我修复**等功能。它适用于大规模生产环境中的复杂应用部署与管理，**支持跨多台服务器（节点）的集群管理和自动化运维**。此外，Kubernetes还提供了**自动扩展、健康检查、多租户支持、安全性控制**等一系列高级特性，能够更好地满足大规模、高可用、复杂微服务架构的生产需求。

### Kubernetes 的组成部分

Kubernetes 是一个分布式的容器编排平台，其架构由多个组件组成。这些组件分为 **Master 节点组件** 和 **Worker 节点组件**。

#### Master 节点组件

Master 节点负责集群的管理和控制，主要包括以下组件：

1. **API Server**：
   - 提供 Kubernetes API，是集群的控制入口。
   - 接收用户和其他组件的请求，并更新集群状态。
   - 支持 RESTful API，可以通过 `kubectl` 或其他客户端工具访问。
2. **etcd**：
   - 分布式键值存储，用于保存集群的所有配置数据和状态。
   - 确保数据的一致性和高可用性，是 Kubernetes 的“数据库”。
3. **Scheduler**：
   - 负责将 Pod 调度到合适的 Worker 节点上。
   - 根据资源需求、节点负载、亲和性规则等做出调度决策。
4. **Controller Manager**：
   - 包含多个控制器，负责维护集群的期望状态。
   - 常见的控制器包括：
     - **Node Controller**：管理节点状态。
     - **Replication Controller**：确保 Pod 的副本数量符合预期。
     - **Endpoint Controller**：维护 Service 和 Pod 的映射关系。
     - **Service Account & Token Controller**：管理服务账户和令牌。

#### Worker 节点组件（Node）

Worker 节点负责运行容器化应用，主要包括以下组件：

1. **Kubelet**：
   - 负责与 Master 节点通信，管理节点上的 Pod 和容器。
   - 确保容器按照 Pod 的定义运行。
   - 监控容器的健康状态并报告给 Master 节点。
2. **Kube Proxy**：
   - 负责节点的网络代理和负载均衡。
   - 实现 Service 的网络访问规则，将流量转发到后端 Pod。
3. **容器运行时**：
   - 负责运行容器（如 Docker、containerd）。
   - Kubernetes 通过 CRI（Container Runtime Interface）与容器运行时交互。

![img](https://ucc.alicdn.com/pic/developer-ecology/2o6k3mxipgtmy_375ec870bd7b46d9905d392656f15984.png)



### Kubernetes 的一些核心概念

#### **Pod**

- **Pod 是 Kubernetes 的最小部署单元**，包含一个或多个容器，运行在 Node 节点中。
- 同一个 Pod 中的容器共享网络和存储资源。
- 每个 Pod 都有一个**唯一的 IP 地址**。

#### Deployment

- **Deployment 用于定义 Pod 的部署策略**。支持滚动更新、回滚和副本管理。

#### Service

- **Service 为 Pod 提供稳定的网络访问入口**，通过标签选择器（Label Selector）关联一组 Pod。
- **Service** 在物理上通过 Kubernetes 的网络代理（如 kube-proxy ）实现。kube-proxy 运行在每个 Node 上，负责将流量转发到后端的 Pod （**服务发现与负载均衡**）。
- **Service** 的 IP 地址是虚拟的，由Kubernetes的网络插件（如Calico、Flannel）管理。

#### Namespace

- **Namespace 用于资源隔离和分组**。可以将**集群**划分为多个虚拟集群，每个 Namespace 有自己的资源。主要是解决重名问题，将容器更好的进行划分。

#### ConfigMap 和 Secret

- **ConfigMap**：用于存储非敏感的配置数据（配置文件与环境变量）。
- **Secret**：用于存储敏感数据（如密码、密钥）。

#### Volume

- 与 Docker 中的 Volume 作用一致，用于为容器提供持久化存储，支持多种存储类型（如本地存储、云存储）

#### Ingress

- **Ingress 用于管理外部访问流量的规则**（支持基于路径、域名等的负载均衡）。
- 通常与 Ingress Controller（如 Nginx、Traefik）配合使用。

#### ReplicaSet

- **ReplicaSet 用于确保指定数量的 Pod 副本始终运行**，通常由 Deployment 管理。

#### StatefulSet

- **StatefulSet 用于管理有状态应用**，确保 Pod 的顺序性和唯一性。

#### DaemonSet

- **DaemonSet 用于在每个节点上运行一个 Pod 副本**，常用于日志收集、监控等场景。

#### Job 和 CronJob

- **Job**：用于运行一次性任务，任务完成后Pod会自动退出。
- **CronJob**：用于定期运行任务。



### Kubernetes 中的端口与本地端口

#### 容器端口

容器内部应用程序监听的端口（如一般后端的 `8080`）。

#### Pod 端口

Pod 的网络接口暴露的端口，一般与容器端口一致（如 `8080`）。

#### Service 端口

Service 是 Kubernetes 中的一种抽象，用于将 Pod 暴露为一个稳定的网络接口。Service 可以将流量转发到后端的 Pod。

- **定义**：Service 定义了两个端口：
  - **`port`**：Service 的端口，是集群内部访问服务的端口。
  - **`targetPort`**：Service 转发到 Pod 的端口，通常与 Pod 的端口一致。
- 下面的示例中
  - Service 的端口是 `80`，集群内部可以通过 `example-service:80` 访问服务。
  - Service 会将流量转发到后端 Pod 的 `8080` 端口。

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
```



#### 本地端口

在开发和调试阶段，你可能需要从本地机器访问 Kubernetes 集群中的服务。这可以通过 `kubectl port-forward` 命令实现。

- **定义**：`kubectl port-forward` 命令将本地端口转发到集群中的服务或 Pod 的端口。

- **示例**：

  ```bash
  kubectl port-forward service/example-service 7080:80
  ```

  在这个例子中：

  - 本地端口 `7080` 被转发到 Service 的端口 `80`。
  - Service 的端口 `80` 转发到后端 Pod 的 `8080` 端口。

## 如何使用 Kubernetes 部署服务

### 基于 Minikube 的简单尝试

参考：[官方文档](https://minikube.sigs.k8s.io/docs/start/?arch=/macos/arm64/stable/binary+download) 

#### 安装

```bash
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-darwin-arm64
sudo install minikube-darwin-arm64 /usr/local/bin/minikube
```

#### 启动

```bash
minikube start
```

![image-20250212142804007](/Users/wcx/Library/Application Support/typora-user-images/image-20250212142804007.png)

#### 可视化 Dashboard

>For additional insight into your cluster state, minikube bundles the Kubernetes Dashboard, allowing you to get easily acclimated to your new environment:

```
minikube dashboard
```

![image-20250212143144281](/Users/wcx/Library/Application Support/typora-user-images/image-20250212143144281.png)

#### 如何部署一个服务

1. 在 Kubernetes 集群中创建一个名为 `hello-minikube` 的 Deployment 对象。
   - 指定 Pod 中的容器的镜像为 `kicbase/echo-server:1.0`
   
     >[!tip]
     >
     >这一步需要从远端拉取镜像，请确保你的网络环境。可以通过 get 命令查看当前 pod 的状态，如果出现了 `ImagePullBackOff` 就是镜像拉取失败。
   
     
   
2. 将之前创建的 `hello-minikube` Deployment 暴露为一个 Kubernetes 服务（Service），并指定服务类型为 `NodePort`，暴露的端口为 8080 以便可以从集群外部访问该服务。

```
kubectl create deployment hello-minikube --image=kicbase/echo-server:1.0
kubectl expose deployment hello-minikube --type=NodePort --port=8080
```

![image-20250213152429885](/Users/wcx/Library/Application Support/typora-user-images/image-20250213152429885.png)

3. 通过 `get` 命令查看上面部署的 `hello-minikube` 服务的状态

![image-20250213152808141](/Users/wcx/Library/Application Support/typora-user-images/image-20250213152808141.png)

4. `minikube` 可以打开一个网页来访问到这个服务

```
minikube service hello-minikube
```

![image-20250213154123184](/Users/wcx/Library/Application Support/typora-user-images/image-20250213154123184.png)

>[!note]
>
>`minikube service <service-name>` 是 Minikube 提供的一个便捷命令，用于访问在 Minikube 集群中运行的服务。它可以帮助你快速打开服务的 URL，或者获取服务的访问信息。

5. 将将本地端口转发到集群中的服务或 Pod，这样可以从本地机器访问集群内部的服务，而无需暴露服务到集群外部。
   - 当下面的代码执行后只需要访问 http://localhost:7080/ 就可以访问集群中的 8080 端口

```
kubectl port-forward service/hello-minikube 7080:8080
```

![image-20250213154102803](/Users/wcx/Library/Application Support/typora-user-images/image-20250213154102803.png)

### 集群管理

#### 关闭集群

```
minikube stop
```

#### 暂停/取消暂停 集群

```
minikube pause
minikube unpause
```



### [Kubernetes 常用命令速查](./k8s-order)
