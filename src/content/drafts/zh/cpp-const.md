---
title: cpp-const
tags:
---
### cpp 中的常量 && const

<!--more-->

### 常量变量（非指针）

- 常量变量是指在声明时被指定为 `const` 的变量，这意味着该变量的值在其生命周期内不能被修改。
- 常量变量必须在**声明时进行初始化**，否则会导致编译错误。

```cpp
#include <iostream>
int main(){
    const int value = 10; // 声明常量变量
    // value = 20; // 错误：不能修改常量变量的值
    const int numbers[] = {1, 2, 3, 4, 5}; // 声明常量数组
    // numbers[0] = 10; // 错误：不能修改常量数组的元素
    std::cout << "value = " << value << std::endl;
    return 0;
}
```

### 常量对象

- 常量对象是指在声明时被指定为 `const` 的对象，这意味着该对象的值在其生命周期内不能被修改。
- 常量对象**只能调用常量成员函数**（即在函数声明后带有 `const` 关键字的成员函数），这些函数保证不会修改对象的状态。
- 常量对象的主要作用是提供一种机制，确保对象的状态在其生命周期内不会被修改，从而提高代码的安全性和可维护性。

```cpp
class MyClass {
public:
    void display() const {
        std::cout << "This is a constant member function." << std::endl;  
    }
};

int main() {
    const MyClass obj; // 声明常量对象
    obj.display(); // 调用常量成员函数
    return 0;
}
```

### 常量成员函数

- 常量成员函数是指在函数声明后带有 `const` 关键字的成员函数，这意味着该函数不会修改对象的状态。常量成员函数**可以被常量对象调用**，但**不能修改对象的数据成员**。
- 常量成员函数**同样也可以被非常量对象调用**，但是不能修改对象的数据成员。
- 语法格式：`void functionName() const;`

```cpp
class MyClass {
public:
    void display() const {
        std::cout << "This is a constant member function." << std::endl;  
    }
};

int main() {
    const MyClass obj; // 声明常量对象
    obj.display(); // 调用常量成员函数
    return 0;
}

```

### 常量 & 指针 ？

#### 常量和指针的结合分为三种情况

- 指向常量的指针（常量指针）（Pointer to Constant）：指针指向的变量是常量，不能通过指针修改变量的值。但是**可以改变指针的指向**。

  - 指向常量的指针一定必须是常量指针

    ```cpp
    const int value = 21;
    int* p = &value // wrong
    ```

    

- （指针常量）（Constant Pointer）：指针本身是常量，**不能改变指向的对象**，但可以通过该指针修改对象的值。

- 指向常量的常量指针（Constant Pointer to Constant）：指针本身是常量，指向的变量也是常量，既不能改变指向的对象，也不能通过该指针修改对象的值。

#### 为什么会有常量与指针的结合呢？

- 常量指针 `CP`：常量指针用于确保指针在初始化后不会指向其他对象。当指针需要始终指向同一个对象时，可以使用常量指针，确保指针不会被重新赋值。
- 指向常量的指针 `P2C`：因为在实际开发中，我们有时候需要通过指针来访问某些数据，但是又不希望通过指针来修改这些数据，这时候就需要使用指向常量的指针。
- 指向常量的常量指针 `CP2C`：当需要**确保指针和指针指向的对象都不会被修改时**，可以使用指向常量的常量指针。

#### 语法&&示例

- 指向常量的指针（常量指针）：`const int* ptr1 = &value1;`
- 指针常量（指针本身类型是常量）：`int* const ptr2 = &value1;`
- 指向常量的常量指针：`const int* const ptr3 = &value1;`

```cpp
#include <iostream>

int main() {
    int value1 = 10;
    int value2 = 20;
    // 指向常量的指针
    const int* ptr1 = &value1; 
    // *ptr1 = 30; // 错误：不能通过指向常量的指针修改对象的值
    ptr1 = &value2; // 可以改变指针本身

    // 指针常量
    int* const ptr2 = &value1;
    *ptr2 = 30; // 可以通过常量指针修改对象的值
    // ptr2 = &value2; // 错误：不能改变常量指针本身

    // 指向常量的常量指针
    const int* const ptr3 = &value1;
    // *ptr3 = 40; // 错误：不能通过指向常量的常量指针修改对象的值
    // ptr3 = &value2; // 错误：不能改变指向常量的常量指针本身

    return 0;
}
```

### 常量表达式（constexper 关键字）

- `constexpr` 关键字是 C++11 引入的一个关键字，用于**定义常量表达式**。常量表达式是在**编译时**就能确定其值的表达式。
- `constexpr` 可以用于变量、函数和构造函数，表示这些**变量、函数或构造函数的值在编译时就能确定**。

