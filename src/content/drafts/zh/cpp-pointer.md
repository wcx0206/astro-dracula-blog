---
title: cpp-pointer
tags:
---

### Pointer in Cpp

<!--more-->

### 指针 Pointer

`void*` 通用指针，可以指向任意类型的数据，但不能直接访问指向的数据，需要进行类型转换

```cpp
// void 指针
int i = 42;
void* p = &i; 
(char*)p;  // 强制类型转换

// 普通指针
int *x = NULL; // 空指针
int y = 9;
x = &y; // 指针指向 y
cout << *x << endl; // 9

// 函数指针
// 定义一个简单的函数
int add(int a, int b) {
    return a + b;
}

// 定义一个函数指针类型
typedef int (*FuncPtr)(int, int);

int main() {
    // 定义一个函数指针并将其指向 add 函数
    FuncPtr ptr = add;
    // 使用函数指针调用 add 函数
    int result = ptr(3, 4);
    cout << "Result of add(3, 4): " << result << endl; // 输出 7

    return 0;
}


```


struct 和 class 的区别：struct 默认情况下所有的成员（包括数据成员和成员函数）都是 public，而 class 默认情况下所有的成员都是 private。
