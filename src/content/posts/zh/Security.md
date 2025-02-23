---
title: SpringBoot Security
categories:
  - SE
  - SpringBoot
abbrlink: 4a58bdb4
date: 2024-10-03 14:12:20
tags:
---

关于 `SpringBoot Security` 安全框架，以及在项目中如何使用（未完成）

<!--more-->

## Spring Security

[toc]



### 什么是Spring Security

一个安全框架

主要负责实现两大功能：认证与授权

事实上就是一系列具有特定功能的过滤器组合成为的一个过滤链（Filler Chain）

### 过滤器链解析

1. `ChannelProcessingFilter`：确保请求通过正确的通道（HTTP 或 HTTPS）传输。

2. `WebAsyncManagerIntegrationFilter`：集成 Spring Security 与 Spring Web 的异步请求处理。

3. `SecurityContextPersistenceFilter`：负责从 `HttpSession` 中加载 `SecurityContext`，并在请求处理完成后将其存储回 `HttpSession`。

4. `HeaderWriterFilter`：用于添加安全相关的 HTTP 头，例如 `X-Content-Type-Options`、`X-Frame-Options`、`X-XSS-Protection` 等。

5. `CsrfFilter`：防止跨站请求伪造（CSRF）攻击。

6. `LogoutFilter`：处理用户注销请求。

7. #### **`UsernamePasswordAuthenticationFilter`**

   1. 负责处理我们在登录界面填写了用户名和密码后的登陆请求。负责认证工作

   2. 处理基于用户名和密码的身份验证请求。

8. `DefaultLoginPageGeneratingFilter`：生成默认的登录页面（如果未提供自定义登录页面）。

9. `DefaultLogoutPageGeneratingFilter`：生成默认的注销页面（如果未提供自定义注销页面）。

10. `BasicAuthenticationFilter`：处理 HTTP Basic 认证请求。

11. `RequestCacheAwareFilter`：确保用户在登录后重定向到他们最初请求的 URL。

12. `SecurityContextHolderAwareRequestFilter`：将 `SecurityContext` 中的信息添加到 `HttpServletRequest` 中。

13. `AnonymousAuthenticationFilter`：为未认证的用户提供匿名身份。

14. `SessionManagementFilter`：管理用户会话，包括并发会话控制和会话固定攻击防护。

15. #### **`ExceptionTranslationFilter`**

    1. 处理认证和授权过程中抛出的异常，并将用户重定向到适当的错误页面。

    2. 处理 `AccessDeniedException`  `AuthenticationException`

16. #### **`FilterSecurityInterceptor`**

    1. 负责权限校验的过滤器，负责授权

    2. 执行访问控制决策，确定当前用户是否有权访问请求的资源。



### 核心类(接口)

#### `Authentication`

`Authentication` 类是一个核心接口，表示用户的认证信息，有如下的方法

- **`getAuthorities()`**：返回用户的权限（角色）。
- **`getCredentials()`**：返回用户的凭证（如密码）。
- **`getDetails()`**：返回与认证请求相关的附加信息。
- **`getPrincipal()`**：返回用户的主体信息（如用户名）。
- **`isAuthenticated()`**：返回用户是否已认证。
- **`setAuthenticated(boolean isAuthenticated)`**：设置用户的认证状态。

#### `SecurityContextHolder`

`SecurityContextHolder`是 Spring Security 中的一个核心类，用于存储和获取当前应用程序的安全上下文（`SecurityContext `包含了当前用户的认证信息 `Authentication` 对象）

主要作用为：

1. **存储认证信息**：`SecurityContextHolder` 存储当前用户的 `SecurityContext`，其中包含了用户的认证信息和权限。
2. **获取认证信息**：可以通过 `SecurityContextHolder` 获取当前用户的 `SecurityContext`，从而获取用户的认证信息和权限。
3. **线程安全**：`SecurityContextHolder` 提供了多种策略来确保在多线程环境中安全地存储和访问 `SecurityContext`。

### 项目配置

```xml
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-security</artifactId>
	</dependency>
```

添加项目配置后重新运行项目，会产生一个 security password 

![image-20240808203852328](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240808203852328.png)

