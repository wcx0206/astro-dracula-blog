---
title: sdkman
date: 2024-10-18 10:59:00
tags:
---


使用 `SDKMAN!` 更加高效的管理你在本地的 Java 环境

<!--more-->

[SDKMAN！官网](https://sdkman.io)

### 什么是 `SDKMAN!`

`SDKMAN!` 是一个用于管理多个开发工具包（SDK）的工具。它可以在 Unix 系统（如 macOS 和 Linux）上安装、管理和切换不同版本的 SDK，例如 Java、Groovy、Scala、Kotlin 等。

### 为什么要使用 `SDKMAN!`

 不同课程以及项目使用的 Java 版本不一致，本地安装多个 Java JDK 后会出现一些奇怪的问题。所以想到需要一个类似 `Conda` (for Python) 的 JDK 版本管理工具，遂在好友推荐下找到并且使用了 `SDKMAN！`



### 安装 `SDKMAN!`

就下面一行命令 爽死 

而且使用这个貌似还不用自己配环境变量 更爽了

```bash
curl -s "https://get.sdkman.io" | bash
source "$HOME/.sdkman/bin/sdkman-init.sh"
```



### 如何使用 `SDKMAN!`

#### 查看目前可以安装的 Java JDK

```bash
sdk list java
```

![image-20241018105205475](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241018105205475.png)

#### 查看本地已经安装的 Java JDK

```bash
sdk list java | grep -i installed
```

![image-20241018105110430](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241018105110430.png)

#### 安装 Java JDK

```java
sdk install java 11.0.11.hs-adpt
  
// sdk install java 版本 从上面的list命令最后一列复制
```

#### 切换 Java 环境

```bash
sdk use java 11.0.11.hs-adpt
```

#### 设置默认 Java 环境

```
sdk default java 11.0.11.hs-adpt
```

#### 查看当前 Java JDK

```bash
sdk current
```

![image-20241018105401446](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20241018105401446.png)

#### 卸载某个版本的 JDK

```
sdk uninstall java 11.0.11.hs-adpt
```

