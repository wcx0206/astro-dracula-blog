---
title: "joshuto: A great file manager in terminal"
categories:
  - CS
  - Tools
tags:
  - joshuto
abbrlink: "348795e3"
date: 2023-07-12 11:39:18
---

When in a terminal, sometimes it's really annoying to keep on typing in `cd` or something else to browse the files and directories. Can we do it just like what we do in GUI? Then joshuto may be helpful to you.

<!--more-->

## Brief

[joshuto](https://github.com/kamiyaa/joshuto) is a [ranger](https://ranger.github.io/)-like terminal file manager written in Rust. Thanks to rust's excellent performance, joshuto is much faster than ranger.

It allows you to explore files in terminal like this:

![joshuto on GitHub](https://b316f18.webp.li/blog-imgs/cs/tools/joshuto-a-great-file-manager-in-terminal/1.png)

## Installation

### Arch

In archlinux, I choose to use `yay`. Run the command below and keep hitting Enter.

```bash
yay -S joshuto
```

<!--blockquote2note:info,,How to install Yay?-->

> How to install Yay from source?
>
> First, run:
>
> ```bash
> sudo pacman -Sy --needed git base-devel
> ```
>
> Then, download the AUR package:
>
> ```bash
> git clone https://aur.archlinux.org/yay.git
> ```
>
> And then, go into the directory:
>
> ```bash
> cd yay
> ```
>
> Finally, build it:
>
> ```bash
> makepkg -si
> ```

<!--end-blockquote2note-->

### Ubuntu

You can install `joshuto` using `cargo`:

```bash
cargo install --git https://github.com/kamiyaa/joshuto.git --force
```

{% note info%}

To install `cargo`, run:

```bash
sudo apt install cargo
```

Then add `/$HOME/.cargo/bin` to PATH in `/$HOME/.profile`:

```bash
export PATH="$PATH:/$HOME/.cargo/bin"
```

If you don't use bash, but fishshell, then edit `/$HOME/.config/fish/config.fish` and add this line:

```bash
set -x PATH /$HOME/.cargo/bin $PATH
```

{% endnote %}

## Usage

First, to open the GUI, run:

```bash
joshuto
```

`joshuto` supports vim-like operations:

- Move up: `k`
- Move down: `j`
- Return to parent directory: `h`
- Open file or directory: `l`
- Go to top: `gg`
- Go to bottom: `G`
- Page up: `<c-u>`
- Page down: `<c-d>`

- Cut / Delete file: `dd`
- Copy file: `yy`
- Paste file: `pp`

Learn more [here](https://github.com/kamiyaa/joshuto/blob/main/README.md#usage)
