---
title: udemy-go-2
tags:
---

Udemy Go 2 课程笔记

<!--more-->

### Splitting Code Across Multiple Files

- Go 语言中，一个 package 可以拆分成多个文件，但是这些文件必须在同一个目录下
- 一个 package 中的所有文件必须有相同的 package 名
- 一个 package 中的所有文件会被编译到一个单独的包中
- 一个 package 中的所有文件可以共享变量和函数
  
下面例子中的代码展示了如何将一个 package 拆分成多个文件：

```go
// communication.go
package main

import (
   "fmt"
)

func presentOptions() {
    fmt.Println("What do you want to do?")
    fmt.Println("1. Check balance")
    fmt.Println("2. Deposit money")
    fmt.Println("3. Withdraw money")
    fmt.Println("4. Exit")
}
```

### Splitting Files Across Multiple Packages

- Go 语言中，我们可以使用多个 package 来组织我们的项目，高效的复用一些代码
- 创建一个新的 package 需要创建一个新的目录，并且目录的名字必须和 package 名字相同
- 我们可以在新创建的这个目录下编写代码，作为这个 package 的一部分
- 一个 package 可以引用另一个 package 中的函数和变量

下面例子中的代码展示了如何将一个 package 拆分成多个文件：

```go
package fileops

import (
	"errors"
	"fmt"
	"os"
	"strconv"
)

func GetFloatFromFile(fileName string) (float64, error) {
	data, err := os.ReadFile(fileName)

	if err != nil {
		return 1000, errors.New("failed to find file")
	}

	valueText := string(data)
	value, err := strconv.ParseFloat(valueText, 64)

	if err != nil {
		return 1000, errors.New("failed to parse stored value")
	}

	return value, nil
}

func WriteFloatToFile(value float64, fileName string) {
	valueText := fmt.Sprint(value)
	os.WriteFile(fileName, []byte(valueText), 0644)
}

```

### 关键：  Exported & Unexported Identifiers

- Go 语言中，一个标识符（变量、函数、常量等）如果以大写字母开头，那么这个标识符就是可导出的
- 可导出的标识符可以被其他 package 引用
- 一个标识符如果以小写字母开头，那么这个标识符就是不可导出的
- 不可导出的标识符只能在当前 package 中使用

### Importing &Using Custom Packages

- Go 语言中，我们可以使用 `import` 关键字来引入自定义的 package
- 引入自定义的 package 后，我们可以使用 package 中的函数和变量
示例代码：

```go

```

### Using Third-Party Packages

- Go 语言中，我们可以使用第三方的 package 来扩展我们的项目
- 使用第三方的 package 需要先安装这个 package
- 使用 `go get` 命令可以安装第三方的 package
- 安装完成后，我们可以使用 `import` 关键字来引入这个 package
- 引入第三方的 package 后，我们可以使用  package 中的函数和变量
示例代码：

```bash
go get github.com/Pallinder/go-randomdata

```

```go
package main
import (
    "fmt"
    "go-learn-example/fileops"
    "github.com/Pallinder/go-randomdata"
)
fmt.Println("Reach us 24", randomdata.PhoneNumber())
```
