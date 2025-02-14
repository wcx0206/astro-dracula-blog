---
title: udemy-go-function
tags:
---

udemy-go-function deep dive

<!--more-->

### Using Functions as Values

- 在 Go 中，函数也只是一种值，可以赋值给变量，也可以作为参数传递给其他函数。
- 如果需要将函数作为参数传递给其他函数，需要定义一个函数类型，然后将函数赋值给这个类型的变量。
- 定义函数类型的语法如下： `type typeName func(input1 inputType1, input2 inputType2, ...) (output1 outputType1, output2 outputType2, ...)`
- 当然你也可以在函数传入参数的时候直接定义函数类型，不过这样会使代码变得更加复杂，不推荐这样做。

```go
type funcType func(int) int
func transformNumbers(numbers *[]int, transfrom funcType) []int {
	dNumbers := []int{}
	for _, number := range *numbers {
		dNumbers = append(dNumbers, transfrom(number))
	}
	return dNumbers
}
```

- 因为 Go 中函数是一种值可以作为参数传递给另一个函数，那么函数也可以作为另一个函数的返回值。
- 需要将某些函数作为返回值的函数，定义返回值类型时需要定义对应的函数类型。
- 将一个函数作为值进行传递或者返回时，都不需要加上括号，直接写函数名即可。带括号表示调用函数。

```go
func transformNumbers(numbers *[]int, transfrom func(int) int) []int {
	dNumbers := []int{}
	for _, number := range *numbers {
		dNumbers = append(dNumbers, transfrom(number))
	}
	return dNumbers
}

```

### Anonymous Functions 匿名函数

- 当你想要某些函数作为参数传递给其他函数，但是这些函数只会被调用一次后续你不想要通过函数名进行二次调用，那么你可以使用匿名函数。
- 匿名函数应当是简单的，不应该包含太多的逻辑，否则会使代码变得难以阅读。
- 如果函数可能会被多次调用，那么最好还是定义一个函数类型，然后将函数赋值给这个类型的变量。
- 匿名函数的定义语法和一般的函数定义语法一样，只是没有函数名。在需要传递函数的地方将原本的函数名直接替换为匿名函数的定义即可
- 同样的，如果需要将匿名函数作为返回值，在原本返回函数名的地方也可以直接定义匿名函数并返回。
- 定义语法 `func(input1 inputType1, input2 inputType2, ...) (output1 outputType1, output2 outputType2, ...) { ... }`

```go
tripled := transformNumbers(&moreNumbers, func(number int) int {
		return number * 3
	})

func getTransformFunction(numbers *[]int) TransformFunction {
	if (*numbers)[0] == 1 {
		return double
	} else {
		return func(number int) int {
            return number * 3
        }
	}
}

```

#### factory function 函数工厂

- 函数工厂是一种设计模式，它可以通过不同参数构建出不一样的函数进行返回。
- 构造匿名函数的时候，可以使用上级函数中的变量
- 基于匿名函数构建的这种特殊性，我们就可以通过上级函数传入的参数来构建并且返回不同的函数。
- 通过函数工厂，可以避免在函数内部使用大量的 if-else 语句，使代码更加简洁。

```go
// factory function 通过不同的 factor 构建出不一样的函数
func createTransformFunction(factor int) TransformFunction {
	return func(n int) int {
		return n * factor
	}
}
```

### Closures 闭包

- 闭包是一个函数，它引用了其外部作用域中的变量。即使在外部函数返回之后，闭包仍然可以访问和修改这些变量。闭包可以捕获并“闭合”其外部作用域中的变量，从而在其内部使用这些变量。
- 上面的 通过 `createTransformFunction` 构造出来的函数就是一个闭包，因为它包含了对外部作用域变量 `factor` 的引用。
- 当我们对 `createTransformFunction` 函数传入不同的 `factor` 参数时，之前构造出的函数不会收到这个新传入的参数的影响。因为之前的函数已经捕获并“闭合”了 `factor` 变量，不会进行改变。
  
```go
// factory function 通过不同的 factor 构建出不一样的函数
func createTransformFunction(factor int) TransformFunction {
	return func(n int) int {
		return n * factor
	}
}
```


### Recursion 递归

- 递归是一种函数调用自身的技术。递归函数在调用自身时，会将问题分解为更小的子问题，直到问题变得足够小，可以直接解决。
- Go 中的递归使用方法和其他语言类似，需要定义一个递归函数，然后在函数内部调用自身。

```go
func factorial(n int) int {
	if n == 0 {
		return 1
	}
	return n * factorial(n-1)
}
```

### Variadic Functions 可变参数函数

- 某些时候你可能无法确定函数需要接受多少个同类型的参数，同时你又不希望将这些参数全部放入到一个 Array 中传递给函数。这时候你可以使用可变参数函数。
- 可变参数函数的本质就是在定义函数参数的时候，定义出一个可变参数类型，这个类型可以接受任意数量的该类型的参数。
- 同样需要了解的是：可变函数的参数可以有多个，但是可变参数有且只能有一个并且一定需要放在参数列表的最后。
- 这是因为 Go 语言中你向函数进行传参时，函数会将传入的参数与函数定义的参数一一对应。当非可变参数一一对应结束后，剩余的所有参数都会被组织成一个数组，然后传递给可变参数。
- 如果可变参数放在参数列表的中间或者开头，那么函数将无法读取到后续的参数，这些参数会被当做可变参数的一部分。
- 定义可变参数的语法如下：`func funcName(param1 type1, param2 type2, ..., paramN ...typeN) { ... }` 其中 `...typeN` 表示可变参数。

```go
func sumup(startingVal int, numbers ...int) int {
	sum := 0
	for _, number := range numbers {
		sum += number
	}
	return sum
}
// 参数分配情况：startingVal 为 1，numbers 为 21 和 3
sum := sumup(1, 21, 3) // 24
```

- 在某些情况下，你可能需要将一个数组或者 Slice 中的元素传递给一个可变参数函数，这显然是十分困难的。
- Go 语言提供了一种方式可以将 `Slice` 拆分为参数值。可以在 `Slice` 后面加上 `...` 来将数组中的元素解包传递给函数。

```go
numbers := []int{1, 2, 3, 4, 5}
sum := sumup(0, numbers...) // 15
```