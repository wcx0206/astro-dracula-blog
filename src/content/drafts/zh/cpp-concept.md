---
title: cpp-concept
tags:
---

### Cpp 中的一些重要概念

<!--more-->

### .h .c(.cpp) .o 三种文件

- `.h` 文件是头文件用于定义常量和函数，对于函数只定义而不实现。主要的作用是方便在多个 .c 文件中重复使用
- `.c(.cpp)` 文件是源文件，包含了函数的具体实现，实现你程序的主要逻辑
- ``.o` 是 `.c .cpp` 文件编译后的结果

#### `.h` 文件（头文件）

1. **用途**：
   - 用于声明函数、宏、数据类型等，以便在多个源文件中共享。
   - 不包含函数的具体实现。
   - 声明类，将类的声明和实现分离。避免暴露类的实现细节以及类的定义过于冗长。
2. **内容**：
   - 函数声明（不包括函数体）。
   - 宏、常量定义。
   - 数据类型定义（如结构体、枚举、类型别名）。
   - **类的定义。**
   - 包含保护（防止头文件被多次包含）。

```cpp
#ifndef UTILS_H
#define UTILS_H

// 函数声明
void print_message(const char *message);

// 宏定义
#define PI 3.14159

// 数据类型定义
typedef struct {
    int x;
    int y;
} Point;

class MyClass {
public:
    void display();
};

#endif // UTILS_H
```

#### `.c(cpp)` 文件（源文件）

1. **用途**：
   - 包含函数的具体实现。
   - 包含类的方法的实现。
   - 实现程序的主要逻辑和功能。
2. **内容**：
   - 函数定义与实现（包括函数体）。
   - 变量定义和初始化。
   - 包含头文件（使用 `#include` 指令）。
   - 主程序入口（如 `main` 函数）。
   - 类的具体实现（构造函数，成员函数）

```cpp
#include "utils.h"
#include <stdio.h>

// 函数实现
void print_message(const char *message) {
    printf("%s\n", message);
}

// 类的方法实现
void MyClass::display() {
    printf("This is a member function of MyClass.\n");
}

```

#### `.o` 文件（目标文件）

1. **用途**：
   - 由编译器生成的中间文件，包含编译后的机器代码。
   - 不能直接执行，需要链接器将多个 `.o` 文件链接成一个可执行文件。
2. **生成过程**：
   - 编译器将 `.c` 文件编译成 `.o` 文件。
   - 链接器将多个 `.o` 文件和库文件链接成最终的可执行文件。
3. **示例**：

```bash
gcc -c main.c -o main.o
gcc -c utils.c -o utils.o
gcc main.o utils.o -o myprogram
```


### 命名空间 Namespace

- 命名空间是 C++ 中用于组织代码的一种机制，可以将一组相关的函数、类、变量等放在一个命名空间中，**以避免命名冲突**。
- 当**多个库或者项目中的代码**需要集成在一起时，可能会出现命名冲突的问题。命名空间可以帮助我们解决这个问题，通过将不同的代码放在不同的命名空间中，从而避免命名冲突。
- 可以使用 `namespace` 关键字定义命名空间，使用 `::` 操作符访问命名空间中的成员。
- 语法格式：`namespace namespace_name { ... }`。
  
```cpp
#include <iostream>
// 定义命名空间 MyNamespace
namespace MyNamespace1 {
    int value = 42;
    void printValue() {
        std::cout << "Value: " << value << std::endl;
    }
    // 嵌套命名空间
    namespace NestedNamespace {
        void printMessage() {
            std::cout << "Hello from NestedNamespace" << std::endl;
        }
    }
}

namespace MyNamespace2 {
    int value = 100;
    // 避免命名冲突
    void printValue() {
        std::cout << "Value: " << value << std::endl;
    }
}
int main() {
    // 使用命名空间中的成员
    MyNamespace1::printValue(); // 输出: Value: 42
    MyNamespace1::NestedNamespace::printMessage(); 
    // 输出: Hello from NestedNamespace
    MyNamespace2::printValue(); // 输出: Value: 100
    return 0;
}

```

### 静态绑定

静态绑定（Static Binding），也称为早期绑定（Early Binding），是在编译时确定函数调用的绑定方式。

编译器在编译阶段就确定了函数调用的具体实现，这种绑定方式通常用于**非虚函数和静态函数**

1. 编译时刻确定调用哪一个方法
2. 依据对象的静态类型
3. **效率高、灵活性差**
4. 静态绑定**根据形参决定**

### 动态绑定

动态绑定（Dynamic Binding），也称为晚期绑定（Late Binding）或运行时绑定（Runtime Binding）这种绑定方式通常用于**虚函数**。

1. 晚绑定是指编译器或者解释器在运行前不知道对象的类型，使用晚绑定，**无需检查对象的类型**，只需要检查对象是**否支持特性和方法**即可。
2. c++中晚绑定常常发生在使用`virtual`声明成员函数
3. 运行时刻确定，依据对象的实际类型(动态)
4. 灵活性高、**效率低**
5. 动态绑定函数也就是虚函数。
6. **直到构造函数返回之后，对象方可正常使用**
7. C++默认的都是静态绑定，Java默认的都是动态绑定

### 类与对象的概念

类是一种逻辑上的概念、对象是存储上的概念

### RAII

RAII（Resource Acquisition Is Initialization，资源获取即初始化）是一种管理资源的编程惯用法，主要用于 C++。它的核心思想是将资源的获取和释放绑定到对象的生命周期上。通过这种方式，可以确保资源在对象的生命周期内被正确管理，避免资源泄漏。

