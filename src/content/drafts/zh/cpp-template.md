---
title: cpp-template
tags:
---

## Template in C++

<!--more-->

### Template

C++ 中的模板（template）是一种允许函数和类操作泛型类型的特性。模板使得代码更加通用和复用，能够处理不同的数据类型，而无需重复编写相同的代码逻辑

```cpp
//下面两种一般情况下一样
template <class T1, class T2>
class Pair {
    // 类定义
};

template <typename T1, typename T2>
class PairAlt {
    // 类定义
};

//嵌套类型
typedef typename std::vector<T>::iterator iterator; //只能使用typename 
```

>嵌套类型是指在一个类或结构体内部定义的类型。嵌套类型可以是类、结构体、枚举或类型别名（typedef）

### 函数模版

```cpp
#include <iostream>

// 定义一个函数模板
template <typename T>
T add(T a, T b) {
    return a + b;
}

template <typename T>
void sort(T A[], unsigned int num) {
    for(int i=1; i<num; i++)
        for (int j=0; j< num - i; j++) {
            if  (A[j] > A[j+1]) {
                T t = A[j];
                A[j] = A[j+1];
                A[j+1] = t;
            }
        }
}


int main() {
    // 使用模板函数
    std::cout << "int: " << add(1, 2) << std::endl;          // 输出 3
    std::cout << "double: " << add(1.1, 2.2) << std::endl;   // 输出 3.3
    return 0;
}
```

### 类模版

```cpp
#include <iostream>

// 定义一个类模板
template <typename T>
class Box {
private:
    T value;
public:
    Box(T v) : value(v) {}
    T getValue() {
        return value;
    }
};

int main() {
    // 使用模板类
    Box<int> intBox(123);
    Box<double> doubleBox(456.78);

    std::cout << "intBox: " << intBox.getValue() << std::endl;        // 输出 123
    std::cout << "doubleBox: " << doubleBox.getValue() << std::endl;  // 输出 456.78

    return 0;
}


```

### 模版的参数

1. 可有多个类型参数，用逗号分隔:`template <class T1, class T2>`

   - 在模板编程中，使用多个类型参数（如 `T1` 和 `T2`）而不是单个类型参数（如 `T`）是为了**处理不同类型的情况。**具体来说，当你需要处理多个不同类型的参数或成员时，使用多个类型参数可以提供更大的灵活性和通用性。

   - 假设你要定义一个模板类 `Pair`，用于存储一对值。如果这两个值的**类型可能不同**，那么你需要使用两个类型参数 `T1` 和 `T2`。

   - ```cpp
     #include <iostream>
     
     // 定义一个类模板，用于存储和操作一对值
     template <typename T1, typename T2>
     class Pair {
     public:
         Pair(T1 first, T2 second) : first(first), second(second) {}
     
         void print() const {
             std::cout << "First: " << first << ", Second: " << second << std::endl;
         }
     
     private:
         T1 first;
         T2 second;
     };
     
     int main() {
         Pair<int, std::string> p(1, "one");
         p.print();
     
         Pair<double, char> q(3.14, 'A');
         q.print();
     
         return 0;
     }
     ```

     

2. 可带普通参数:

   + **必须列在类型参数之后**:`template <class T, int size>`

   + **调用时需显式实例化**，使用默认参数值可以不显式实例化

     ```cpp
     template <class T1, class T2>
     void f(T1 a, T2 b) {}
     template <class T, int size>
     void f(T a) {T temp[size];}
     f<int,10>(1);
     ```

3. 类型参数和普通参数**都可以给出默认参数**，但是必须从右侧向左侧给出

   ```cpp
   template<typename T = int, int size = 10>
   class Array {
   private:
       T data[size];
   public:
       Array() {
           for (int i = 0; i < size; ++i) {
               data[i] = T();  // 默认初始化
           }
       }
   
       void display() const {
           for (int i = 0; i < size; ++i) {
               std::cout << data[i] << " ";
           }
           std::cout << std::endl;
       }
   };
   ```

   

### 外部模版

#### 为什么会有外部模版

Avoid of unnecessary instantiation 避免不必要的实例化

1. 重复实例化问题：在 C++ 中，模板类和模板函数的实例化通常发生在**每个使用它们的翻译单元**（translation unit）中。这可能导致以下问题：

   - **编译时间增加**：每个翻译单元都需要**实例化相同的模板**，增加了编译时间。

   - **代码膨胀**：每个翻译单元都**包含相同的模板实例化代码**，导致可执行文件的大小增加。

2. 外部模板的解决方案：外部模板（extern template）通过显式声明和实例化模板，解决了上述问题：

   - **减少编译时间**：通过在一个翻译单元中**显式实例化模板**，并在其他翻译单元中使用 `extern template` 声明，可以**避免重复实例化**，减少编译时间。

   - **控制代码膨胀**：通过显式实例化模板，可以控制模板实例化的位置，避免不必要的代码膨胀

