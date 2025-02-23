---
title: lombok
categories:
  - SE
  - SpringBoot
date: 2024-09-27 19:32:33
tags:
---

Lombok 插件及其应用

<!--more-->

### 什么是 `Lombok`

1. `Lombok` 是一个 Java 库，它可以通过注解的方式，使得 Java 代码更简洁，提高开发人员的效率。

2. `Lombok` 提供了一系列的注解，通过这些注解，可以在编译时自动地生成构造器、getter/setter 方法、equals、hashCode 和 toString 方法，甚至更复杂的如 Builder 模式等。 

3. 使用Lombok可以大大减少模板化的代码，使得代码更加简洁，提高开发效率。但是，也需要注意的是，Lombok通过字节码技术修改了编译后的代码，这可能会带来一些不易察觉的问题，因此在使用时需要谨慎。

4. 以下是一些常用的 Lombok 注解

   1. @Data: 这个注解包含了@ToString、@EqualsAndHashCode、@Getter、@Setter和@RequiredArgsConstructor的功能，是一个综合注解。 

   2. @Getter 和 @Setter: 这两个注解可以用来自动生成getter和setter方法。 

   3. @NoArgsConstructor, @RequiredArgsConstructor 和 @AllArgsConstructor: 这三个注解用来自动生成无参构造器、部分参数构造器和全参数构造器。 

   4. @Builder: 这个注解用来实现 Builder 模式，可以更方便地创建对象实例。

      ```java
      import lombok.Builder;
      import lombok.Data;
      
      @Data
      @Builder
      public class User {
          private String name;
          private int age;
      
          public static void main(String[] args) {
              User user = User.builder()
                              .name("John Doe")
                              .age(30)
                              .build();
      
              System.out.println(user);
          }
      }
      ```

      

   5. @Slf4j: `@Slf4j` 是 Lombok 提供的一个注解，用于自动生成一个名为 `log` `org.slf4j.Logger` 对象。这样你就不需要手动创建 Logger 对象，可以直接使用 `log` 进行日志记录。

      ```java
      import lombok.extern.slf4j.Slf4j;
      
      @Slf4j
      public class LoggingExample {
      
          public void doSomething() {
              log.info("This is an info message");
              log.debug("This is a debug message");
              log.error("This is an error message");
          }
      
          public static void main(String[] args) {
              LoggingExample example = new LoggingExample();
              example.doSomething();
          }
      }
      ```

      



