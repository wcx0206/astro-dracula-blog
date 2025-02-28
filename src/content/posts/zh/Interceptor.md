---
title: SpringBoot_interceptor
categories:
  - SE
  - SpringBoot
abbrlink: 87eb8aa6
tags:
 - SE
 - Go
date: 2024-08-17 13:58:50

---

关于拦截器 `Interceptor`是什么，以及如何在 SpringBoot 中配置拦截器

<!--more-->

## 拦截器

- 拦截器（`Interceptor`）在Spring MVC框架中是一个重要的组件。
- 拦截器，就是可以拦截Http请求，进行一些处理后，再传递给controller层进行处理。所以可以在处理HTTP请求的过程中进行一些==预处理和后处理==。例如，你可以在一个拦截器中检查用户是否已经登录，或者记录请求的处理时间。
- 处理流程（Http）：拦截器 --> Controller --> Service --> data

```java
/*
preHandle：这个方法在请求被处理之前调用。如果这个方法返回true，那么请求会继续被处理；如果返回false，那么请求的处理会被中断。
postHandle：这个方法在请求被处理之后，但在视图被渲染之前调用。
afterCompletion：这个方法在请求处理完毕之后调用，即在视图被渲染之后。
*/

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class MyInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        System.out.println("Pre Handle method is Calling");
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        System.out.println("Post Handle method is Calling");
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception exception) throws Exception {
        System.out.println("Request and Response is completed");
    }
}
```

```java
/*
要使用这个拦截器，需要在一个配置类中注册它。需要创建一个新的配置类，或者在一个已有的配置类中添加配置。这个配置类应该实现WebMvcConfigurer接口，并重写addInterceptors方法：
*/

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {

    @Autowired
    private MyInterceptor myInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(myInterceptor);
    }
}
```

