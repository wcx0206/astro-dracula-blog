---
title: udemy-go-Collections
tags:
---
udemy-go-Collections

<!--more-->

### Arrays

#### Creating Arrays

- 创建一个 Array 的语法为  `[]T`，其中 `T` 是数组中元素的类型
- 在 `[]` 中我们可以定义 Arraty 的长度，如 `[3]int`，也可以不定义长度，如 `[]int`
- 在 Go 中，数组的长度是数组类型的一部分，所以 `[3]int` 和 `[4]int` 是两种不同的类型

```go
var arr [3]int
arr[0] = 1
prices := [3]float64{100.1, 200, 300}
```

#### Using Arrays

- 使用下标访问数组元素，例如 `arr[0]`
- 使用 `len` 函数获取数组的长度

### Slices (subarray of an array) 子数组

- Slice 是一个数组的引用，它指向数组的一部分

#### Creating Slices

- 可以通过 `arr[start:end]` 语法来创建一个 Slice，其中 `start` 是开始的索引，`end` 是结束的索引，slice 包含 `start` 但是不包含 `end`
- 如果 `start` 是 0，可以省略 `start`，如 `arr[:end]`
- 如果 `end` 是数组的长度，可以省略 `end`，如 `arr[start:]`
- `start` 不能小于 0，`end` 不能大于数组的长度
- 但是在拓展 Slice 时，`end` 可以大于数组的长度，但是不能大于 Slice 的容量
- 创建出的 Slice 的类型和原Array基本类型相同（并不是创建出一个指针类型）

```go
arr := [3]int{1, 2, 3}
slice := arr[0:2]
fmt.Println(slice) // [1 2]
moreSlice := arr[1:3]
fmt.Println(moreSlice) // [2 3]
```

#### Using Slices

- 修改 Slice 中的值会修改原数组中该位置的值。这是因为你在创建 Slice 时，并不是在内存中创建一个新的数组，而是创建一个指向原数组的引用
- 使用 `len` 函数可以获取 Slice 的长度
- 使用 `cap` 函数可以获取 Slice 的容量，这里的容量是指 Slice 的开始位置到原数组的末尾的长度 Slice 可以向右拓展到原数组的末尾，但是不能向左拓展到原数组的开始。
- Slice 通过记忆原数组的指针、长度来实现上面的特性

```go
arr := [3]int{1, 2, 3}
slice := arr[:2]
slice[0] = 100
fmt.Println(arr) // [100 2 3]
```

### Slice for Dynamic Arrays

- 当你创建一个 `Array` 时你没有指定其长度。实际上这个时候 Go 为你创建的就是一个 `Slice`，以及一个 `Array（不可见）`，`Slice` 指向这个 `Array`
- 当你使用 `append` 函数向 `Slice` 中添加元素时，Go 会创建一个新的 `Array`，将原 `Array` 中的元素复制到新的 `Array` 中，然后向新的 `Array` 中添加新的元素
- `append` 函数会返回一个新的 `Slice`，指向新的 `Array`
- 这样的设计使得 `Slice` 可以动态的增长，通过这种动态增长的方式，实现了动态 Array 的功能.但是也会带来性能上的损失。

```go
// 创建一个 Slice
slice := []int{1, 2, 3}
// 使用 append 函数向 Slice 中添加元素
slice = append(slice, 4)
fmt.Println(slice) // [1 2 3 4]
```

### append

- `append` 函数的第一个参数是一个 `Slice`，后面的参数是要添加的元素，可以添加一个或者多个元素 如 `append(slice, 4, 5, 6)`
- `append` 函数会返回一个新的 `Slice`，指向新的 `Array`
- `append` 同样可以将一个 `Slice` 添加到另一个 `Slice` 中，但是需要使用 `...` 运算符，如 `append(slice, anotherSlice...)`

```go
slice := []int{1, 2, 3}
slice = append(slice, 4,5,6,7)
fmt.Println(slice) // [1 2 3 4 5 6 7]
newSlice := []int{8, 9, 10}
slice = append(slice, newSlice...)
fmt.Println(slice) // [1 2 3 4 5 6 7 8 9 10]
```

### Maps

#### Creating Maps

- Map 是一个无序的 key-value 对的集合
- Map 的 key 必须是支持 `==` 操作符的类型，所以 `Slice`、`Map` 和 `Function` 不能作为 `Map` 的 key
- 创建一个 Map 的语法为 `map[T]T`，其中第一个 `T` 是 key 的类型，第二个 `T` 是 value 的类型

```go
// 创建一个 Map key 是 string 和 value 都是 string 类型
website := map[string]string{
    "Google": "https://google.com",
    "Facebook": "https://facebook.com",
}
```

#### Using Maps

