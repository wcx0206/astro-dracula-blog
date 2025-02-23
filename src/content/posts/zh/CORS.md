---
title: SpringBoot 跨域配置
categories:
  - SE
  - SpringBoot
abbrlink: ec2e5edd
date: 2024-09-03 14:11:46
tags:
---

CORS 跨域资源共享 如何解决跨域问题

<!--more-->

## 跨域配置

### 为什么要跨域

- 跨域只存在于浏览器端，不存在于安卓/ios/Node.js/python/ java等其它环境
- 跨域请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了。
- 之所以会需要配置跨域，是因为受到了同源策略的限制，同源策略要求源相同才能正常进行通信，即协议、域名、端口号都完全一致。

### 配置跨域的方式（CORS 跨域资源共享）

#### 1 使用SpringBoot的注解 `@CrossOrigin`

```java
@RestController 
@CrossOrigin 
@RequestMapping("/user")
public class UserController {
    
    @Autowired UserService userService;
    @RequestMapping("/create")
    public ResultVO<String> createUser(){
        userService.createUser();
        return ResultVO.buildSuccess("User created");
    }
    
}

// 缺点一个一个配置太麻烦，除非再搞一个父类controller使用这个注解，其他的controller继承这个父类
```

#### 2 添加一个配置类

继承 `WebMvcConfigurerAdapter` 或者实现 `WebMvcConfigurer`

**注意**

- `allowCredentials(true)` 设置为true时，``allowedOrigins `不能使用 * 需要替换为             `.allowedOriginPatterns("*")` (这是一个允许使用通配符的模式列表。)

```java
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
          			//.allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*");
    }
}

/*
- `@Configuration` 注解表示这是一个配置类，Spring会将其作为源使用来创建beans。
- `addCorsMappings` 方法接收一个CorsRegistry类型的参数，可以在其中注册CORS配置。  
- `registry.addMapping("/**")` 表示这个CORS配置会应用到所有的URL路径。/**是一个通配符，匹配所有路径。  
- `allowedOrigins("*")` 表示允许所有的源进行跨域请求。*是一个通配符，表示所有源
- `allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")` 表示允许这些HTTP方法的跨域请求。  
- `allowCredentials(true)` 表示允许跨域请求包含凭证信息，如cookies或HTTP认证。
- `maxAge(3600)` 表示预检请求的结果可以被缓存3600秒。  
- `allowedHeaders("*")` 表示允许所有的请求头进行跨域请求
*/
```



#### 3 在过滤器中进行配置（`Filter`）

<table>
  <thead>
    <tr>
      <th style="width: 50%;">CORS Header属性</th>
      <th style="width: 50%;">解释</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Access-Control-Allow-Origin</td>
      <td>允许指定的域发起跨域请求。例如，可以设置为http://www.example.com，则只有来自http://www.example.com的请求才会被接受。如果设置为*，则表示接受任何域的请求。</td>
    </tr>
    <tr>
      <td>Access-Control-Max-Age</td>
      <td>设置预检请求的结果能够被缓存多久。例如，如果设置为86400，则表示在86400秒内，同样的请求不需要再发送预检请求，可以直接使用上一次的预检请求的结果。</td>
    </tr>
    <tr>
      <td>Access-Control-Allow-Methods</td>
      <td>设置允许跨域请求的方法。例如，可以设置为POST, GET, PUT, DELETE, OPTIONS，则表示这些HTTP方法的请求都会被接受。</td>
    </tr>
    <tr>
      <td>Access-Control-Allow-Headers</td>
      <td>设置允许跨域请求包含的头部信息。例如，可以设置为content-type，则表示允许跨域请求包含content-type头部信息。如果设置为*，则表示接受任何头部信息。</td>
    </tr>
    <tr>
      <td>Access-Control-Allow-Credentials</td>
      <td>设置是否允许发送Cookie。如果设置为true，则表示允许发送Cookie。注意，如果允许发送Cookie，那么Access-Control-Allow-Origin不能设置为*，必须指定具体的域名。</td>
    </tr>
  </tbody>
</table>


```java
package com.wcx.blog.BlogBackend.config;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.Filter;
import jakarta.servlet.*;
import jakarta.servlet.annotation.WebFilter;



import org.springframework.stereotype.Component;
import java.io.IOException;


import java.io.IOException;

/*
 @WebFilter("/*")
 Servlet API中的一个注解，用于创建过滤器。
 这个注解告诉Servlet容器，应该将所有（"/*"）的请求都通过这个过滤器
 */
@Component
@WebFilter("/*")
public class CorsFilter implements Filter {
    /**
     * wcx
     * 在SpringBoot过滤器中配置跨域，
     * 跨域配置不能和拦截器写一起，
     * 会造成冲突，
     * 需要在过滤器中配置跨域，
     * 过滤器在拦截器前进行。
     * 在“Access-Control-Allow-Headers”中需要添加上token，因为前端要传输token到后端，不能过滤掉。
     */

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // 初始化代码，此处暂时不需要任何操作
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse res = (HttpServletResponse) response;
        HttpServletRequest req = (HttpServletRequest) request;

        // 设置跨域相关的响应头
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Max-Age", "3600");
        res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, token");
        /*
        Authorization：通常用于存放服务器需要的授权信息，例如Bearer tokens。
        Content-Type：表示实际请求的数据类型，例如application/json。
        token：自定义的头部字段，通常用于存放一些验证信息，例如JWT tokens
        */
        res.setHeader("Access-Control-Allow-Credentials", "true");

        // 对预检请求（OPTIONS）进行特殊处理 从而避免因为预检请求导致的跨域问题
        if ("OPTIONS".equalsIgnoreCase(req.getMethod())) {
            res.setStatus(HttpServletResponse.SC_OK);  // 返回200 表示请求成功
        } else {
            // 对于非预检请求，继续执行后续的过滤器链和请求处理
            chain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {
        // 清理代码，此处暂时不需要任何操作
    }
}
```





### 拦截器与跨域的冲突

- 当你使用1 2 两种方式配置跨域并且使用了拦截器，你的拦截器可能会直接拦截了你的请求导致跨域失败。
- 具体来说来CROS复杂请求时会首先发送一个OPTIONS请求做嗅探，来测试服务器是否支持本次请求，请求成功后才会发送真实的请求；而OPTIONS请求不会携带任何数据，导致这个请求不符合我们拦截器的校验规则被拦截了，直接返回了状态码，响应头中也没携带解决跨域需要的头部信息，进而出现了跨域问题。但是使用过滤器我们可以对这个OPTIONS请求进行识别，规避这种问题的出现。

==**所以使用拦截器后一般使用过滤器进行跨域配置**==

