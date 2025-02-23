---
title: SpringBoot Error
categories:
  - SE
  - SpringBoot
abbrlink: 5dddbc71
date: 2024-08-04 14:28:48
tags:
---

SpringBoot 开发过程中遇到的部分问题归纳

<!-- more -->

### Error 403 No valid crumb

使用 APIFOX  进行接口测试时出现

<img src="http://wcx0206.oss-cn-nanjing.aliyuncs.com/alt=image-20240831111724949" style="zoom:50%;" />

解决：修改请求路径

```
127.0.0.1:8080 ❌
localhost:8080
```

<img src="http://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240831111947671.png" alt="image-20240831111947671" style="zoom:50%;" />



## 无法解析符号 'servlet'

```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
```

正确导入依赖后仍解决不了问题

查看SpringBoot版本，如果你正在使用Spring Boot 3.0或更高版本，注意Java EE API已迁移到Jakarta EE API，需要使用新的包名称`jakarta.servlet`替换`javax.servlet`。

```java
//正确导入
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.Filter;
import jakarta.servlet.*;
//老版本
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;

```

