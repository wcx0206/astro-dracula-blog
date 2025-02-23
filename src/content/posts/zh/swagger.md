---
title: Swagger
categories:
  - SE
  - SpringBoot
date: 2024-10-23 21:02:35
tags:
---


什么是 **`Swagger`** 以及如何使用 **`Swagger`**

<!--more-->

### `Swagger` 是什么

`Swagger` 是一个开源的 `API` 设计和文档工具，可以帮助工程师更快、更简单地设计、构建、文档化和测试 `RESTful API`。通过自动生成一个可视化的接口文档，可以解决在开发过程中有关于接口设计（包括接口参数、种类）方面的问题。

### 项目中配置

#### `pom.xml`

```xml

		<dependency>
			<groupId>org.springdoc</groupId>
			<artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
			<version>2.6.0</version>
		</dependency>

		<dependency>
			<groupId>org.springdoc</groupId>
			<artifactId>springdoc-openapi-starter-webflux-api</artifactId>
			<version>2.6.0</version>
		</dependency>
```

#### `Config`

```java
@Configuration
public class Swagger3Config {

    @Bean
    public OpenAPI springOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SpringDoc API Test")
                        .description("SpringDoc Simple Application Test")
                        .version("0.0.1"));
    }

}
```

 

### Swagger 使用

#### Controller

1. @Operation：注解接口
2. @Tag：注解 Controller
3. @Parameter：注解参数 

```java
@RestController
@RequestMapping("/api/user")
@Tag(name = "用户接口", description = "用户相关的接口")
public class UserController {
    @Autowired
    private UserService userService;

    @Operation(summary = "用户登陆", description = "处理用户登陆请求的接口")
    @RequestMapping("/register")
    public ResultVO<Boolean> register(
            @Parameter(name = "user_name", description = "用户名称", required = true) @RequestParam String name,
            @Parameter(name = "phone", description = "用户手机号", required = true)  @RequestParam String phone,
            @Parameter(name = "password", description = "用户密码", required = true)  @RequestParam String password) {
        return ResultVO.buildSuccess(userService.register(name,phone, password));

    }
}
```

#### Entity

@Schema：标注一个实体类以及每一个条目

**Tip：在 swagger-ui 中显示需要在一个 controller 中作为一个返回类型（或者返回类型包括这个）**

```java
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Schema(name = "用户 User 实体", description = "用户 User 实体description")
@Table(name = "user")

public class User {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "user_id")
    @Schema(description = "主键 用户id", example = "0")
    private Integer id;
    
    @Column(name = "phone")
    @Schema(description = "用户手机号", example = "13900000000")
    private String phone;
    
    @Column(name = "password")
    @Schema(description = "用户密码", example = "123456")
    private String password;
    
    @Column(name = "user_name")
    @Schema(description = "用户名称", example = "elysia")
    private String userName;
    
}

```

