---
title: 负载均衡
categories:
  - SE
  - Java
abbrlink: 3877d22f
date: 2024-09-03 21:00:51
tags:
---

负载均衡相关内容，整理来自 JavaGuide

<!--more-->

## 负载均衡

### 什么是负载均衡

用户请求分摊到不同的服务器上处理，以提高系统整体的并发处理能力以及可靠性

### 服务端负载均衡

第四层（传输层）负载均衡：根据包里的源端口地址以及目的端口地址，会基于这些信息通过一定的负载均衡算法将数据包转发到后端真实服务器

第七层（应用层）负载均衡：读取包中数据部分（比如说我们的 HTTP 部分的报文），然后根据读取到的数据内容（如 URL、Cookie）做出负载均衡决策。执行第七层负载均衡的设备通常被称为 **反向代理服务器** 。

### 客户端负载均衡

1. 在客户端负载均衡中，客户端会自己维护一份服务器的地址列表，发送请求之前，客户端会根据对应的负载均衡算法来选择具体某一台服务器处理请求。
2. 应用于系统内部的不同的服务之间，可以使用现成的负载均衡组件来实现
3. 客户端负载均衡器和服务运行在同一个进程或者说 Java 程序里

### 负载均衡常见算法

#### 随机法

#### 轮询法

#### 两次随机法

#### 哈希法

#### 一致性 Hash 法

#### 最小连接法

#### 最少活跃法

#### 最快响应时间法

### 反向代理服务器 Nginx

客户端将请求发送到反向代理服务器，由反向代理服务器去选择目标服务器，获取数据后再返回给客户端。对外暴露的是反向代理服务器地址，隐藏了真实服务器 IP 地址。反向代理“代理”的是目标服务器，这一个过程对于客户端而言是透明的。

![image-20240904233102510](/Users/wcx/Library/Application Support/typora-user-images/image-20240904233102510.png)

#### 在服务器上部署 Nginx

安装 Nginx

```bash
sudo apt update
sudo apt install nginx
```

编辑 Nginx 配置文件，通常位于 `/etc/nginx/nginx.conf` 或 `/etc/nginx/conf.d/default.conf`。你可以创建一个新的配置文件或修改现有的配置文件。

```bash
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;  # 将请求转发到后端服务器
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
#isten 80; 指定 Nginx 监听 80 端口。
#server_name yourdomain.com; 指定服务器名称。
#location / 块配置了反向代理，将所有请求转发到 http://localhost:8080
```

配置多个后端服务器

```bash
http { 
    upstream backend {  # 后端服务器列表
        server backend1.example.com;
        server backend2.example.com;
        server backend3.example.com;
    }

    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://backend;  # 服务器地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

测试配置

```bash
sudo nginx -t
```

启动 Nginx

```bash
sudo systemctl start nginx
```

重新加载配置

```bash
sudo systemctl reload nginx
```

开机启动

```bash
sudo systemctl enable nginx
```



#### 在 docker 中使用 Nginx

### Netflix Ribbon

### Spring Cloud Load Balancer
