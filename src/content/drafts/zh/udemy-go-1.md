---
title: udemy-go-1
tags:
---

Golang 的基本知识（Udemy Go - The Complete Guide ）

<!--more-->

### Go 核心概念 Essentials

### Key Components

#### package

 一个 `Go Module` 可以包含多个 ` Package`，但是需要一个 main Package 作为 entry point (go build 时需要 Module)

一般一个简单的 Go 项目就是一个 Module

使用 go mod init 创建一个  Module，生成一个 go.mod 文件

```go
go mod init <path>
```

- **一定需要一个 main 函数** 设定你的代码从哪里开始运行，让 go 知道去执行哪些代码
- go 是从 main 函数开始执行的 而不是文件的顶部

- 同一个  Package 中只能有一个 main 函数

- 但是如果构建一个第三方库不需要有 main 函数，构建可执行程序的时候一定需要 main 函数  


```go
func main(){}
```



### Values & Types

- 创建变量的时候可以给出该变量的类型

- 如果你不给出 **Go 会自动推断**这个变量的类型

- 你**显式给出**的变量类型会**覆盖 Go 自动推断**的

- 当然 Go 也是允许你进行类型转换的

- 但是 `:=` 创建的变量不能够为其设定一个类型

- 如果你在创建变量的时候没有给其赋予一个初始值，那么你一定需要在变量声明的时候声明类型。同时根据你声明的类型，Go 会赋予这些变量一个初始值


```go
var a = 100

var a int = 100
var a float64 = 100

var b := int (a / 3) 

c := 5.5 // (c float64 := 5 wrong)

var a // wrong
var a int //true

```

Go 中变量（常量）的使用范围只在定义该变量的函数中，如果需要在其他地方使用变量（常量）就需要在更高层上进行定义（全局）

### Constant

与变量不同 Go 中的常量是**无法被修改和重新分配的**

```go
const inflationRate = 2.5
fmt.Scan(&inflationRate) //wrong
```



### Scan && Print (IO)

#### 读入

使用 Scan 时你需要传递的是一个**变量的指针** 

```go
var investmentAmount float64 = 1000
fmt.Scan(&investmentAmount)
fmt.Println()
```

#### 多样化的输出

fmt.Println 允许传递多个参数并且在一行中进行输出，以空格进行分割

```go
fmt.Println("Future Value", futureVale)
```

fmt.Printf  格式化输出 %v 作为变量（常量）的占位符

```go
fmt.Printf("Future Value: %v\n",futureValue)
```

实际上有很多占位符详细的需要查阅文档：例如通过 %.1f 输出一位小数

```go
fmt.Printf("Future Value: %.1f\n",futureValue)
```



### Sprintf 

使用 Sprintf 来格式化创建一个字符串（相当于把 Print 输出到终端中的内容存储到一个字符串中）

```go
formatSring := fmt.Sprint("Future Value: %.1f\n",futureValue)
```



### Multiline String

当我们想要在输出或者是格式化生成一个多行（跨行）的字符串时，如果我们使用 "" 包裹内容会触发报错。这种情况下我们需要使用反引号对字符串进行包裹

```go
formatSring := fmt.Sprint("Future Value: %.1f\n Futrure Value(adjusted for Inflation): %.1f",futureValue,futureRealValue) //wrong

formatSring := fmt.Sprint(`Future Value: %.1f\n Futrure Value(adjusted for Inflation): %.1f`,futureValue,futureRealValue) //true
```



### Functions

Go 的函数可以返回多个值，但是需要你显式的声明返回值的数量以及类型。返回值的声明位于传递参数声明的后面，如果有多个值需要返回，需要用 ( ) 进行包裹 

```go
func calculateFutureValus()(float64,float64){
  // 这里返回两个 float64 类型的值
  fv := 123
  rfv := 345
  return fv,rfv
}
```

Go 中对于函数返回值还有一种新的语法：在函数定义中直接定义返回值的类型 + **名称** 。这种形式便于你去判断需要返回一个什么样的值，避免类型出错。这种形式相当于时帮你创建了两个变量用于返回，使用时函数体中需要避免出现重复定义。（定义过的变量不能欧使用 :=）

