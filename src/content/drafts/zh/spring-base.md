---
title: Spring-Base
tags:
---

有关于 Spring 、 SpringBoot 、 SpringMVC 的基本知识。包括 IoC、Bean 、依赖注入等

<!--more-->

### Spring IoC 控制反转

1. 控制：对象创建（实例化、管理）的权利
2. 反转：将控制权从原本的个体交予外部环境（Spring 框架 、IoC容器）

简单来说，在 Java 项目｜程序 中对象的创建、实例化、删除等操作都是我们通过代码实现完成的，相当于我们控制着这个过程。控制反转就相当于将这些管理对象的权力交付给容器，在程序运行的过程中让容器来控制对象的实例化（或删除）。这样可以极大的减少代码编写的工作量，并且避免了对象依赖上的一些问题。



### Spring Bean

我们需要告诉 Spring IoC 容器，需要它参与管理哪些对象。这些需要由 Spring IoC 容器统一进行管理的对象被称为 `Bean` 

#### Bean 的创建

我们一般通过注解的形式去创建一个 Bean（或者说是将一个类标柱为 Bean）

- `@Component`：通用的注解，可标注任意类为 `Spring` 组件。如果一个 Bean 不知道属于哪个层，可以使用`@Component` 注解标注。
- `@Repository` : 对应持久层即 Dao 层，主要用于数据库相关操作。`JPA`
- `@Service` : 对应服务层，主要涉及一些复杂的逻辑，需要用到 Dao 层。
- `@Controller` : 对应 Spring MVC 控制层，主要用于接受用户请求并调用 `Service` 层返回数据给前端页面。



#### @Bean 注解

1. 将 `@Bean` 单独列出是因为和上面创建 Bean 的注解不一样，`@Bean` 注解的对象并不是一个类而是一个**方法**。这个方法返回的对象会作为一个 Bean 交由 IoC 容器进行管理。
2. `@Bean` 注解一般用户配置文件中（使用 `@Configuration` 进行注解的类。
3. 主要应用是将一些第三方库方法返回的对象交由 IoC 容器管理，并且在要使用这些对象的使用进行注入。

```java
// SecurityConfig.java spring security 的配置类
@Configuration
@EnableWebSecurity
public class SecurityConfig {

  // 这里通过 @Bean 创建两个Bean 一个用于编码加密 一个管理验证过程
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public AuthenticationManager authenticationManager() throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}


// 其他类中使用创建的Bean
    @Autowired
    PasswordEncoder passwordEncoder;
```

 



### 依赖注入 Dependency Injection, DI

**依赖（Dependency）**:

- 一个对象需要另一个对象来完成其功能，这个被需要的对象就是依赖。

**注入（Injection）**:

- 将依赖对象传递给需要它的对象，而不是让对象自己创建或查找依赖。

 小心成环依赖（A->B B->C C->A）

#### 构造函数注入

通过构造函数的参数进行依赖的注入

```java
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```



#### 通过类 Setter 函数注入

通过让容器执行类的 set 函数来实现依赖注入

```java
@Service
public class UserService {

    private UserRepository userRepository;

    // 在 Spring 4.3 及以后的版本，特定情况下 @Autowired 可以省略不写
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //...
}
```



#### `(Filed)` 字段注入（最智能）

通过使用一些特殊的注解直接实现依赖的注入，然后直接可以在类方法的实现中使用这些注入的对象

- `@Autowired `

  - 是 Spring 内置的注解

  - 默认注入的方式是 `byType` 根据类型进行匹配

  - 当遇到一个接口有多个实现这种情况时会出现单靠类型无法匹配（都是该接口的类型）会自动按照名称进行匹配

  - 但是遇到这种情况还是最好使用 @Qualifier(value = "smsServiceImpl2") 进行标注

    ```java
    // 报错，byName 和 byType 都无法匹配到 bean
    @Autowired
    private SmsService smsService;
    // 正确注入 SmsServiceImpl1 对象对应的 bean
    @Autowired
    private SmsService smsServiceImpl1;
    // 正确注入  SmsServiceImpl1 对象对应的 bean
    // smsServiceImpl1 就是我们上面所说的名称
    @Autowired
    @Qualifier(value = "smsServiceImpl2")  // 这里注入的就是接口的第二种实现 smsServiceImpl2
    private SmsService smsService;
    ```

    

- `@Resource`

  - 是 JDK 提供的注解

  - 默认注入的方式是 `byName` 根据名字进行匹配

  - 有两个参数值可以进行传递：但是一般使用的时候最好只使用其中一个避免出现一些问题

    - type：表示类型（类似上面的 byType）
    - name：表示名称（类似上面的 byName）

    ```java
    // 报错，byName 和 byType 都无法匹配到 bean（类型为 SmsServiceImpl1）
    @Resource
    private SmsService smsService;
    // 正确注入 SmsServiceImpl1 对象对应的 bean（按照名字）
    @Resource
    private SmsService smsServiceImpl1;
    // 正确注入 SmsServiceImpl1 对象对应的 bean（比较推荐这种方式）
    @Resource(name = "smsServiceImpl1")
    private SmsService smsService;
    ```

    

- `@Autowired` 支持在构造函数、方法、字段和参数上使用。`@Resource` 主要用于字段和方法上的注入，不支持在构造函数或参数上使用。

#### 几种方式的比较

- **构造函数注入**: 强制依赖、不可变、易测试，适用于必需依赖。
- **Setter 注入**: 灵活、可选依赖、解决循环依赖，适用于可变依赖。
- **字段注入**: 简洁，适用于少量依赖，不易测试（不容易进行某个类的单元测试，在只启动这个类的情况下，但是在目前也不是什么问题）。



### Bean 是否是线程安全的

取决于 Bean 的作用域以及状态

#### 作用域

1. **singleton** : IoC 容器中只有**唯一**的 bean 实例。Spring 中的 bean 默认都是单例的，是对单例设计模式的应用。
2. **prototype** : **每次获取都会创建一个新的 bean 实例**。也就是说，连续 `getBean()` 两次，得到的是不同的 Bean 实例。
3. **request** （仅 Web 应用可用）: 每一次 HTTP 请求都会产生一个新的 bean（请求 bean），该 bean 仅在当前 HTTP request 内有效。
4. **session** （仅 Web 应用可用） : 每一次来自新 session 的 HTTP 请求都会产生一个新的 bean（会话 bean），该 bean 仅在当前 HTTP session 内有效。
5. **application/global-session** （仅 Web 应用可用）：每个 Web 应用在启动时创建一个 Bean（应用 Bean），该 bean 仅在当前应用启动时间内有效。
6. **websocket** （仅 Web 应用可用）：每一次 WebSocket 会话产生一个新的 bean。

```java
// 可以通过 @Scope 注解的形式来定义一个Bean的作用域
@Bean
@Scope(value = ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public Person personPrototype() {
    return new Person();
}
```



#### 状态

1. 无状态（推荐）：不包含可变的成员变量，主要都是一些方法的实现
2. 有状态：包含可变的成员变量，在方法的执行过程中会动态的修改这些成员变量的值

对于无状态的 Bean （大部分情况下）显然是线程安全的（不会出现数值上的错误）但是有状态的 Bean 可能会出现线程问题
