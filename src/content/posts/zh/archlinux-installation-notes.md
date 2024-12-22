---
title: Arch Linux 安装笔记
tags:
 - archlinux
 - hyprland
 - installation
 - linux
 - linux-setup
 - unix
date: 2024-12-22 19:01:16
---

最近在 VMWare 中安装了 Arch Linux。Arch Linux 的 [Wiki](https://wiki.archlinuxcn.org/) 写得非常好，而且中文资料很丰富，加之 AI Chatbot 的帮助，安装过程总体上还是很顺利的。这里记录一下在[安装指南](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)中没有直接提到的一些细节，以及后续的一些配置。

<!--more-->

## VMWare 的配置

[VMWare WorkStation Pro 目前对个人用户是免费的](https://blogs.vmware.com/workstation/2024/05/vmware-workstation-pro-now-available-free-for-personal-use.html)，您可以直接去官网下载安装。

安装完成后，创建一个新的虚拟机。然后按需求配置虚拟机硬件。两个特殊的配置是：我希望使用 UEFI 引导，所以需要在 `虚拟机设置 -> 选项 -> 高级 -> 固件类型` 中选择 UEFI；后续我希望安装 [Hyprland](https://hyprland.org/)，所以我还在 `虚拟机设置 -> 硬件 -> 显示屏 -> 3D 图形` 中勾选了 `加速 3D 图形`。

确保您在 `虚拟机设置 -> 硬件 -> CD/DVD (SATA) -> 连接` 中选择了 `使用 ISO 映像文件`，并选择了您[下载](https://archlinux.org/download/)的 Arch Linux 镜像，就可以启动虚拟机，开始安装了。

## 安装过程

从[安装指南](https://wiki.archlinuxcn.org/wiki/%E5%AE%89%E8%A3%85%E6%8C%87%E5%8D%97)的 `1.5` 开始一步一步做到 `1.8`，然后进行 `1.9 创建硬盘分区`。

### 磁盘分区

各种硬盘设备会被系统识别并分配为一个[块设备](https://zh.wikipedia.org/wiki/%E8%AE%BE%E5%A4%87%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F#.E5.91.BD.E5.90.8D.E7.BA.A6.E5.AE.9A)，如 `/dev/sda`（此处 `sd` 表示 SCSI 硬盘，`a` 表示第一个）。

我们可以使用 `lsblk` 或 `fdisk` 来查看这些块设备，此处我使用 `fdisk`：

```bash
fdisk -l
```

按照指南中所说的：

> 结果中以 rom、loop 或者airootfs结尾的设备可以被忽略。结果中以 rpbm、boot0 或者 boot1 结尾的 mmcblk* 设备也可以被忽略。

我在此处看到的有效设备是 `/dev/sda`。

![lsblk 和 fdisk -l 的运行结果](https://webp.blocklune.cc/blog-imgs/archlinux-installation-notes/block-devices.png)

接下来，我们就可以开始分区了。采用的是指南中的分区方案示例，具体如下：

- `/dev/sda1` 为 EFI 系统分区，大小为 1GB，文件系统为 `FAT32`；
- `/dev/sda2` 为 Swap 分区，大小为 4GB；
- `/dev/sda3` 为根分区，大小即剩余硬盘大小，文件系统为 `ext4`。

这个分区方案是为 UEFI 引导准备的，所以有一个 EFI 系统分区。

`FAT32` 和 `ext4` 是文件系统。前者较老但兼容性较好，EFI 分区必须使用 `FAT32` 以确保 UEFI 固件可读；后者是 Linux 默认的文件系统，功能更多性能更好。

我使用 `fdisk` 来进行分区。首先运行下面的命令来指定硬盘：

```bash
fdisk /dev/sda
```

进入 `fdisk` 后，我们可以使用以下命令来查看帮助、进行操作和保存：

- `m`：查看帮助；
- `g`：新建 GPT 分区表；
- `n`：新建分区；
- `t`：更改分区类型；
- `p`：查看分区表；
- `w`：保存并退出。

我们需要首先按下 `g` 创建一个 GPT 分区表。

下面，按下 `n` 创建一个分区。第一个分区是 EFI 系统分区。分区号回车默认为 `1`，起始扇区回车默认为 `2048`，结束扇区输入 `+1G` 后回车，这样就创建了一个大小为 1GB 的分区。然后按下 `t` 更改分区类型，输入分区号并更改类型为 `EFI System`。

接着进行类似地操作，创建一个 Swap 分区，分区类型是 `Linux swap`。

最后再创建根分区，按下 `n` 开始创建，结束扇区直接回车，这样就会占据剩余的硬盘空间。类型不需要手动修改，默认就是 `Linux filesystem`。

分区完成后，按下 `p` 查看分区表，确认无误后按下 `w` 保存并退出。

![分区完成后按下 `p` 的输出](https://webp.blocklune.cc/blog-imgs/archlinux-installation-notes/partitions.png)

可以用 `lsblk` 来查看分区情况。

### 格式化分区

分区完成后，就可以进行格式化操作，创建文件系统了。

在 EFI 系统分区上创建 `FAT32` 文件系统：

```bash
mkfs.fat -F 32 /dev/sda1
```

创建 Swap 分区：

```bash
mkswap /dev/sda2
```

在根分区上创建 `ext4` 文件系统：

```bash
mkfs.ext4 /dev/sda3
```

### 挂载分区

然后，我们需要挂载这些分区。首先挂载根分区：

```bash
mount /dev/sda3 /mnt
```

挂载 EFI 系统分区（指南中挂载到的位置是 `/mnt/boot`，但我查询了其他资料，似乎更建议挂载到 `/mnt/boot/efi`）：

```bash
mount --mkdir /dev/sda1 /mnt/boot/efi
```

还需要激活 Swap 分区：

```bash
swapon /dev/sda2
```

可以用下面的命令来查看激活情况：

```bash
swapon --show
```

### 生成 fstab 文件

继续跟随指南完成 `2 开始安装系统`，然后进行 `3 配置系统`，在 `3.1 生成 fstab 文件` 时，我们需要生成一个 `fstab` 文件。[fstab](https://wiki.archlinuxcn.org/wiki/Fstab) (File System Table) 文件的作用是告诉系统如何挂载和使用文件系统。

我们可以使用下面的命令来生成 `fstab` 文件：

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

含义如下：

- `genfstab` 是生成 fstab 文件的工具
- `-U` 表示使用 UUID 来标识设备（比设备路径更可靠）
- `/mnt` 是当前挂载的目标系统
- `>>` 表示将输出追加到文件
- `/mnt/etc/fstab` 是生成的 fstab 文件的位置

### chroot 到新安装的系统

到目前位置，我们实际上都是在 Live CD 环境中操作的，此时的 `/` 是 Live CD 的根目录。为了进入新安装的系统，我们需要 `chroot` 到新安装的系统。

在前面的操作中，我们已经挂载了根分区到 `/mnt`，所以我们只需要 `chroot` 到 `/mnt` 即可。运行下面的命令：

```bash
arch-chroot /mnt
```

此处并没有直接使用 `chroot` 命令，而是使用了 [`arch-chroot`](https://wiki.archlinuxcn.org/wiki/Chroot#%E4%BD%BF%E7%94%A8_arch-chroot) 命令。这是 Arch Linux 提供的一个脚本，它会自动地进行包括挂载 `/proc`、`/sys`、`/dev` 和 `/run` 到新系统在内的一系列操作，使用起来更方便。

### 安装引导程序

接着跟随指南到 `3.8 安装引导程序`，我们来安装 [GRUB](https://wiki.archlinuxcn.org/wiki/GRUB)。

首先安装必要的包：

```bash
pacman -S grub efibootmgr
```

然后安装 GRUB：

```bash
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```

## 后续配置

### 添加新用户

让我们来添加一个 sudo 用户。运行下面的命令创建一个名为 `username` 的用户并将其添加进 [`wheel`](https://en.wikipedia.org/wiki/Wheel_(computing)) 组：

```bash
useradd -m -G wheel username
```

另一些有用的命令：

```bash
# 查看某用户所属的组
groups username

# 将现有用户加入 wheel 组
usermod -aG wheel username
```

然后编辑 `/etc/sudoers` 文件，可以这样做：

```bash
EDITOR=vim visudo

# 然后在打开的文件中找到并取消下面这一行的注释
# %wheel ALL=(ALL:ALL) ALL
```

### 虚拟机工具

我在 VMWare 中安装了 Arch Linux，配合虚拟机工具可以更方便地使用虚拟机。但我没有选择 VMWare 官方提供的版本，而是使用了 `open-vm-tools`。

```bash
# 安装 open-vm-tools
pacman -S open-vm-tools

# 如果你使用图形界面，还需要安装
pacman -S gtkmm3 xf86-video-vmware xf86-input-vmmouse

# 启用服务
systemctl enable vmtoolsd
systemctl start vmtoolsd

# 如果需要共享文件夹功能，还要启用这个服务
systemctl enable vmware-vmblock-fuse
systemctl start vmware-vmblock-fuse
```

### Hyprland

后续我还尝试安装了 [Hyprland](https://hyprland.org/)。不同于我们日常使用的浮动式窗口管理器，它是一个[平铺式窗口管理器](https://wiki.archlinuxcn.org/wiki/%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8#%E5%B9%B3%E9%93%BA%E7%AA%97%E5%8F%A3%E7%AE%A1%E7%90%86%E5%99%A8)，这意味着，窗口会以方格的形式排列在屏幕上，永远不会重叠。

此次安装我没有自行配置，而是使用了 [illogical-impulse](https://end-4.github.io/dots-hyprland-wiki/zh-cn/)。未来我可能会尝试自行配置。

## 参考资料

- [Arch Linux Wiki](https://wiki.archlinuxcn.org/)
- [Hyprland Official Site](https://hyprland.org/)
- [You NEED to try Hyprland on Linux RIGHT NOW | Hyprland for Newbs EP 1](https://youtu.be/2CP_9-jCV6A)
