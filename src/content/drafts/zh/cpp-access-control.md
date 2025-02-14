---
title: cpp-access-control
tags:
---

### C++ 访问控制

<!--mpre-->

### 类中的权限管理

- 类中的权限管理是指通过访问控制符（`public`、`protected`、`private`）控制类的成员的访问权限。访问控制符用于限制类的成员**对外部的可见性**，提高代码的安全性和可维护性。
- 访问控制修饰符
  - `public`：公有成员，可以在类的外部访问。
  - `protected`：保护成员，可以在**类的派生类**中访问。
  - `private`：私有成员，**只能在类的内部访问**。
- 默认访问控制符是 `private`。
- 访问控制符可以多次出现，每次出现后的访问权限都会受到影响。
- 访问控制符只影响类的**外部访问权限**，不影响类的**内部访问权限**。



### 派生类

- 派生类是从另一个类（称为基类或父类）继承而来的类。派生类继承了基类的成员变量和成员函数，并且可以添加新的成员变量和成员函数，或者重写基类的成员函数。通过继承，派生类可以复用基类的代码，实现代码的重用和扩展。
- 派生类的声明格式：`class 派生类名 : 访问控制符 基类名 { ... };`
- 派生类的访问控制符 [继承方式](./10-oo-cpp.md#七、继承方式)
  - `public`：公有继承，基类的公有成员和保护成员在派生类中保持相应的访问权限。
  - `protected`：保护继承，基类的公有成员和保护成员在派生类中都变为保护成员。
  - `private`：私有继承，基类的公有成员和保护成员在派生类中都变为私有成员。

```cpp
#include <iostream>

// 基类
class Base {
public:
    void display() const {
        std::cout << "This is the base class." << std::endl;
    }
};

// 派生类
class Derived : public Base {
public:
    void show() const {
        std::cout << "This is the derived class." << std::endl;
    }
};

int main() {
    Base baseObj;
    Derived derivedObj;
    baseObj.display(); // 调用基类的成员函数
    derivedObj.display(); // 调用基类的成员函数
    derivedObj.show(); // 调用派生类的成员函数
    return 0;
}


```

### 友元

- 友元（friend）是指可以访问类的私有成员和保护成员的非成员函数或其他类。友元函数或友元类在类的定义中使用 friend 关键字声明。
- 如果想要使用友元函数，需要**在类的定义中声明友元函数，然后在类外定义友元函数**。
- 如果想要使用友元类，需要在类的定义中声明友元类，然后在类外定义友元类。
- 友元是无法进行传递，即 A 是 B B 是 C  友元，但 A 不是 C 的友元
#### 友元函数

- 友元函数可以是**全局函数、类的成员函数或其他类的成员函数**。友元类可以访问声明它为友元的类的所有成员。

- 对于**友元全局函数**，可以在声明为友元前**没有进行声明**

- **但是对于友元类函数，在完整的类的声明完成之前是不能够被声明为友元的**。

  - 需要先前向声明一个类
  - 然后在自身的类中声明这个成员函数
  - 再在前向声明类的中声明这个类的成员函数为友元
  - 再对这个成员函数进行具体的定义
  - 详细的过程可以参考下面的示例

- 友元函数的声明： `friend void functionName();`

- 示例一：友元函数为全局函数

  ```cpp
  // 友元函数为全局函数
  class MyClass {
  private:
      int x;
  public:
      MyClass(int a) : x(a) {}
      friend void display(MyClass obj);  // 可以直接声明友元函数
  };
  
  // 定义友元函数
  // 因为是友元函数，所以可以访问 MyClass 的私有成员 x
  void display(MyClass obj) {
      std::cout << "The value of x is: " << obj.x << std::endl;
  }
  ```

  

- 示例二：友元函数为类成员函数

  ```cpp
  // 1. 首先需要前向声明类D
  class D;
  
  // 2. 然后声明类E及其成员函数accessD
  class E {
  public:
      void accessD(D& d);  // 必须先声明这个成员函数
  };
  
  // 3. 最后才能在类D中声明友元
  class D {
  private:
      int data = 42;
      friend void E::accessD(D& d);  // 现在可以友元了
  };
  
  // 完成对与友元类函数的完整定义
  void E::accessD(D& d) {
      std::cout << "Accessing D's private data: " << d.data << std::endl;
  }
  ```

#### 友元类

- 友元类是指**可以访问另一个类的私有成员和保护成员的类**。通过声明友元类，可以使一个类的所有成员函数都能够访问另一个类的私有和保护成员。
- 友元类的声明：`friend class ClassName;`
- 声明一个类为另一个类的友元类时，可能会遇到定义顺序的问题（可能会出现两个类互相引用导致谁先声明都会出现问题）。这时候需要将作为友元类的那个类进行**[前向声明](#前向声明（引用）)**。如果你没有提前声明这个类（如下面的 `B` 类，可能会在 `A` 类的名空间中为你定义一个类，这可能不是你想要的）

```cpp

#include <iostream>
using namespace std;

class ClassB; // 前向声明
class ClassA {
private:
    int privateVarA;
public:
    ClassA(int value) : privateVarA(value) {}

    // 声明 ClassB 为友元类
    friend class ClassB; 
};
class ClassB {
public:
    void display(const ClassA& obj) {   
        // 因为 ClassB 是 ClassA 的友元类 所以可以访问 ClassA 的私有成员
        std::cout << "ClassA privateVarA: " << obj.privateVarA << std::endl;
    }
};
int main() {
    ClassA objA(42);
    ClassB objB;
    objB.display(objA); // 调用友元类的成员函数，访问 ClassA 的私有成员
    return 0;
}
```

### 继承中友元的访问权限

- 在 C++ 中，友元关系是**单向的且不传递的**

- 若是 B 作为 A 的友元类，A1 继承了 A，B 可以访问 A1 中基类的部分

  - 但是同样这里 B 是无法访问 A1 本身的对象的

- 若 B1 是 B 的派生类， B1 继承了 B 那么 B1 不能访问 A的私有和保护部分

  

### 前向声明（引用）

- 前向引用（Forward Declaration）是指在使用某个类或结构体之前，**先声明它的名字，而不定义其具体内容**。前向引用通常用于解决类之间的**相互依赖问题**，或者减少头文件的包含，从而提高编译速度。
- 这是 Cpp 中的一种特性：允许你先声明类，再后面对类进行初始化。
- 当然再这个时候对于前向声明的类，当你需要使用这个类的对象的时候，**一定要使用对象的引用**，因为你并没有定义这个类的具体内容，所以编译器不知道这个类的大小，所以不能直接使用对象，只能使用对象的引用。
- 当然如果你想要使用前向声明的类的成员变量或函数，你不能够在友元函数声明处直接使用，你需要先在类中进行声明，然后再进行实现。


#### 作用

- 解决类之间的相互依赖问题：当两个类相互引用对方时，可以使用前向引用来打破循环依赖。
- 减少头文件的包含：使用前向引用可以避免在头文件中包含不必要的头文件，从而减少编译时间。

```cpp
#include <iostream>
using namespace std;


// 前向声明类 B
class B;

class A {
private:
    int data;
public:
    A(int value) : data(value) {}

    // 声明 B 的成员函数为友元函数
    // 这里不能直接使用 B 的成员函数和变量，需要等待 B 的定义，所以这里只是对函数进行了声明
    friend void showA(const A& a, const B& b);
    friend void showB(const A& a, const B& b);
};

class B {
private:
    int data;
public:
    B(int value) : data(value) {}

    // 声明 A 的成员函数为友元函数
    friend void showA(const A& a, const B& b);
    friend void showB(const A& a, const B& b);


};

// 这里是对函数的具体实现
void showA(const A& a, const B& b) {
    std::cout << "A's data: " << a.data << ", B's data: " << b.data << std::endl;
}
void showB(const A& a, const B& b) {
    std::cout << "B's data: " << b.data << ", A's data: " << a.data << std::endl;
}

int main() {
    A a(10);
    B b(20);
    showA(a, b);
    showB(a, b);

    return 0;
}
```




### static 成员

- static 成员是类的静态成员，包括**静态数据成员**和**静态成员函数**。
- 静态成员属于类本身，而不是类的某个对象。
- 静态数据成员在所有对象之间共享，静态成员函数只能访问静态数据成员和其他静态成员函数。

#### 静态数据成员

- 静态数据成员是指在类中使用 `static` 关键字声明的数据成员，它属于类本身，而不是类的对象。
- **一个类只有一个**
- 静态数据成员在所有对象之间共享，可以通过类名访问。
- 静态成员变量其实就相当于一个全局变量，只不过它是属于类的（属于类的名空间的）。
  - 不使用全局变量的原因 ：避免名污染以及数据泄漏的问题

- 对于类的静态数据成员，需要在**类的定义外部**进行初始化，通常在类的实现文件中进行初始化。

  - 为什么需要在外部定义：如果在类的内部定义静态成员变量，当多次引用该类时，会导致重复定义，从而引发编译错误。

```cpp
class MyClass {
public:
    static int count; // 声明静态数据成员
    MyClass() { count++; } // 构造函数，每次创建对象时 count 加 1
};

int MyClass::count = 0; // 初始化静态数据成员
int main(){
    MyClass obj1, obj2, obj3;
    std::cout << "The number of objects is: " << MyClass::count << std::endl;
    // 输出 The number of objects is: 3
    return 0;
}

```

#### 静态成员函数

- 静态成员函数是指在类中使用 `static` 关键字声明的成员函数，它属于类本身，而不是类的对象。
  
- 静态成员函数**只能访问静态数据成员和其他静态成员函数**，不能访问非静态数据成员和非静态成员函数。
  - 为什么？因为静态成员函数**可以在不初始化类对象的情况下使用**，所以其不能调用类的其他非静态属性和函数。在使用上与全局的函数类似。

- 静态成员函数**可以通过类名调用，也可以通过对象调用。**
  - `A::f() | a.f()`

- 静态成员函数的声明：`static 返回类型 functionName();`

- 需要在类外对 static 成员变量进行初始化
  - 必须在类外部且不能够在 main 函数中进行初始化
  - 类似一个全局变量


```cpp
class MyClass {
public:
  	static int value;
    static void display() {
        std::cout << "This is a static member function." << std::endl;
    }

};

int MyClass::value = 10;
int main(){
    MyClass::display(); // 通过类名调用静态成员函数
    return 0;
}
```

