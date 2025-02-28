---
title: udemy-go-concurrency
tags:
---
udemy-go-concurrency 关于Go语言并发编程的学习笔记。

<!--more-->

### Goroutines 轻量级线程（协程）

- Goroutines 是 Go 语言中的一个非常重要的概念，它是一种**轻量级的线程**, 可以用于并行运行函数。
- 对于一些耗时的操作，我们可以使用 Goroutines 来提高程序的性能。
- Goroutines 实际上就是创建一个线程，将**函数**放到这个线程中执行。
- Goroutines 是由 **Go 语言的运行时调度完成的**，而不是由操作系统调度的，因此它的创建和销毁的代价要比线程小很多。

使用 `go` 关键字来启动一个 Goroutines

```go
func greeting(data string) {
    fmt.Println(data)
}

func slowGreeting(data string) {
    time.Sleep(3 * time.Second)
    fmt.Println(data)
}

func main() {
    go greeting("Nice to meet you") // 使用go关键字来启动一个Goroutines
    go greeting("How are you")
    go slowGreeting("How ... are ... you")
}
```

>[!caution]
>
>- 但是我们发现上面的代码并没有输出任何内容，这是因为主程序在启动了三个 Goroutines 后就立即退出了，而此时 Goroutines 还没有来得及执行。
>- 那么如何解决这个问题呢？这就是下面要提及的 `channel` 的作用了。

### Go 协程（Goroutines）的底层实现

参考文章：[Go协程的底层原理（图文详解）](https://blog.csdn.net/qq_35289736/article/details/138419334)

协程的本质是将一段程序的运行状态进行打包，使其可以在不同的线程上进行调度。

在上面这篇文章中作者给出了几个很有意思的比喻：

- 进程——“工厂”
- 线程——“流水线”

而所谓的协程就是让一段程序运行状态打包后在某一个流水线（线程）上进行运行，此时进行协程调度就只需要将这个“程序包”移动到另一条流水线上去执行，而不需要重新启动一个流水线（线程调度）。

多协程运行时，每一个线程会从协程的全局队列中抓取一个（程序运行状态包）进行执行，执行完成后丢弃。

```go
a := 3
b := 2
c := a * b
```

#### 协程的本质

在 Golang 的运行时中协程的本质是一个**g结构体**



### Channels 通道

- `Channels` 是 Go 语言中用于在 Goroutines 之间进行通信的机制。它们提供了一种类型安全的方式来传递数据。
- 通道是引用类型，所以可以使用 `make` 函数来创建一个通道。
- 可以通过在主线程中等待 `channel` 值的方式来解决上面提到的问题。
  - 只有当 `channel` 中有值时，主线程才会继续执行。
- 语法:
  - 作为函数参数: `func greeting(data string, ch chan bool) { ... }`
  - `ch := make(chan int)` 创建一个整型的通道
  - `ch <- 42` 将一个整型的值 42 发送到通道 ch 中
  - `v := <-ch` 从通道 ch 中接收一个值并将其赋值给变量 v
  - `close(ch)` 关闭通道 ch
  - `v, ok := <-ch` 从通道 ch 中接收一个值并将其赋值给变量 v，同时判断通道是否已经关闭

### many Goroutines one Channel

- 下面这种情况等待了一个channel值，但是我们启动了多个Goroutines，这种情况下只有一个Goroutines会被执行，其他的Goroutines会被忽略

>[!caution]
>
>所以在这种情况的时候我们需要尽可能的等待更多的channel值

```go
func greeting(data string, ch chan bool) {
    fmt.Println(data)
    ch <- true
}
func slowGreeting(data string, ch chan bool) {
    time.Sleep(3 * time.Second)
    fmt.Println(data)
    ch <- true
}
func main() {
    ch := make(chan bool)
    go greeting("Nice to meet you", ch)
    go greeting("How are you", ch)
    go slowGreeting("How ... are ... you", ch)
    <-ch
}
```

正确的使用 `channel` 的方式

```go
func main() {
    ch := make(chan bool)
    go greeting("Nice to meet you", ch)
    <-ch
    go greeting("How are you", ch)
    <-ch
    go slowGreeting("How ... are ... you", ch)
    <-ch
}

```

### many Goroutines many Channels 多个 Goroutines多个 Channels

- 在某些情况下对于每个 Goroutines 都需要一个独立的 Channel，这种情况下我们可以使用一个 `map` 或者 `list` 来存储多个 Channel。
- 在这种情况下需要注意的是我们需要向不同的函数传递不同的 Channel。

```go
func greeting(data string, ch chan bool) {
    fmt.Println(data)
    ch <- true
}
func slowGreeting(data string, ch chan bool) {
    time.Sleep(3 * time.Second)
    fmt.Println(data)
    ch <- true
}

func main() {
	ch := make([]chan bool, 3)
	for i := 0; i < 3; i++ {
		ch[i] = make(chan bool)
	}
	go greeting("Nice to meet you", ch[0])
	<-ch[0]
	go greeting("How are you", ch[1])
	<-ch[1]
	go slowGreetings("How ... are ... you", ch[2])
	<-ch[2]
}
```

>[!caution]
>-  在通过 `make` 函数创建一个 `channel` 时，我们需要指定 `channel` 的类型，否则会报错。
>   -  `ch := make(chan)` 这种方式是错误的，应该使用 `ch := make(chan bool)` 这种方式。
>-  通过当我们使用 `make` 初始化许多 `channel` 尤其是 `slice` 切片类型时，一定需要对每一个 `chan` 进行初始化

### Set up error channel

- 在某些情况下我们需要将错误信息传递给主线程，这种情况下我们可以使用一个 `channel` 来传递错误信息
  - `errChan chan error`
  
- 这个时候我们对于一个函数往往需要设置多个 `channel` 用于不同的信息传递
  - 是否完成的信息
  - 是否发生错误的信息

```go
func process(errChan chan error,doneChan chan bool) {
    errChan <- errors.New("Something went wrong")
    doneChan <- false
}
```

### Select Channel 选择通道

- 你可以使用 `select` 语句来处理一个 `Goroutines` 可能会传递的多个 `channel` 信号的情况
  - 这种情况会广泛出现包括：处理超时、传递错误信息
- `select`语句的机制类似于 `switch` 语句，但是与 `switch` 语句不同的是 `select` 语句会**随机选择**一个可用的通道进行通信，而 `switch` 语句会按顺序从第一个 case 开始执行。

#### 几种 `case` 的情况

- `case <-ch1:` 从通道 ch1 中接收数据, 如果 ch1 通道没有数据，就会阻塞等待
- `case data := <-ch2:` 从通道 ch2 中接收数据并赋值给变量 data
- `case ch3 <- data:` 将数据 data 发送到通道 ch3, 如果 ch3 通道已满，就会阻塞等待
- `case <-time.After(2 * time.Second):` 在 2 秒后执行
- `case v, ok := <-ch4:` 从通道 ch4 中接收数据并判断通道是否已经关闭
- `default:` 如果没有任何 case 准备好，就会执行 default 分支


#### 处理超时情况

- `select` 可以与 `time.After` 通道结合使用，实现操作的超时控制。如果在指定时间内没有通道操作完成，可以执行超时处理逻辑。
- 如下面的代码所示，如果在 2 秒内没有从通道 ch 中接收到数据，就会执行超时处理逻辑。

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string)

    go func() {
        time.Sleep(3 * time.Second)
        ch <- "Data received"
    }()

    select {
    case msg := <-ch:
        fmt.Println(msg)
    case <-time.After(2 * time.Second):
        fmt.Println("Timeout")
    }
}

