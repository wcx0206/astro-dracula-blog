---
date: 2024-11-09 16:23:00
tags:
- unix
- windows
- terminal
- productivity
- software-engineering
- configuration
- tool
title: 简明开发环境配置指南
---

作为开发者，我们每天都会使用各种机器。一个配置良好的开发环境可以显著提高生产力，让编码变得更加愉快。本指南将指导您配置一个舒适且高效的工作空间。此文主要面向初学者，但经验丰富的开发者也可能受到启发。

<!--more-->

## 为什么开发环境配置很重要 & 本指南适合谁

过去，我的终端未经配置，是一个无聊的黑框框，它不能激发我的任何兴趣。但经过配置后，我现在使用的终端是彩色的，并且功能丰富 —— 只需键入几个字母，曾经输入过的命令就会弹出；命令的各部分都会以不同颜色高亮，我可以从颜色上轻松判断一个程序是否存在或一个文件是否可以执行...这是一个简单的例子。相信我，一个好的开发环境真的能 make life easier！

![我的终端](https://pub-af472240fc074a369c4d02574ef383b5.r2.dev/sip/2024/09/02/18mgdt-o7.webp)

终端配置只是开发环境配置的一小部分。往大了说，各种各样的配置可能会很复杂，但本指南试图为初学者提供一个路线图。需要注意的是，这份指南不是一个逐步教程，这意味着我不会展示如何下载和安装各个应用程序。您可能需要自行参考本文中提到的各种软件的官方网站以了解如何安装和使用它们。

本文的灵感来源于：

- [macOS Setup Guide](https://sourabhbajaj.com/mac-setup/)
- [一个仅供参考的 CS 学习规划 (#环境配置)](https://csdiy.wiki/CS%E5%AD%A6%E4%B9%A0%E8%A7%84%E5%88%92/#_3)
- [新机器上手指南 (新手向)](https://taylover2016.github.io/%E6%96%B0%E6%9C%BA%E5%99%A8%E4%B8%8A%E6%89%8B%E6%8C%87%E5%8D%97%EF%BC%88%E6%96%B0%E6%89%8B%E5%90%91%EF%BC%89/index.html)

## 网络配置：永远的第一步

在深入开发环境设置之前，确保您的网络正常工作。您需要一个稳定的（国际）互联网连接来下载各种工具和软件包。（是的，“国际” 互联网，我们有太多国外软件要使用了！）

## 客户端配置：Windows、macOS 和 Linux

当我说 “客户端” 时，我指的是您正在使用的本地机器，即您的 PC 或 Mac。

在 Mac 上，您的操作系统一般是 macOS，而在 PC 上，可能是 Windows 或 Linux。大多数类 Unix 操作系统（如 macOS 或 Linux）上的配置是相似的，而在 Windows 上可能有所不同。作为开发者，我们更多地使用类 Unix 系统（大多数是 Linux）而不是 Windows。然而，作为 IT 领域的初学者（例如一名来自中国的计科学生），您可能只有一台运行 Windows 的 PC。

在本指南中，我充分理解这一点，所以我会尝试使您的 Windows 更加 “Unix 化”。我们不会使用虚拟机（例如 VMWare 或 WSL），因为这种方法实际上就是安装一个完整的 Linux 了。

### 添加用户账户

本节基本上只适用于 Linux 用户。当您安装好一个新的 Linux 系统时，您可能只有一个 root 账户。我们不建议使用 root 账户进行日常工作，因为它有点太 “万能” 了，如果您一不小心输错了命令或者犯了别的什么错误，可能会一下子导致严重的问题。通常，我们建议您创建一个新账户使用。

您可以使用以下命令创建一个新账户（将 `username` 替换为您想要的用户名）：

```bash
useradd -m username
```

`useradd` 命令是一个 POSIX 兼容的命令，用于创建新用户账户。`-m` 标志为新用户创建一个主目录。运行此命令后，您可以使用 `passwd` 命令为新用户设置密码。您可能还想让新用户成为 sudoer，这可以通过将用户添加到 `sudo` 组来完成：

```bash
usermod -a -G sudo username
```

或者您可以通过运行 `visudo` 手动编辑 sudoers 文件。

如果您使用的是 Ubuntu，您可以使用 `adduser` 命令。一步一步按照它给出的指示操作即可，会更容易：

```bash
adduser username sudo
```

### 选择合适的字体

一个好的编程字体可以带来巨大的不同。寻找具有以下特征的字体：

- 等宽
- 易于区分的字符（例如，您可以轻松区分 `1`，`l` 和 `I`，`O` 和 `0` 等）
- 连字支持（可选，只是为了美观，我个人比较喜欢这种）

此外，一个名为 “[Nerd Fonts](https://www.nerdfonts.com/)” 的字体集合提供了许多带有图标的修补字体，这在终端中非常有用。

![Nerd Fonts](https://www.nerdfonts.com/assets/img/sankey-glyphs-combined-diagram.png)

`FiraCode Nerd Font` 是我的最爱。如果您有选择困难症，不知道从上面的列表中选哪一个，那就试试我喜欢的这个吧！

### 终端、控制台和终端模拟器

您可能听说过 **“终端（Terminal）”** 或 **“控制台（Console）”** 这些词。这些词来自计算机巨大且昂贵的年代。整个建筑可能只有一台计算机。终端会放置在建筑的不同房间里，以便人们可以与那台计算机交互。终端是一个基于文本的界面，而控制台是一个物理设备。

而 **终端模拟器（Terminal Emulator）** 是模拟终端的软件，基本上它是一个看起来像终端的 GUI 应用程序。如今，您可以互换使用这些术语。

无论您使用什么操作系统，您都有一个内置的终端，例如 Mac 上的 `Terminal.app` 和 Windows 上的 `Windows Terminal`。然而，第三方提供了更多的功能和自定义选项。考虑使用下面的第三方终端模拟器：

- Mac 上的 [`iTerm2`](https://iterm2.com/)
- Windows 和 Linux 上的 [`Alacritty`](https://alacritty.org/)

`Alacritty` 是一个跨平台、高性能且高度可定制的终端模拟器。您也可以在 Mac 上使用 `Alacritty`，但我更喜欢在 Mac 上使用 `iTerm2`。

这是我在 Windows 上的 `Alacritty` 配置文件：

```toml
working_directory = "D:\\Documents"

[shell]
program = "C:\\Program Files\\Git\\bin\\bash.exe"
args = ["--login", "-i"]

[font]
bold = { family = "FiraCode Nerd Font Mono", style = "Bold" }
normal = { family = "FiraCode Nerd Font Mono", style = "Light" }
size = 12
offset = { x = 0, y = 4 }

[window]
dimensions = { columns = 80, lines = 30 }
padding = { x = 12, y = 12 }
```

主题是一组更改应用程序外观的配置。您可以使用主题使您的终端工具更好看，更易于使用。例如，在 Vim 中设置 `colorschema`。然而，我更喜欢在终端模拟器中设置主题，这样所有的终端工具都共享相似的外观。我在 `Alacritty` 和 `iTerm2` 中都使用了 [`Dracula`](https://draculatheme.com/) 主题。

顺便说一下，`Dracula` 主题也适用于许多其他应用程序。我也在我的 VS Code 和 JetBrains IDE 中使用它。共享的主题使您的开发环境更加一致和美观。

### Shell：您与系统内核之间的桥梁

在终端中运行的程序称为 Shell，它是用户与系统内核之间的桥梁。在大多数 Linux 上，默认的 Shell 是 `bash`，而在 macOS 上是 `zsh`。在 Windows 上有两个 Shell，`cmd` 和 `PowerShell`。

我推荐在所有系统上使用 `zsh`。您可以将其视为 bash 的超集，具有更多功能。这里是[我的配置](/posts/my-zsh-config)。在其中，我：

- 使用 [`oh-my-zsh`](https://github.com/ohmyzsh/ohmyzsh) 框架使 `zsh` 配置更容易
- 使用主题 [`powerlevel10k`](https://github.com/romkatv/powerlevel10k) 自定义命令提示符
- 使用许多其他插件和配置

如果您不想使用 `zsh`，因为它需要一些配置，您也可以试试 [`fish`](https://fishshell.com/)（我之前用的就是 `fish`）。然而，`fish` 不是 POSIX 兼容的，这意味着您可能会遇到一些 Shell 脚本的兼容性问题。这就是我更喜欢 `zsh` 的原因。但对于初学者来说，这没问题。

在大多数类 Unix 系统上，您已经安装了 `bash`，并且很容易在这些平台上安装 `zsh` 或 `fish`。但在 Windows 上，这有点棘手。

如果您想在 Windows 上安装 `bash`，您可以使用 [`git bash`](https://git-scm.com/)。当您在 Windows 上安装 `git`（一个流行的版本控制系统）时，它会被自动安装。此外，您也可以在 Windows 上使用 `zsh`。以下文章可能会有所帮助：

- [Installing Zsh (and oh-my-zsh) in Windows Git Bash](https://dominikrys.com/posts/zsh-in-git-bash-on-windows/)
- [Windows 安装 Zsh 终端 - 知乎](https://zhuanlan.zhihu.com/p/625583037)

我还没有找到在 Windows 上安装 `fish` 的好方法。如果您知道如何做到这一点，请通过留言或发送[电子邮件](mailto:i@blocklune.cc)告诉我。

> [!Caution]
> 另一个您可能需要注意的问题是您 Windows 平台上使用的字符集。如果您是一个使用中文 Windows 的中国 CS 学生，您的系统默认字符集通常不是 UTF-8。因此，您可能会遇到 [乱码](https://en.wikipedia.org/wiki/Mojibake) 问题。您可以在 `~/.zshrc` 的开头添加以下几行指令以在终端中启用 UTF-8，进而解决该问题：
>
> ```text
> # 将 Windows 代码页设置为 65001（UTF-8）。
> if [[ "$OSTYPE" == "msys" ]]; then
>     chcp.com 65001 &> /dev/null
> fi
> ```

安装您喜欢的 Shell 后，您可以通过运行以下命令将其设置为默认 Shell（仅适用于 Unix 类系统）：

```bash
chsh -s $(which zsh)
```

### 包管理器：开发者的应用商店

包管理器基本上扮演了应用商店的角色。“包（Package）” 这个术语意味着一堆文件。一个可执行的应用程序基本上是一堆文件，所以您可以将应用程序视为一个包。

在包管理器的帮助下，您不再需要去特定应用程序的官方网站，点击下载然后安装它，而是只需一行简单的命令。

在不同版本的 Linux 上有不同的包管理器，例如，Ubuntu 上最流行的包管理器是 `apt`，而 Arch 上是 `pacman`。它们在 Linux 系统准备就绪时就为您安装好了。

然而，在 Mac 上，您需要下载并安装一个包管理器。最流行的是 [Homebrew](https://brew.sh/)。Windows 也没有自带的包管理器。您可以自己下载并安装 [`scoop`](https://scoop.sh/) 或 [`choco`](https://chocolatey.org/)。

上面解释的 “包管理器” 这个概念实际上非常不严谨。更准确地说，上述包管理器是系统范围的。在各种技术栈中还有许多其他包管理器。例如，node.js 项目中的 `npm` 和 rust 项目中的 `cargo` 等。

> [!Tip]
> 对于中国用户来说，一个常见的头痛问题是与服务器的物理距离，导致网络信号差，从而下载速度慢，甚至超时，最终无法使用包管理器正确下载包。在这种情况下，您可以使用镜像站点。过去，我们必须手动修改不同包管理器的一堆配置文件。但现在您可以使用一个名为 [`chsrc`](https://github.com/RubyMetric/chsrc) 的工具。

### Gsudo：Windows 的第三方 `sudo`

本节仅适用于 Windows 用户。`sudo` 是 Unix 类系统中的一个命令，允许您以 sudoer 身份（基本上就是超级用户身份）运行命令。Windows 没有 `sudo` 命令，但您可以使用 [`gsudo`](https://github.com/gerardog/gsudo) 作为替代。

一个常见的用例是当您想使用 `choco` 安装一个包时，您运行一个类似 `choco install xxx` 的命令，但您可能会因为没有权限安装包而遇到错误。在这种情况下，您可以使用 `gsudo !!` 以管理员身份运行命令。（`!!` 是 `zsh` 中的一个快捷方式，表示上一个命令。）

### TLDR：速查手册

在 Unix 类系统上，您可以使用 `man` 命令查看命令的手册。然而，手册通常太长且难以理解。我只想知道命令的基本用法，但 `man` 提供了比我需要的更多的信息。

[`tldr-pages`](https://tldr.sh/) 项目填补了这一需求。运行 `tldr xxx` 将为您提供如何使用 `xxx` 命令的示例，涵盖最常见的用例。

我推荐使用 [`tealdeer`](https://github.com/dbrgn/tealdeer) 客户端，它基于 tldr pages 项目，但用 Rust 编写。它比原始的 `tldr` 客户端快得多。

![tealdeer 的介绍图片](https://raw.githubusercontent.com/dbrgn/tealdeer/main/docs/src/screenshot-default.png)

### Vim 和 VS Code：两个编辑器

我每天都使用 Vim 和 VS Code。我使用 Vim 进行快速和小的编辑，使用 VS Code 进行大型项目。即使在 VS Code 中，我也在使用 Vim 扩展来启用 Vim 键绑定。

我的 Vim 配置在[这里](/posts/my-vim-config)。

要在 Ubuntu 上将 Vim 设置为默认编辑器，您可以以 root 身份运行以下命令：

```bash
update-alternatives --config editor # 并在菜单中选择 vim
```

### 环境的版本控制

这里我不是在谈论像 `git` 这样的版本控制系统，而是您使用的软件的版本。例如，您可能在您的机器上安装了 `Node 20`，但您的项目需要 `Node 14`。如何快速有效地在同一软件的不同版本之间切换？这些工具可以帮助您：

- Java: [`sdkman`](https://sdkman.io/) 等
- Node.js: [`fnm`](https://github.com/Schniz/fnm), [`n`](https://github.com/tj/n), [`nvm`](https://github.com/nvm-sh/nvm) 等
- Python: [`pyenv`](https://github.com/pyenv/pyenv), [`conda`](https://www.anaconda.com/) 等（关于这个我也写了一篇[文章](/posts/managing-multiple-python-versions-with-pyenv-and-conda)）。

### Dotfiles：持久化您的应用配置

许多 Unix 类系统上的程序使用以 `.` 开头的文件作为其配置文件。例如，`bash` 的 `.bashrc` 和 `vim` 的 `.vimrc`。所以您可以将这些文件保存在某个地方（比如 GitHub 仓库）并同步到您的新机器上。如果您在 GitHub 上搜索 `dotfile`，您会发现许多具有类似名称的仓库。更多信息请参见 [dotfiles.github.io](https://dotfiles.github.io)。

我的 dotfiles 在[这里](https://github.com/blocklune/dotfiles)。

## 服务器端配置：Linux 是您的好朋友

在服务器上，Linux 是最流行的操作系统。因此，一般来说，您只需要将基于 Linux 的客户端配置复制到服务器端。

### SSH：轻松连接到服务器

SSH（Secure SHell）是一种网络协议，允许您安全地连接到远程服务器。它在 IT 行业中被广泛使用。您可以在本地机器上使用 `ssh` 命令连接到服务器。例如：

```bash
ssh username@hostname
```

默认情况下，您每次连接到服务器时都必须输入密码。您可以通过使用 SSH 密钥省略这个烦人的步骤。为此：使用 `ssh-keygen` 命令在本地机器上生成一对密钥，并使用 `ssh-copy-id` 命令将公钥复制到服务器。您将被提示最后一次输入密码，然后就可以在不输入密码的情况下连接到服务器。

> [!Note]
> 注意：我将关于 SSH 的部分放在服务器端配置中，但我们在这里使用的命令应该在客户端运行。

## 总结

配置一个高效的开发环境是一个持续的过程。随着时间的推移，您会发现新的工具和方法来进一步优化您的工作流程。希望本指南能为您提供一个良好的起点，并帮助您在开发过程中更加高效和愉快。如果您有任何问题或建议，欢迎通过[电子邮件](mailto:i@blocklune.cc)与我联系。祝您编码愉快！
