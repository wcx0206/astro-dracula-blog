---
title: API-Rate-Limiting
tags:
---

使用 Redis +  Redisson(RRateLimiter)  + AOP 通过接口注解的方式实现接口限流

<!--more-->

### 为什么要接口限流

接口限流的主要目的是为了保护系统的稳定性和可用性。具体原因包括：

1. 防止系统过载：当大量请求同时涌入时，系统可能会因为资源耗尽而崩溃。限流可以控制并发请求的数量，防止系统过载。
2. 防止恶意攻击：防止类似 DDOS 这种恶意的攻击行为，可以对 IP 进行限流或者一刀切限流
3. 平滑流量高峰：将段时间涌入对大量流量进行平摊，避免瞬时高峰对于系统的冲击

但是接口限流在某种情况下必然会影响用户的使用体验（响应速度降低）但这是在系统可用性和稳定性之间作出的平衡和取舍

### 分布式限流

下面主要是使用 Redis +  Redisson(RRateLimiter)  + AOP 实现的一个简单的分布式限流。由于分布式和云服务的兴起，简单的单机限流显然已经无法满足需求。所以使用 Redis 中间件实现一个分布式的限流方案，对多个节点的服务进行统一的流量分配与限制，避免单一节点过载

### Java 反射机制

反射机制是Java语言的一种特性，允许程序在运行时动态地获取类的信息（如类名、方法、字段等），并对其进行操作。反射机制使得程序可以在运行时检查和调用类的方法、访问类的字段等，而不需要在编译时知道这些信息。  反射机制的主要用途包括：  

1. 动态加载类：可以在运行时根据类名加载类，而不需要在编译时确定具体的类。
2. 动态调用方法：可以在运行时调用类的方法，而不需要在编译时知道方法的具体签名。
3. 访问和修改字段：可以在运行时访问和修改类的字段，即使这些字段是私有的。
4. 创建实例：可以在运行时创建类的实例，而不需要在编译时知道具体的类。

### 接口限流

#### 依赖配置

pom.xml

```xml
		<dependency>
			<groupId>org.redisson</groupId>
			<artifactId>redisson-spring-boot-starter</artifactId>
			<version>3.37.0</version>
		</dependency>
```

#### 注解类的设计

```java
package com.bluebook.backend.aop;


/**
 * 自定义注解 @RateLimiter 用于接口限流。
 */

/**
 * @Retention(RetentionPolicy.RUNTIME):
 * 这指定了 @RateLimiter 注解将在运行时可用。
 * 这对于在程序执行期间通过反射访问注解是必要的。
 *
 * @Target(ElementType.METHOD):
 * 这指定了 @RateLimiter 注解只能应用于方法。
 */

// 注解的详细内容还可以根据后续在切面类中实现时需要的参数进行添加

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface RateLimiter {
    int limit() default 5; // 每秒限制请求数
}


```



#### RateLimiter Aop 切面实现

```java

/**
 * 切面类 RateLimiterAspect 用于实现限流逻辑。
 */
@Aspect
@Component
public class RateLimiterAspect {

    @Autowired
    private RedissonClient redissonClient;
    
    private static final Logger logger = Logger.getLogger(RateLimiterAspect.class.getName());

    @Around("@annotation(rateLimiter)")
    public Object around(ProceedingJoinPoint joinPoint, RateLimiter rateLimiter) throws Throwable {
        // 获取注解中的限流值
        int limit = rateLimiter.limit();
        // 获取方法名
        String methodName = joinPoint.getSignature().getName();
            
        // 获取限流器实例
        RRateLimiter rateLimiterInstance = redissonClient.getRateLimiter("rateLimiter:" + methodName);
        
        /**
         * 设置限流器的速率
         * RateType.OVERALL: 限流类型，表示总体限流
         * limit: 在指定时间间隔内允许的最大请求数
         * 1: 指定时间间隔，表示每1个时间单位 具体时间单位由下面的RateIntervalUnit指定 
         * RateIntervalUnit.SECONDS: 时间单位，表示秒  可修改为RateIntervalUnit.MILLISECONDS表示毫秒 RateIntervalUnit.MINUTES表示分钟
         */
        rateLimiterInstance.trySetRate(RateType.OVERALL, limit, 1, RateIntervalUnit.MINUTES);
        if (rateLimiterInstance.tryAcquire()) {
            long remainingPermits = rateLimiterInstance.availablePermits();
            logger.info("RateLimiter: " + methodName + " passed" + " remainingPermits: " + remainingPermits);
            return joinPoint.proceed();
        } else {
            logger.info("RateLimiter: " + methodName + " blocked");
            logger.warning("RateLimiter: " + methodName + " blocked");
            throw new RuntimeException("Too many requests, please try again later.");
        }
    }
}


```

#### 在接口上的使用

```java
    @GetMapping("/test")
    @RateLimiter(limit = 1) // 使用注解，并设置请求数限制
    public ResultVO<String> test() {
        redisUtil.set("test", "Hello Redis " 
                + securityUtil.getCurrentUserBySession().getUserName()
                + " "
                + securityUtil.getCurrentUserBySecurityContext().getUserName()
        );
        return ResultVO.buildSuccess(redisUtil.get("test").toString());
    }
```



