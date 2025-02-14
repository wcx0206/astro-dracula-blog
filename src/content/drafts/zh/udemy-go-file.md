---
title: udemy-go-file
tags:
---

udemy-go-file deep dive File handling in Go

在 Golang 中如何处理文件数据

<!--more-->

### 读取文件

- 在 Go 中，读取文件的操作可以通过 `os` 包中的 `Open` 函数来实现的。
- `Open` 函数的返回值是一个 `*File` 类型的指针，这个指针可以用来读取文件的内容。
- 读取文件的内容可以通过 `bufio` 包中的 `NewReader` 函数来实现。
- `NewReader` 函数的参数是一个 `*File` 类型的指针，返回值是一个 `*Reader` 类型的指针，这个指针可以用来读取文件的内容。
- 为了检查读取文件是否有错误，可以使用 `Scanner` 类型的 `Err` 方法。

```go
func () LoadData(){
    file, err := os.Open("data.txt")
    if err != nil {
        fmt.Println("Error: ", err)
    }
    sanner := bufio.NewReader(file)

    var data []string
    sanner.Scan() // 读取文件的一行
    fmt.Println(sanner.Text()) // 输出文件的一行
    data = append(data, sanner.Text())

    for sanner.Scan() { // 读取文件的所有行
        fmt.Println(sanner.Text())
        data = append(data, sanner.Text())
    }

    err = scanner.Err() // 检查是否有错误

    if err != nil {
        fmt.Println("Error: ", err)
    }


}
```

### 使用文件数据 Use file data

```go

// 将读取到的文件数据转换为 float64 类型的切片
prices : make([]float64, len(data))
for idx, line := range data {
    price, err := strconv.ParseFloat(line, 64)
    if err != nil {
        fmt.Println("Error: ", err)
        file.Close()
        return
    }
    prices[idx] = price
}

```

### 写入文件 Write Json to file

- 在 Go 中，创建文件的操作可以通过 `os` 包中的 `Create` 函数来实现的。
- `Create` 函数的返回值是一个 `*File` 类型的指针，这个指针可以用来写入文件的内容。
- 如果需要构建一个 JSON 文件，可以使用 `encoding/json` 包中的 `NewEncoder` 函数来实现。
- `NewEncoder` 函数的参数是一个 `*File` 类型的指针，返回值是一个 `*Encoder` 类型的指针，这个指针可以用来写入 JSON 文件的内容。
- 通过 `*Encoder` 类型的指针的 `Encode()` 方法可以将数据写入到文件中。

```go
func WriteJSON(path string,data interface{}){
    file,err := os.Create(path)

    if err != nil {
        fmt.Println("Error: ", err)
        return
    }

    jsonEncoder := json.NewEncoder(file)
    err = jsonEncoder.Encode(data)
    if err != nil {
        fmt.Println("Error: ", err)
        file.Close()
        return
    }
}
    
```
