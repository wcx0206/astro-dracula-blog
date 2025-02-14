---
title: cpp-constructor
tags:
---

### C++ 构造函数

- 在这个部分主要讨论 C++ 中的构造函数，包括默认构造函数、带参数构造函数、拷贝构造函数、拷贝赋值函数、移动构造函数、移动赋值函数。
- 同样我们会讨论初始化列表在构造函数中的使用。
- 最后会对析构函数进行讨论。

<!--more-->

### 前言

- 如果你自定义了构造函数，你需要**对每一个成员变量进行处理**
- cpp编译器识别到你自定义的构造函数后，就只会按照你的构造函数进行处理，**不会再去对一些你没有涉及的成员变量使用默认的构造函数**。（只会按照你的意思）
- **构造函数没有返回类型**并且在对象创建时自动调用
- 构造函数**允许进行重载**：即可以定义多个构造函数，只要它们的参数列表不同

### 默认构造函数

没有参数的构造函数

```cpp
class Person {
private:
    std::string name;
    int age;

public:
    // 默认构造函数
    Person() {
        name = "Unknown";
        age = 0;
        std::cout << "Default constructor called" << std::endl;
    }
    // 显示信息的方法
    void display() {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
};

int main() {
    // 使用默认构造函数
    Person person1;
    person1.display();
}
```



### 带参数构造函数

