---
title: 我的 Vim (以及 NeoVim) 配置
tags:
  - Vim
  - Config
categories:
  - CS
  - Tools
abbrlink: 96f7ff9f
date: 2023-04-22 10:27:09
updated: 2024-10-18 17:00:00
---

Vim 可以说是一个老古董了，但是在命令行文本编辑器这一领域，即使到目前，它说第二也没人能说第一。在这篇文章中，我们会进行一些简单的配置，让 Vim 更加好用。并且，我们还会谈到 NeoVim 相关的内容，通过安装和配置 LazyVim，来让 NeoVim 变为一个现代化的、全功能的 IDE。

<!--more-->

## Vim

首先备份你的 Vim 设置（如果你配置过的话）：

```bash
mv .vimrc .vimrc.bak
```

接着，在开始下面的工作之前，记得配置好代理。因为下面的操作需要大量访问 GitHub。

安装 [vim-plug](https://github.com/junegunn/vim-plug)，它是一个 Vim 插件管理器：

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

然后下载我的配置：

```bash
curl -o ~/.vimrc https://raw.githubusercontent.com/BlockLune/dotfiles/refs/heads/main/.vimrc
```

启动 Vim。这里会因为缺失插件报错，但我们启动它就是为了进去装插件的所以不用管，回车即可：

```bash
vim
```

最后，在 Vim 中运行 `:PlugInstall` 来安装这些插件。下面是部分插件的简介：

| Plugin                 | Basic Usage                                                                               | Link                                                         |
| ---------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| ack.vim                | Search text in the project using `:Ack` command                                           | [GitHub](https://github.com/mileszs/ack.vim)                 |
| ale                    | Perform syntax checks while editing code with configured tools                            | [GitHub](https://github.com/dense-analysis/ale)              |
| auto-pairs             | Automatically insert closing brackets for opening brackets                                | [GitHub](https://github.com/jiangmiao/auto-pairs)            |
| CamelCaseMotion        | Press `<leader>` followed by a motion command to move to the next/previous CamelCase word | [GitHub](https://github.com/bkad/CamelCaseMotion)            |
| ctrlp.vim              | Open CtrlP window with `:CtrlP` or `<C-p>`, then search and open files                    | [GitHub](https://github.com/ctrlpvim/ctrlp.vim)              |
| lightline.vim          | Customize appearance and content of the statusline                                        | [GitHub](https://github.com/itchyny/lightline.vim)           |
| nerdtree               | Open NERDTree window with `:NERDTree`, navigate with `hjkl` keys                          | [GitHub](https://github.com/preservim/nerdtree)              |
| vim-commentary         | Comment/uncomment lines with `gc` or `gC` commands                                        | [GitHub](https://github.com/tpope/vim-commentary)            |
| vim-dracula            | Switch to Dracula theme with `:colorscheme dracula`                                       | [GitHub](https://github.com/dracula/vim)                     |
| vim-easymotion         | Trigger EasyMotion with `<Leader><Leader>` and enter characters to jump                   | [GitHub](https://github.com/easymotion/vim-easymotion)       |
| vim-fugitive           | View file status with `:G status`, commit changes with `:G commit` and so forth           | [GitHub](https://github.com/tpope/vim-fugitive)              |
| vim-indent-guides      | Visually display indent levels in Vim                                                     | [GitHub](https://github.com/preservim/vim-indent-guides)     |
| vim-sensible           | Configure Vim with sensible defaults for a pleasant editing experience                    | [GitHub](https://github.com/tpope/vim-sensible)              |
| vim-surround           | Change surrounding characters with `cst`, delete surroundings with `dst`, and more        | [GitHub](https://github.com/tpope/vim-surround)              |
| vim-unimpaired         | Provides various useful mappings for manipulating vertical whitespace and more            | [GitHub](https://github.com/tpope/vim-unimpaired)            |
| vim-visual-star-search | Search for the visually selected text with `*` and `#` commands                           | [GitHub](https://github.com/nelstrom/vim-visual-star-search) |
| YouCompleteMe          | A code-completion engine for Vim                                                          | [GitHub](https://github.com/ycm-core/YouCompleteMe)          |

## NeoVim (LazyVim)

LazyVim 是一个 NeoVim 配置，它几乎已经是个 IDE 了。我基于 LazyVim 又进行了一些配置，你可以在 [这里](https://github.com/BlockLune/NeovimConfig) 找到。

## 其他软件中的 Vim 模式

TODO

## 参考和更多阅读资料

- _[A Good Vimrc (dougblack.io)](https://dougblack.io/words/a-good-vimrc.html)_
- _[Editors (Vim) · Missing Semester (mit.edu)](https://missing.csail.mit.edu/2020/editors/)_
- _[Practical Vim by Drew Neil](https://pragprog.com/titles/dnvim2/practical-vim-second-edition/)_
- _[VIMCASTS.org](http://vimcasts.org/)_
- _[Vim 配置入门 - 阮一峰的网络日志 (ruanyifeng.com)](https://ruanyifeng.com/blog/2018/09/vimrc.html)_
