---
title: destruction
tags:
---

<!--more-->

### delete 关键字 

在 C++ 中，`delete` 关键字用于释放动态分配的内存。它用于销毁通过 `new` 运算符分配的对象，并释放其占用的内存。`delete` 关键字有两种形式：`delete` 和 `delete[]`，分别用于释放单个对象和数组。

#### 使用 `delete` 释放单个对象

当你使用 `new` 运算符动态分配一个对象时，需要使用 `delete` 关键字来释放该对象的内存。

```cpp
int* ptr = new int(10); // 动态分配一个整数
delete ptr; // 释放分配的内存
ptr = nullptr; // 将指针置为空，避免悬挂指针
```

#### 使用 `delete[]` 释放数组

当你使用 `new[]` 运算符动态分配一个数组时，需要使用 `delete[]` 关键字来释放该数组的内存。

```cpp
int* arr = new int[10]; // 动态分配一个整数数组
delete[] arr; // 释放分配的数组内存
arr = nullptr; // 将指针置为空，避免悬挂指针
```

