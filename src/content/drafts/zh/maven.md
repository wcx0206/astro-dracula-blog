---
title: maven
tags:

---

参考：[JavaGuide](https://javaguide.cn/tools/maven/maven-best-practices.html#%E6%8C%87%E5%AE%9A-maven-%E7%BC%96%E8%AF%91%E5%99%A8%E6%8F%92%E4%BB%B6)

### Maven 概述

<!--more-->

### 什么是 Mavan

[Maven](https://github.com/apache/maven) 官方文档是这样介绍的 Maven 的：

>Apache Maven is a software project management and comprehension tool. Based on the concept of a project object model (POM), Maven can manage a project's build, reporting and documentation from a central piece of information.

一开始我错误的认为 `Maven` 是 Java 的一个依赖管理器，然而事实 `Maven`  是一种项目的管理和理解工具。通过其们可以管理 Java 项目的项目依赖、构建过程（跨平台、标准的）、测试过程以及报告和文档的生成。

`Maven` 依赖于项目根目录下的 `pom.xml` 文件。

###  Pom 文件中依赖格式解析

```xml
<dependency>
    <groupId>com.xxx</groupId>
    <artifactId>yyy</artifactId>
    <version>1.0.0</version>
</dependency>
```

在这个例子中我列出了在 pom.xml 文件中引入一个依赖必须要填写的三个字段：

- `groupId` ：这个依赖隶属于的组织或者结构，可以在 `Mavan` 仓库中进行查询，[仓库地址](https://mvnrepository.com/)
- `artifactId`：这个 Maven 项目（依赖）的具体名称
- `version`：项目（依赖）的具体版本

当然除了这三个一般而言必须要填写的，还有 `scope` 、`type` 、`optional` 、`exclusions` 等。

>[!note]
>
>这里的 `scope` 字段用于表示依赖的范围，即这个依赖在哪些环境中会被引入，主要可能会出现 test 依赖范围，此依赖范围只能用于测试，而在编译和运行项目时无法使用此类依赖，典型的是 JUnit



### 依赖冲突解决原则

**路径最短优先** 和 **声明顺序优先**



### Maven 仓库

#### 本地仓库

- 在你运行 `Maven` 的本地计算机上会存在一个目录，用于缓存从远程仓库中下载的依赖或构件
- 一般而言位于用户目录的 `.m2` 文件夹，可以进行修改

![image-20250212133751803](/Users/wcx/Library/Application Support/typora-user-images/image-20250212133751803.png)

#### 远程仓库

- 官方或者其他组织维护的大型 Maven 仓库，可以从中下载本地仓库中没有的依赖或者构件进行使用
- 分为中央仓库（由 Maven 社区维护）以及各个厂商组织对应的仓库（阿里云）

#### 依赖/构件寻找顺序

优先本地依赖，如果本地依赖中没有找到再去配置的远程仓库中寻找，找到之后会缓存到本地仓库中去



### Maven 多模块管理

- Maven 多模块项目是指将一个大型项目拆分为多个子模块，每个子模块可以独立构建，同时通过父模块统一管理依赖和配置。这种方式适合复杂的项目，能够保持各个模块间使用的依赖情况高度一致（统一继承父模块）提高代码的可维护性和复用性。
- 实现的父模块的 `pom.xml` 文件中声明子模块，对应的子模块的 `pom.xnl` 则需要集成这个父模块
- 如果某个依赖只在子模块中使用那么只需要在子模块的 pom.xml 文件中进行定义
- 编译构建打包时可以分模块进行

#### 示例

```
multi-module-project/
├── pom.xml               <!-- 父模块的 pom.xml，位于根目录 -->
├── module-a/
│   └── pom.xml           <!-- 子模块 A 的 pom.xml -->
└── module-b/
    └── pom.xml           <!-- 子模块 B 的 pom.xml -->
```

父模块 pom.xml

```xml
<!-- pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 父模块的坐标 -->
    <groupId>com.example</groupId>
    <artifactId>parent-pom</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>  <!-- 父模块的 packaging 必须是 pom -->

    <!-- 子模块列表 -->
    <modules>
        <module>module-a</module>  <!-- 子模块 A -->
        <module>module-b</module>  <!-- 子模块 B -->
    </modules>

    <!-- 公共依赖管理 -->
    <dependencyManagement>
        <dependencies>
            <!-- 定义公共依赖 -->
            <dependency>
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>4.13.2</version>
                <scope>test</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 公共构建配置 -->
    <build>
        <plugins>
            <!-- 编译插件 -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.8.1</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

子模块 pom.xml

```xml
<!-- module-a/pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <!-- 继承父模块 -->
    <parent>
        <groupId>com.example</groupId>
        <artifactId>parent-pom</artifactId>
        <version>1.0.0</version>
        <relativePath>../pom.xml</relativePath>  <!-- 父模块的相对路径 -->
    </parent>

    <!-- 子模块 A 的坐标 -->
    <artifactId>module-a</artifactId>

    <!-- 子模块 A 的依赖 -->
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>  <!-- 使用父模块管理的依赖 -->
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```



### 使用 Maven Wrapper

Maven Wrapper 是一个用于管理和使用 Maven 的工具，它允许在没有预先安装 Maven 的情况下运行和构建 Maven 项目。

>The Maven Wrapper is an easy way to ensure a user of your Maven build has everything necessary to run your Maven build.

#### 可以用于解决什么问题

简单来说只需要有一个人通过  `Maven` 生成了 `Maven Wrapper` ，那么其他人在本地没有 `Maven` 环境也运行指定的命令包括 `mvn install`

- **版本一致性**：确保所有开发者和环境使用相同的 Maven 版本。
- **简化配置**：无需手动安装 Maven，降低环境配置的复杂性。
- **跨平台支持**：提供适用于 Linux/macOS 和 Windows 的脚本。
- **离线支持**：可以将 Maven 二进制文件打包到项目中，支持离线构建。
- **无缝集成**：与现有的 Maven 项目完全兼容，无需修改构建逻辑。

#### 生成 Maven Wrapper

```bash
mvn wrapper:wrapper
```

当执行完成上面的命令后，会在我们的项目中生成 `Maven Wrappe` 文件。之后就可以使用 `./mvnw` 来执行所有的 `mvn` 命令，而不再需要使用 `mvn`

### 针对不同环境使用配置文件

为了解决不同的环境可能会产生的依赖情况不同问题，Maven 配置文件允许我们配置不同环境的构建设置，例如开发、测试和生产。在 `pom.xml` 文件中定义配置文件并使用命令行参数激活它们：

```xml
<profiles>
  <profile>
    <id>development</id>
    <activation>
      <activeByDefault>true</activeByDefault>
    </activation>
    <properties>
      <environment>dev</environment>
    </properties>
  </profile>
  <profile>
    <id>production</id>
    <properties>
      <environment>prod</environment>
    </properties>
  </profile>
</profiles>
```

使用命令行激活对应的环境

```bash
mvn clean install -P production
```

