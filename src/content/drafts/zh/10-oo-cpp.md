---
title: 10-OO-cpp
tags:
---

C++ 面向对象的十大问题

<!--more-->

## 一、构造函数

当类中未自主定义构造函数，编译器会提供默认构造函数，为什么？编译器会对一个空类做什么？

1. 编译器只有在**一定需要**默认构造函数的时候，才去创建构造函数。
2. 编译器会对一个空类生成这些函数：

```cpp
class Empty {
public:
    // 编译器为空类提供的函数：
    Empty(); // 默认构造函数
    Empty(const Empty&); // 默认拷贝构造函数
    ~Empty(); // 默认析构函数
    Empty& operator=(const Empty&); // 默认拷贝赋值函数  重载了 = 符号
    Empty* operator&(); // 默认重载取对象地址  重载了 & 符号
    const Empty *operator&() const; // 默认重载取常量对象地址
};
```

## 二、构造函数和析构函数

何时构造函数、析构函数被定义为 `private`？何时、如何使用友元、static 成员？

1. `private` 的构造函数和析构函数常常用在某些设计模式下的情况
   - 例如**单例模式**：构造函数的私有化的类的设计保证了其他类（包括其派生类）不能创建类的实例

2. 通过友元类对象的方法来完成创建：友元类可以访问另一个类的私有构造函数，从而创建该类的实例。友元类的方法**可以调用该类的私有构造函数**，创建并返回该类的对象。
3. 使用 static 方法完成创建：
   - 静态方法属于类本身，而不是类的某个对象。
   - 通过静态方法，**可以在类外部访问类的私有构造函数**，从而创建类的实例。
   - 静态方法可以控制实例的创建过程，确保类的实例化符合特定的设计模式（如单例模式）。


```cpp
// 单例模式
#include <iostream>

// 使用友元类实现
class SingletonFriend; // 前向声明 

class Singleton {
private:
    // 这个也就是单例模式中的那个 单例对象 instance
    static Singleton* instance; // 静态成员变量 这个成员变量的类型是 Singleton 的一个指针

    // 私有构造函数
    Singleton() {
        std::cout << "Singleton instance created by friend class." << std::endl;
    }

    // 私有析构函数
    ~Singleton() {
        std::cout << "Singleton instance destroyed." << std::endl;
    }

    // 声明友元类
    friend class SingletonFriend;

public:
    // 禁止拷贝构造和赋值操作 使用 delete 关键字
    Singleton(const Singleton&) = delete; // 禁止拷贝构造
    Singleton& operator=(const Singleton&) = delete; // 通过重载 = 符号禁止赋值
};

// 初始化静态成员变量
Singleton* Singleton::instance = nullptr; // 初始化静态成员变量

// 定义友元类
class SingletonFriend {
public:
    static Singleton* createInstance() {
// 当 static变量 instance 为空时，即该类还没有实例化时，通过调用new创建一个实例赋值给 instance
        if (Singleton::instance == nullptr) {
              // 友元类可以访问私有构造函数 
            Singleton::instance = new Singleton();
        }
        return Singleton::instance;
    }

    static void destroyInstance() {
        // 销毁实例
        delete Singleton::instance;
        Singleton::instance = nullptr;
    }
};

// 使用 static 方法实现
class SingletonStatic {
private:
    // 私有静态成员变量 用于保存唯一实例
    static SingletonStatic* instance;

    // 私有构造函数
    SingletonStatic() {
        std::cout << "SingletonStatic instance created by static method." << std::endl;
    }

    // 私有析构函数
    ~SingletonStatic() {
        std::cout << "SingletonStatic instance destroyed." << std::endl;
    }

public:
    // 禁止拷贝构造和赋值操作
    SingletonStatic(const SingletonStatic&) = delete;
    SingletonStatic& operator=(const SingletonStatic&) = delete;

    // 静态方法获取实例 该静态方法可以在类的唯一静态变量 instance 为空时创建一个实例并赋值
    static SingletonStatic* getInstance() {
        if (instance == nullptr) {
            instance = new SingletonStatic();
        }
        return instance;
    }

    // 静态方法销毁实例
    static void destroyInstance() {
        delete instance;
        instance = nullptr;
    }
};

// 初始化静态成员变量
SingletonStatic* SingletonStatic::instance = nullptr;

int main() {
    // 使用友元类创建和销毁实例
    Singleton* s1 = SingletonFriend::createInstance();
    SingletonFriend::destroyInstance();

    // 使用 static 方法创建和销毁实例
    SingletonStatic* ss1 = SingletonStatic::getInstance();
    SingletonStatic::destroyInstance();
    return 0;
}
```

