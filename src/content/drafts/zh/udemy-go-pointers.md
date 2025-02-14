---
title: udemy-go-3
tags:
---

Udemy Go 3 Pointer 课程笔记

<!--more-->

What are Pointers?

### Why dose this feature exist?

- 在函数传递参数的时候，如果传递的是一个很大的数据结构，那么会占用很多的内存，如果传递的是一个指针，那么只需要传递一个地址，就可以节省很多内存。
- 在函数中修改一个变量的值，如果传递的是变量的值，那么函数中修改的值不会影响到原来的值，如果传递的是指针，那么函数中修改的值会影响到原来的值。
  
```go
func main() {
	age := 30
	agePointer := &age
	fmt.Println("Age:", *agePointer)
	getAdultYeaas(agePointer)
	fmt.Println("Adult years:", age)
}

func getAdultYeaas(age *int) int {
	*age = *age - 18
	return *age
}

//输出 Age: 30 Adult years: 12
```

### How can you work with Pointers?

#### create a pointer

```go
age := 30
var agePointer *int // *int 表示这是一个指针类型
agePointer = &age // &符号获取变量的地址

```

#### use a pointer

- 对于指针类型的变量，我们可以通过 `*` 符号来获取指针指向的值
- 同样我们可以通过 `&` 符号来获取变量的地址
- 在 Go 中，不能进行指针运算
- 对于内存占用较小的数据结构，不需要使用指针，使用指针会增加代码的复杂度

```go
func main() {
	age := 30
	agePointer := &age
	adultYears := getAdultYeaas(agePointer)
	fmt.Println("Age:", *agePointer)
	fmt.Println("Adult years:", adultYears)
}

func getAdultYeaas(age *int) int {
	return *age - 18
}
```

### pointer default value

在 Go 中每一个类型都有一个默认的 Null Value 指针的默认值是 `nil` 
nil 是一个特殊的值，表示指针不指向任何地址

### fmt.Scan 

- fmt.Scan 会将输入的值赋值给变量的地址
- 所以我们需要传递变量的地址即 `&variable` Pointer