#### 为什么要使用 `constexpr` 关键字？

- 提高性能：通过在**编译时计算常量表达式，可以减少运行时的计算量**，从而提高程序的性能。编译时计算的结果可以直接**嵌入**到生成的代码中，避免了运行时的开销。
- 增强代码的安全性：使用 constexpr 可以确保某些值在编译时就能确定，从而避免运行时的错误。例如，可以使用 constexpr 定义数组的大小，确保数组的大小在编译时就能确定，避免运行时的越界错误。
- 可读性、可维护性

#### 应用于变量

```cpp
#include <iostream>
constexpr int max_value = 100;

int main() {
    std::cout << "Max value: " << max_value << std::endl; // 输出: Max value: 100
    return 0;
}
```

#### 应用于函数

- 函数体中**只能包含常量表达式**。
- 函数的返回类型和参数类型必须是**字面值类型**（Literal Type）。

```cpp
#include <iostream>
constexpr int factorial(int n) {
    return (n <= 1) ? 1 : (n * factorial(n - 1));
}
int main() {
    constexpr int result = factorial(5); // 常量表达式
    std::cout << "Factorial of 5: " << result << std::endl; 
    // 输出: Factorial of 5: 120
    return 0;
}
```

#### 应用于构造函数

- constexpr 构造函数是指在编译时就能初始化对象的构造函数。
- 使用constexpr 关键字定义的构造函数必须满足以下条件：
  - **构造函数体中只能包含常量表达式**。
  - 类的**所有成员变量必须是字面值类型**（Literal Type 可以在编译时确定其值的类型）。

```cpp
#include <iostream>
class Point {
public:
    constexpr Point(int x = 0, int y = 0) : x_(x), y_(y) {}
    constexpr int getX() const { return x_; }
    constexpr int getY() const { return y_; }
private:
    int x_;
    int y_;
};
int main() {
    constexpr Point p(3, 4); // 常量表达式对象
    std::cout << "Point: (" << p.getX() << ", " << p.getY() << ")" << std::endl;
    // 输出: Point: (3, 4)
    return 0;
}
```

### enum 枚举

- 枚举（enum）是一种用户定义的数据类型，它由一组命名的**常量**组成。枚举类型用于表示一组相关的值，通常用于提高代码的可读性和可维护性。
- 对于一些涉及到类别的变量，我们可以使用枚举类型来定义。

```cpp
#include <iostream>

// 定义枚举类型 Color
enum Color {
    RED,    // 默认值为 0
    GREEN,  // 默认值为 1
    BLUE    // 默认值为 2
};
// 定义枚举类型 Day
enum Day {
    MONDAY = 1,  // 显式指定值为 1
    TUESDAY,     // 默认值为 2
    WEDNESDAY,   // 默认值为 3
    THURSDAY,    // 默认值为 4
    FRIDAY,      // 默认值为 5
    SATURDAY,    // 默认值为 6
    SUNDAY       // 默认值为 7
};

int main() {
    // 使用枚举类型 Color
    Color myColor = RED;
    std::cout << "My color is: " << myColor << std::endl; // 输出: My color is: 0
    // 使用枚举类型 Day
    Day today = FRIDAY;
    std::cout << "Today is: " << today << std::endl; // 输出: Today is: 5
    return 0;
}
```

#### 强类型枚举

C++11 引入了强类型枚举，允许显式指定枚举的底层类型。强类型枚举提供了更强的类型安全性，枚举常量不会隐式转换为整数类型。

```cpp
// 定义强类型枚举类型 Color，底层类型为 int
enum class Color : int {
    RED,
    GREEN,
    BLUE
};

// 定义强类型枚举类型 Day，底层类型为 short
enum class Day : short {
    MONDAY = 1,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
};
```

### const_cast

- const_cast 是 C++ 中的一种类型转换运算符，用于在类型转换过程中添加或移除 const 或 volatile 修饰符。它主要用于修改指针或引用的常量性，但不能用于改变对象的底层常量性。
- 与 static_cast 和 dynamic_cast 不同，const_cast 主要用于添加或移除 const 或 volatile 修饰符，而不是进行类型转换。


- 语法：`const_cast<new_type>(expression)` 

```cpp
#include <iostream>

void modifyValue(int* ptr) {
    *ptr = 42;
}

int main() {
    const int value = 10;
    const int* constPtr = &value; // 常量指针 指向的是常量

    // 使用 const_cast 移除 const 修饰符
    int* nonConstPtr = const_cast<int*>(constPtr);

    // 修改值
    modifyValue(nonConstPtr);

    std::cout << "Modified value: " << *nonConstPtr << std::endl;

    return 0;
}

```