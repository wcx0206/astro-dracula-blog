---
title: udemy-go-interface
tags:
---
udemt go interface
<!--more-->

### Why using interfaces?

- Go 中的 Interfaces 类似于其他语言中的接口，但是更加灵活。
- Interces 可以帮助我们定义一组方法，然后可以被任何类型实现。这样可以避免对不同的类型实现逻辑相同的很多方法。

### What are interfaces?

- Interfaces 是一种类型，它定义了一组方法，但是这些方法不包含实现代码。Interfaces 仅是被用于定义方法的签名。可以被用于声明变量、参数、返回值等。
- Interfaces 可以被任何类型实现，一个类型可以实现多个 Interfaces。
- Interfaces 的命名规则：以 `er` 结尾，如 `Reader`、`Writer`、`Logger` 等。一般前面的单词是这个接口的方法名。例如 `Reader` 接口有一个 `Read` 方法。

### Creating & Using Interfaces

#### Creating Interfaces

- 使用 `type` 关键字定义一个接口，接口中包含一组方法签名。定义的格式为 `type InterfaceName interface { MethodName() ReturnType }`。
- 例如定义一个 `Saver` 接口，包含一个 `Save` 方法：

```go
type saver interface {
	Save() error
}
```

#### Using Interfaces

- 和其他语言不同，Go 中的 Interfaces 是**隐式**的。只要一个类型实现了接口中的所有方法，那么这个类型就是这个接口的实现。
- 当你需要一个接口类型的变量时，你需要使用一个实现了这个接口的类型的变量来赋值。
- 接口的工作逻辑是：当你将一个变量赋值给一个接口类型的变量时，Go 会检查这个变量是否实现了接口中的所有方法。如果实现了，那么这个变量就是这个接口的实现。就可以执行接口中的方法。
- 例如下面的例子，假如我的 Todo 类型中实现了一个 `Save` 方法，所以可以将一个 Todo 类型的变量赋值给一个 `Saver` 类型的变量。即可以将 Todo 类型的变量传递给一个接受 `Saver` 类型的参数的函数。

```go
func saveData(data saver) error {
	err := data.Save()
	if err != nil {
		return err
	}
	fmt.Println("Data saved successfully")
	return nil
}
```

### Embedding Interfaces

- 一个接口可以包含另一个接口，这样的接口称为嵌套接口。
- 使用嵌套接口时，只需要实现最外层的接口，内部的接口会自动实现。
- 例如定义一个 `Data` 接口，包含一个 `Save` 方法，然后定义一个 `Saver` 接口，包含一个 `Data` 接口。这样 `Saver` 接口就包含了 `Save` 方法。

```go
type Data interface {
    Save() error
}
type Saver interface {
    Data
}
```

### Any Type Allowed in Interfaces

- 在 Go 中可以使用 `interface{}` 类型，表示任何类型。
- 这种使用方式类似于其他语言中的 `Object` 类型，可以接受任何类型的值。
- 将函数的参数或返回值定义为 `interface{}` 类型，可以接受或返回任何类型的值。在某些情况下可以提供一些便利
- 如果需要知道通过 `interface{}` 传递的值的类型，可以使用两种方式进行判断：
- - 使用类型断言来判断。格式为 `typeVal,ok := value.(Type)` ，如果类型匹配，返回值该类型的值和 `True` ，否则返回 `false`。
- - 使用 `value.(type)` 直接获得值的类型。

```go
// printSomething 函数接受一个 interface{} 类型的参数，可以接受并打印出任何类型的值 并且获得并打印出值的类型
func printSomething(value interface{}) {
	switch value.(type) {
	case string:
		fmt.Println("String:", value)
	case int:
		fmt.Println("Int:", value)
	case float64:
		fmt.Println("Float64:", value)
	default:
		fmt.Println("Unknown type")
	}
}
// 使用类型断言来判断
func printSomething(value interface{}) {
	intVal, ok := value.(int)
	if ok {
		fmt.Println("Integer:", intVal)
		return
	}
	floatVal, ok := value.(float64)
	if ok {
		fmt.Println("Float64:", floatVal)
		return
	}
	stringVal, ok := value.(string)
	if ok {
		fmt.Println("String:", stringVal)
		return
	}

}
```

### Generics in Go 范型

- Go 语言中没有实际上的范型，但是你可以使用 `interface{}` 类型和定义函数时使用类型占位符来实现类似范型的功能。
- 在定义函数的时候可以使用 `[T any]` 来定义一个类型占位符，然后在函数中使用这个类型占位符来定义参数、返回值等。
- 对于这种占位符可以是 `[T inferface{}]｜[T any]` 也可以对类型的范围通过使用 `|` 进行限制，如 `[T int|float64]`。

```go
func print[T any](a T) {
    fmt.Println(a)
}

func add[T int | float64 | string](a T, b T) T {
    return a + b
}
```
