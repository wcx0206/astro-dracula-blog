---
title: go-syntax
tags:
---

Golang 相关特殊语法以及使用

<!--more-->

### 方法接收者（Method Receiver）

- 在 Go 语言中，方法接收者允许你定义属于某个结构体的方法，并通过该结构体的实例来调用这些方法（类比 Java 中的类｜接口）
- 接收者可以是值接收者或指针接收者。  

```go
// user_service.go

type UserService struct{}
// 注意这里的括号中的内容
func (s *UserService) CreateUser(ctx context.Context, req *user.CreateUserReq) (err error) {
	return nil
}
```

1. 在例子中，s *UserService 是一个指针接收者
2. 这意味着 CreateUser 是属于 UserService 结构体的方法。  
3. 接收者 s 允许该方法访问 UserService 结构体的字段和其他方法。
4. 这类似于面向对象编程语言中的方法，它们与类相关联，并且可以访问类的属性和其他方法。  
5.  简要解释：  
   1. s 是接收者变量名，通常使用简短的名称。
   2. *UserService 表示 s 是指向 UserService 结构体的指针。

#### 使用示例

在 UserServiceImpl 结构体中定义出一个上面实现的 userService 结构体 

通过调用 UserServiceImpl 结构体 中的 userService 结构体的制定方法解决问题

```go
// handle.go

type UserServiceImpl struct{
	userService *service.UserService
}


// CreateUser implements the UserServiceImpl interface.
func (s *UserServiceImpl) CreateUser(ctx context.Context, req *user.CreateUserReq) (err error) {
	// TODO: Your code here...
	return s.userService.CreateUser(ctx, req)
}
```

### 接口类型的隐式实现

1. 在 Go 语言中，接口类型的隐式实现是指一个类型**不需要显式声明它实现了某个接口**，只要该类型实现了接口中定义的所有方法，那么该类型就隐式地实现了该接口。这种设计使得 Go 语言的接口非常灵活和简洁。
2. 简单来说只要实现了某个接口的所有方法的结构体会自动成为这个接口的实现
   - 该结构体可以作为方法参数进行传递（方法定义时参数设置为接口）
   - 该结构体也可以作为赋值语句的右值，赋值给对应的接口

#### 定义接口

```go
package main

import "fmt"

type Speaker interface {
    Speak() string
}

```

#### 实现接口


```go
type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof! My name is " + d.Name
}

type Cat struct {
    Name string
}

func (c Cat) Speak() string {
    return "Meow! My name is " + c.Name
}

```

#### 使用这种特性

```go
func main() {
    var speaker Speaker

    dog := Dog{Name: "Buddy"}
    cat := Cat{Name: "Whiskers"}

    speaker = dog
    fmt.Println(speaker.Speak())

    speaker = cat
    fmt.Println(speaker.Speak())
}
```

#### 典型例子对于 error 的处理



### 复合字面量 & 切片

1. 复合字面量（Composite Literal）是一种用于创建复合类型（如数组、切片、映射和结构体）值的语法。复合字面量允许你在声明和初始化这些类型时同时指定其元素或字段的值。
2. 结构体切片是一个包含多个结构体实例的切片。它通常用于存储和操作一组相关的结构体数据。

```go
type Person struct {
    Name string
    Age  int
}

// []表示切片  {{...}} 表示复合字面量
people := []Person{
    {Name: "Alice", Age: 30},
    {Name: "Bob", Age: 25},
    {Name: "Charlie", Age: 35},
}

// *[]Person{{...}} 指向一个结构体切片的指针
```



