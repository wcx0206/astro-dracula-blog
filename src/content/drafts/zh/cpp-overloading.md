---
title: cpp-overloading
tags:
---

### OverLoading 重载

<!--more-->

### 什么是重载

- 在 C++ 中，重载（Overloading）是指在同一个作用域内定义多个同名的函数或运算符，但它们的参数列表（参数的类型、数量或顺序）不同。重载允许同一个函数名或运算符在不同的上下文中具有不同的行为。
- 重载分为：函数重载和运算符重载

### 为什么要有重载

- 提高代码的可读性和可维护性：通过重载函数和运算符，可以使用**相同的函数名或运算符来处理不同类型的数据**。
- 实现**多态性**：重载是实现多态性的一种方式。通过重载，可以在同一个函数名下实现不同的功能，从而提高代码的灵活性。
- 简化代码：重载可以减少函数名的数量，避免为每种数据类型定义不同的函数名，从而简化代码。
- 增强类的功能：通过运算符重载，可以使用户定义的类型（类或结构体）像内置类型一样使用运算符进行操作，从而增强类的功能。

### 函数重载

- 函数重载是指在同一个作用域内定义多个同名的函数，但它们的参数列表（参数的类型、数量或顺序）不同。

```cpp
// 函数重载示例
void print(int i) {
    std::cout << "Integer: " << i << std::endl;
}
void print(double d) {
    std::cout << "Double: " << d << std::endl;
}
void print(const std::string& s) {
    std::cout << "String: " << s << std::endl;
}
void print(const char* s) {
    std::cout << "C-String: " << s << std::endl;
}
int main() {
    print(10);           // 调用 print(int)
    print(3.14);         // 调用 print(double)
    print("Hello");      // 调用 print(const char*)
    print(std::string("World")); // 调用 print(const std::string&)
}
```

> [!CAUTION]  
> 如果你传入的参数不符合任何一个重载的函数，还是会编译失败的


### 运算符重载

运算符重载（Operator Overloading）是 C++ 中的一种特性，它允许程序员为用户定义的类型（如**类或结构体**）重载运算符，使得这些类型的对象可以像内置类型一样使用运算符进行操作。

- 重载运算符的语法格式：`返回类型 operator 运算符(参数列表) { ... }`

```cpp
// 在类中重载运算符
class Complex {
public:
    double real, imag;
    Complex(double r = 0.0, double i = 0.0) : real(r), imag(i) {}
    // 重载 + 运算符 实现复数的加法
    Complex operator + (const Complex& obj) {
        return Complex(real + obj.real, imag + obj.imag);
    }
};

// 在struct中重载运算符
struct Point {
    double x, y;
    // 设置默认值 0.0
    Point(double x_val = 0.0, double y_val = 0.0) : x(x_val), y(y_val) {}
    // 重载 + 运算符 实现点的加法
    Point operator + (const Point& obj) const {
        return Point(x + obj.x, y + obj.y);
    }
    // 打印点的坐标
    void print() const {
        std::cout << "(" << x << ", " << y << ")" << std::endl;
    }
};

int main() {
    Complex c1(1.0, 2.0), c2(3.0, 4.0);
    Complex c3 = c1 + c2; // 调用重载的 + 运算符
    std::cout << "c3.real: " << c3.real << ", c3.imag: " << c3.imag << std::endl;
    // 输出 c3.real: 4, c3.imag: 6

    Point p1(1.0, 2.0), p2(3.0, 4.0);
    Point p3 = p1 + p2; // 调用重载的 + 运算符
    p3.print(); // 输出 (4, 6)
    return 0;
}
```



