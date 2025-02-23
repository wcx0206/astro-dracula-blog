---
title: udemy-go-structs
tags:
 - Golang
date: 2024-11-8 10:33:07
---

udemy-go-4-structs | Golang 中 struct 类型的特性

<!--more-->

### what are structs

- A struct is a composite data type
- 使用 `Struct` 可以将类型不同但是相关的数据组合在一起


### Creating & Using Structs

#### Creating a Struct

- 使用 `type` 关键字定义一个新的类型
- 使用 `struct` 关键字定义一个新的结构体
- 你可以在函数内部定义结构体，但是为了在多个函数中使用，最好在函数外部定义结构体
- 在 `struct` 中定义字段的时候需要指定字段的类型

```go
type User struct {
	fistName  string
	lastName  string
	birthDate string
	createAt  time.Time
}
```

#### Using a Struct

- 使用 var 关键字创建一个结构体变量
- 对于创建的结构体变量，我们需要对其进行实例化，实例化的格式为 `结构体变量名 = 结构体类型{字段名: 字段值}`
- 实例化一个结构体变量的时候，需要使用结构体的字段名来赋值
- 我们也可以省略字段名，但是这样的话，需要按照结构体定义的顺序来赋值
- 在实例化结构体变量的时候，我们可以使用 `:=` 来简化代码，并且不需要为每一个字段赋予初始值

```go
  var appUser user
  appUser = user{
      fistName:  firstName,
      lastName:  lastname,
      birthDate: birthDate,
      createAt:  time.Now(),
  }

  var user User
  user = User{
      fistName,
      lastName
      birthDate
      createAt
  }

```

#### Using struct as parameter

- 在函数中使用结构体作为参数的时候，我们需要指定结构体的类型
- 参数的格式为 `参数名 参数类型`
- 在函数中作为参数传递进来的结构体时，我们可以使用结构体的字段名来访问结构体的字段

```go
func printUser(u User) {
    fmt.Println(u.fistName)
    fmt.Println(u.lastName)
    fmt.Println(u.birthDate)
    fmt.Println(u.createAt)
}
```

### Struct with Pointer 

- 在函数中使用结构体指针作为参数的时候，我们需要指定结构体的指针类型
- 参数的格式为 `参数名 *参数类型`
- 我们使用 `&` 符号来获取结构体的指针
- 在函数中我们可以通过例如 `(*u).fieldName` 来获得结构体的字段值
- 在 Go 语言中提供了一种更加简单快捷的方式，可以使用例如 `u.fieldName` 来获取结构体的字段值

```go
outputUserData(&appUser)

func outputUserData(u *user) {
	fmt.Println("First name: ", u.fistName)
	fmt.Println("Last name: ", u.lastName)
	fmt.Println("Birth date: ", u.birthDate)
}
```

### Adding Methords to Structs 

- 在 Go 语言中，我们可以在结构体中编写函数，这些函数称为方法
- 这种函数最好只会操作结构体的字段
- 我们通过在函数名和 `func` 关键字之间添加一个接收者（Reseivers）来定义这个函数属于哪个结构体（是哪个结构体的方法）
- 接受者类型为结构体类型
  - 接受者的格式为 `func (接收者变量名 接收者类型（struct类型名）) 函数名()`
  - 如果我们要调用这个方法，我们需要使用 `结构体变量名.方法名()` 的方式来调用
- 接受者类型为指针类型(需要修改结构体的字段值)
  - 同样我们可以使用指针类型的接受者来定义方法，这样我们可以在方法中**修改结构体的字段值**
  - 同样通过使用指针类型作为接受者，可以减少传输时内存的使用
  - 接收者的格式为 `func (接收者变量名 *接收者类型（struct类型名）) 函数名()`
  - 如果我们要调用这个方法，我们需要使用 `结构体指针变量名.方法名()` 的方式来调用

```go
func (u *user) outputUserData() {  // u 是接收者变量名，*user 是接收者类型
    fmt.Println("First name: ", u.fistName)
    fmt.Println("Last name: ", u.lastName)
    fmt.Println("Birth date: ", u.birthDate)
}

// 通过这个方法我们可以修改结构体的字段值 因为我们传递的是指针
func (u *user) clearUserName() {
	u.fistName = ""
	u.lastName = ""
}
```

### creation / construction functions

- 在 Go 语言中，我们可以使用函数来创建结构体变量，这种函数称为构造函数。一般构造函数的格式为 `func 函数名(参数列表) 结构体类型` 返回值为结构体类型
- 对于返回值类型更加好的选择是使用结构体指针类型，这样可以减少内存的使用。使用指针作为返回值的构造函数格式为 `func 函数名(参数列表) *结构体类型` 
- 我们可以在构造函数中对结构体的字段值进行检验，如果字段值不符合要求，我们可以返回一个错误，这样可以避免创建一个不符合要求的结构体变量，并且避免在代码中反复出现检验结构体是否正确的代码(产生可重用的检验代码)

```go
// 返回值为结构体类型
func newUser(firstName string, lastName string, birthDate string) User {
    return User{
        fistName:  firstName,
        lastName:  lastName,
        birthDate: birthDate,
        createAt:  time.Now(),
    }
}
// 返回值为结构体指针类型 并且添加了错误检验 返回值为 结构体指针类型 + error
func newUser(firstName string, lastName string, birthDate string) (*user, error) {
	if firstName == "" || lastName == "" {
		return nil, fmt.Errorf("First name and last name are required")
	}
	return &user{
		fistName:  firstName,
		lastName:  lastName,
		birthDate: birthDate,
		createAt:  time.Now(),
	}, nil
}
```

### Structs, Packages & export  

