---
abbrlink: 4ee6ac78
categories:
- CS
- Tools
date: 2023-03-11 14:23:18
tags:
- 'Here are the tags for the article:


  `unix'
- tool
- package-manager
- linux
- apt`
title: Package managers in Linux (To be continued)
toc: true
---

This post tries to simply introduce some package managers and their basic usage.
<!--more-->

## pacman

The pacman package manager is the default package manager of Arch Linux. Learn more about pacman on the official wiki [here](https://wiki.archlinux.org/title/Pacman).

### pacman - Changing to mirror

Before you start to use pacman, changing its source to mirror source in your country might be greatly helpful.

Firstly, find a mirror you need on [Mirror Overview of ArchLinux offical site](https://archlinux.org/mirrors/). Here I choose the mirror from my mother school, whose URL is `https://mirrors.njupt.edu.cn/archlinux/`.

Then, edit `/etc/pacman.d/mirrorlist` , and paste the string below into the file.

```
Server = https://mirrors.njupt.edu.cn/archlinux/$repo/os/$arch
```

Last, save the file and run `sudo pacman -Syu` to update.

> The file `/etc/pacman.d/mirrorlist` has already provided many mirrors in it. So you can just skip the first step above, just edit the mirrorlist file. Find the server you want, and delete the `#` at the begining of that line to uncomment it.

For an easy copy, here are some mirrors in China:

```
### China
## Aliyun
# Server = https://mirrors.aliyun.com/archlinux/$repo/os/$arch
## Netease
# Server = https://mirrors.163.com/archlinux/$repo/os/$arch
## Tsinghua
# Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
## NJU
# Server = https://mirrors.nju.edu.cn/archlinux/$repo/os/$arch
## NJUPT
# Server = https://mirrors.njupt.edu.cn/archlinux/$repo/os/$arch
```

### pacman - Upgrading packages

Run the command below to upgrade packages.

```bash
sudo pacman -Syu
```

You are recommended to immediately run this command after changing to a mirror.

### pacman - Querying package(s)

To find the package you need in the sync database:

```bash
pacman -Ss <package_name>
```

The "s" in the small case means "search".

To list the packages installed:

```bash
pacman -Qq  // list all the packages, ignore version (-q)
pacman -Qqe // list explicitly installed packages (-e)
pacman -Qqd // list the packages installed as dependencies (-d)
pacman -Qqdt // list the packages which are no longer dependencies (-t), usually can be removed
```

### pacman - Installing package(s)

This command helps install one or more packages.

```bash
sudo pacman -S <package_name1> <package_name2> ...
```

For example, to install *bat*, run:

```bash
sudo pacman -S bat
```

### pacman - Removing package(s)

This command helps remove a single package, leaving all of its dependencies installed:

```bash
sudo pacman -R <package_name>
```

To remove a package and its dependencies that are not required by any other installed package:

```bash
sudo pacman -Rs <package_name>
```

Here I found a helpful article that provides more information: [《Arch Linux 软件包的查询及清理》](https://www.cnblogs.com/sztom/p/10652624.html).

## APT

The APT(Advanced Packaging Tools) is(Maybe "are"? Since it's "tools"?) widely used in Debian and Ubuntu etc. It mainly includes `apt-get` ,`apt-cache` and `apt-file`.

### APT - Changing to mirror

Take Tsinghua's mirror as an example:

```
## Tsinghua
## from https://mirrors.tuna.tsinghua.edu.cn/help/ubuntu
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-backports main restricted universe multiverse

# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse
# # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-security main restricted universe multiverse

deb http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse
# deb-src http://security.ubuntu.com/ubuntu/ jammy-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
# # deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ jammy-proposed main restricted universe multiverse
```

### APT - Useful commands

```bash
sudo apt update // update the package info 
sudo apt upgrade // upgrade all the packages installed
apt list --upgradeable // list all the packages that can upgrade

sudo apt install <package_name> // install a specific package
sudo apt install -f // fix the dependencies

sudo apt remove <package_name> // remove a specific package
sudo apt autoremove // auto remove the packages that no longer needed

apt show <package_name> // show the info about a specific package
```

## To be continued