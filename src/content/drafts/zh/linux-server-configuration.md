---
title: Linux-Server-Configuration
tags:
---

## 关于 Linux 云服务器配置

oh-my-zsh 部分参考 [Fish Pond](https://fishg.top/posts/3e5630f.html?highlight=z) 

<!--more-->

### ssh 连接

```bash
ssh root@ip
```

### 创建用户

```bash
sudo adduser <newusername>
```

![image-20240906075047919](/Users/wcx/Library/Application Support/typora-user-images/image-20240906075047919.png)

### 安装 vim

```bash
sudo apt update
sudo apt install vim
vim --version 
```

![image-20240906081751757](/Users/wcx/Library/Application Support/typora-user-images/image-20240906081751757.png)

### 配置用户 sudo 权限

```bash
su -  # 切换为 root 用户
visudo # 打开 /etc/sudoers 文件进行编辑

```

#### sudoers 文件编辑

- 在文件中找到类似以下的行：

  ```bash
  # User privilege specification
  root  ALL=(ALL:ALL) ALL
  ```

- 在这行下面添加一行，将用户 username

  添加到 sudoers 文件中：

  ```bash
  username    ALL=(ALL:ALL) ALL
  ```

- 保存并退出编辑器（在 `vi` 编辑器中，按 `Esc` 键，然后输入 `:wq` 并按回车键）。

### 切换到用户

#### 切换

```bash
su username
# su - 切换到 root
# 在 /home/username 目录下切换
```

#### ssh 远程连接

```bash
ssh username@remote_host
# ssh wcx@....
```

### 配置 shell （ZSH）

#### 下载

```bash
sudo apt update
sudo apt install zsh
zsh --version
```

看到下图后直接回车即可

![image-20240906081941989](/Users/wcx/Library/Application Support/typora-user-images/image-20240906081941989.png)



![image-20240906082118366](/Users/wcx/Library/Application Support/typora-user-images/image-20240906082118366.png)

#### 配置 zsh 为默认 shell

```bash
chsh -s $(which zsh)
```

![image-20240906082913005](/Users/wcx/Library/Application Support/typora-user-images/image-20240906082913005.png)

![image-20240906082937997](/Users/wcx/Library/Application Support/typora-user-images/image-20240906082937997.png)

#### 安装 oh-my-zsh

[oh-my-zsh 官网地址](https://ohmyz.sh/)

```bash
# installs oh-my-zsh using curl
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"
# clones powerlevel10k 
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k 

```

#### 安装 oh-my-zsh 插件

参考 https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins

```bash
git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions --depth=1
git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search --depth=1
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git $ZSH_CUSTOM/plugins/fast-syntax-highlighting --depth=1 # a faster choice

```



#### 编辑 .zshrc 进行配置

```bash
ZSH_THEME="powerlevel10k/powerlevel10k"
# I disable some plugins here

plugins=(
    history-substring-search
    ripgrep
    z
    zsh-autosuggestions
    zsh-osx-autoproxy
    fast-syntax-highlighting
)
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=white'

```



### 配置 git

#### 安装 git

```bash
sudo apt update
sudo apt install git
git --version
```

![image-20240906083230621](/Users/wcx/Library/Application Support/typora-user-images/image-20240906083230621.png)

#### 配置 Git

```bash
git config --global user.name "Your Name" # 配置用户名
git config --global user.email "your.email@example.com" # 配置 email
git config --list # 验证
ssh-keygen -t rsa -b 4096 -C "your.email@example.com" # 生成 SSH 密钥
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa  # 添加 SSH 密钥到 SSH 代理
cat ~/.ssh/id_rsa.pub # 复制公钥内容
```

#### 将公钥内容 ssh 添加到各个网站中



### 服务器访问 Github

编辑 Hosts 文件，在文件最后添加如下内容。

```bash
#vim /etc/hosts

140.82.114.3     github.com
```



### 服务器和本地互相传递数据

### 从本地传输文件到远程服务器

```shell
scp /path/to/local/file username@remote_host:/path/to/remote/directory
```

### 从远程服务器传输文件到本地

```bash
scp username@remote_host:/path/to/remote/file /path/to/local/directory
```

### 从本地传输目录到远程服务器

```bash
scp -r /path/to/local/directory username@remote_host:/path/to/remote/directory
```

### 从远程服务器传输目录到本地

```bash
scp -r username@remote_host:/path/to/remote/directory /path/to/local/directory
```

