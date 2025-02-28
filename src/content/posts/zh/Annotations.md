---
title: SpringBoot 注解
categories:
  - SE
  - SpringBoot
tags:
 - SE
 - SpringBoot
abbrlink: ce0f97d2
date: 2024-08-15 14:23:56
---

<!--more-->

SpringBoot 中使用到的部分注解

[toc]



### @Component 注解

```java
@Component
public class CorsFilter implements Filter{

}
```

- @Component是Spring框架中的一个注解，用于标记一个类为Spring的组件。
- 当Spring应用启动时，它会自动扫描项目中所有的@Component注解的类，并创建它们的实例，这些实例会被Spring容器管理。  
- 代码中，@Component注解被用在CorsFilter类上，这意味着CorsFilter的实例会被Spring容器自动创建并管理。这样，就可以在其他需要使用CorsFilter的地方，通过依赖注入（例如使用@Autowired注解）来获取CorsFilter的实例，而不需要手动创建CorsFilter的实例。

### @SessionAttributes

`@SessionAttributes` 是 Spring MVC 提供的一个注解，用于将模型中的某些属性暂存到 HTTP Session 中，以便在多个请求之间共享数据。

#### 作用

`@SessionAttributes("tacoOrder")` 的作用是将名为 `tacoOrder` 的模型属性存储到 HTTP Session 中，这样在后续的请求中可以继续访问和修改这个属性，而不需要每次都重新创建它。

#### 使用场景

通常在处理多步骤表单提交时会用到这个注解。例如，一个用户在填写订单时，可能需要分多个步骤填写不同的信息。使用 `@SessionAttributes` 可以在每个步骤之间共享订单对象，直到订单完成。

#### 示例

#### 1. 创建一个 `TacoOrder` 类

```java
import lombok.Data;

@Data

public class TacoOrder {
  private String name;
  private String address;
  private String tacoType;

}
```

#### 2. 创建一个控制器，使用 `@SessionAttributes`

1. **`@SessionAttributes("tacoOrder")`**：将名为 `tacoOrder` 的模型属性存储到 HTTP Session 中。
2. **`showOrderForm` 方法**：初始化一个新的 `TacoOrder` 对象并添加到模型中，如果模型中还没有该对象。
3. **`processOrder` 方法**：处理订单的第一步，并重定向到第二步。
4. **`showOrderStep2Form` 方法**：显示订单的第二步表单，`tacoOrder` 对象从会话中注入。
5. **`processOrderStep2` 方法**：处理订单的第二步，并使用 `SessionStatus.setComplete()` 方法清除会话中的 `tacoOrder` 属性。

```java
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
@SessionAttributes("tacoOrder")
public class TacoOrderController {

    @GetMapping("/order")
    public String showOrderForm(Model model) {
        if (!model.containsAttribute("tacoOrder")) {
            model.addAttribute("tacoOrder", new TacoOrder());
        }
        return "orderForm";  
    }

    @PostMapping("/order")
    public String processOrder(@ModelAttribute TacoOrder tacoOrder) {
        // 处理订单的第一步
        return "redirect:/orderStep2";
    }

    @GetMapping("/orderStep2")
    public String showOrderStep2Form(@ModelAttribute TacoOrder tacoOrder) {
        // tacoOrder 已经从会话中注入
        return "orderStep2Form";  // 这个略去
    }

    @PostMapping("/orderStep2")
    public String processOrderStep2(@ModelAttribute TacoOrder tacoOrder, SessionStatus sessionStatus) {
        // 处理订单的第二步
        System.out.println("Order submitted: " + tacoOrder);

        // 完成会话
        sessionStatus.setComplete();
        return "redirect:/orderSuccess";
    }
}
```



#### 3. 创建视图模板 `orderForm.html`

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>Order Form</title>
</head>
<body>
    <form action="#" th:action="@{/order}" th:object="${tacoOrder}" method="post">
        <label for="name">Name:</label>
        <input type="text" id="name" th:field="*{name}" /><br/>

        <label for="address">Address:</label>
        <input type="text" id="address" th:field="*{address}" /><br/>

        <button type="submit">Next Step</button>
    </form>
</body>
</html>
```



### @ConfigurationProperties

@ConfigurationProperties 注解的作用是将配置文件（如 application.yml 或 application.properties）中的属性映射到一个 Java 类中。这使得可以在代码中轻松访问和管理这些配置属性。

```yml
# application.yml
aliyun:
  oss:
    endpoint: 
    accessKeyId: 
    accessKeySecret: 
    bucketName: 
```

读取这些配置

```java
@ConfigurationProperties("aliyun.oss")
public class OssUtil {
    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
}
```

