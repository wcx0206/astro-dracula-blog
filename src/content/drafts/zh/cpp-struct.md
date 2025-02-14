---
title: cpp-struct
tags:
---

### Struct in Cpp 结构体

<!--more-->
### 什么是结构体

结构体是一种用户自定义的数据类型，主要是将一些有关联的同类型和非同类型数据组合在一起。



### struct 的内存对齐原理和规则

1. **基本对齐规则**:

   - 每个成员相对于结构体起始位置的偏移量**必须是该成员大小的整数倍**
     - 0 可以是任何数的整数倍，所以第一个元素前不会出现 padding
   - 结构体总大小**必须是最大对齐数的整数倍**
   - 系统默认对齐系数通常是编译器指定的，可通过 `#pragma pack(n)` 修改

2. 示例

   1. 普通排列

      ```cpp
      struct Example1 {
          char a;     // 1字节，偏移量0
          int b;      // 4字节，偏移量4（需要4字节对齐）
          char c;     // 1字节，偏移量8
      };              // 总大小12字节（需要4字节对齐）
      
      /*
      内存布局:
      0   1   2   3   4   5   6   7   8   9   10  11
      a   -   -   -   b   b   b   b   c   -   -   -
      -: 填充字节 padding
      */
      ```

      

   2. 紧凑排列

      ```cpp
      #pragma pack(1)  // 设置对齐系数为1
      struct Example2 {
          char a;     // 1字节，偏移量0
          int b;      // 4字节，偏移量1
          char c;     // 1字节，偏移量5
      };              // 总大小6字节
      #pragma pack()
      
      /*
      内存布局:
      0   1   2   3   4   5   
      a   b   b   b   b   c
      无填充字节
      */
      ```

   3. 不同类型组合

      ```cpp
      struct Example3 {
          double a;   // 8字节，偏移量0
          char b;     // 1字节，偏移量8
          int c;      // 4字节，偏移量12
      };              // 总大小16字节（8字节对齐）
      
      /*
      内存布局:
      0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15
      a   a   a   a   a   a   a   a   b   -   -   -   c   c   c   c
      -: 填充字节
      */
      ```

      

### [与 struct 相关的其余类型](./cpp-type#tuple)



### 结构体与类的区别

- 默认访问权限：结构体默认访问权限是 `public`，类默认访问权限是 `private`。
- 继承方式：结构体默认继承方式是 `public`，类默认继承方式是 `private`。







### 权限管理

- 结构体默认的访问权限是 `public`，可以通过 `public`、`protected` 和 `private` 关键字进行权限管理。（与类类似）
  - `public`：公有成员，可以在结构体的内部和外部访问。
  - `protected`：受保护成员，可以在结构体的内部和派生结构体中访问，不能在结构体外部访问。
  - `private`：私有成员，只能被结构体的成员函数和友元函数访问，不能被结构体外部的代码访问
- 结构体的默认继承方式是 `public`，继承的语法为 `struct B : A`。（B 继承 A）

### 构造函数与初始化

- 结构体可以定义构造函数，用于初始化结构体的成员变量。
- 如果没有定义构造函数，结构体会有一个默认的无参构造函数。
- 结构体的构造函数可以有默认参数，也可以重载多个构造函数。
- 在初始化的时候，可以使用列表初始化的方式进行初始化。
- 语法格式：`Point(int x, int y) : x(x), y(y) {}`
- 创建结构体的两种方式：
  - `Point p1;`：创建的是结构体对象
  - `Point* p2 = new Point();`：创建的是结构体指针

```cpp
struct Point {
    int x;  //成员变量
    int y;

    // 默认构造函数
    Point() : x(0), y(0) {}
    // 有参构造函数
    Point(int x, int y) : x(x), y(y) {}
    // 构造函数重载
    Point(int x) : x(x), y(0) {}
    // 拷贝构造函数
    Point(const Point& p) : x(p.x), y(p.y) {

    }
    // 移动拷贝构造函数
    Point(Point&& p) : x(p.x), y(p.y) {
        p.x = 0;
        p.y = 0;
    }
    // 析构函数
    ~Point() {}
};

int main() {
    Point p1;
    std::cout << "Point 1: " << p1.x << ", " << p1.y << std::endl;
    Point p2(10, 20);
    std::cout << "Point 2: " << p2.x << ", " << p2.y << std::endl;
    Point p3(30);
    std::cout << "Point 3: " << p3.x << ", " << p3.y << std::endl;
}

```

