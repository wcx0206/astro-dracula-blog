---
title: prometheus-grafana
tags:
---

 prometheus-grafana

<!--more-->

## grafana 的安装与使用

### 安装

```
curl -O https://dl.grafana.com/enterprise/release/grafana-enterprise-11.4.0.darwin-amd64.tar.gz
tar -zxvf grafana-enterprise-11.4.0.darwin-amd64.tar.gz
```

### 启动 grafana

```
./bin/grafana server web
```

![image-20241223155109721](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223155109721.png)

### 访问 Grafana

Grafana 默认监听在 `http://localhost:3000`。在浏览器中访问这个地址来打开 Grafana 的 Web 界面。

### 登录 Grafana

默认的用户名和密码都是 `admin`。首次登录时，系统会提示你更改密码。

![image-20241223155207306](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223155207306.png)

![image-20241223155338199](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223155338199.png)

## prometheus 的安装与使用

### 安装

```
brew install prometheus
```

![image-20241223164000440](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223164000440.png)

### 修改配置文件

```bash
brew info prometheus #查找安装路径
cat /opt/homebrew/etc/prometheus.args #下图中的路径 找到config.file
vim /opt/homebrew/etc/prometheus.yml
```

![image-20241223164305588](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223164305588.png)

![image-20241223164545273](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223164545273.png)

![image-20241223164832352](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223164832352.png)

### 启动

```bash
brew services start prometheus
```

![image-20241223164051625](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223164051625.png)

访问 localhost:9090

![image-20241223170153546](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241223170153546.png)

### 使用（基于 Kitex）

[参考 CloudWeGo](https://www.cloudwego.io/zh/docs/kitex/tutorials/observability/monitoring/#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F) 

client 端

```go
import (
    "github.com/kitex-contrib/monitor-prometheus"
    kClient "github.com/cloudwego/kitex/client"
)

...
	c, err := musicservice.NewClient(
		conf.MusicServiceName,
		client.WithRPCTimeout(3*time.Second),              // rpc timeout
		client.WithConnectTimeout(50*time.Millisecond),    // conn timeout
		client.WithFailureRetry(retry.NewFailurePolicy()), // retry
		client.WithResolver(r),                            // resolver
		client.WithTracer(prometheus.NewClientTracer(":9092", "/kitexclient")),
	)
...

```

server 端

```go
import (
    "github.com/kitex-contrib/monitor-prometheus"
    kServer "github.com/cloudwego/kitex/server"
)

func main() {
...
	// 创建一个 Kitex 服务器实例
	svr := music.NewServer(new(MusicServiceImpl),
		server.WithServiceAddr(addr), // 指定服务地址
		server.WithRegistry(r),       // 指定注册器
		server.WithServerBasicInfo(
			&rpcinfo.EndpointBasicInfo{
				ServiceName: conf.MusicServiceName, // 指定服务名称
			},
		),
		server.WithTracer(prometheus.NewServerTracer(":9093", "/kitexserver")),  // /kitexserver 为暴露监控数据的路径
	)
...
}

```

关键：配置文件的修改

```yml
  - job_name: "kitexserver"
    metrics_path: "/kitexserver"  # 修改监听的路径
    static_configs:
      - targets: ["localhost:9093"]  # 设置
  - job_name: "kitexclient"
    metrics_path: "/kitexclient"
    static_configs:
      - targets: ["localhost:9092"]
```

1. **job_name**:

   - `job_name: "kitexserver"`：定义了一个抓取任务的名称为 `kitexserver`。这个名称用于标识 Prometheus 抓取的不同任务。

2. **metrics_path**:

   - `metrics_path: "/kitexserver"`：指定 Prometheus 抓取监控数据的路径为 `/kitexserver`。默认情况下，Prometheus 会尝试从目标地址的 `/metrics` 路径抓取监控数据，但在这里我们显式指定了一个不同的路径 `/kitexserver`。

3. **static_configs**:

   - ```
     static_configs
     ```

     ：定义了静态配置的抓取目标。

     - `targets: ["localhost:9093"]`：指定 Prometheus 将从 `localhost:9093` 抓取监控数据。这里的 `localhost:9093` 是 Kitex 服务器暴露监控数据的地址和端口。
