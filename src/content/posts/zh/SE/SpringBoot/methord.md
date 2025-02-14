---
title: SpringBoot 开发技巧
categories:
  - SE
  - SpringBoot
abbrlink: c9a9c779
date: 2024-08-03 15:02:01
tags:
---

一些 SpringBoot 开发过程中的技巧和方法

<!-- more -->

## SpringBoot 如何调试

### spring 容器调试 查看过滤链

这样编写启动类后在输出行打上断点进行调试，可以查看目前context的值

```java
		ConfigurableApplicationContext context = SpringApplication.run(BlueWhaleApplication.class, args);
		System.out.println("1111");
```

### 断点 调试用于获得一些特殊对象的属性值

<img src="http://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240821225634803.png" alt="image-20240821225634803" style="zoom:50%;" />