- 使用 `map[key]` 访问 Map 中的元素，并且可以使用 `map[key] = value` 语法修改 Map 中的元素
- 如果想要向 Map 中添加元素，可以直接使用 `map[key] = value` 语法
- 可以使用 `delete(map, key)` 函数删除 Map 中的元素

```go
website := map[string]string{
    "Google": "https://google.com",
    "Facebook": "https://facebook.com",
}
website["Baidu"] = "https://baidu.com"
fmt.Println(website["Google"]) // https://google.com
```

### Make Function（Build-In Make）

#### for Slice

- 在上面我们提及创建 Dynamic Array 时，Go 会为我们创建一个 Slice，以及一个 Array（不可见），Slice 指向这个 Array。当我们每次向这个 Slice 中添加元素时，Go 都会创建一个新的 Array，将原 Array 中的元素复制到新的 Array 中，然后向新的 Array 中添加新的元素，显然这个过程是非常耗时的。
- 为了解决这个问题，Go 提供了一个 `make` 函数，可以创建一个指定类型、容量的 Slice。这样在一开始添加元素时，就不需要每次复制并创建一个新的 Array了
- `make` 函数的语法为 `make([]T, size, cap)`，其中 `T` 是 Slice 中元素的类型，`size` 是 Slice 的长度，`cap` 是 Slice 的容量

```go
// 创建一个长度为 1，容量为 5 的 Slice 
// 长度为 1，表示 Slice 中有一个元素 0（默认值）
// 容量为 5，表示 Slice 可以向右拓展到共有 5 个元素
slice := make([]int, 1, 5)
slice = append(slice, 4)  // [0 4]
fmt.Println(slice) 
fmt.Println(len(slice)) // 3
fmt.Println(cap(slice)) // 5
```

#### for Map

- 同样的，`make` 函数也可以用来创建 Map，`make` 函数的语法为 `make(map[T]T), size)`，其中 `T` 是 Map 中 key 和 value 的类型，`size` 是 Map 的长度
- 使用 `make` 函数创建 Map 时，`size` 是可选的，如果不指定 `size`，则会创建一个长度为 0 的 Map
- 使用 `make` 函数创建 Map 的好处是，可以避免在 Map 中添加元素时，发生 rehash 的情况，提高性能。

```go
// 创建一个长度为 2 的 Map
// 长度为 2，表示 Map 中有两个 key-value 对
website := make(map[string]string, 2)
website["Google"] = "https://google.com"
website["Facebook"] = "https://facebook.com"
```

### Type Alias

- 在 Go 中，可以使用 `type` 关键字为一个类型创建一个别名
- 通过这种 `Type Alias` 的方式，可以将一个很长的类型名字简化为一个短的名字，便于使用
- `Type Alias` 本质上是一个新的类型，但是它和原类型是相同的，可以互相赋值

```go
type floatMap map[string]float64
// 创建一个 floatMap 类型的变量 size 为 2
map1 := make(floatMap, 2)
map2 := make(map[string]float64, 2)
```

### For Loops with Arrays,Slices & Maps

#### Simple For Loops

- Go 中的 `for` 循环和其他语言中的 `for` 循环类似，也有一种最为简单的形式
- 在遍历一些数据结构或者集合时，可以使用 `for range` 语法，这种语法可以遍历数组、Slice 和 Map 在下面会给出具体的示例

```go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
```

#### For Loops with Arrays

- 使用 `range` 关键字可以遍历数组，`range` 关键字返回两个值，第一个值是数组的索引，第二个值是数组的值
- 如果你不需要索引，可以使用 `_` 忽略索引

```go
arr := [3]int{1, 2, 3}
// index 是数组的索引，value 是数组的值
for index, value := range arr {
    fmt.Println(index, value)
}
// 如果你不需要索引，可以使用 _ 忽略索引
for _, value := range arr {
    fmt.Println(value)
}
```

#### For Loops with Slices

- 使用 `range` 关键字可以遍历 Slice，`range` 关键字返回两个值，第一个值是 Slice 的索引，第二个值是 Slice 的值
- 如果你不需要索引，可以使用 `_` 忽略索引

```go
var arr [3]int{1, 2, 3}
slice := arr[:2]
// index 是 Slice 的索引，value 是 Slice 的值
for index, value := range slice {
    fmt.Println(index, value)
}
```

#### For Loops with Maps

- 使用 `range` 关键字可以遍历 Map，`range` 关键字返回两个值，第一个值是 Map 的 key，第二个值是 Map 的 value
- 如果你不需要 key，可以使用 `_` 忽略 key

```go
website := map[string]string{
    "Google": "https://google.com",
    "Facebook": "https://facebook.com",
}
// key 是 Map 的 key，value 是 Map 的 value
for key, value := range website {
    fmt.Println(key, value)
}
```
