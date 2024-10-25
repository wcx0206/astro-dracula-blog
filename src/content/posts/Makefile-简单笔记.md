---
abbrlink: b5f1b38d
categories:
- CS
- Tools
date: 2023-01-08 10:52:48
tags:
- c
- cpp
- makefile
- software-engineering
- build-tool
title: Makefile 简单笔记
---

这是一篇笔记，原视频是 [@于仕琪](https://space.bilibili.com/519963684) 老师的 [《Makefile 20 分钟入门，简简单单，展示如何使用 Makefile 管理和编译 C++ 代码》](https://www.bilibili.com/video/BV188411L7d2)。

<!--more-->

## 老师所给的四个版本

```makefile
# 版本一
hello: main.cpp printhello.cpp factorial.cpp
    g++ -o hello main.cpp printhello.cpp factorial.cpp


# 版本二
CXX = g++
TARGET = hello
OBJ = main.o printhello.o factorial.o

$(TARGET): $(OBJ)
    $(CXX) -o $(TARGET) $(OBJ)

main.o: main.cpp
    $(CXX) -c main.cpp

printhello.o: printhello.cpp
    $(CXX) -c printhello.cpp

factorial.o: factorial.cpp
    $(CXX) -c factorial.cpp


# 版本三
CXX = g++
TARGET = hello
OBJ = main.o printhello.o factorial.o

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
    $(CXX) -o $@ $^

%.o: %.cpp
    $(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
    rm -f *.o $(TARGET)


# 版本四
CXX = g++
TARGET = hello
SRC = $(wildcard *.cpp)
OBJ = $(patsubst %.cpp, %.o, $(SRC))

CXXFLAGS = -c -Wall

$(TARGET): $(OBJ)
    $(CXX) -o $@ $^

%.o: %.cpp
    $(CXX) $(CXXFLAGS) $< -o $@

.PHONY: clean
clean:
    rm -f *.o $(TARGET)
```

## 知识点

首先是关于 g++ 这个 C++ 编译器的一些知识点。

- `-c` 参数表示生成 obj 文件（`*.o`）；
- `-o` 用于指定生成的可执行文件的名称，比如上边 `-o hello` 就表示生成的可执行文件叫 hello；
- `-Wall` 表示 Warning all，也就是打开全部的警告。

接着是 Makefile 文件的大致原理。

首先看最易理解的版本一。

```makefile
hello: main.cpp printhello.cpp factorial.cpp
    g++ -o hello main.cpp printhello.cpp factorial.cpp
```

第一行冒号前的部分表示我们需要的文件（这里是 `hello`），冒号后表示冒号前文件的依赖项（这里是三个 `.cpp` 文件），第二行表示为了生成冒号前的文件，需要执行什么命令。Make 工具通过检测冒号后文件的时间戳是否比冒号前文件更新来判断是否要执行第二行语句。

在第二个版本中，引入了变量的概念。形似 `XXX = YYY` 的东西就是在给变量赋值，使用 `$(XXX)` 来取得值 `YYY`。

第三个版本中出现了 `$@`、`$^`、`$<` 等符号，他们分别表示冒号前面的内容、冒号后边的全部内容和冒号后边第一个内容。

第三个版本中的 `.PHONY: clean` 标识了 `clean` 是个命令而不是一个文件，这样结合下边的 `clean:` 的内容，就可以实现直接在终端输入 `make clean` 来执行 `rm -f *.o $(TARGET)` 的命令，清空生成出来的文件。