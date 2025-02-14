---
title: grpc-gateway
tags:
---

如何基于 `grpc` 构建 API 网关

<!--more-->

#### 环境依赖

安装生成 `grpc-gateway` 的有关插件

```shell
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway@latest
```

```
go get -u github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway
go get -u github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2
```