### 结构体的成员函数

- 成员函数可以在结构体内部声明和定义，也可以在内部声明在外部定义。
- 内联成员函数：内联成员函数的定义与普通成员函数类似，只是定义在结构体或类的内部。
- 常量成员函数：常量成员函数使用 const 关键字声明，表示该函数不会修改结构体的成员变量.
  - 定义常量成员函数：`返回类型 函数名() const {}` 
- 静态成员函数：静态成员函数使用 static 关键字声明，表示该函数不依赖于结构体的实例，可以直接通过结构体名调用。
  - 定义静态成员函数：`static 返回类型 函数名() {}`
  - 静态成员函数不能访问非静态成员变量，只能访问静态成员变量。
  - 静态成员函数不能使用 `this` 指针。
  - 静态成员变量需要在结构体外部进行定义和初始化。语法为：`类型 结构体名::静态成员变量 = 初始值;`
  - 静态成员函数可以通过 `结构体名::函数名()` 的方式调用。
- 结构体的成员函数可以进行重载。

```cpp
#include <iostream>
#include <string>


// 定义结构体
struct Rectangle {
    int width;
    int height;
    static int count; // 静态成员变量
    static int getCount() { return count; } // 静态成员函数 

    // 在结构体内部定义成员函数
    int area() const {
        return width * height;
    }
    Rectangle(int w, int h) : width(w), height(h) {
        count++;
    }

    // 在结构体内部声明成员函数
    void setDimensions(int w, int h);
};

// 在结构体外部定义成员函数
void Rectangle::setDimensions(int w, int h) {
    width = w;
    height = h;
}

// 在类定义外部提供静态成员变量的定义和初始化
int Rectangle::count = 0;

int main() {

    // 使用成员函数
    Rectangle rect(0,0);
    rect.setDimensions(10, 20);
    std::cout << "Rectangle count: " << Rectangle::getCount() << std::endl;
    std::cout << "Rectangle area: " << rect.area() << std::endl;

    return 0;
}
```

### 结构体的嵌套

- 嵌套结构体的定义
- 嵌套结构体的访问

### 结构体的指针和引用

- 结构体指针的使用
- 结构体引用的使用
- 结构体指针和引用的初始化

### 结构体的动态内存分配

- 使用 `new` 和 `delete` 进行动态内存分配
- 动态数组的分配和释放

### 结构体的运算符重载

- 重载赋值运算符
- 重载比较运算符
- 重载输入输出运算符

### 结构体的高级特性

- 结构体的继承
- 结构体的多态
- 结构体的模板化

### typedef 与 using

#### typedef

- typedef 关键字用于为现有的数据类型定义一个新的名称（别名）。可以将某些较长的类型名、结构体名、类名进行简化。
- 语法格式：`typedef 原类型名 新类型名;`
- 定义函数指针：`typedef 返回类型 (*新类型名)(参数列表);`

```cpp
typedef struct Node{
    int data;
    struct Node *next;
}Node_t;

typedef struct Node Node_x;
// 此时 Node_x 与 Node_t 都是 Node 结构体的别名

typedef int (*FuncPtr)(int, int);
FuncPtr add = [](int a, int b) { return a + b; };
int result = add(2, 3);
```

#### using

- using 关键字在 C++11 中引入，用于定义类型别名，语法更简洁，并且在定义模板别名时更为强大。
- using 关键字可以**用于定义模板(包含`T`)别名**，而 typedef 不能。
- 语法格式：`using 新类型名 = 原类型名;`

```cpp
#include <iostream>
#include <vector>

// 使用 typedef 定义别名
typedef unsigned long ulong;
typedef int* IntPtr;
typedef int (*FuncPtr)(int, int);

// 使用 using 定义别名
using ulong = unsigned long;
using IntPtr = int*;
using FuncPtr = int(*)(int, int);

// 使用 using 定义模板别名
template <typename T>
using Vec = std::vector<T>;

int main() {
    // 使用 typedef 定义的别名
    ulong largeNumber = 1000000;
    std::cout << "Large Number: " << largeNumber << std::endl;

    int a = 10;
    IntPtr pInt = &a;
    std::cout << "Pointer Value: " << *pInt << std::endl;

    FuncPtr add = [](int a, int b) { return a + b; };
    int result = add(2, 3);
    std::cout << "Add Result: " << result << std::endl;

    // 使用 using 定义的模板别名
    Vec<int> numbers = {1, 2, 3, 4, 5};
    for (int num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;

    return 0;
}
```
