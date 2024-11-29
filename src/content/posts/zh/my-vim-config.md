---
title: 我的 Vim 和 NeoVim 配置
abbrlink: 96f7ff9f
categories:
- CS
- Tools
tags:
- vim
- neovim
- ide
- text-editor
- terminal
- configuration
date: 2023-04-22 10:27:09
updated: 2024-11-29 10:45:00
---

本文记录了我在 Vim 和 NeoVim 中的配置。

<!--more-->

## Vim

### TL;DR

遵循这些步骤以快速应用我的 Vim 配置。请注意配置好代理，因为这些配置需要访问 GitHub。

首先，如果您已经配置过 Vim，请使用以下命令备份您的配置文件：

```bash
mv .vimrc .vimrc.bak
```

安装 [vim-plug](https://github.com/junegunn/vim-plug)，它是一个 Vim 插件管理器：

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

下载我的配置文件：

```bash
curl -o ~/.vimrc https://raw.githubusercontent.com/BlockLune/dotfiles/refs/heads/main/.vimrc
```

在命令行中键入 `vim` 以启动 Vim。此时会因为缺失插件报错，但我们很快就会安装它们。按下回车以继续。

在 Vim 中运行 `:PlugInstall` 来安装我配置中的插件。

### 详细说明

Vim 的配置文件是 `~/.vimrc`。为了自定义 Vim，您需要编辑这个文件。

#### 起步

作为一个历史悠久的软件，Vim 的一些默认配置并不符合现代软件的惯例。我建议您启用一些基础设置使其更现代化和符合现代人的直觉。作为起步，您可以参考 [`essential.vim`](https://github.com/toshimichimiki/practical-vim-2nd/blob/master/essential.vim) 、来自 [Missing Semester](https://missing.csail.mit.edu/2020/editors/) 的 [Basic Vimrc](https://missing.csail.mit.edu/2020/files/vimrc) 以及 [`tpope/vim-sensible`](https://github.com/tpope/vim-sensible/blob/master/plugin/sensible.vim)。我的配置就是基于 `tpope/vim-sensible` 的。

#### 插件

除了设置 Vim 本身，您还需要一些插件来使其更强大。而为了管理这些插件，您需要一个插件管理器。我使用的是 [vim-plug](https://github.com/junegunn/vim-plug)。运行下面的命令来安装它：

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

在安装完成后，您就可以在 `~/.vimrc` 中添加插件了。例如，为了安装 `tpope/vim-sensible`，您可以在 `~/.vimrc` 中添加：

```vim
call plug#begin()
Plug 'tpope/vim-sensible'
call plug#end()
```

然后在 Vim 中运行 `:PlugInstall` 来安装插件。

如果您想知道我使用的插件，可以查看我的 [`.vimrc`](https://raw.githubusercontent.com/BlockLune/dotfiles/refs/heads/main/.vimrc)。

#### 键位设置

Vim 的强大之处在于它的键位设置。您可以通过键位设置来自定义 Vim 的行为。我的设置包括：

- 在插入模式下使用 `jk` 映射为 `<Esc>`，以便更快地退出插入模式
- 使用 `Ctrl` + `hjkl` 来在窗口之间移动
- 使用 `H` 和 `L` 来在标签页之间移动
- 使用 `<leader>bd` 来关闭当前缓冲区
- 使用 `<leader>bo` 来关闭其他缓冲区
- 使用 `<leader>e` 来切换文件管理器 NERDTree
- ...

#### 培养好习惯

最近我安装了一个名为 [vim-hardtime](https://github.com/takac/vim-hardtime) 的插件，它会阻止我在短时间内多次按下 `hijk` 以此来敦促我使用更好的移动方式。您可以参考下面两篇文章以了解更多：

- _[Habit breaking, habit making | vimcasts.org](http://vimcasts.org/blog/2013/02/habit-breaking-habit-making/)_
- _[Moving around | Vim Tips Wiki](https://vim.fandom.com/wiki/Moving_around)_

需要注意的是，您可能需要在中文编辑环境下关闭这个插件。毕竟您没法用 `w`、`b`、`e`、`f` 等键位在中文中移动了。

## NeoVim (LazyVim)

LazyVim 是一个 NeoVim 配置，它几乎已经是个 IDE 了。我基于 LazyVim 又进行了一些配置，您可以在 [这里](https://github.com/BlockLune/dotfiles/tree/main/.config/nvim) 找到。

## 其他软件中的 Vim 模式

TODO

## 参考和更多阅读资料

- _[A Good Vimrc (dougblack.io)](https://dougblack.io/words/a-good-vimrc.html)_
- _[Editors (Vim) · Missing Semester (mit.edu)](https://missing.csail.mit.edu/2020/editors/)_
- _[Habit breaking, habit making | vimcasts.org](http://vimcasts.org/blog/2013/02/habit-breaking-habit-making/)_
- _[Moving around | Vim Tips Wiki](https://vim.fandom.com/wiki/Moving_around)_
- _[Practical Vim by Drew Neil](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)_
- _[VIMCASTS.org](http://vimcasts.org/)_
- _[Vim 配置入门 - 阮一峰的网络日志 (ruanyifeng.com)](https://ruanyifeng.com/blog/2018/09/vimrc.html)_
- _[ivim](https://github.com/kepbod/ivim)_
