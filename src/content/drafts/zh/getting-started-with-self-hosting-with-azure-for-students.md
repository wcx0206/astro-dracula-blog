---
title: 借助面向学生的 Azure 开始您的自托管之旅
tags:
- azure
- caddy
- docker
- memos
- bitwarden
- miniflux
- rclone
- self-hosting
---

近年来，云服务领域经历了迅猛的增长。虽然云服务最初主要面向企业用户设计，但现在各大云服务提供商也推出了针对个人用户的经济实惠方案。对于学生用户来说，更是有多种免费额度和服务优惠可供利用。伴随着以 Docker 为代表的容器化技术的迅速崛起，[自托管（Self-hosting）]((https://en.wikipedia.org/wiki/Self-hosting_(web_services)))这一曾经复杂且耗时的任务变得前所未有的简便和轻松。在本文中，我将借助面向学生的 Azure 为例，带您踏入自部署的世界。

<!--more-->

在本文中，我将引导您从选购一台云服务器起步，以部署 [Memos](https://www.usememos.com/)（个人备忘录）和 [Miniflux](https://miniflux.app/)（RSS 阅读器）为例，向您展示如何利用 Docker Compose 轻松快捷地部署各种服务。

接下来，我们将探讨域名的选购以及如何使用 Caddy 来配置反向代理。通过这些步骤，您的服务将可以通过自定义的、易于记忆的 URL，例如 [`https://memos.blocklune.cc`](https://memos.blocklune.cc)，被用户直接访问。

最后，为了确保您的数据安全与持久性，我会介绍服务器数据备份的具体方法。您将学习到如何使用 [`rclone`](https://rclone.org/) 这一强大工具，将您的关键数据备份至如 Cloudflare R2 这样的 S3 兼容存储服务、或者是 Google Drive 上。此外，我们还会讲解 `cron` 的基础用法，使您可以设置定期自动化的备份任务，从而无需手动干预即可保持数据的安全更新。

## 获得云服务器

您需要一台云服务器来部署您的服务。

### 选择服务器地址

此处指选择中国大陆地区的服务器或其他国家或地区的服务器。

首先要考虑的是域名问题。在中国大陆地区，如果您的域名没有完成工信部要求的备案程序，则无法使用标准的 80（HTTP）和 443（HTTPS）端口提供服务。这将迫使您选择其他非标准端口。于我而言，这一点挺让人难受的。

此外，国内服务器也会遇到一些众所周知的网络问题，如果您选择了位于国内的服务器，您可能需要额外为配置镜像等步骤烦恼。

所以，对于新手而言，我建议选择 **非中国大陆地区** 的云服务器。

### 选择服务商

国内的云服务商包括[阿里云](https://www.alibabacloud.com/zh/product/swas)、[腾讯云](https://cloud.tencent.com/product/lighthouse)、[华为云](https://www.huaweicloud.com/special/hecs-qlfwq.html) 等，它们都提供了类似于传统 [VPS](https://en.wikipedia.org/wiki/Virtual_private_server) 的服务。国外的大型云服务商包括亚马逊 AWS、微软 Azure、Google Cloud 等。您可以在这些我叫得上名的大平台选购您心仪的云服务器，也可以看看 [便宜 VPS 网](https://www.pianyivps.com/) 购买相对低价的类 VPS 服务。取决于您的用量，您可以自行决定选购什么配置的产品。对于本文中的应用，1 核 1G 的最低配已经够用了。

### 本文的选择

本文中，我们将使用微软提供的面向学生的 Azure。它提供了有效期为一年的 100 美元的免费额度（可每年续订），以及一系列试用。您需要使用您的学生邮箱进行申请，具体您可以参考：

- [面向学生的 Azure - 免费帐户额度 | Microsoft Azure](https://azure.microsoft.com/zh-cn/free/students/)
- [什么是 Azure for Students? | Microsoft Learn](https://learn.microsoft.com/zh-cn/azure/education-hub/about-azure-for-students)

申请完成后，您可以参考下面的官方文档创建一台 Ubuntu 虚拟机（只需要阅读文档的登录 Azure、创建虚拟机、连接到虚拟机三个部分）：

- [快速入门 - 在 Azure 门户中创建 Linux VM - Azure Virtual Machines | Microsoft Learn](https://learn.microsoft.com/zh-cn/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)

此处我选择的规格（Size）是 B1s，即 1 个虚拟 CPU 和 1G 内存，位置选择了日本东部。

## 安装 Docker 并部署服务

遵循上面提到的文档，您应该已经通过 SSH 连接到了您的云服务器。现在，我们可以开始安装 Docker，并使用它来部署 Memos 和 Miniflux 了。

### 安装 Docker

一旦您连接到了您的云服务器，您就可以开始这一步 —— 安装 Docker 了。

由于我们在服务器上，所以我们需要的其实是 Docker Engine（而不是桌面版的 Docker Desktop）。下面的安装命令来自 [Docker 官方文档](https://docs.docker.com/engine/install/ubuntu/)，具体的解释请直接参考官方文档：

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

如果您不了解什么是 Docker，或者您在安装时遇到了一些网络问题、希望使用镜像进行安装，可以参考我的另一篇文章：

- [Docker: 是什么? 为什么? 怎么用? | BlockLune's Blog](https://blocklune.cc/zh/posts/docker-what-why-how/)

在安装完成后，您可以创建一个目录（文件夹），用于存放待会我们会使用的 Docker Compose 文件。例如，在家目录下创建一个名为 `docker_data` 的目录。

```bash
mkdir -p ~/docker_data
```

### 部署 Memos

[Memos](https://www.usememos.com/) 是一个支持自部署的备忘录，或者也可以理解为一个自部署的 “朋友圈” —— 您可以在这里记录内容，并将其设置为私密或公开。下面是来自小众软件的一篇介绍文章：

- [memos - 私人微博，开源可自托管的 flomo 替代 - 小众软件](https://www.appinn.com/memos/)

您可以在 Memos 的官方网站上找到官方提供的多种部署方式。此处我使用的是 Docker Compose 部署。

首先，在上面创建好的 `docker_data` 目录中再创建一个 `memos` 目录：

```bash
cd docker_data
mkdir memos
```

然后，进入这个目录并在其中创建一个名为 `docker-compose.yml` 的文件：

```bash
cd memos
vim docker-compose.yml
```

上面的命令使用 Vim 来创建这个文件。按下 `i` 键进入编辑模式，然后复制下面的内容粘贴到这个文件中：

```yaml
services:
  memos:
    image: neosmemo/memos:stable
    container_name: memos
    volumes:
      - ./memos_data/:/var/opt/memos
    restart: unless-stopped
    ports:
      - 5230:5230
```

完成编辑后，按下键盘左上角的 Esc 键，退出编辑模式、回到 Vim 的正常模式。此时，输入 `:wq` 并按下回车，以写入（Write）并退出（Quit）。

在上面的 `docker-compose.yml` 中，我们定义了我们的 `memos` 服务：

- 该服务使用的镜像是 `neosmemo/memos:stable`
- 该服务将在 `memos_data` 目录下存储数据（这意味着稍后服务启动后，在 `docker-compose.yml` 同目录层级会有一个 `memos_data` 目录存储着该服务的数据）
- 该服务的重启策略是 `unless-stopped`，这样，即使服务器重启，该服务也会随着 Docker 的开机自启而启动
- 该服务将在云服务器的 `5230` 端口启动，稍后我们将通过反向代理隐藏这个端口号

现在，来启动我们的服务吧！运行下面的命令：

```bash
docker compose up -d
```

在本地的机子上使用 `<服务器公网 IP>:<端口>` 这样一个地址（公网 IP 可以在 Azure 服务器管理面板上找到），在浏览器中打开，您能打开您的服务吗？

如果您是按照上面的[微软官方文档](https://learn.microsoft.com/zh-cn/azure/virtual-machines/linux/quick-create-portal?tabs=ubuntu)一步一步走过来的，那您应该 **无法** 访问这个服务。因为按照这份文档，您应该只开启了 HTTP (80) 和 SSH (22) 两个端口。我们的 `5230` 端口并不在此之列。

除非您没有域名或您不希望使用域名，您可以自行[配置了防火墙相关的内容](https://learn.microsoft.com/zh-cn/azure/virtual-network/tutorial-filter-network-traffic?toc=/azure/virtual-machines/toc.json&tabs=portal)打开相应的端口。但是，如果您拥有域名，我就 **不建议您** 打开额外端口。别担心，下面会指导您如何通过 Caddy 配置反向代理，来从 80 端口访问这个服务。

### 部署 Miniflux

[Miniflux](https://miniflux.app/) 是一个轻量的 RSS 阅读器。我们来看看怎么部署它。

类似于 Memos，首先在 `docker_data` 目录下创建 `miniflux` 目录，然后创建如下 `docker-compose.yml` 文件（这份配置来源于 [完整的 RSS 解决方案：自建 RSSHub 与 Miniflux - Yunfi](https://yfi.moe/post/rsshub-miniflux)，稍微做了一些修改，例如使用 alpine 版本的 postgres 镜像以减小体积）：

```yaml
services:
    miniflux:
      image: miniflux/miniflux:latest
      container_name: miniflux
      depends_on:
          - db
      environment:
          - DATABASE_URL=postgres://miniflux:secret@db/miniflux?sslmode=disable
          - RUN_MIGRATIONS=1
          - FETCH_YOUTUBE_WATCH_TIME=1
          - CREATE_ADMIN=1
          - ADMIN_USERNAME=<YOUR_ADMIN_USERNAME> # 需要替换
          - ADMIN_PASSWORD=<YOUR_ADMIN_PASSWORD> # 需要替换
          - BASE_URL=<YOUR_BASE_URL> # 需要替换
          - POLLING_FREQUENCY=60 #每个 feed 的刷新间隔
          - POLLING_PARSING_ERROR_LIMIT=0 #拉取出错后不会停止拉去，还是会按计划继续拉
          - BATCH_SIZE=100 #每次拉取的 feed 数量
          - POLLING_SCHEDULER=entry_frequency #拉取类型，根据上周的平均更新周期来拉取
          - SCHEDULER_ENTRY_FREQUENCY_MAX_INTERVAL=180 #接上条，但也不会大于 30 分钟，建议和 POLLING_FREQUENCY 参数一起来看
          # - PROXY_OPTION=all #图片代理功能，Miniflux 先把源端的图片缓存到服务器上来，后续就不用客户端去源服务器拉了
          - PROXY_PRIVATE_KEY=password #使用客户端缓存过文章，然后某个时间重启了 docker 实例，那么会导致图片无法显示的情况，这是因为每次重启会随机生成 PROXY_PRIVATE_KEY,所以可以增加参数 PROXY_PRIVATE_KEY 固化 key ，便于解决更新、重启等场景下的图片显示问题。
          - DATABASE_MAX_CONNS=50 #增加数据库连接数，对于多图片的 feed 非常有效，可以大幅提升加载和访问速度
          - DATABASE_MIN_CONNS=5  # 同上
          - WORKER_POOL_SIZE=10  #默认，或适当加大
      restart: unless-stopped
      ports:
          - "8080:8080"
    db:
      image: postgres:17.2-alpine
      container_name: postgres
      environment:
          - POSTGRES_USER=miniflux
          - POSTGRES_PASSWORD=secret
      volumes:
          - ./db:/var/lib/postgresql/data
      healthcheck:
          test: ["CMD", "pg_isready", "-U", "miniflux"]
          interval: 10s
          start_period: 30s
      restart: unless-stopped
```

这份文件相对就比较复杂了，其中有三个字段的内容需要替换为您自己的内容：

- `ADMIN_USER`：管理员用户名
- `ADMIN_PASSWORD`：管理员密码
- `BASE_URL`：基 URL，即您希望最后通过什么域名访问这个服务，例如 `https://miniflux.blocklune.cc`，如果您不希望使用域名，则填为 `<服务器公网 IP>:<端口>`

类似地，您可以打开防火墙的相应端口（`8080`），或者使用下面要介绍的反向代理的方法来访问这个服务。

## 域名与反向代理

TODO

## 参考资料

Caddy:

- [Caddy v2中文文档](https://caddy2.dengxiaolong.com/docs/)
- [Caddy —— 轻松换掉你的 Nginx - Yunfi](https://yfi.moe/post/caddy-web-server)

Memos:

- [Memos 官方网站](https://www.usememos.com/)
- [memos - 私人微博，开源可自托管的 flomo 替代 - 小众软件](https://www.appinn.com/memos/)

Miniflux:

- [Miniflux 官网](https://miniflux.app/)
- [完整的 RSS 解决方案：自建 RSSHub 与 Miniflux - Yunfi](https://yfi.moe/post/rsshub-miniflux)

Rclone:

- [Rclone 官方网站](https://rclone.org/)
- [利用 Rclone 对服务器备份 - Yunfi](https://yfi.moe/post/rclone-backup)

其他：

- [Awesome-Selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted)