#### 示例 1 函数模版

解释：

- 在 `test.cpp` 中，模板函数 `myfunc<int>(int)` 被实例化。
- 当编译器处理 main.cpp 时，如果没有 `extern template` 声明，编译器会再次实例化 `myfunc<int>(int)`，导致重复实例化。
- 通过在 main.cpp 中使用 `extern template void myfunc<int>(int);`，告诉编译器这个模板实例**已经在其他模块中实例化**，避免了重复实例化，从而减少了编译时间和可执行文件的大小

函数模版的定义

```cpp
// myfunc.h
template<typename T>
void myfunc(T t) {}
```

使用模板函数的**翻译单元**

```cpp
// test.cpp
#include "myfunc.h"

int foo(int a) {
    myfunc(1);  // 实例化 myfunc<int>(int)
    return 1;
}
```

主程序翻译单元

```cpp
// main.cpp
#include "myfunc.h"

// 告诉编译器这个实例已经在其他模块中实例化
extern template void myfunc<int>(int);

int main() {
    myfunc(1);  // 使用已实例化的 myfunc<int>(int)
}
```

#### 示例二 类模版

解释：

- 这个示例中我们在模版类的实现文件中，显式实例化了两个模版
  - 使用 `template class` `MyTemplate<int>` ｜ `MyTemplate<duble>`
- 这样在具体使用这个模版类的时候通过 extern 就可以不对这两种模版进行示例化
- 这种使用场景需要提前预知 T 的大致类型 进行显式示例化

模版类定义

```cpp
// MyTemplate.h
#ifndef MYTEMPLATE_H
#define MYTEMPLATE_H

template <typename T>
class MyTemplate {
public:
    MyTemplate(T value) : value(value) {}
    void display() const;

private:
    T value;
};

#endif // MYTEMPLATE_H
```

模板类实现

```cpp
// MyTemplate.cpp
#include "MyTemplate.h"
#include <iostream>

template <typename T>
void MyTemplate<T>::display() const {
    std::cout << "Value: " << value << std::endl;
}

// 显式实例化模板
template class MyTemplate<int>;
template class MyTemplate<double>;
```

使用外部模板

```cpp
// main.cpp
#include "MyTemplate.h"

// 外部模板声明，避免在 main.cpp 中实例化模板
extern template class MyTemplate<int>;
extern template class MyTemplate<double>;

int main() {
    MyTemplate<int> obj1(42);
    obj1.display();

    MyTemplate<double> obj2(3.14);
    obj2.display();

    return 0;
}
```



### 显示具体化

- 在 C++ 中，显示具体化（explicit specialization）用于**为模板提供特定类型的实现。**
- 通常，模板允许你编写通用代码，可以与多种类型一起使用。
- 然而，有时你可能希望**为特定类型提供不同的实现**，这时就可以使用显示具体化。

解释下面的列子：

- 对于一般的类型，`diaplay` 方法输出 Generic template
- 我们对 `int` 类型进行了显示具体化，`display` 方法输出的是 Specialized template for int

```cpp
#include <iostream>

// 通用模板
template <typename T>
class MyClass {
public:
    void display() {
        std::cout << "Generic template" << std::endl;
    }
};

// 为 int 类型提供显式具体化
template <>
class MyClass<int> {
public:
    void display() {
        std::cout << "Specialized template for int" << std::endl;
    }
};

int main() {
    MyClass<double> obj1;
    obj1.display(); // 输出: Generic template

    MyClass<int> obj2;
    obj2.display(); // 输出: Specialized template for int

    return 0;
}


```

例子如下，这里是对函数模版进行了显式具体化

```cpp
// 通用模板
template <typename T>
void print(T value) {
    std::cout << "通用模板: " << value << std::endl;
}

// 显示具体化，针对 int 类型
template <>
void print<int>(int value) {
    std::cout << "显示具体化: " << value << std::endl;
}
```



### Concepts 约束

- 某些情况下我们对模版参数的类型可能需要有所限制。例如：对于要进行加法操作的模版，我们需要确保模版参数的类型是支持进行加法的。所以在这里我们就需要对模版参数进行约束和检验。
- C++20 引入了 Concepts 概念，用于约束模板参数的类型。
- 可以通过 `requires` 关键字和 `concept` 关键字来定义和使用

#### 使用示例

```cpp
#include <iostream>
#include <concepts>

// 定义一个 Concept，要求类型 T 必须支持加法运算
template<typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::same_as<T>;
};

// 使用 Concept 约束模板参数
template<Addable T>
T add(T a, T b) {
    return a + b;
}

int main() {
    std::cout << add(1, 2) << std::endl;       // 输出 3
    std::cout << add(1.5, 2.5) << std::endl;   // 输出 4.0
    // std::cout << add("Hello", "World") << std::endl; // 编译错误，std::string 不满足 Addable
    return 0;
}
```

