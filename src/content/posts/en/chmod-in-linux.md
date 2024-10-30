---
abbrlink: a9dc5c1e
categories:
- CS
- Tools
date: 2023-03-23 22:27:08
tags:
- unix
- terminal
- linux
- chmod
- permission-management
title: The chmod command in Linux
---

I accidentally ran a wrong `chmod` command in my Linux, and it messed up everything! I hate the permission management in Linux. :|

<!--more-->

## Permission Management in Linux

When you run `ls -l` in your terminal, you can always see strings like `-rw-r–r–` and `drwxr-xr-x` etc. To understand them, we can always split a such string into four part. The first one is a single character, `-` if it's a file and `d` if it's a directory. The rest 9 characters can be equally divided into three parts, representing the permission of the owner, the members of the group and other users relatively. Every part contains three characters, showing the permission of **r**(read), **w**(write) and **x**(execute).

![When you run `ls -l`](https://b316f18.webp.li/blog-imgs/cs/tools/the-chmod-command-in-linux/1.png)
![From www.runoob.com](https://www.runoob.com/wp-content/uploads/2014/08/file-permissions-rwx.jpg)

Besides the bit pattern, you can also use octal notation to express these permissions, which uses 4 for **r**, 2 for **w** and 1 for **x**. The sum of these octal numbers then can replace the `rwx` pattern. For example, using 6 for **rw**.

Why is 4, 2 and 1? Actually, you can view every 3-character unit as 3 binary bits. So, 100(r--) means 4 in decimal, 010(-w-) means 2, and 001(--x) means 1. You can then understand what dose the sum means.

![From www.runoob.com](https://www.runoob.com/wp-content/uploads/2014/08/rwx-standard-unix-permission-bits.png)

Now, you can read this:

```bash
-rw------- # (600) Owner:RW
-rw-r--r-- # (644) Owner:RW Group:R Other:R
-rw-rw-rw- # (666) Owner:RW Group:RW Other:RW
-rwx------ # (700) Owner:RWX
-rwx--x--x # (711) Owner:RWX Group:X Other:X
-rwxr-xr-x # (755) Owner:RWX Group:RX Other:RX
-rwxrwxrwx # (777) Owner:RWX Group:RWX Other:RWX
```

## Default Permission

The default permission for a file is 666, which means `-rw-rw-rw-`, indicating that the owner, group and other users can read and write the file. The default permission for a directory is 777, which means `drwxrwxrwx`, indicating that the owner, group and other users can read, write and access the directory.

However, these default permissions are affected by the user’s **umask** setting. The umask is a value that controls which permissions are removed when creating a new file or directory. For example, if the user’s umask is 022, then the write permission for group and other users will be removed when creating a new file, and the write and execute permission for group and other users will be removed when creating a new directory. Therefore:

The actual default permission for a file is 666 - 022 = 644, which means `-rw-r–r–`. The actual default permission for a directory is 777 - 022 = 755, which means `drwxr-xr-x`.

You can run the `umask` command to see what your setting is.

![](https://b316f18.webp.li/blog-imgs/cs/tools/the-chmod-command-in-linux/4.png)

## The chmod Command

![](https://b316f18.webp.li/blog-imgs/cs/tools/the-chmod-command-in-linux/5.png)

```bash
chmod [-cfvR] [--help] [--version] <mode> <file>...
```

The `-R` means recursively. You will need it.

The most important part is `<mode>` obviously. Its pattern is:

```bash
[ugoa...][[+-=][rwxX]...][,...]
```

1. [ugoa...]: `u` means user, `g` means group, `o` means other, and `a` means all.
2. [+-=]: `+` means adding permission, `-` means removing, and `=` means setting the permissions for a specific user type, **regardless of the previous permissions**.
3. [rwxX]: You have known `rwx`, and the `X` means setting the execute permission only if the file is a directory or already has execute permission for some user.

For example:

```bash
chmod u+x <file> # adding execute permission to the owner of the file, and leaving the group and other permissions unchanged
chmod o-rwx <file> # removing all permissions from others, and leaving the owner and group permissions unchanged
chmod a=r <file> # setting all user types’ permissions to read only, overwriting any previous permissions
chmod a+X <file> # adding execute permission to all user types only if file is a directory or already executable by some user
```

You can also use octal pattern represents the `<mode>`. For example:

```bash
chmod 777 <file> # now everyone can read, write and execute the <file>
```

## Change Permissions to File or Dir Individually

To change permissions to file or dir individually, you can use the `-exec` option of `find` to execute chmod on each matching file or directory. For example: To find all files in the current directory and its subdirectories and change their permissions to 644, you can use: `find . -type f -exec chmod 644 {} ;`

`-type f` means file. You can use `-type d` to find all the dir.

## Thanks

By the way, this blog was completed with the help of new bing. I asked her many questions and got great answers. She also helped me correct errors and polish my writing. She is just too amazing!

## Reference

- [《Linux chmod 命令 | 菜鸟教程》](https://www.runoob.com/linux/linux-comm-chmod.html)
- [《Linux 权限详解（chmod、600、644、700、711、755、777、4755、6755、7755）》](https://blog.csdn.net/u013197629/article/details/73608613)