---
title: "Package Managers on Linux: A Simple Cheat Sheet"
abbrlink: 4ee6ac78
categories:
- CS
- Tools
tags:
- apt
- linux
- package-manager
- pacman
- tool
- unix
date: 2023-03-11 14:23:18
updated: 2025-02-02 20:37:00
---

What are package managers? For beginners, you can think of them as "app stores for nerds". More specifically, they are tools for automating software installation, updates, and dependency resolution. Here's a simple cheat sheet for `apt` and `pacman`, which noting the most used commands.

<!--more-->

## Introduction

[APT (Advanced Packaging Tool)](https://en.wikipedia.org/wiki/APT_(software)) is the default package manager for Debian and Debian-based operating systems (like Ubuntu). The [pacman](https://wiki.archlinux.org/title/Pacman) package manager is the default package manager of Arch Linux.

In this post, I will introduce the most used commands for `apt` and `pacman`.

## Mirrors

Before you start to use the package manager, changing its source to a mirror source in your country might be greatly helpful.

### Quick way to change the source

A utility called [chsrc](https://chsrc.run) could help you change the source of `apt` and `pacman` easily. Go to its website, and follow the instructions to change the source.

### Manually changing the source

If you want to change the source manually...

For `apt`, here is the [tsinghua tuna mirror](https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu/) in China. Edit the file `/etc/apt/sources.list`, and paste the string below into the file.

```text
## Tsinghua
## from https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
```

Save the file and run `sudo apt update` to update the source information.

For `pacman`, you can find the mirror you need on [Mirror Overview of ArchLinux offical site](https://archlinux.org/mirrors/). Choose one or more mirrors, and edit the file `/etc/pacman.d/mirrorlist` to be like this:

```text
### China
## Aliyun
Server = https://mirrors.aliyun.com/archlinux/$repo/os/$arch
## Tsinghua
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
## NJU
Server = https://mirrors.nju.edu.cn/archlinux/$repo/os/$arch
## NJUPT
Server = https://mirrors.njupt.edu.cn/archlinux/$repo/os/$arch
```

Save the file and run `sudo pacman -Syu` to synchronize and update all the packages.

## Update packages

```bash
# apt
sudo apt update # update the package info
sudo apt upgrade # upgrade all the packages installed

# pacman
sudo pacman -Syu # synchronize and update all the packages
```

## Query packages

To find the package you need in the repository:

```bash
# apt
apt search PACKAGE_NAME

# pacman
pacman -Ss PACKAGE_NAME # The big "S" means "sync", and the small one means "search".
```

To list the packages installed:

```bash
# apt
apt list --installed

# pacman
pacman -Qq  # list all the packages, ignore version (-q)
pacman -Qqe # list explicitly installed packages (-e)
pacman -Qqd # list the packages installed as dependencies (-d)
pacman -Qqdt # list the packages which are no longer dependencies (-t), usually can be removed
```

## Install packages

```bash
# apt
sudo apt install PACKAGE_NAME
sudo apt install -y PACKAGE_NAME # auto answer "yes" to the prompt
sudo apt install -f # fix the dependencies

# pacman
sudo pacman -S PACKAGE_NAME
```

## Remove packages

```bash
sudo apt remove PACKAGE_NAME
sudo apt autoremove # auto remove the packages that no longer needed

sudo pacman -R PACKAGE_NAME
sudo pacman -Rs PACKAGE_NAME # remove the package and its dependencies that are not required by any other installed package
```

## Pacman only configurations

To enable the color output for `pacman`, edit the file `/etc/pacman.conf`, and uncomment the `Color` line.

```text
Color
```

To enable the parallel download for `pacman`, edit the file `/etc/pacman.conf`, and uncomment the `ParallelDownloads` line.

```text
ParallelDownloads = 5
```

## AUR and AUR helpers

[AUR (Arch User Repository)](https://aur.archlinux.org/) is a community-driven repository for Arch Linux users. You can find many packages that are not in the official repository.

To install packages from AUR, you can clone the repository and build and install the package manually. Or you can use AUR helpers like [`yay`](https://github.com/Jguer/yay), [`paru`](https://github.com/Morganamilo/paru), etc to simplify the process. These helpers share a similar syntax with `pacman`. Actually, they use `pacman` behind the scenes.

`yay` and `paru` themselves are also in AUR. Let's take `paru` as an example of how to install a package from AUR manually:

```bash
sudo pacman -S --needed base-devel
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

> [!info]
> `makepkg` is a script to automate the building of packages. `-s` means to install the dependencies automatically, and `-i` means to install the package after building. It's provided by the `pacman` package.

After you have installed an AUR helper like `paru`, you can use it to install packages from AUR. For example, the command below installs `visual-studio-code-bin` from AUR with `paru`:

```bash
paru -S visual-studio-code-bin
```

## Learn more

- [APT (Advanced Packaging Tool)](https://en.wikipedia.org/wiki/APT_(software))
- [Arch User Repository](https://aur.archlinux.org/)
- [pacman(8) — Arch manual pages](https://man.archlinux.org/man/pacman.8)
- [pacman](https://wiki.archlinux.org/title/Pacman)
- [《Arch Linux 软件包的查询及清理》](https://www.cnblogs.com/sztom/p/10652624)