```go
func calculateFutureValus()(fv float64,rfv float64){
  // 这里直接声明返回的两个变量为fv和rfv 都为float64
  // 注意这样相当于已经创建了两个变量 fv rfv 所以在函数体中进行操作的时候直接赋值即可，不需要再对其进行初始化 避免使用 :=
  fv = 123
  rfv = 345
  return fv,rfv
}
```



### Control Structures

我们可以讲逻辑判断的结果存储在一个变量中，这个变量的类型会被 Go 自动推断为 bool

```go
wantCheckBalance := choice == 1
```

#### if - else if - else

和 C 一致，同样在 if 分支内定义的变量不可以被其他 if 分支内的代码访问，且不能够在 if 外被使用

```go
if a > 0 {
  var b = 0
}else if a < 0{
  // 这里不能访问 b
}else {
  
}
// 这里也不能访问 b
```



#### Loop - FOR

在 Go 中没有除 For 以外的循环方式（没有while等）

但是这里的 For 提供了一种无限循环的写法

这里的 For 循环还有一种基于布尔值判断的形式

```go
for i：= 0; i < 200;i++{
  // 有限循环
  continue
}

// 无限循环
for {
  // 循环执行的代码
  break
}

// 基于bool的for循环，当条件为true一直执行为false跳出
var someCondition bool = true
for someCondition {
  
  if {
    someCondition = false 
  }
}
```

continue 和 break 的用法和 C 一致

#### Switch - Case

Go 中提供了 switch - case 用于多分支情况下的处理

Go 不需要在每个 case 中以 break 结尾。同样不能在 switch-case 中使用 break 跳出循环，如果在某种情况下你需要跳出 switch 只能使用 return。这种情况最好是使用上面的 if - else if - else 结构

```go
switch condition
case 1:
case 2:
...
default:
// default 包含其他上面所有未包含的情况
```



### File IO

#### Write To File

- 使用 os.WriteFile 来写入文件，需要传递文件名，内容，权限
- 需要使用 []byte 来将字符串转换为字节数组

```go
package main

import (
  "fmt"
  "os"
)

func writeBalanceToFile(balance float64){
  balanceText := fmt.Sprint(balance)
  os.WriteFile("balance.txt",[]byte(balanceText),0644)
  
}
```

### Read From File

使用 os.ReadFile 读取文件内容，返回的是一个 byte 数组，需要将其转换为字符串
对于字符串转换为 float64 可以使用 strconv.ParseFloat

``` go
func getBalance() float64 {
  data, err := os.ReadFile("balance.txt")if err != nil {
    fmt.Println("Error reading file")
    return 0.0
  }
  balanceText := string(data)
  balance, err := strconv.ParseFloat(balanceText, 64)
  if err != nil {
    fmt.Println("Error parsing float")
    return 0.0
  }
  return balance
}
```

### err 错误处理

Go 中的错误处理是通过返回值来进行的，如果函数返回一个错误，你需要在调用函数的时候进行判断
可以使用 errors 包（errors.New()）来创建一个新的错误并返回（用于替换本身产生的错误）

```go
import "errors"
func getBalance() (float64, error) {
  data, err := os.ReadFile("balance.txt")
  if err != nil {
    return 0.0, errors.New("Error reading file")
  }
  balanceText := string(data)
  balance, err := strconv.ParseFloat(balanceText, 64)
  if err != nil {
    return 0.0, errors.New("Error parsing float") // 替换本身的错误
  }
  return balance, nil
}

```

### Panic 中断

- Go 中的 panic 用于中断程序的执行，可以在任何地方触发 panic，但是需要在 defer 中进行 recover 来捕获 panic 并且处理
- panic 可以自定义错误信息

```go
func getBalance() (float64, error) {
  data, err := os.ReadFile("balance.txt")
  if err != nil {
    return 0.0, errors.New("Error reading file")
  }
  balanceText := string(data)
  balance, err := strconv.ParseFloat(balanceText, 64)
  if err != nil {
    panic("Error parsing float") // 触发 
  }
  return balance, nil
}
```

