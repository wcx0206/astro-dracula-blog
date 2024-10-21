---
title: Zsh 简明配置指南
tags:
  - Config
  - Zsh
categories:
  - CS
  - Tools
abbrlink: 3e5630f
date: 2024-01-26 12:14:40
updated: 2024-10-17 1:17:00
---

作为计算机爱好者，我们每天会花大量时间和 Shell 打交道，一个配置得足够好的 Shell 会让你觉得更加得心应手。这篇博文记录了我的 Zsh 配置。本来，这篇文章只是作为我自己的笔记，所以写的没比较随意；同时出于练习英语写作的目的，写成了英文。但后来发现我的朋友们也会参考，所以我打算将其重置为中文的，并修改完善了一些内容。

<!--more-->

## 在开始之前

在正式开始之前，让我们先明确几个概念：

- **终端（Terminal） / 终端模拟器（Terminal Emulator）/ 控制台（Console）**：这些名词来自计算机庞大而昂贵的时代，那时候整栋大楼可能只有一台计算机，名为 “终端” 的设备被放置在大楼的不同房间里，人们通过它与这台计算机进行交互。终端模拟器是模拟终端的软件，基本上是一个看起来像终端的图形用户界面应用程序。如今，这些术语可以互换使用，指的都是 “终端模拟器” 这样一个概念，即一个可以输入输出的文本界面。
- **Shell**：你可能听说过 Linux 内核，内核是操作系统的核心，而在这个 “核” 之外，存在一种名为 “壳” 的软件 —— Shell。简单而言 Shell 是用户与内核沟通的桥梁。它作为一个命令解释器，接受用户输入的命令，然后调用操作系统的功能来执行这些命令。最著名的 Shell 应该是 `bash`，它是几乎所有 Linux 的默认 Shell，类似地，Windows 平台的默认 Shell 是 `cmd` 和 Power Shell。我们这里要使用的 `zsh` 可以简单理解为 `bash` 的一个超集。它几乎兼容 `bash`，但提供了更高的配置自由度和更多的功能。
- **命令提示符（Prompt）**：命令提示符指的是在终端输入命令前，光标跳动位置之前的输出的内容，它的具体内容由环境变量 `$PS1`（意为 Prompt String 1）控制。你可以在 `zsh` 中输入 `echo $PS1` 命令来查看你的当前 Prompt String。注意这里的 “命令提示符” 并不是指 Windows 的 `cmd`（尽管打开这个软件它的名字显示为命令提示符），那个更像是上面说的终端和 Shell 的结合体。

本文将着眼于 Zsh 的配置，但也会涉及到配置最基本的终端。如果你想了解更多关于环境配置方面的内容，也许也可以看看我的 [另一篇文章](/posts/183d7426.html)。

## 选择终端模拟器

