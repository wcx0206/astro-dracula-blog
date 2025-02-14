---
title: SpringBoot Logger 
categories:
  - SE
  - SpringBoot
abbrlink: d2a3a856
date: 2024-08-12 13:52:49
tags:
---

关于如何配置 `SpringBoot` 中的 `Logger`，以及如何使用，配置内容在 `AOP` 部分

<!--more-->

### logger 日志 配置

```yml
# application.yml
logging:
  pattern:
#    console: "%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"
    file: "%d{HH:mm:ss} [%t] %-5level %logger{36} - %msg%n"
  level:
    root: INFO
  file:
    name: logs/blog.log
```

### logger 使用

```java
    private static final Logger logger = LoggerFactory.getLogger(LoggerAspect.class);  //定义logger
// 这里的 .class 为使用logger类的名称
logger.error("This is an error message");
logger.warn("This is a warning message");
logger.info("This is an info message");
logger.debug("This is a debug message");
logger.trace("This is a trace message");
```