- 我们可以将和一个结构体相关的函数，以及属于这个结构体的方法放在一个包中，这样可以更好的组织代码
- 在 Go 语言中，如果一个标识符以大写字母开头，那么这个标识符就是可以被导出的，可以被其他包使用。这个导出的规则也适用于结构体的字段名和结构体的方法
- 在需要使用这个结构体的时候，我们需要在使用处导入这个包，导入的格式为 `import "module名/包名"`。并且使用 `包名.结构体名` 的方式来使用这个结构体
- 当然在某些情况下，我们不需要 export 一个结构体，我们可以在结构体的字段名前加上小写字母，这样这个字段就不会被导出

```go
// 这里的 User 结构体和 User 结构体的方法都是可以被导出的
type User struct {
	FistName  string
	LastName  string
	BirthDate string
	CreateAt  time.Time
}
func (u *User) OutputUserData() {
	fmt.Println("First name: ", u.FistName)
	fmt.Println("Last name: ", u.LastName)
	fmt.Println("Birth date: ", u.BirthDate)
}
```

### Structs Embedding 结构体嵌套

- 在 Go 语言中没有和 Java 中的类继承一样的概念，但是我们可以通过结构体嵌套来实现类似继承的功能
- 使用结构体嵌套生成的结构体，可以继承嵌套的结构体的字段和方法
- 为了暴露出嵌套结构体中存在的那个结构体（使用对应的方法），对于那个字段的命名需要以大写字母开头
- 使用嵌套结构体的时候，我们可以使用 `结构体变量名.嵌套结构体字段名` 的方式来访问嵌套结构体的字段和方法
- 对于嵌套结构体的构造函数，我们选择返回该嵌套结构体的类型而不是其指针类型，是

```go
type Admin struct {
	email    string
	password string
	user     User
}

func NewAdmin(email string, password string, firstName string, lastName string) (*Admin, error) {
	if email == "" || password == "" {
		return nil, errors.New("email and password are required")
	}
	return &Admin{
		email:    email,
		password: password,
		User: User{
			FistName:  "Admin",
			LastName:  "Admin",
			BirthDate: "01/01/2000",
			CreateAt:  time.Now(),
		},
	}, nil
}

// 使用这个嵌套结构体
	admin.User.OutputUserData()
	admin.User.ClearUserName()
```

### Creating Other Custom Types

- 在 Go 语言中，我们可以使用 `type` 关键字来定义一个新的类型
- 比如可以 `type MyInt int` 来定义一个新的 int 类型
- 为什么要定义一个新的类型呢？因为这样子定义的类型我们可以为其添加方法，这样可以更好的组织代码。这样可以为一些基本类型添加一些自定义的方法

```go
type MyInt int
type str string

func(text str) log() {
    fmt.Println(text)
}
func main() {
    var text str = "hello"
    text.log()
}
```

### How to read a long string from stdin

- 在 Go 中 Scan 函数默认以空格为分隔符，所以如果我们要读取一行字符串，我们可以使用 `bufio` 包来读取长字符串
- 对于字符串的处理 `strings` 包提供了很多方法，比如
- - `strings.TrimSpace` 可以去掉字符串两边的空格
- - `strings.TrimSuffix` 可以去掉字符串的后缀
- - `strings.TrimPrefix` 可以去掉字符串的前缀
- - `strings.ReplaceAll` 可以替换字符串中的所有匹配项
- - `strings.Split` 可以将字符串按照指定的分隔符分割成数组
- - `strings.Join` 可以将数组中的字符串按照指定的分隔符连接成一个字符串
- - `strings.Contains` 可以判断字符串中是否包含某个子字符串
- - `strings.Index` 可以返回字符串中某个子字符串的索引
- - `strings.ToLower` 可以将字符串转换为小写
- - `strings.ToUpper` 可以将字符串转换为大写

```go
func getUserInput(prompt string) string {
	fmt.Print(prompt)
	reader := bufio.NewReader(os.Stdin)  // 使用 bufio.NewReader 读取用户长输入
	text, err := reader.ReadString('\n') // 读取用户输入直到遇到换行符
	if err != nil {
		fmt.Println(err)
		return ""
	}
	text = strings.TrimSuffix(text, "\n") // 去掉换行符
	text = strings.TrimSuffix(text, "\r") // 去掉回车符
	return text
}

func (note Note) Save() {
	fileName := strings.ReplaceAll(note.Title, " ", "_")
	fileName = strings.ToLower(fileName)
	os.WriteFile(note.Title, []byte(note.Content), 0644)
}
```

### Using encoding/json package

- 在 Go 语言中，我们可以使用 `encoding/json` 包来处理 JSON 数据
- 比如可以使用 `json.Marshal` 函数将结构体转换为 JSON 数据
- 比如可以使用 `json.Unmarshal` 函数将 JSON 数据转换为结构体
- 在结构体中，我们可以使用 `json:"字段名"` 来指定 JSON 数据中的字段名
- 在结构体中，我们可以使用 `json:"-"` 来忽略这个字段
- 在结构体中，我们可以使用 `json:",omitempty"` 来忽略这个字段的零值

```go

	textJson, err := json.Marshal(note)
	if err != nil {
		return err
	}
	return os.WriteFile(fileName, textJson, 0644)
```

### Structs Tags

- 在 Go 语言中，我们可以使用 `struct` tag 来为结构体的字段添加元数据
- 例如我们可以使用 `json:"字段名"` 来指定 JSON 数据中的字段名，比如我们使用 `json:"title"` 来指定 JSON 数据中的字段名为 `title`

```go
type Note struct {
    Title   string `json:"title"`
    Content string `json:"content"`
}
```