在 macOS 平台，我选择的终端是 [iTerm2](https://iterm2.com/)。如果你使用 Homebrew，可以运行下面的命令来安装：

```bash
brew install --cask iterm2
```

> **记得配置镜像或代理！** 如果你选择配置代理，要记得仅仅开启系统代理是不够的。你得在你的代理软件中找到类似下面的命令（例如一键复制终端代理命令之类的按钮），并把它粘贴到你当前的终端窗口中执行：
>
> ```bash
> export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
> ```

或者你也可以选择 [Alacritty](https://alacritty.org/)，它是一个跨平台的高性能终端模拟器。我在 Windows 平台上使用它。

可选地，你可以为你的终端配置一套配色主题以提升其美观度。我喜欢的 Dracula 主题为大量软件做了适配，它对于 iTerm2 和 Alacritty 的适配分别可以在 [这儿](https://draculatheme.com/iterm) 和 [这儿](https://draculatheme.com/alacritty) 找到。

## 选择 Nerd Font

Nerd Fonts 是一类带有图标的特殊字体，它和很多终端应用程序配合地很好，所以建议你在配置终端时将终端的默认字体更改为一款你喜欢的 Nerd Font。我使用的是 Fira Code Nerd Font，如果你是 macOS 平台并且使用 Homebrew，可以运行下面的命令来安装：

```bash
brew install --cask font-fira-code-nerd-font
```

## 安装 Zsh

在 macOS 平台上，Zsh 是默认 Shell，直接打开终端就可以开始使用了。

在 Linux 平台，你可以使用相应平台的包管理器来安装它，并使用 `chsh` 命令来将其设置为你的默认 Shell。假设你使用的包管理器是 `apt` ，你可以输入下面的命令来安装并设置 zsh 为你的默认 Shell：

```bash
sudo apt update
sudo apt install zsh -y
chsh -s $(which zsh)
```

安装和设置完成后，关闭并重启你的终端来使配置生效。

在 Windows 平台上会麻烦一些，主要是原生的 GNU Bash 并不支持 Windows 平台，更别提 Zsh 了。但也不完全没有办法，你可以参考下面两篇文章来在 Windows 平台使用 Zsh：

- [Installing Zsh (and oh-my-zsh) in Windows Git Bash](https://dominikrys.com/posts/zsh-in-git-bash-on-windows/)
- [Windows 安装 Zsh 终端 - 知乎](https://zhuanlan.zhihu.com/p/625583037)

## 配置框架与主题

Zsh 最知名的配置框架是 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)，通过下面的命令来安装它：

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

安装成功的话，你就会发现你的 Prompt 已经变了。

接着，可以安装一个主题。我使用的是 [powerlevel10k](https://github.com/romkatv/powerlevel10k)，它提供了一个一步一步的操作流程让你自定义一个你喜欢的命令提示符（其中第一步操作流程就是安装一个它推荐的 Nerd Font，如果你上面配置终端时已经配过了，这里就不需要安装了）：

```bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

然后打开 `~/.zshrc` 这个文件，找到 `ZSH_THEME` 开头的这一行并修改为：

```zshrc
ZSH_THEME="powerlevel10k/powerlevel10k"
```

> 顺便一说，`~/.zshrc` 中的 `~` 指的其实是你的家目录。举例而言，如果你的用户名是 `asuna`，那么它在各平台所代表的完整路径如下：
>
> - macOS: `/Users/asuna`
> - Linux: `/home/asuna`
> - Windows: `C:\Users\asuna`
>
> 所以实际上 `~/.zshrc` 是在说你的家目录下的 `.zshrc` 这样一个文件。它是 Zsh 的（其中一个）配置文件。

### 插件

Oh-my-zsh 提供了海量的插件以支持丰富的扩展功能 (查看 [插件列表](https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins))。有的是默认安装的，有的则需要你手动下载并配置。必装的我认为有这三个：

```bash
git clone https://github.com/zdharma-continuum/fast-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/fast-syntax-highlighting --depth=1
git clone https://github.com/zsh-users/zsh-autosuggestions.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions --depth=1
git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search --depth=1
```

如果你是 macOS 平台，我还推荐你安装下面这个插件，它可以自动检测你的系统代理设置并自动配置相关环境变量：

```bash
git clone https://github.com/sukkaw/zsh-osx-autoproxy ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-osx-autoproxy --depth=1
```

为了启用这些插件，你需要再次打开并编辑 `~/.zshrc` 文件（如果你没有安装 zsh-osx-autoproxy 插件，记得把对应的那一行删除）：

```zshrc
plugins=(
    fast-syntax-highlighting
    history-substring-search
    z
    zsh-autosuggestions
    zsh-osx-autoproxy
)
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=white'
```

如果你细心的话，你会发现我这里还启用了一个名为 `z` 的插件，它是默认安装的，你可以在 [这里](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/z) 找到关于它的说明。

## 别名

一些常用命令可能很长，你可以创建别名来加快输入速度。创建别名的命令是 `alias` 。例如对于 `ls`，我有下面这些别名：

```bash
alias ls="ls -FG --color=auto"
alias ll="ls -lh"
alias la="ls -a"
alias l="ll -a"
```

你可以将这些内容写入你的 `~/.zshrc` 配置文件中，这样每次你打开终端它们都会被自动配置好。而我的习惯是创建一个 `~/.aliases` 文件专门存储这些别名，并在 `~/.zshrc` 中添加下面这一行来包含它：

```zshrc
[[ -f ~/.aliases ]] && source ~/.aliases
```

你可以在 [这里](https://github.com/BlockLune/dotfiles/blob/main/.aliases) 找到我的 `.aliases` 文件。

## 自定义函数

还记得上面提到的配置终端代理吗？在那儿我们遇到了类似这样一条命令：

```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

我在 `~/.zshrc` 中创建了如下函数来让我快速配置终端代理：

```zshrc
proxy() {
  export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
}
```

## 懒加载

随着你配置的插件等内容的增多，你的 zsh 可能会花费越来越多的时间才能启动。在这种情况下，配置一些懒加载可能会有所帮助。下面的文章细致地介绍了相关技术：

- [我就感觉到快 —— zsh 和 oh my zsh 冷启动速度优化 | Sukka's Blog](https://blog.skk.moe/post/make-oh-my-zsh-fly/)

## 可能遇到的问题

- [syntax highlighting is super slow in WSL2 · Issue #790 · zsh-users/zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/issues/790)

## 更多资源

- [abhigenie92/zsh_to_fish: How to make zsh like fish?](https://github.com/abhigenie92/zsh_to_fish)
- [终极 Shell——ZSH - 知乎](https://zhuanlan.zhihu.com/p/19556676)
