---
title: AOP 面向切面编程
categories:
  - SE
  - SpringBoot
abbrlink: af4c3ed6
tags:
 - SE
 - SpringBoot
date: 2024-09-05 11:50:00

---

关于 `AOP` 面向切面编程

<!--more-->

## AOP 面向切面编程

### 什么是 `AOP`

**AOP 是对 OOP（面向对象编程）的一种进一步的补充**

如果在一个类或者多个类的多个业务逻辑方法中, 在开始、结尾部分包含功能相同的代码。那么这些代码的位置被称之为横切关注点也叫切面, 这种结构可能符合传统的面向对象编程（OOP）的封装特性, 但可能导致代码难以维护和扩展。

例如：当需要为多个不具有继承关系的对象添加一个公共的方法的时候，例如日志记录、性能监控等，如果采用面向对象编程的方法，需要在每个对象里面都添加相同的方法，这样就产生了较大的重复工作量和大量的重复代码，不利于维护。

面向切面编程允许程序员将横切关注点（cross-cutting concerns）从业务逻辑中分离出来, 单独在特殊的类中编写这些功能代码,而原来的业务逻辑中不再编写与之相关的代码, 但依然会对业务逻辑代码产生影响。这样子就进一步减少了重复代码的出现。

![image-20240807162411180](http://wcx0206.oss-cn-nanjing.aliyuncs.com/image-20240807162411180.png)



### 为什么要使用 `AOP`

利用AOP可以对我们边缘业务进行隔离，降低无关业务逻辑耦合性。提高程序的可重用性，同时提高了开发的效率。一般用于`日志记录，性能统计，安全控制，权限管理，事务处理，异常处理，资源池管理`

利用AOP可以对我们边缘业务进行隔离，降低无关业务逻辑耦合性。提高程序的可重用性，同时提高了开发的效率。一般用于`日志记录，性能统计，安全控制，权限管理，事务处理，异常处理，资源池管理`

### 技术要点

1. 通知（Advice）包含了需要用于多个应用对象的横切行为
2. 连接点（Join Point）是程序执行过程中能够应用通知的所有点。
3. 切点（Poincut）是定义了在“什么地方”进行切入，哪些连接点会得到通知。显然，切点一定是连接点。
4. 切面（Aspect）是通知和切点的结合。通知和切点共同定义了切面的全部内容——是什么，何时，何地完成功能。
5. 引入（Introduction）允许我们向现有的类中添加新方法或者属性。
6. 织入（Weaving）是把切面应用到目标对象并创建新的代理对象的过程，分为编译期织入、类加载期织入和运行期织入。

### springboot中的使用

#### 依赖导入

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-aop</artifactId>
        </dependency>
```

#### 主配置类启用

```java
/*
为了使AOP生效，你需要在你的Spring Boot应用中启用它。
你可以在你的主配置类（通常是@SpringBootApplication注解的类）中添加@EnableAspectJAutoProxy注解来启用它。
*/
@SpringBootApplication
@EnableAspectJAutoProxy
public class BlogBackendApplication {
	public static void main(String[] args) {
		SpringApplication.run(BlogBackendApplication.class, args);
	}

}
```

#### Aspect

```java
@Aspect
@Component
public class LoggerAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggerAspect.class);


    /**
     * 使用环绕通知记录方法的执行时间。
     *
     * @param joinPoint 连接点，表示要进行通知的方法。
     * @return 方法的返回值。
     * @throws Throwable 如果目标方法抛出异常。
     */
    @Around("execution(* com.wcx.blog.BlogBackend..*(..))")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {  // ProceedingJoinPoint是JoinPoint的子接口，表示可以执行目标方法。
        
        long start = System.currentTimeMillis(); // 记录方法开始执行的时间。

        Object proceed = joinPoint.proceed(); // 执行目标方法。

        long executionTime = System.currentTimeMillis() - start;// 计算方法执行的时间。
        logger.info(joinPoint.getSignature() + " executed in " + executionTime + "ms");
        // 记录方法执行的时间。
        return proceed;  // 返回目标方法的返回值。
    }
    
    
}

```

