---
title: 简明 GitHub 教程
tags:
- git
- software-engineering
- ssh
- github
- version-control
date: 2024-11-12 08:58:00
---

我之前写了一篇关于 Git 的[教程](/posts/simple-git-tutorial)。而在此文中，我希望介绍一下说到 Git 离不开的平台：GitHub。

<!--more-->

正如在介绍 Git 的文章中提到的，GitHub 是一个用于托管远程 Git 仓库的平台。您可以将其简单但不严谨地理解成，这是您的一个小云盘，可以用于同步（上传、下载）您的代码文件，并且您还可以借助该平台与其他开发者进行沟通交流。

> [!Note]
> 如果您遇到了任何问题，建议您查询 [Github Docs](https://docs.github.com/)，使用搜索引擎搜索，或者询问一个 AI 助手。或者，您也可以通过[邮箱](mailto:i@blocklune.cc)联系我。

## 创建一个 GitHub 账户

请参考：

- _[开始使用 GitHub 帐户 - GitHub 文档](https://docs.github.com/zh/get-started/onboarding/getting-started-with-your-github-account)_

## 检查您的本地 Git 配置

请确保您已经设置了 Git 用户名和邮箱，这意味着您运行过类似下面的命令：

```bash
git config --global user.name YOUR_NAME
git config --global user.email YOUR_EMAIL
```

了解更多:

- _[Basic Configuration - Simple Git Tutorial](posts/simple-git-tutorial/#basic-configuration)_
- _[在 Git 中设置用户名 - GitHub 文档](https://docs.github.com/zh/get-started/getting-started-with-git/setting-your-username-in-git)_
- _[设置提交电子邮件地址 - GitHub 文档](https://docs.github.com/zh/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address)_

## 使用 SSH 连接到 GitHub

建议您使用 SSH 连接到 GitHub，为此：

首先，创建一对 SSH 密钥。下面的命令使用本地的 `ssh-keygen` 程序生成一对 ED25519 算法生成的密钥对，并使用 `YOUR_EMAIL` 作为注释：

```bash
ssh-keygen -t ed25519 -C YOUR_EMAIL
```

一直按回车，直到回到您的命令提示符。

然后前往 GitHub 添加公钥：

1. 转到 _[SSH and GPG keys - GitHub](https://github.com/settings/keys)_。
2. 点击页面右上方绿色的 `New SSH key`（新建 SSH 密钥）按钮。
3. 填写表格，其中 `key` 是 `~/.ssh/id_ed25519.pub` 的内容（该文件由上述 `ssh-keygen` 命令生成。您可以在 Linux 或 Mac 上运行 `cat ~/.ssh/id_ed25519.pub` 或在 Windows 上运行 `notepad ~/.ssh/id_ed25519.pub` 查看其内容）。
4. 点击绿色的 `Add SSH key`（添加 SSH 密钥）按钮，提交表格。

> [!Tip]
> 后缀“.pub ”表示 “id_ed25519.pub” 文件是公钥。上面的 `ssh-keygen` 命令也会生成私钥文件 `id_ed25519` （没有后缀 `.pub`）。

了解更多：

- _[通过 SSH 连接到 GitHub - GitHub 文档](https://docs.github.com/zh/authentication/connecting-to-github-with-ssh)_

## 通过 HTTPS 端口使用 SSH（可选但建议使用）

由于国内特殊的网络环境，您可能经常需要使用代理服务来获得更好的浏览体验。一般来说，启用 “系统代理” 选项后，只有 80/443 端口（对应 HTTP/HTTPS）上的流量会通过代理服务器，而 SSH 默认的 22 端口上的流量不会通过代理服务器。通过以下设置，可以强制 SSH 流量通过 443 端口。

要测试 SSH 是否可以通过 HTTPS 端口，请运行

```bash
ssh -T -p 443 git@ssh.github.com
```

如果看到类似信息，请键入 `yes` ：

```text
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

如果收到类似下面的回复，说明没问题，可以进行下一步了：

```text
Hi USERNAME! You've successfully authenticated, but GitHub does not
provide shell access.
```

现在您可以覆盖 SSH 设置，强制通过该服务器和端口连接 GitHub.com。编辑 `~/.ssh/config` 并添加以下部分：

```text
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
```

现在，您可以像往常一样执行命令了：

```bash
git clone git@github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

等同于

```bash
git clone ssh://git@ssh.github.com:443/YOUR-USERNAME/YOUR-REPOSITORY.git
```

另请参见：

- _[在 HTTPS 端口使用 SSH - GitHub 文档](https://docs.github.com/zh/authentication/troubleshooting-ssh/using-ssh-over-the-https-port)_

## 基本概念与用法

### 克隆仓库

您可以使用 `git clone` 从 GitHub 克隆一个现有的 repo。最简单的形式如下

```bash
git clone URL [LOCAL_DIRECTORY_NAME]
```

括号中的 `LOCAL_DIRECTORY_NAME` 为可选项。

> 不再推荐使用 http/https 网址进行克隆。使用 `git@github.com:YOUR-NAME/YOUR-REPOSITORY.git` 这样的 URL！

如果想在克隆时指定分支，可以使用 `-b` 选项：

```bash
git clone -b BRANCH URL
```

如果不想包含所有 Commits，可以使用 `--depth` 选项。这对克隆大型仓库很有帮助：

```bash
git clone URL --depth=1
```

### 问题 & 拉取请求

**问题（Issue）** 和 **拉取请求（Pull Request, PR）** 是 GitHub 上两种最重要的协作功能。通过 “问题”，您可以指出某个代码库中的问题、提出改进意见、请求添加新功能等；通过 “拉取请求”，您可以请求某个代码库的管理者合并您提交的代码，以实现对该代码库的贡献。

### GitHub 工作流

参考 _[GitHub 流 - GitHub 文档](https://docs.github.com/zh/get-started/using-github/github-flow)_

## 资源

- _[GitHub docs](https://docs.github.com/)_
