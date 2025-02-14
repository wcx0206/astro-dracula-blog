---
title: ssh-key
tags:
---

有关 MacOs 系统上 ssh key 的一些使用上的问题

<!--more-->

### 启动 ssh 服务 并添加 key

```bash
eval "$(ssh-agent -s)"
```

### 添加 ssh-key

```bash
ssh-add ~/.ssh/id_rsa
```

### 列出当前正在被代理的 ssh-key

```bash
ssh-add -l
```

