---
title: SpringBoot 配置
categories:
  - SE
  - SpringBoot
abbrlink: d48a2f7c
date: 2024-08-03 15:00:33
tags:
---

一些关于 SpringBoot 的配置

<!-- more -->

## `Springboot` 连接  `Mysql` 数据库

```yml
# application.yml 
#spring.jpa.hibernate.ddl-auto: update：
#		这是Hibernate的自动DDL（Data Definition Language）策略。
#		update表示如果数据库表结构和实体类不一致，Hibernate将尝试修改表结构以匹配实体类。
#		其他可选值包括:
# 		create（每次运行应用时都创建新的表结构）、
#			create-drop（每次运行应用时都创建新的表结构，并在应用关闭时删除表结构）
#			validate（验证数据库表结构和实体类是否一致，但不做任何修改）。  
#spring.jpa.show-sql: true：
#		这个配置决定是否在控制台显示执行的SQL语句。
#		如果设置为true，那么每次执行SQL语句时，SQL语句都会被打印到控制台。


  datasource:
    url: jdbc:mysql://localhost:3306/blog # 数据库地址
    username: root
    password: wcx20040206
    
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```