```

#### 非阻塞通道操作

- select 可以用于实现非阻塞的通道操作。如果某个通道没有准备好，可以立即执行其他逻辑，而不是阻塞等待。
- 如下面的代码所示，如果通道 ch 中没有数据，就会执行 default 分支。

```go
package main

import (
    "fmt"
)

func main() {
    ch := make(chan string)

    select {
    case msg := <-ch:
        fmt.Println("Received:", msg)
    default:
        fmt.Println("No data received")
    }
}
```

#### 多路复用通道操作

- select 允许一个 Goroutine 同时等待多个通道操作（发送或接收）。当其中一个通道操作准备好时，select 会执行对应的分支。这对于需要同时处理多个异步事件的场景非常有用。
- 如下面的代码所示，select 可以同时等待 ch1 和 ch2 两个通道的操作，当其中一个通道准备好时，就会执行对应的分支。

```go
package main

import (
    "fmt"
    "time"
)

func sendData(ch1 chan string, ch2 chan string) {
    time.Sleep(2 * time.Second)
    ch1 <- "Data from channel 1"
    ch2 <- "Data from channel 2"
}

func main() {
    ch1 := make(chan string)
    ch2 := make(chan string)

    go sendData(ch1, ch2)

    for i := 0; i < 2; i++ {
        select {
        case msg1 := <-ch1:
            fmt.Println("Received:", msg1)
        case msg2 := <-ch2:
            fmt.Println("Received:", msg2)
        }
    }
}
```

#### 处理通道关闭

- select 可以用于检测通道是否关闭，从而优雅地处理通道关闭的情况。
- 如下面的代码所示，如果通道 ch 已经关闭，就会执行对应的分支。
- 通过 `v, ok := <-ch` 语句可以判断通道是否已经关闭，如果通道已经关闭，ok 的值为 false。

```go
package main

import (
    "fmt"
)

func main() {
    ch := make(chan string)
    close(ch)

    select {
    case msg, ok := <-ch:
        if !ok {
            fmt.Println("Channel closed")
        } else {
            fmt.Println("Received:", msg)
        }
    default:
        fmt.Println("No data received")
    }
}
```

### defer 关键字

- `defer` 关键字可以确保一个函数在执行结束后一定会被调用
- 在某些函数中可能会因为一些错误导致函数提前返回，那么我们需要通过编写多个释放资源的代码来确保资源被释放
- 使用 `defer` 关键字可以用来解决这个问题，只需要调用一次就可以保证在函数执行结束后一定会被调用

```go
func WriteToFile() {
    file, err := os.Create("example.txt")
    if err != nil {
        fmt.Println(err)
        return
    }
    defer file.Close() // 这里使用defer确保file.Close()一定会被调用
    fmt.Fprintln(file, "data")
}
```