带有参数的构造函数。更多的时候会结合[初始化列表](#初始化列表)一同进行使用

```cpp
#include <iostream>
#include <string>

class Person {
private:
    std::string name;
    int age;

public:
    // 参数化构造函数
    Person(std::string n, int a) {
        name = n;
        age = a;
        std::cout << "Parameterized constructor called" << std::endl;
    }
    // 显示信息的方法
    void display() {
        std::cout << "Name: " << name << ", Age: " << age << std::endl;
    }
};

int main() {
    // 使用参数化构造函数
    Person person2("Alice", 30);
    person2.display();
}
```



### 拷贝构造函数 && 拷贝赋值函数

- 但你同时有默认拷贝构造函数 与 自定义拷贝构造函数 （所有的只会调用其中一个）


- 用于创建一个新对象，该对象是现有对象的副本。[为什么需要使用拷贝构造函数？](./10-oo-cpp.md#四、拷贝构造函数和赋值函数)

  - 拷贝构造函数：`MyClass(const MyClass& other) { ... }`
    - 传递的参数为 类对象的引用

  - 拷贝赋值函数：`MyClass& operator=(const MyClass& other) { ... }`
    - 对 = 操作符进行重载

- 在通过值传递将一个对象作为参数传递给一个函数的时候，往往会触发拷贝构造函数


- （移动）赋值函数的定义通常包括以下步骤：

  1. 检查自赋值。
  1. 释放当前对象持有的资源。
  1. 移动资源（而不是复制）到当前对象。
  1. 返回当前对象的引用。


```cpp
class MyClass {
private:
    char* data;

public:
    // 构造函数
    MyClass(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }

    // 自定义拷贝构造函数
    // 这里的类中有一个指针成员，所以需要自定义拷贝构造函数
    MyClass(const MyClass& other) {
        data = new char[strlen(other.data) + 1];
        strcpy(data, other.data);
    }

    // 赋值函数 对 = 运算符的重载
    MyClass& operator=(const MyClass& other) {
      // 检查自赋值
        if (this != &other) {
            delete[] data;
            data = new char[strlen(other.data) + 1];
            strcpy(data, other.data);
        }
        return *this;
    }

    // 析构函数
    ~MyClass() {
        delete[] data;
    }

    void display() const {
        std::cout << data << std::endl;
    }
};
```



### 移动构造函数 && 移动赋值函数

- 为什么在有拷贝构造函数的情况下还需要移动构造函数？
  - 拷贝构造函数在使用时会复制现有对象的资源，在复制大型对象或资源时可能会导致性能问题。
- “移动” 是指将资源的所有权从一个对象转移到另一个对象，而不是复制资源。
- 移动构造函数是一种特殊的构造函数，用于将[**右值引用**](./cpp-reference.md#右值引用)的资源移动到新对象，避免资源的复制。
- 移动赋值函数是移动语义的一部分，用于将资源从一个对象移动到另一个对象，而不是复制资源
- 一般需要**禁用拷贝构造函数和拷贝赋值函数**，以确保只能使用移动语义。避免意外深拷贝、资源泄漏等问题。
- 移动拷贝函数的定义： `MyClass(MyClass&& other) noexcept { ... }`
- 移动赋值函数的定义：`MyClass& operator=(MyClass&& other) noexcept { ... }`

```cpp
class MyClass {
private:
    int* data;
    size_t size;

public:
    // 构造函数
    MyClass(size_t size) : size(size), data(new int[size]) {
        std::cout << "Constructor called, memory allocated" << std::endl;
    }
    // 移动构造函数
    MyClass(MyClass&& other) noexcept : data(other.data), size(other.size) {
        std::cout << "Move constructor called" << std::endl;
        other.data = nullptr;
        other.size = 0;
    }
  
    // 移动赋值函数
    MyClass& operator=(MyClass&& other) noexcept {
        std::cout << "Move assignment operator called" << std::endl;

        // 检查自赋值
        if (this != &other) {
            // 释放当前对象持有的资源
            delete[] data;

            // 移动资源
            data = other.data;
            size = other.size;

            // 将源对象置于有效但未指定的状态
            other.data = nullptr;
            other.size = 0;
        }
        return *this;
    }

    // 禁用拷贝构造函数和拷贝赋值函数
    MyClass(const MyClass&) = delete;
    MyClass& operator=(const MyClass&) = delete;

    // 打印数据
    void print() const {...}
};

int main() {
    MyClass obj1(10); // 创建对象，调用构造函数
    MyClass obj2(20); // 创建另一个对象

    obj2 = std::move(obj1); // 调用移动赋值函数

    obj2.print(); // 打印数据
    obj1.print(); // 打印数据，应该显示 "No data"

    return 0;
}
```



### 初始化列表

### 成员初始化表

成员初始化列表（Member Initializer List）是C++中的一种语法，用于在构造函数中初始化类的成员变量。是对类构造函数初始化方法对进一步的补充

#### 为什么会初始化列表这种方法

cpp 中某些变量类型的值在变量定义初始化后是不能够被修改的：`const`、 `&引用` 

对于这种无法被修改的变量类型没有办法在构造函数中进行初始化只能使用成员初始化表

##### 1. 初始化常量成员

常量成员变量（`const`）必须在初始化时赋值，不能在构造函数体内赋值。成员初始化列表是唯一的选择。

```cpp
class MyClass {
private:
    const int constantValue;
public:
    MyClass(int value) : constantValue(value) {}
};
```

##### 2. 初始化引用成员

引用成员变量（`&`）必须在初始化时赋值，不能在构造函数体内赋值。成员初始化列表是唯一的选择。

```cpp
class MyClass {
private:
    int &ref;
public:
    MyClass(int &r) : ref(r) {}
};
```

##### 3. 调用基类构造函数

```cpp
class Base {
public:
    Base(int value) {}
};

class Derived : public Base {
public:
    Derived(int value) : Base(value) {}
};
```

##### 4. 初始化成员对象

如果类包含其他类类型的成员对象，并且这些成员对象没有默认构造函数，则必须使用成员初始化列表来初始化它们。

```cpp
class Member {
public:
    Member(int value) {}
};

class MyClass {
private:
    Member member;
public:
    MyClass(int value) : member(value) {}
};
```

##### 5. 提高效率

使用成员初始化列表可以避免不必要的默认构造和赋值操作，从而提高效率。对于内置类型和简单类型，差异可能不大，但对于复杂类型，效率提升显著。

```cpp
class MyClass {
private:
    int a;
    int b;
public:
    // 使用成员初始化列表
    MyClass(int x, int y) : a(x), b(y) {}
    
    // 在构造函数体内赋值
    // MyClass(int x, int y) {
    //     a = x;
    //     b = y;
    // }
};
```

#### 成员初始化表的初始化顺序

在C++中，成员初始化列表的初始化顺序**是按照成员变量在类中声明的顺序**，而**不是在成员初始化列表中出现的顺序**。这一点非常重要，因为它可以避免潜在的错误和未定义行为。

初始化顺序规则

1. **基类**：首先初始化基类部分（如果有基类）。
2. **成员变量**：按照它们在类中**声明的顺序进行初始化。**
3. **构造函数体**：最后**执行构造函数体**中的代码。
4. 初始化列表的**书写顺序**不影响成员变量和基类的初始化顺序。

示例：

这个示例先执行基类的初始化，输出了 Base constructor

再按照变量的定义顺序 a,b 先初始化 a 再初始化 b 输出 a: 1, b: 2

```cpp
#include <iostream>

class Base {
public:
    Base() {
        std::cout << "Base constructor" << std::endl;
    }
};

class MyClass : public Base {
private:
    int a;
    int b;
public:
    MyClass(int x, int y) : b(y), a(x) {
        std::cout << "a: " << a << ", b: " << b << std::endl;
    }
};

int main() {
    MyClass obj(1, 2);
    return 0;
}
```

输出为：

```cpp
Base constructor
a: 1, b: 2
```

### 委托构造

- 背景：对于一些类有多个构造函数，部分构造函数之间**存在部分相同的代码**。为了减少代码冗余，提高可读性和可修改性，提出了委托构造这一方法。
- 委托构造（Delegating Constructors）是指**一个构造函数调用同一个类中的另一个构造函数**，以便重用其初始化逻辑。
- C++11 引入了委托构造的概念，允许一个构造函数**在其初始化列表中**调用另一个构造函数。

```cpp
#define MAX 256
// 使用函数来实现这种功能
class X {
    int a;
    void validate(int x) { if (0<x && x<=MAX) a=x; else throw bad_X(x); }
public:
    X(int x) { validate(x); }  // 带参数的构造函数，调用一个函数进行初始化
    X() { validate(42); }  // 无参数构造函数使用默认值调用函数进行初始化（实现了默认值）
    // ...
};

// 使用委托构造来实现
class X {
    int a;
public:
    X(int x) { if (0<x && x<=max) a=x; else throw bad_X(x); } // 复杂的带参数构造函数
    X() :X(42) { } // 在构造函数的初始化列表中继续调用构造函数，复用了上面的逻辑 还添加了特性
    // ...
};
X(int x = 42) ?
```



### 析构函数

在C++中，析构函数是类的一种特殊成员函数，用于在对象的生命周期结束时执行清理操作。析构函数的名称与类名相同，但前面有一个波浪号（`~`），并且没有返回类型和参数。

#### 析构函数的特点

1. **自动调用**：当对象超出作用域或被显式删除时，析构函数会自动调用。
2. **无返回类型**：析构函数没有返回类型。
3. **无参数**：析构函数不能有参数，也不能被重载。
4. **一个类只能有一个析构函数**。

#### 析构函数的用途

- 释放动态分配的内存。
- 关闭文件或网络连接。
- 释放其他资源（如锁、句柄等）。

#### 析构函数的定义和使用

```cpp
#include <iostream>

class MyClass {
public:
    // 构造函数
    MyClass() {
        std::cout << "Constructor called" << std::endl;
    }

    // 析构函数
    ~MyClass() {
        std::cout << "Destructor called" << std::endl;
    }
};

int main() {
    MyClass obj; // 创建对象，调用构造函数
    // 对象超出作用域，调用析构函数
    return 0;
}
```

#### 动态内存管理中的析构函数

在使用动态内存分配时，析构函数尤为重要，因为它可以确保在对象销毁时释放分配的内存，避免内存泄漏。

```cpp
#include <iostream>

class MyClass {
private:
    int* data;
public:
    // 构造函数
    MyClass(int size) {
        data = new int[size];
        std::cout << "Constructor called, memory allocated" << std::endl;
    }

    // 析构函数
    ~MyClass() {
        delete[] data;
        std::cout << "Destructor called, memory deallocated" << std::endl;
    }
};

int main() {
    MyClass obj(10); // 创建对象，调用构造函数
    // 对象超出作用域，调用析构函数
    return 0;
}
```

#### 继承中的析构函数

在继承关系中，基类的析构函数应该是虚函数，以确保在删除派生类对象时，能够正确调用派生类和基类的析构函数。

```cpp
#include <iostream>

class Base {
public:
    // 虚析构函数
    virtual ~Base() {
        std::cout << "Base destructor called" << std::endl;
    }
};

class Derived : public Base {
public:
    ~Derived() {
        std::cout << "Derived destructor called" << std::endl;
    }
};

int main() {
    Base* obj = new Derived();
    delete obj; // 调用派生类和基类的析构函数
    return 0;
}
```

#### 总结

- 析构函数用于在对象生命周期结束时执行清理操作。
- 析构函数没有返回类型和参数，不能被重载。
- 在使用动态内存分配时，析构函数可以防止内存泄漏。
- 在继承关系中，基类的析构函数应该是虚函数，以确保正确调用派生类的析构函数。

```cpp
#include "MyContainer.h"

int MyContainer::_count = 0;

MyContainer::MyContainer(int size) : _size(size) {
    _data = new int[size];
    _count++;
    
    // TODO: finish me
}

MyContainer::~MyContainer() {
    delete[] _data;
    _count--;
    // TODO: finish me
}

MyContainer::MyContainer(const MyContainer &Other) : _size(Other._size) {
    _data = new int[_size];
    std::copy(Other._data,Other._data + size, _data);
    _count++;
}

MyContainer& MyContainer::operator=(const MyContainer &Other) {
    if(this == &Other){
        return *this;
    }
    delete[] _data;
    _size = Other._size;
    _data = new int[size];
    std::copy(Other._data,Other._data + size, _data);
    return *this;
    // TODO: finish me
}

int MyContainer::size() const {
    return _size;
}

int* MyContainer::data() const {
    return _data;
}

int MyContainer::count() {
    return _count;
}
```