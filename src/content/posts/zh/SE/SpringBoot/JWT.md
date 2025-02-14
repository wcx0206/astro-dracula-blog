---
title: JWT
categories:
  - SE
  - SpringBoot
abbrlink: 1bb08f7a
date: 2024-08-21 14:26:27
tags:
---

关于 `JWT(Json Web Token)` 以及如何在 `SpringBoot` 中使用 `JWT` 进行身份验证

<!--more-->

## JWT（Json Web Token）

### 原理

服务器认证以后，生成一个 JSON 对象，发回给用户

```json
{
	"姓名": "wcx",
  "身份": "admin",
  "到期时间": "2024.8.7"
}
```

以后，用户与服务端通信的时候，都要发回这个 JSON 对象。服务器完全只靠这个对象认定用户身份。为了防止用户篡改数据，服务器在生成这个对象的时候，会加上==签名==。

### JWT 数据结构

```java
// 没有换行，这里的换行是额外加上用于拆分结构的
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

```

这个JWT由以下三部分组成：  

1. 头部（Header）：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

   - 头部通常包含了token的类型（typ）和所使用的签名算法（alg）。 

2. 载荷（Payload）：

   eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ

   - 载荷包含了一些声明（Claims）。声明是一些关于用户和其他数据的陈述。
   - JWT规定了7个可用字段
     - iss (issuer)：签发人
     - exp (expiration time)：过期时间
     - sub (subject)：主题
     - aud (audience)：受众
     - nbf (Not Before)：生效时间
     - iat (Issued At)：签发时间
     - jti (JWT ID)：编号
   - 同样你也可以定义你自己的私有字段
   - 在这个示例中，载荷包含了以下声明：  
     - sub（主题）：1234567890
     - name：John Doe
     - iat（发行时间）：1516239022

3. 签名（Signature）：SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

   - 签名是用来验证token的完整性和防止数据被篡改的。在这个示例中，签名是用HMAC SHA256算法和一个密钥生成的。

**==特别注意：== **

JWT的头部和载荷都是Base64Url编码的，但它们并不是加密的。所以事实上可以非常简单的解码你JWT头部和载荷里面的信息，所以不能在JWT里面写入一些重要的信息以及用户的隐私（密码）。但是生成原始 Token 以后，可以用密钥再加密一次。

#### 依赖

```xml
		<dependency>
			<groupId>com.auth0</groupId>
			<artifactId>java-jwt</artifactId>
			<version>3.18.2</version>
		</dependency>
```

### 如何创建 `token`

```java
    public String getToken(User user) {
        Date now = new Date(); // 当前系统时间
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME); 
      // token 过期时间
        
        return JWT.create()
                .withAudience(String.valueOf(user.getId()))  //设置受众
                .withExpiresAt(expiryDate) //设置过期时间
                .sign(Algorithm.HMAC256(user.getPassword())); 
      					//进行签名（使用password作为密钥）
    }
```

### 如何解析 `token`

```java
    public boolean verifyToken(String token) {
        try {
            // 从token中解码出"aud"（接收者）声明，这是用户的ID
            Integer 		userId=Integer.parseInt(JWT.decode(token).getAudience().get(0));
            // 从数据库中查用户
            User user= userRepository.findById(userId).get();
            // 创建一个JwtVerifier实例，用于验证token。使用用户的密码作为密钥
            JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(user.getPassword())).build();
            // 验证token。如果token无效（例如，签名不匹配、token已过期等），那么这个方法将抛出一个异常
            jwtVerifier.verify(token);
            // 如果token有效，那么返回true
            return true;
        }catch (Exception e){
            // 如果在验证过程中抛出了异常，那么返回false，表示token无效
            return false;
        }
    }
```

### 如何在项目中获得当前用户的信息

1. 在拦截器中验证token
2. 如果token验证成功，从token中提取用户信息，存入session中
3. 需要使用当前用户信息时直接从session中获取

### 配置 Interceptor 拦截器

```java
    
// 在自定义的拦截器中的preHandle方法中获得token，并且将用户信息存入session会话中
@Component
public class LoginInterceptor implements HandlerInterceptor {

    @Autowired
    TokenUtil tokenUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("token");
        if (token != null && tokenUtil.verifyToken(token)) {
            request.getSession().setAttribute("currentUser",tokenUtil.getUser(token));
            return true;
        }else {
            throw BlueWhaleException.notLogin();
        }
    }

}

```

### 使用拦截器

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Autowired
    LoginInterceptor loginInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns("/api/users/register")
                .excludePathPatterns("/api/users/login")
                .order(1);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
//                .allowedOrigins("*")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600)
                .allowedHeaders("*");
    }
}
```

### 从 `session ` 中获取用户信息

```java
@Component
public class SecurityUtil {

    @Autowired
    HttpServletRequest httpServletRequest;

    public User getCurrentUser(){
        return (User)httpServletRequest.getSession().getAttribute("currentUser");
    }
}
```



### TokenUtil

```java
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.util.Date;

/**
 * 这是一个token的工具类，
 * 设置了过期时间为1天。
 * getToken方法用来获取token，
 * token中包含了用户的Id、密码信息以及到期时间。
 * verifyToken方法用来检验token是否正确。
 * getUser方法用来从token中获得用户信息。
 */
@Component
public class TokenUtil {
    private static final long EXPIRE_TIME = 24 * 60 * 60 * 1000;

    @Autowired
    UserRepository userRepository;

    public String getToken(User user) {
        Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
        return JWT.create()
                .withAudience(String.valueOf(user.getId()))
                .withExpiresAt(date)
                .sign(Algorithm.HMAC256(user.getPassword()));
    }

    public boolean verifyToken(String token) {
        try {
            Integer userId=Integer.parseInt(JWT.decode(token).getAudience().get(0));
            User user= userRepository.findById(userId).get();
            JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256(user.getPassword())).build();
            jwtVerifier.verify(token);
            return true;
        }catch (Exception e){
            return false;
        }
    }

    public User getUser(String token){
        Integer userId=Integer.parseInt(JWT.decode(token).getAudience().get(0));
        return userRepository.findById(userId).get();
    }
}


```

