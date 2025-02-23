---
title: SpringBoot 过滤器
categories:
  - SE
  - SpringBoot
abbrlink: 3519e4b8
date: 2024-08-10 14:11:16
tags:
---

关于过滤器 `Filter` 是什么 ，以及如何在 `SpringBoot` 中配置过滤器

<!--more-->

## 过滤器 Filter

#### 1、 过滤器是什么？

过滤器是Java Servlet API的一部分，用于在请求达到目标资源（如Servlet或JSP页面）之前或在响应从目标资源返回到客户端之后进行预处理或后处理。它们可以被看作是==请求和响应的“管道”== ，允许开发人员执行一些跨切割关注点的操作，如==编码转换、添加响应头、身份验证、日志记录==等。

##### 特点

- 生命周期管理：过滤器具有初始化（init），过滤（doFilter）和销毁（destroy）的方法，这些方法分别在过滤器创建、每次请求和服务器关闭时调用。
- 执行顺序：过滤器的执行顺序是由部署描述符（web.xml）或等效的Java配置类中定义的过滤器映射所决定的。
- 跨容器：过滤器可以在任何实现了Servlet规范的容器中工作，这意味着它们可以用于任何基于Servlet的Web应用程序，而不仅仅是Spring Boot应用。
- 请求/响应处理：过滤器可以在请求到达目标资源前和响应离开容器后执行操作，这使得它们非常适合处理一些需要在所有请求中都生效的任务。

#### 2、 过滤器的运作原理？

可以自定义去实现java提供的`Filter`方法

```java
import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

@WebFilter(urlPatterns = "/*")
public class MyFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化代码，可选实现
        System.out.println("Filter initialized");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        // 过滤器逻辑在请求处理前执行
        System.out.println("Request received at filter");

        // 继续调用过滤器链，传递请求和响应
        chain.doFilter(request, response);

        // 过滤器逻辑在响应处理后执行
        System.out.println("Response leaving filter");
    }

    @Override
    public void destroy() {
        // 销毁代码，可选实现
        System.out.println("Filter destroyed");
    }
}

```

