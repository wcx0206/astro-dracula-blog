---
abbrlink: 86a70735
categories:
- CS
- Tools
date: 2024-09-03 16:35:32
tags:
- docker
- containerization
- software-engineering
- tool
- devops
title: 'Docker: 是什么? 为什么? 怎么用?'
---

作为一个喜欢折腾新玩意儿的人，在网上冲浪时，我经常会去寻找各种各样新式的软件或服务。如果你和我一样也喜欢寻找这些软件，那你可能也会注意到，在安装指南中，越来越多的软件提供了一种使用 **Docker** 的安装或部署方法。这是什么东西？为什么现在流行使用它？我们又能如何使用它？这篇文章，带你入门 Docker 。

<!--more-->

题外话: 这篇文章的标题模仿了朋友的[《RSS: 是什么？为什么？怎么用？》](https://yfi.moe/post/all-about-rss)。那是一篇很不错的文章，推荐你也去看一看。

## 是什么？

维基百科这样描述 Docker：

> Docker is a set of platform as a service (PaaS) products that use OS-level virtualization to deliver software in packages called containers. The service has both free and premium tiers. The software that hosts the containers is called Docker Engine. It was first released in 2013 and is developed by Docker, Inc.
>
> Docker is a tool that is used to automate the deployment of applications in lightweight containers so that applications can work efficiently in different environments in isolation.

简单地讲，借助 Docker 平台，软件开发者可以将应用程序与其依赖项打包到一个可移植的容器中。这些容器可以在任何支持 Docker 的环境中运行，无需担心底层系统的差异。

你可以将 Docker 理解为一种轻量级的虚拟机:

- 这个虚拟机已经配置好了运行特定软件所需的全部或大部分条件，无需你再花时间配置，开箱即用。

但 Docker 又不完全等同于传统虚拟机:

- 传统虚拟机通常很大，因为它在操作系统层面创建一个完整的、与宿主机隔离的环境。我们通常在单个虚拟机环境中做多件事，比如在 Windows 电脑上安装 Ubuntu 虚拟机来学习 Linux 时，我们会在这个虚拟机里安装各种软件、进行各种操作。
- 而 Docker 容器通常很小，因为容器内不包含完整的操作系统，容器之间共享宿主机的操作系统内核。由于它足够轻量、启动速度快、资源利用效率高，我们通常在一个容器中只运行一个特定的应用及其所需服务。

## 为什么？

新工具的诞生总是为了解决现有的问题和痛点。如果你也喜欢折腾，你肯定也经历过，照着网站上的部署和配置指南一步一步走下来，走着走着就走不通了，跑着跑着就报错了等等一系列问题。本身，“折腾” 这个词也就是在说你需要在这个过程中不停地解决问题嘛。造成这些问题的很大一部分原因，就是你的本地环境与开发者预设的环境不一致。而 Docker 允许开发者将他们的运行环境直接打包分享，大大简化了你的 “折腾” 过程。

当然，Docker 的功能不止于此。从更专业一点的角度说，Docker 的流行有几个关键原因:

1. 一致的运行环境：Docker 确保应用程序在开发、测试和生产环境中的一致性，有效解决了 “在我的机器上可以运行” 的问题。
2. 快速部署和扩展：容器可以在几秒钟内启动和停止，使得应用程序的部署和扩展变得更加简单和快速。
3. 资源隔离和优化：Docker 容器提供了良好的资源隔离，同时允许更有效地利用底层硬件资源。
4. 版本控制和可重复性：Docker 镜像可以被版本化，确保应用程序的不同版本可以被精确地重现和部署。

## 怎么用？

### 安装 Docker

关于如何安装 Docker，请参见[官方文档](https://docs.docker.com/get-started/get-docker/)。

上面提到，Docker 容器会共用操作系统的内核。但实际上，Docker 只能使用 Linux Kernel。为了在 macOS 或 Windows 上使用 Docker，实际上需要借助其他方法。在官方文档中推荐使用的是 Docker Desktop，它使用了一个轻量级的虚拟机来运行 Docker。在 macOS 上，你也可以试试 [OrbStack](https://orbstack.dev/)。

这里特别说一下在国内的 Ubuntu 服务器上安装 Docker Engine 这样一个场景。由于一些网络问题，你可能无法访问 Docker 官方源。下面是使用阿里云镜像的一种解决方案（仅关键命令，完整步骤参见[这份官方文档](https://docs.docker.com/engine/install/ubuntu/)）：

1. 设置 Docker 的 `apt` 存储库：

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL http://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] http://mirrors.aliyun.com/docker-ce/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

2. 安装最新版本：

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3. 使用阿里云提供的镜像加速器（具体的加速器需要你自己登录阿里云后见[这里](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)）：

```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://your-aliyun-mirror.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
```

4. 检查是否安装成功：

```bash
sudo docker run hello-world
```

### 关键概念

在继续之前，必须首先解释一些关键概念。你不需要完全理解它们，但要知道它们的存在。后续的例子可能会帮助你更好地理解这些概念。

- 容器 (`Container`): 一个轻量级、可执行的独立软件包，包含运行某个软件所需的所有内容。
- 镜像 (`Image`): 用于创建容器的只读模板。镜像包含了运行应用程序所需的代码、运行时、库、环境变量和配置文件。
- 仓库 (`Repository`): 用于存储和分发 Docker 镜像的地方。
- 卷 (`Volume`): 用于在容器和主机之间共享数据的目录。如前文所述，Docker 容器可以不严谨地视作一个虚拟机，那么卷就是虚拟机和主机之间的共享文件夹。

可以这样区分容器和镜像：镜像是一个只读的模板，容器是镜像的运行实例。

### 例子：安装 MySQL

让我们通过一个简单的例子来演示如何使用 Docker，我们将在一台服务器上安装 MySQL 数据库。在这个例子中，我们会简单地使用 Docker。我不会详细地解释各个命令是用来干什么的，如果你想知道，可以查看[学习资源](#学习资源)。

首先，参考[安装 Docker](#安装-docker)在机器上安装好 Docker。

在创建容器之前，我们需要准备一些目录和文件。它们将被用作卷，以便我们可以在容器和主机之间共享数据。这样，我们可以在容器中运行 MySQL 数据库，而数据将被保存在主机上。

```bash
# 创建目录
sudo mkdir -p /var/lib/docker/mysql/data
sudo mkdir -p /etc/docker/mysql/conf.d
sudo mkdir -p /var/log/docker/mysql

# 设置权限
# 假设 MySQL 在容器中使用 UID 999 运行（这是 MySQL 官方镜像的默认值）
sudo chown -R 999:999 /var/lib/docker/mysql/data
sudo chown -R 999:999 /var/log/docker/mysql

# 配置文件目录应该由 root 拥有，因为它包含敏感信息
sudo chown -R root:root /etc/docker/mysql/conf.d
sudo chmod 755 /etc/docker/mysql/conf.d
```

接下来，我们将创建一个 MySQL 容器。下面使用 `docker run` 来创建容器，并：

- 使用 `--name` 选项来指定容器的名称，这里我们将其命名为 `mysql-container`；
- 使用 `-e` 选项来设置环境变量（`e` 的意思是 `env`），这里我们设置了 MySQL 的 root 密码；
- 使用 `-d` 选项来在后台运行容器（`d` 的意思是 `detached`）；
- 使用 `-p` 选项来映射容器的端口到主机的端口（`p` 的意思是 `port`，前面的端口是主机的端口，后面的端口是容器的端口）；
- 使用 `-v` 选项来指定卷（`v` 的意思是 `volume`，同样，冒号前为主机的目录，冒号后为容器的目录）；
- 使用 `--restart always` 选项来设置容器自动重启。

```bash
sudo docker run --name mysql-container \
  -e MYSQL_ROOT_PASSWORD=your_root_password \
  -d -p 3306:3306 \
  -v /var/lib/docker/mysql/data:/var/lib/mysql \
  -v /etc/docker/mysql/conf.d:/etc/mysql/conf.d \
  -v /var/log/docker/mysql:/var/log/mysql \
  --restart always \  # 设置自动重启
  mysql:latest
```

如果忘记使用 `--restart always` 选项指定容器自动重启，你可以使用 `docker update` 命令来更新容器的配置：

```bash
sudo docker update --restart always mysql-container
```

在正式开始使用 MySQL 前，你可能还需要一些自定义配置。例如，允许任意 IP 地址连接到 MySQL 服务器。为此，编辑 `/etc/docker/mysql/conf.d/my.cnf` 如下：

```text
[mysqld]
bind-address = 0.0.0.0
```

配置文件的更改需要重启容器才能生效：

```bash
sudo docker restart mysql-container
```

为了连接到容器中的 MySQL 服务器，你可以使用 `mysql` 命令行工具。可以这样直接使用 Docker 容器中的：

```bash
# 进入容器
sudo docker exec -it mysql-container bash
# 登录 mysql
mysql -u root -p
```

我们可能希望直接远程访问位于这个远程服务器上的 MySQL 服务器。为此，可以首先在 MySQL 中添加一个新用户并给予相应的权限（下面的命令授予了所有权限，但你应该按照你的需要自行设置权限）：

```sql
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

你可能还需要设置服务器的防火墙，允许 3306 端口的访问。

最后，你可以在本地机器上使用下面的命令来远程访问：

```bash
mysql -u remote_user -p --host your_server_ip
```

## 学习资源

Docker 的[官方文档站](https://docs.docker.com/)提供了大量的文档。如果你遇到问题，你始终可以在官方文档里找到最新的解决方案。

如果你需要的是一门课程，来自 KodeKloud 的这门 _[Docker Training Course for the Absolute Beginner](https://learn.kodekloud.com/user/courses/docker-training-course-for-the-absolute-beginner)_ 课程是我学习 Docker 的入门课。它不仅提供了课程视频，而且还有练习题和实验环境，并且完全免费。非常推荐你去学习。