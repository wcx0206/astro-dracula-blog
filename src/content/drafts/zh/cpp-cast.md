---
title: cpp-cast
tags:
---

### C++ 中的类型转换 cast

<!--more-->

### 为什么需要这种 cast 进行类型转换？

- 很多情况下我们需要进行类型转化，但是这种类型转化是不能由编译器“隐式”进行的，所以我们需要一种安全的显式转化类型的方式
- 在C++中，使用类型转换（cast）是为了**显式地**将一个数据类型转换为另一个数据类型，以便在不同类型之间进行操作时**避免编译错误或未定义行为**（安全性）


### static_cast

- `static_cast` 用于在**编译时执行显式类型转换**。它可以用于多种类型转换，包括**基本数据类型**之间的转换、**指针类型之间的转换**、以及**类层次结构**中的上行和下行转换。
- 用途
  - 基本数据类型之间的转换。
  - 指针类型之间的转换。
  - 类层次结构中的上行和下行转换，即**父类和子类之间转换**
    - **子类向父类转化是安全的**，但是父类向子类转化**不会提供检查**
    - 将父类转化为子类后访问子类的成员是不安全的会触发 UDB
      - 需要解决这个问题就需要使用更加安全的 `dynamic_cast`
  - **枚举类型和整数类型之间的转换**

- 用法

  ```cpp
  double d = 3.14;
  int i = static_cast<int>(d);  // double 转 int
  cout << i << endl;  //3
   
  // 类层次转换
  Derived* derived = new Derived();
  Base* base = static_cast<Base*>(derived);      // 向上转换（安全）
  Derived* d2 = static_cast<Derived*>(base);     // 向下转换（不安全）
  ```

  

### dynamic_cast

- `dynamic_cast` 用于在**运行时执行类型安全的向下转换**（从基类指针或引用转换为派生类指针或引用）。它主要用于**多态类型转换**，确保转换的安全性。

- 如果转换失败，指针类型会返回 `nullptr`，引用类型会抛出 `std::bad_cast` 异常。

- **使用 dynamic_cast 进行转化的操作数一定是多态的，必须具有虚函数**

- 因为是在运行时检查，有**性能开销**

- 用途
  - **多态类型转换**：在类层次结构中进行向下转换，确保转换的安全性。

- 使用

  - ```cpp
    class Base {
        virtual void foo() {}  // 必须有虚函数
    };
    class Derived : public Base { };
    
    Base* base = new Derived;
    // 安全的向下转换，失败返回nullptr
    Derived* derived = dynamic_cast<Derived*>(base);
    if(derived) {
        // 转换成功
    }
    ```

    


### const_cast

- `const_cast` 用于在类型转换过程中**添加或移除 const 或 volatile 修饰符**。它主要用于**修改指针或引用的常量性**，但**不能用于改变对象的底层常量性**。
- 用途
  - 移除 const 修饰符：将指向常量的指针或引用转换为指向非常量的指针或引用。
  - 通过去除 const 修饰符，可以在 const 成员函数中 修改成员变量的值
  - 添加 const 修饰符：将指向非常量的指针或引用转换为指向常量的指针或引用（虽然这种用法不常见）。
  
- 使用：

  ```cpp
  const int constant = 21;                    // constant 本身是 const
  const int* const_p = &constant;             // const_p 指向 const 数据
  int* modifiable = const_cast<int*>(const_p); // 只去除常量指针const_p 的 const 属性
  // 现在这个指针可以指向非常量
  int value = 1;
  modifiable = &value;
  cout << *modifiable << endl;  // 1
  
  class A {
  private:
      int x;
  public:
      A(int val) : x(val) {}
      
      void modifyX() const {
          // 在 const 成员函数中修改 x
          (const_cast<A*>(this))->x = 100;  // 去除 this 指针的 const 属性
      }
  };
  ```

### reinterpret_cast

- 最底层的转换，仅仅是重新解释比特模式。所以也是最危险的转换方式
- 转换指针和整数
- 不同类型指针间的转换

```cpp
int* p = new int(65);
char* ch = reinterpret_cast<char*>(p);  // 重新解释内存
cout << *ch << endl; // A
uintptr_t addr = reinterpret_cast<uintptr_t>(p);  // 指针转整数
cout << addr << endl; // 5114977088
```