## 三、成员初始化表

为什么引入成员初始化表？为什么初始化表执行次序只与类数据成员的定义次序相关？

1. 为了提高编译效率，减轻编译器负担
2. 按照成员定义次序初始化，可以达到提高编译效率的目的
3. 原则上的初始化顺序：**就地初始化 > 构造函数的初始化列表 > 构造函数里的赋值（严格意义上不能成为初始化）**

``` cpp
class CString {
    char *p;
    int size;
    public:
        CString(int x): size(x),p(new char[size]) {}
    };
```

## 四、拷贝构造函数和赋值函数

为什么引入拷贝构造函数、赋值函数？

1. **防止浅拷贝带来的问题，需要由程序员管理各种资源**
   - 默认的拷贝构造函数和赋值操作符执行的是浅拷贝，即逐位复制对象的成员变量。这对于包含指针成员的类可能会导致问题，如多个对象指向同一块内存。
   - 为了避免浅拷贝带来的问题，需要自定义拷贝构造函数和赋值操作符，实现深拷贝，即复制指针指向的内存，而不是复制指针本身。
   - 默认的拷贝构造函数和赋值操作符可能会导致意外的副作用，特别是在类包含复杂成员或需要特定初始化顺序时。
2. 拷贝构造函数和赋值函数可以提高效率

## 五、后期绑定

什么是后期绑定？ C++ 如何实现虚函数？（这是实现多态的基础）

1. **运行时确定调用哪个函数的代码**，与早期绑定（Early Binding）相对，早期绑定是在编译时确定调用哪个函数的代码。
2. 通过在**对象头部加入虚函数表**来实现后期动态绑定
3. 后期绑定通常通过**虚函数**（virtual functions）和**多态性**（polymorphism）来实现。

## 六、虚函数

### 什么是虚函数？

### 何时使用虚函数？

1. 当子类方法需要表现出不同行为的时候

### 如何实现虚函数？

1. 虚函数允许在基类中声明一个函数，并在派生类中重新定义该函数。通过使用基类指针或引用调用虚函数，程序可以在运行时决定调用哪一个派生类的函数实现。
2. 虚函数表（vtable）：在编译时，编译器为每个包含虚函数的类生成一个虚函数表（vtable），其中包含指向该类的虚函数实现的指针。每个对象包含一个指向其所属类的虚函数表的指针（vptr）。在运行时，通过 vptr 查找并调用正确的函数实现。
3. 具体的实现步骤：
   - 在基类中声明虚函数，使用 `virtual` 关键字。
   - 在派生类中重新定义虚函数，使用 `override` 关键字。
   - 使用基类指针或引用调用虚函数，程序会在运行时调用正确的派生类函数实现。

## 七、继承方式

public 继承和 non-pablic 继承意味着什么？

non-public 继承在需要使使用 Base Class 中的 protected 成员，或重载 virtual function 时，同时不希望 Base Class 被客户代码使用。

|                | public    | protected | private |
| -------------- | --------- | --------- | ------- |
| public 继承    | public    | protected | 不可见  |
| protected 继承 | protected | protected | 不可见  |
| private 继承   | private   | private   | 不可见  |

## 八、重载注意事项

为什么 `=, (), [], ->` 不能作为全局函数重载？

1. 大体上来讲，C++ 一个类本身对这几个运算符就已经有了相应的解释了。
2. 如果将这四种符号进行友元全局重载，则会出现一些二义性冲突

## 九、返回引用

什么时候成员函数能返回引用？

1. 需要改变原有值
2. 节省空间、提高效率、避免多余拷贝

## 十、内存分配方式的重载

什么时候、如何重载 `new` 和 `delete`？

1. 需要程序员自己来管理内存的时候（需要多次调用原有 new/delete 的时候，嫌慢）
2. `new` 的重载可以有多个

```cpp
void *operator new(size_t size, ...) {};
// 调用方式：
A *p = new (...) A;
```

1. `delete` 的重载只能有一个。

```cpp
void operator delete(void *p, size_t size);
// 第一个参数表示被撤销的对象地址，第二个参数可有可无，表示被撤销的参数的大小
```

1. `new/delete` 重载之后，就不能再使用预定义的
2. 重载的 `new/delete` 是静态成员，遵循类的访问控制，可继承
3. 允许进行全局重载，但是不推荐使用全局重载