#### RAII 的基本概念

1. **资源获取即初始化**：在对象创建时获取资源（如内存、文件句柄、网络连接等），并在对象的构造函数中进行初始化。
2. **资源释放在析构函数中进行**：在对象销毁时释放资源，并在对象的析构函数中进行清理。

### RTTI

RTTI（运行时类型识别，Run-Time Type Information）是C++中的一种机制，用于在程序运行时识别对象的实际类型。RTTI主要提供以下两个功能：

1. **`typeid` 操作符**：用于获取对象的实际类型信息。
2. **`dynamic_cast` 操作符**：用于在运行时安全地进行类型转换，特别是在多态类型之间进行转换。

### 统一初始化

- 统一初始化（Uniform Initialization）是 C++11 引入的一种新的初始化语法，**使用大括号 `{}` 进行初始化。**
- 统一初始化提供了**一种一致的方式**来初始化**变量、数组、结构体、类对象**等，简化了初始化语法，减少了歧义。
- 这种方式将各种类型和对象的初始化进行了一个统一，提高了整体代码的可读性
- 注意：
  - **避免窄化转换**
    - 统一初始化可以避免窄化转换，确保类型安全。
  - **初始化顺序**
    - 对于类对象，统一初始化会按照成员变量的**声明顺序进行初始化**。
  - **兼容性**
    - 统一初始化是 C++11 引入的特性，确保编译器支持 C++11 或更高版本。

#### 基本数据类型

```cpp
int a{10};  // 使用统一初始化
double b{3.14};
```

#### 数组的统一初始化

```
int arr[3]{1, 2, 3};  // 使用统一初始化
```

#### 结构体统一初始化

```cpp
struct Point {
    int x;
    int y;
};

Point p{10, 20};  // 使用统一初始化
```

#### 类对象统一初始化

```cpp
#include <iostream0>
#include <vector>

class MyClass {
public:
    MyClass(int a, double b) : a(a), b(b) {}

    void display() const {
        std::cout << "a: " << a << ", b: " << b << std::endl;
    }

private:
    int a;
    double b;
};

int main() {
    MyClass obj{10, 3.14};  // 使用统一初始化
    obj.display();

    std::vector<int> vec{1, 2, 3, 4, 5};  // 使用统一初始化
    for (int v : vec) {
        std::cout << v << " ";
    }
    std::cout << std::endl;

    return 0;
}
```



### nullptr 

#### 为什么会引入 `nullptr`

核心点就是 `NULL` 和 0 在很多场景下会被混淆，导致空指针 == 整数0

- 安全性考虑

  - 使用 `NULL` 或 `0` 表示空指针在某些情况下会导致类型不安全的问题。`NULL` 通常被定义为 `0`，这意味着它既可以表示整数 `0`，也可以表示空指针。

  - 这种双重含义可能导致编译器无法正确区分指针和整数，从而引发潜在的错误。

- 函数重载

  - 在函数重载的情况下，使用 `NULL` 或 `0` 作为参数可能导致编译器无法正确选择重载函数。
  - 例如，一个函数接受指针参数，另一个函数接受整数参数，传递 `NULL` 或 `0` 可能会导致编译器选择错误的重载函数

#### 特性

`nullptr` 是 C++11 引入的一个关键字，**用于表示空指针**。它是一个类型安全的空指针常量，取代了传统的 `NULL` 宏和 `0`，用于指针初始化和比较。

- 类型安全
  - `nullptr` 是**类型安全的空指针常量**，类型为 `std::nullptr_t`。
  - `std::nullptr_t` 可以**隐式转换**为任何**指针类型或成员指针类型**，但**不能转换为整数类型**。
- 统一表示
  - `nullptr` 统一表示空指针，避免了使用 `NULL` 或 `0` 可能引起的歧义和错误。

- 函数重载
  - `nullptr` 可以用于**函数重载**，**区分指针和整数类型**的重载函数。

#### 用法

类型安全

```cpp
#include <iostream>
#include <type_traits>

void checkPointer(int* ptr) {
    if (ptr == nullptr) {   // 使用 nullptr 代替 NULL
        std::cout << "Pointer is null" << std::endl;
    } else {
        std::cout << "Pointer is not null" << std::endl;
    }
}

int main() {
    int* p1 = nullptr;  // 使用 nullptr 初始化指针
    checkPointer(p1);

    std::nullptr_t nptr = nullptr;  // std::nullptr_t 类型
    static_assert(std::is_same<decltype(nptr), std::nullptr_t>::value, "Type is not std::nullptr_t");

    return 0;
}
```

统一表示

```cpp
#include <iostream>

void checkPointer(int* ptr) {
    if (ptr == nullptr) {
        std::cout << "Pointer is null" << std::endl;
    } else {
        std::cout << "Pointer is not null" << std::endl;
    }
}

int main() {
    int* p1 = nullptr;  // 使用 nullptr 初始化指针
    checkPointer(p1);

    int* p2 = NULL;  // 使用 NULL 初始化指针（不推荐）
    checkPointer(p2);

    int* p3 = 0;  // 使用 0 初始化指针（不推荐）
    checkPointer(p3);

    return 0;
}
```

函数重载

```cpp
#include <iostream>
 
void func(int* ptr) {  // 参数为int指针
    std::cout << "Pointer overload called" << std::endl;
}

void func(int value) { // 参数为int
    std::cout << "Integer overload called" << std::endl;
}

int main() {
    func(nullptr);  // 调用指针重载
    func(0);        // 调用整数重载
  									// 如果使用 NULL 可能会导致调用问题
    return 0;
}
```

