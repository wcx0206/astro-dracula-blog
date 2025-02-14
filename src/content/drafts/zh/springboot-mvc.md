---
title: SpringBoot-MVC
tags:
---

SpringBoot MVC 有关内容

<!--more-->

### 什么是 MVC

MVC（Model-View-Controller）是一种软件设计模式，用于分离应用程序的不同关注点。它将应用程序分为三个主要部分：模型（Model）、视图（View）和控制器（Controller）

#### 组件解释

1. **Model（模型）**：
   - 负责应用程序的数据和业务逻辑。
   - 直接管理数据、逻辑和规则。
   - 通常与数据库交互，处理数据的存储和检索。
2. **View（视图）**：
   - 负责呈现数据给用户。
   - 只关心如何显示数据，不处理数据的业务逻辑。
   - 通常是 HTML、CSS 和 JavaScript 文件，用于构建用户界面。
3. **Controller（控制器）**：
   - 充当模型和视图之间的中介。
   - 处理用户输入，调用模型来处理数据，并决定使用哪个视图来显示数据。
   - 接收请求，处理业务逻辑，并返回相应的视图。

#### 工作流程

1. 用户通过视图（View）发出请求。
2. 控制器（Controller）接收请求，处理业务逻辑。
3. 控制器调用模型（Model）来获取或处理数据。
4. 模型将数据返回给控制器。
5. 控制器将数据传递给视图。
6. 视图将最终的用户界面呈现给用户。

<img src="/Users/wcx/Library/Application Support/typora-user-images/image-20240927202113595.png" alt="image-20240927202113595" style="zoom:50%;" />

### Model

在 Spring MVC 中，`Model` 是一个接口，提供了一种**将数据传递到视图**的方法。它是 Spring Framework 的一部分，用于在**控制器**和**视图**之间传递数据。

#### `Model` 接口

`Model` 接口位于 `org.springframework.ui` 包中，常用的方法包括：

- `addAttribute(String attributeName, Object attributeValue)`：添加一个属性到模型中。
- `addAttribute(Object attributeValue)`：添加一个属性到模型中，属性名将是属性值的类型名（首字母小写）。
- `addAllAttributes(Collection<?> attributeValues)`：添加多个属性到模型中。
- `addAllAttributes(Map<String, ?> attributes)`：添加多个属性到模型中。
- `mergeAttributes(Map<String, ?> attributes)`：合并多个属性到模型中。

#### 示例代码

**1. 创建控制器类**

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("message", "欢迎来到 Spring Boot 应用程序！");
        return "home";
    }
}
```

**2. 创建视图模板**

在 `src/main/resources/templates` 目录下创建一个名为 `home.html` 的 Thymeleaf 模板文件：

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Home</title>
</head>
<body>
    <h1 th:text="${message}">Placeholder message</h1>
</body>
</html>
```



### SpringBoot-MVC 项目结构

1. **`pom.xml`**：Maven 项目的配置文件，定义了项目的依赖和构建设置。
2. **`ServiceHwApplication.java`**：Spring Boot 应用程序的入口点。
3. **`HomeController.java`**：一个简单的控制器，处理 HTTP 请求。
4. **`User.java`**：一个简单的模型类，表示用户。
5. **`UserService.java`**：一个服务类，处理与用户相关的业务逻辑。
6. **`application.yml`**：Spring Boot 的配置文件。
7. **`home.html`**：一个视图文件，包含 HTML 代码来显示一个网页

```
.
├── pom.xml
└── src
    └── main
        ├── java
        │   └── com
        │       └── wcx
        │           └── servicehw
        │               ├── ServiceHwApplication.java
        │               ├── controller
        │               │   └── HomeController.java
        │               ├── model
        │               │   └── User.java
        │               └── service
        │                   └── UserService.java
        └── resources
            ├── application.yml
            └── templates
                └── home.html
```



### 功能实现部分

#### 定义初始的页面

1. 在 `Spring Boot` 应用中，想在启动时自动导航到特定的页面，可以重写 `WebMvcConfigurer` 接口的**`addViewControllers`** 方法来添加一个视图控制器。
2. 这个视图控制器可以将一个 URL 路径映射到一个视图名。  

```java
package com.wcx.servicehw.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/").setViewName("addUser.html");
    }
}
```

### 问题解决

#### 无法解析 MVC 视图 'xxx.html'

解决：查看是否添加了能够让 SpringBoot 识别 html 的依赖

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

