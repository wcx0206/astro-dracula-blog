---
title: SpringBoot 基本的类和接口
categories:
  - SE
  - SpringBoot
abbrlink: bfb54384
tags:
 - SE
 - SpringBoot
date: 2024-08-03 14:25:29
---

SpringBoot 基本的一些类和接口的定义及其作用

<!-- more -->

## ResultVO

```java
//如何自定义用于返回前端请求结果的类
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
@NoArgsConstructor  //自动生成无参构造器
@AllArgsConstructor
@Getter
@Setter
public class ResultVO<T> implements Serializable {

    private String code;

    private String msg;

    private T result;

    public static <T> ResultVO<T> buildSuccess(T result) {
        return new ResultVO<T>("000", null, result);
    }

    public static <T> ResultVO<T> buildFailure(String msg) {
        return new ResultVO<T>("400", msg, null);
    }
}

```



## Exception

```java
//如何自定义自己的Exception类
public class BlogException extends RuntimeException {
    public BlogException(String message) {
        super(message);  //信息上传给父类 RuntimeException
    } 
    
    public static BlogException tokenNotFound() {
        return new BlogException("Token 未找到");
    } 
}
// 如何使用自定义的Exception

throw BlogException.phoneNotExist();//相当于return

```



## VO（与前端交互）

### 注解

```java
@Getter  //自动创建get方法
@Setter  //自动创建set方法
@NoArgsConstructor  //自动创建无参构造函数
```

```java
@NotNull(message = "name required")
  /*
  import jakarta.validation.constraints.NotNull;
  这个注解用于验证一个字段是否为null。
  如果字段的值为null，那么验证将失败。
  这个注解通常用在数据校验的场景，例如校验HTTP请求的参数。
  message中的文字将会作为http请求的返回
  */

@Length(min = 5, max = 200, message = "name should be between 5 to 200 characters long")

  /*
  依赖
  <dependency>
      <groupId>org.hibernate.validator</groupId>
      <artifactId>hibernate-validator</artifactId>
      <version>7.0.1.Final</version>
  </dependency>

  import org.hibernate.validator.constraints.Length;
  这个注解用于验证一个字符串字段的长度是否在指定的范围内。
  你可以通过min和max属性来指定长度的范围。
  如果字段的长度不在指定的范围内，那么验证将失败，message中的文字将会作为http请求的返回
  */

```

## Controller

```java
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired UserService userService;
    @PostMapping("/register")
    public ResultVO<Boolean> registerUser(@Validated @RequestBody UserVO userVO) {
        return ResultVO.buildSuccess(userService.registerUser(userVO), "注册成功");
    }
}
```

### 注解

```java
@Validated
/*
@Validated注解用于启用方法级别的参数验证。
在方法参数上使用@Validated注解时，Spring将会在方法被调用之前验证该参数，如果参数验证失败，Spring将抛出一个MethodArgumentNotValidException异常。  
在register方法被调用之前，Spring将会验证UserVO对象是否满足其定义中的约束。（@NotNull）
*/
@RequestBody
/*
@RequestBody注解用于将请求体中的JSON字符串绑定到方法参数上。
当你在方法参数上使用@RequestBody注解时，Spring将会使用HTTP消息转换器（默认为MappingJackson2HttpMessageConverter）将请求体中的JSON字符串转换为Java对象。  
例如@RequestBody注解被用在UserVO参数上，这意味着Spring将会将请求体中的JSON字符串转换为UserVO对象。
*/
@RequestParam
/*
@RequestParam是Spring MVC中的一个注解，用于处理HTTP请求参数。
@RequestParam可以用于方法的参数前，用来绑定请求参数到方法的参数上。
例如，如果一个HTTP请求的URL是/login?phone=12345678901&password=testPassword，那么在处理这个请求的方法中，可以使用@RequestParam String phone来获取phone参数
*/
```





## PO（与数据库连接）

### 注解

```java
@Entity
 /*
 （注释在类上）
 这个注解表示该类是一个实体类，它将映射到数据库中的一个表。
 每个实体类都会映射到数据库中的一个表，实体类的实例将映射到表中的行。
 */

@GeneratedValue(strategy = GenerationType.IDENTITY)
 /*
 是JPA（Java Persistence API）的注解，用于指定主键的生成策略。  
 GenerationType.IDENTITY表示主键由数据库自动增长。
 这是最常见的一种主键生成策略，当插入新的记录时，数据库会自动为这个新记录分配一个新的、唯一的主键。  
 这个注解通常和@Id注解一起使用，表示该字段是实体的主键，并且这个主键的值由数据库自动生成。
 */

 @Id
 /*
 @Id: 这个注解表示该字段是实体的主键。每个实体类必须有一个主键。
 */


 @Column(name = "id")
 /*
 这个注解表示该字段映射到数据库表中的一个列。
 name属性指定了列的名称。如果不指定name属性，那么字段名将被用作列名。  
 */
 @Basic
 /*
 这个注解是所有持久化属性的默认注解，它可以用来配置字段的获取策略（立即或延迟）和是否可以为null。
 如果没有明确指定@Basic，JPA将假定实体的所有字段都是基本属性。
 */


@ManyToOne
  /*
  在定义 A对象的实体类中使用 
  @ManyToOne 
  Private B b
  这个注解表示多对一的关系。在实体类中，@ManyToOne 注解用于表示多个可以A对象属于单个B对象
  在数据库中，这种关系通常通过在多的一方的（A对象）表中添加一个外键来实现。 
  */

@ManyToMany：
  /*
  这个注解表示多对多的关系。
  在实体类A中，该注解用于表示单个A对象可以有多个B对象，同时单个B对象也可以被多个A对象引用使用。
  在数据库中，这种关系通常通过一个中间表来实现，中间表包含了两个外键，分别指向两个表。  
  */
  
@Lob：
  /*
  这个注解表示该字段应该被 JPA 当作大对象（Large Object）来处理。
  大对象可以是大文本（CLOB）或者二进制数据（BLOB）
  */


public enum RoleEnum { ADMIN, USER } 
 @Enumerated
	  @Basic
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private RoleEnum role;
  /*
  @Enumerated是JPA（Java Persistence API）的一个注解，用于在实体类中标记枚举类型的字段。
  @Enumerated注解有一个EnumType参数，它有两个可能的值：EnumType.ORDINAL EnumType.STRING。  
  EnumType.ORDINAL：
  	当使用EnumType.ORDINAL时，JPA将枚举值的顺序（ordinal）保存到数据库中
  	ADMIN = 0 USER= 1 

  EnumType.STRING：
  	当使用EnumType.STRING时，JPA将枚举值的名称（name）保存到数据库中。
  	例如，当role字段的值为RoleEnum.ADMIN时，JPA将"ADMIN"保存到数据库中。
  */

 
```



## Enum

```java
// 注意类型是 enum ，枚举内容直接用 , 分隔
public enum RoleEnum {
    ADMIN,
    USER
}
```

## Repository

与数据库进行交互的接口，提供增删改查的方法

```java
// 继承 JpaRepository 本身是一个接口
package com.wcx.blog.BlogBackend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wcx.blog.BlogBackend.po.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByPhone(String phone);
}


```

### 自动生成id

```java
//JpaRepository 的 save 方法会返回一个包含了生成的 id 的 User 对象

UserRepository.save(User); //User 可以不设定id会自动补上
```

### 如何使用Repository进行查找

```java
// 这里的.orElse(null)是需要的，表示如果没有找到返回null，否则返回的会是一个option类型的对象
Tag tag = tagRepository.findById(Long.valueOf(id)).orElse(null);

```