![image-20240808203835326](https://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240808203835326.png)

如果此时直接访问这个应用会出现401错误

#### 基于表单的登陆和登出

Security 提供了两个界面用于登陆和登出，分别位于/login 和 /logout 路径下

只有通过这个进行验证后才能访问服务的其他端点

<img src="http://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240808213223113.png" alt="image-20240808213223113" style="zoom:50%;" />

#### 禁用 Spring Security

```java
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class })
```



### Security + JWT 实现用户权限控制流程

#### 先进行 Spring Security 的相关配置

Spring Security 相关配置

核心是很多 `Bean` 的装载以及构建一个核心的 `securityFilterChain` 

```java
// SecurityConfig.java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    private AuthenticationConfiguration authenticationConfiguration;
    
    @Autowired
    CustomUserDetailsService customUserDetailsService;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager() throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationEntryPoint basicAuthenticationEntryPoint() {
        return new BasicAuthenticationEntryPoint() {
            {
                setRealmName("Basic Authentication");
            }
        };
    }

    @Bean
    public AuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED);
    }
    

/*
这个方法用于配置Spring Security的安全过滤链。主要包括以下几个部分：

1. 会话管理：设置会话创建策略为无状态，即Spring Security不会创建或使用HTTP会话。这是因为我们使用的是JWT，它是无状态的。

2. CSRF保护：禁用CSRF（跨站请求伪造）保护，因为使用JWT时，通常不需要CSRF保护。

3. 用户服务：设置自定义的UserDetailsService，用于加载用户信息。

4. HTTP请求的授权：
   - 对于匹配"/swagger-ui/**"和"/v3/api-docs/**"路径的请求，允许所有用户访问。
   - 对于其他所有请求，只有经过身份验证的用户才能访问。

5. HTTP Basic认证：启用HTTP Basic认证，并设置身份验证入口点。

6. 构建并返回：最后构建并返回SecurityFilterChain对象。
*/
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .userDetailsService(customUserDetailsService)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**","/api/user/register","/api/user/login","/authenticate").permitAll()
                        .anyRequest().authenticated())
                .httpBasic(basic -> basic.authenticationEntryPoint(basicAuthenticationEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}

```



#### Register 用户注册

实现密码加密存储，数据库中的密码不应该存储明文

```java
// UserServiceImpl.java    
@Autowired
PasswordEncoder passwordEncoder; //自动注入编码器 这里的编码器在后面的config中自定义Bean

@Override
    public Boolean register(String name,String phone, String password) {
        User user = new User();
        user.setUserName(name);
        user.setPhone(phone);
        user.setPassword(passwordEncoder.encode(password)); // 需要进行加密
        userRepository.save(user);
        return true;
    }
```



#### Login 用户登录

实现 userdetailService

```java

@Service
@Component
public class CustomUserDetailsService implements UserDetailsService {
//    @Autowired
//    PasswordEncoder passwordEncoder;
    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);  //定义logger

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    RedisUtil redisUtil;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.info("loadUserByUsername: " + username);
        Object raw = redisUtil.get(username);  //获得为JsonObject
        User user = null;
        if (raw == null) {
            user = userRepository.findByPhone(username); // Phone number as username
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
            redisUtil.set(username, user, 60 * 60 * 24L);  // Cache user information (expires in 1 day)
        }else {
            String rawString = JSONObject.toJSONString(raw); // 转化为String
            // 转化为对应的Object
            user = JSON.parseObject(rawString, User.class);
        }

        return new org.springframework.security.core.userdetails.User(user.getPhone(), user.getPassword(), new ArrayList<>());
    }
}

```

生成token security上下文

```java
// UserServiceImpl.class

@Autowired
AuthenticationManager authenticationManager; // 同样可以在 config 中创建 bean

@Override
    public String login(String phone, String password) {
        logger.info("用户 " + phone + "登录中");
        /** 
        Authenticate the user 调用 authenticate 方法进行验证
        验证成功返回一个 authentication 对象
        验证失败会在过程中直接抛出错误
        **/
  
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(phone, password)
        );
        logger.info("用户 " + phone + "验证中");
       	/** 
       	将验证成功后得到的 authentication 存入 security 上下文中
       	之后该用户请求其他接口时会使用这个上下文来验证用户身份
       	**/
        SecurityContextHolder.getContext().setAuthentication(authentication);
      
				// generate token 此处没有对token进行加密处理，不安全
        UserDetails userDetails = userDetailsService.loadUserByUsername(phone);
        String token = tokenUtil.generateTokenWithoutKey(userDetails);
        logger.info("用户 " + userDetails.getUsername() + "登录成功");
        logger.info("token: " + token);
        return token;
    }

// 对token 进行加密
//        String token = null;
//        try {
//            token = tokenUtil.generateToken(userDetails);
//        } catch (JOSEException e) {
//            throw new RuntimeException(e);
//        }
```



#### Other Request 其他请求

1. #### 自定义的实现拦截器

   实现一个拦截器用于拦截其他请求并且进行验证

   ```java
   // JwtAuthenticationFilter.class
   
   @Component
   public class JwtAuthenticationFilter extends OncePerRequestFilter {
   
       @Autowired
       private TokenUtil tokenUtil;
       @Autowired
       CustomUserDetailsService userDetailsService;
   
     
     // 用于定义不需要拦截的请求路径
       private static final Set<String> EXCLUDED_PATHS = Set.of("/api/user/register", "/api/user/login", "/authenticate");
     
       private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);  //定义logger
   
   
       @Override
       protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
         // 获取路径 判断是否需要拦截 不需要拦截的直接放行
           String path = request.getRequestURI();
           if (EXCLUDED_PATHS.contains(path)) {
               filterChain.doFilter(request, response);
               return;
           }
         
         /** 
         从请求头的 Authorization 中获得用户 Token
         通过 tokenUtil 工具类中的方法获得用户的 user_name(实际上是用户手机号)
         判断获得的 user_name(phone) 是否存在于 security 上下文中（用户是否登录）
         如果存在用户的信息就再包装一个 authentication 存入 security 上下文中
         这样在该会话的后续处理过程中用户可以通过 security 上下文来获得用户信息
         Authentication authentication = 		SecurityContextHolder.getContext().getAuthentication();
   String username = authentication.getName();
         
         **/
   
           logger.info("JwtAuthenticationFilter");
           String token = request.getHeader("Authorization");
           logger.info("token: " + token);
           String username = tokenUtil.parseTokenWithoutKey(token).getUsername();
           logger.info("username: " + username);
           // If the token is valid, set the authentication in the context
           if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
               UserDetails userDetails = userDetailsService.loadUserByUsername(username);
             
               UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
               SecurityContextHolder.getContext().setAuthentication(authentication);
             // session 中存储用户信息
               request.getSession().setAttribute("currentUser", tokenUtil.getUser(token));
           }
   
   
         // 拦截器完成用户身份验证请求继续传递进行后续处理
           try {
               filterChain.doFilter(request, response);
           } catch (IOException e) {
               throw new RuntimeException(e);
           }
       }
   }
   ```

2. #### 使用 spring security 已经配置好的 

   在 config 中进行额外的配置

   ```java
   
   ```

#### Token

这里的 `Token` 分为使用密钥对（KeyPair）加密和不使用密钥加密的两种实现

使用密钥加密更加安全，可以避免对 Token 的篡改，需要修改 `JwtDecoder` `JwtEncoder` 两个Bean 

1. #### token 生成

   ```java
   // 不对 token 进行加密    
   public String generateTokenWithoutKey(UserDetails userDetails) {
           Date date = new Date(System.currentTimeMillis() + EXPIRE_TIME);
           return JWT.create()
                   .withAudience(userDetails.getUsername())
                   .withExpiresAt(date)
                   .sign(Algorithm.HMAC256(SECRET_KEY));  // Use SECRET_KEY here
       }
   ```

   ```java
   // 进行加密
   
   /**
    * 此方法用于创建一个JWT（JSON Web Token）。
    *
    * @param authentication Spring Security的Authentication对象，包含了用户的认证信息。
    * @return String 返回创建的JWT令牌。
    *
    * 方法的工作流如下：
    * 1. 获取当前的时间。
    * 2. 创建一个JwtClaimsSet对象，这个对象包含了JWT的一些声明（claims）。声明是一些关于用户的信息，例如用户的名字、令牌的发行者、令牌的发行时间、令牌的过期时间等。
    *    - 设置令牌的发行者为"self"。
    *    - 设置令牌的发行时间为当前时间。
    *    - 设置令牌的过期时间为1小时后。
    *    - 设置令牌的主题为当前用户的名字。这通常是用户的唯一标识，例如用户名或用户ID。
    *    - 添加一个自定义的声明"scope"。这个声明的值是通过createScope(authentication)方法获取的。这个方法的具体实现没有在这段代码中给出，但通常它会返回一个表示用户权限的字符串或字符串列表。
    * 3. 使用JwtEncoder将上面创建的JwtClaimsSet对象编码为一个JWT字符串，然后返回这个字符串。这个JWT字符串就是我们通常说的JWT令牌，它可以被发送给用户，然后在用户的后续请求中作为身份验证的凭证。
    */
   
   public String create(Authentication authentication) {
       Instant now = Instant.now();
       JwtClaimsSet claims = JwtClaimsSet.builder()
               .issuer("self")
               .issuedAt(now)
               .expiresAt(now.plusSeconds(60 * 60)) // 1 hour
               .subject(authentication.getName())
               .claim("scope", createScope(authentication))
               .build();
       return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
   }
   ```

   

2. #### token 解码

   ```java
   // 不对 token 进行加密    
   public UserDetails parseTokenWithoutKey(String token) {
           logger.info("parseTokenWithoutKey");
           // Decode the token
           DecodedJWT jwt = JWT.decode(token);
     
           // Get the username from the "audience" claim
           String phone = jwt.getAudience().get(0);
           logger.info("phone: " + phone);
     
           // Get the expiration date
           Date expiresAt = jwt.getExpiresAt();
           UserDetails userDetails = userDetailsService.loadUserByUsername(phone);
     
           // Check if the token is expired
           if (expiresAt.before(new Date())) {
               throw new RuntimeException("Token is expired");
           }
   
           return userDetails;
       }
   ```

   ```java
   // token 加密
   /**
    * 此方法用于解析由create方法生成的JWT令牌。
    *
    * @param token 要解析的JWT令牌。
    * @return Authentication 返回一个Authentication对象，该对象包含了从令牌中解析出的用户信息。
    *
    * 方法的工作流程如下：
    * 1. 使用JwtDecoder将JWT令牌解码为一个Jwt对象。
    * 2. 从Jwt对象中获取claims（声明）。
    * 3. 从claims中获取用户名（subject）和权限（scope）。
    * 4. 使用用户名从用户服务中获取UserDetails对象。
    * 5. 创建一个UsernamePasswordAuthenticationToken对象，该对象包含了用户的详细信息和权限。
    * 6. 返回创建的UsernamePasswordAuthenticationToken对象。
    */
   public Authentication parse(String token) {
       Jwt jwt = jwtDecoder.decode(token);
       Map<String, Object> claims = jwt.getClaims();
       String username = (String) claims.get("sub");
       List<String> scopes = (List<String>) claims.get("scope");
       Collection<GrantedAuthority> authorities = scopes.stream()
               .map(SimpleGrantedAuthority::new)
               .collect(Collectors.toList());
       UserDetails userDetails = userDetailsService.loadUserByUsername(username);
       return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
   }
   
   ```

   

3. #### token 使用密钥对（keyPair）进行签名加密的原理和理由

   1. 在JWT（JSON Web Tokens）的使用中，密钥对（Key Pair）的使用是为了保证令牌的安全性。
   2. 密钥对由两部分组成：公钥和私钥。私钥用于生成（签名）令牌，公钥用于验证令牌。  
   3. 当你创建一个JWT时，你会使用私钥对其进行签名。这个签名可以确保令牌在传输过程中没有被篡改。只有知道私钥的人才能生成这个签名，所以如果令牌的接收者可以验证这个签名，他们就可以确信令牌是由持有私钥的人生成的，而且在传输过程中没有被修改。  
   4. 公钥用于验证令牌的签名。公钥可以安全地公开，因为即使有人知道公钥，他们也不能用它来生成有效的签名。只有持有私钥的人才能生成可以用公钥验证的签名。  
   5. 因此，当你创建一个JWT并将其发送给客户端时，你也应该提供用于验证令牌的公钥。这样，客户端就可以使用公钥来验证他们收到的令牌是否有效，以及是否在传输过程中被篡改。  
   6. 总的来说，使用密钥对（公钥和私钥）是为了保证JWT的安全性。私钥保证了令牌的生成过程是安全的，公钥则让令牌的接收者可以验证令牌的有效性

4. #### 密钥对配置

   ```java
   @Configuration
   @Component
   public class JwtConfig {
   
       // 1. Create Key Pair 这里的 Key Pair 可以持久化 在一定时间内保持一致
       @Bean
       public KeyPair keyPair() {
           try {
               var keyPairGenerator = KeyPairGenerator.getInstance("RSA");
               keyPairGenerator.initialize(2048);
               return keyPairGenerator.generateKeyPair();
           } catch (Exception ex) {
               throw new RuntimeException(ex);
           }
       }
   
       // 2. Create RSA Key object using the key pair
       @Bean
       public RSAKey rsaKey(KeyPair keyPair) {
           return new RSAKey.Builder((RSAPublicKey) keyPair.getPublic())
                   .privateKey(keyPair.getPrivate())
                   .keyID(UUID.randomUUID().toString())
                   .build();
       }
   
       // 3. Create JWK Source (JSON Web Key Source)
       // 3.1 Create JWK Set with the RSA Key
       // 3.2 Create JWK Source with the JWK Set
       @Bean
       public JWKSource<SecurityContext> jwkSource(RSAKey rsaKey) {
           var jwkSet = new JWKSet(rsaKey);
           return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
       }
   
       // 4. Use RSA Public Key to encode
       @Bean
       public JwtDecoder jwtDecoder(RSAKey rsaKey) throws JOSEException {
           return NimbusJwtDecoder.withPublicKey(rsaKey.toRSAPublicKey()).build();
       }
   
       // 5. Use JWK Source to decode
       @Bean
       public JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
           return new NimbusJwtEncoder(jwkSource);
       }
   }
   ```


#### 使用 Redis 进行优化

用户登录后存储用户信息，再次请求时不访问数据库 直接访问 `redis`

```java
// CustomerUserDetailService.java
   @Autowired
   RedisUtil redisUtil;  // 工具以及Redis配置看另一篇

@Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = (User) redisUtil.get(username);
        if (user == null) {
            user = userRepository.findByPhone(username); // Phone number as username
            if (user == null) {
                throw new UsernameNotFoundException("User not found");
            }
            redisUtil.set(username, user, 60 * 60 * 24L);  // Cache user information (expires in 1 day)
            logger.info("store user "+ user.getPhone() + " in Redis");
        }else {
            logger.info("User "+ user.getPhone() + " found in Redis");
        }

        return new org.springframework.security.core.userdetails.User(user.getPhone(), user.getPassword(), new ArrayList<>());
    }
```

### 第三方登录

### CSRF

### 验证码验证

### 可能会遇到的问题

1. #### 无法自动装配。找不到 'HttpSecurity' 类型的 Bean

   ```java
   //启动类添加注解
   @SpringBootApplication
   @EnableWebSecurity
   ```

2. #### java: java.lang.NoSuchFieldError

   ```java
   Class com.sun.tools.javac.tree.JCTree$JCImport does not have member field 'com.sun.tools.javac.tree.JCTree qualid'
   
     
     // 升级lombok版本到 1.18.30 
     // 参考 https://stackoverflow.com/questions/77297895/how-to-fix-nosuchfielderror-com-sun-tools-javac-tree-jctree
   ```

3. #### Cannot invoke "org.apache.commons.logging.Log.isDebugEnabled()" because "this.logger" is null 问题解决

   参考链接 [StackoverFlow](https://stackoverflow.com/questions/74940897/nullpointerexception-in-genericfilterbean-on-spring-boot-application-start-after)

   出现的原因，使用AOP + logger 时将一些不正确的类也包括了进去，导致报错。具体来说是因为GenericFilterBean 是 Spring 提供的一个基础类，用于创建过滤器。它在初始化时会设置 logger 对象。如果在 logger 对象被设置之前就调用了需要使用 logger 的方法，就会出现这个问题。 不一定是直接使用这个类，可能是继承了这个类或者其子类

   ```
       @Around("execution(* com.wcx.blog.BlogBackend..*(..))
   ```

   修改后

   ```
       @Around("execution(* com.wcx.blog.BlogBackend..*(..)) && !execution(* com.wcx.blog.BlogBackend.config.JwtAuthenticationTokenFilter.*(..))")
   
   ```

   

4. 

   







