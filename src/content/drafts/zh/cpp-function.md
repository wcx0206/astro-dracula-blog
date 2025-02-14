---
title: cpp-function
tags:
---

## Function in Cpp

<!--more-->

### 函数指针

- 函数指针是指向函数的指针，**它可以存储函数的地址**，从而允许在程序运行时动态调用函数。
- 函数指针的声明和使用方式与普通指针类似，只是需要指定**函数的返回类型和参数列表**。
- 函数指针通常用于实现回调函数、事件处理、函数指针数组等场景。
- 语法：`return_type (*pointer_name)(parameter_types) = function_name;`

```cpp
#include <iostream>
int add(int a, int b) {
    return a + b;
}
int main(){
    // 声明了一个函数指针变量 func，指向 add 函数
    int (*func)(int, int) = add; 
    std::cout << "Sum: " << func(3, 4) << std::endl;  // 输出：Sum: 7
    return 0;
}

```

### Lambda Expression

Lambda 表达式是 C++11 引入的一种特性，用于定义匿名函数。Lambda 表达式可以在代码中定义并立即使用，而不需要显式地声明一个函数。它们非常适合用于短小的、一次性的函数，尤其是在需要传递函数作为参数的情况下

#### Lambda 表达式的语法

Lambda 表达式的基本语法如下：

- **capture**：捕获列表，用于捕获外部作用域中的变量。可以是按值捕获（`[=]`）或按引用捕获（`[&]`）。同样也可以使用 `this` 指针捕获当前对象。
- **parameters**：参数列表，与普通函数的参数列表类似。
- **return_type**：返回类型，可以省略，如果编译器可以推断出返回类型。
- **函数体**：Lambda 表达式的函数体。

```cpp
[capture](parameters) -> return_type {
    // 函数体
}
```

#### 示例 1：基本的 Lambda 表达式

```cpp
#include <iostream>
int main() {
    auto add = [](int a, int b) -> int {
        return a + b;
    };
    std::cout << "Sum: " << add(3, 4) << std::endl;  // 输出：Sum: 7
    return 0;
}
```

#### 示例 2：捕获外部变量

```cpp
#include <iostream>
int main() {
    int x = 10;
    int y = 20;
    // 按值捕获外部变量
    auto add = [x, y]() -> int {
        return x + y;
    };
    std::cout << "Sum: " << add() << std::endl;  // 输出：Sum: 30
    return 0;
}
```

#### 示例 3：按引用捕获外部变量

```cpp
#include <iostream>

int main() {
    int x = 10;
    int y = 20;
    // 按引用捕获外部变量
    auto add = [&x, &y]() -> int {
        return x + y;
    };
    x = 15;
    y = 25;
    std::cout << "Sum: " << add() << std::endl;  // 输出：Sum: 40
    return 0;
}
```

#### 示例 4：使用 `this` 捕获当前对象

```cpp
#include <iostream>
#include <functional>
class MyClass {
private:
    int value;

public:
    MyClass(int val) : value(val) {}
    void printA(){
        std::cout << "A" << std::endl;
    }
    void printValue() const {
        // 使用 this 捕获当前对象
        auto lambda = [this]() {
            // 调用成员函数
            this->printA();
            std::cout << "Value: " << this->value << std::endl;
        };
        // 调用 lambda 表达式
        lambda();
    }
};

int main() {
    MyClass obj(10);
    // 调用成员函数，使用 lambda 表达式捕获 this 指针
    obj.printValue(); // 输出：A Value: 10
    return 0;
}
```

#### 示例 5：在算法中使用 Lambda 表达式

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> vec = {5, 2, 8, 1, 3};
    // 使用 Lambda 表达式进行排序
    std::sort(vec.begin(), vec.end(), [](int a, int b) {
        return a < b;  // 升序排序
    });
    // 输出排序后的结果
    for (int num : vec) {
        std::cout << num << " ";
    }
    std::cout << std::endl;  // 输出：1 2 3 5 8
    return 0;
}
```

### Function

- `std::function` 是一个通用的、多态的函数包装器，可以存储、复制和调用任何可调用目标（如函数、Lambda 表达式、函数对象和成员函数）
- 语法：`std::function<return_type(parameter_types)> = callable;`

#### 使用场景

1. **回调函数**：在异步编程或事件驱动编程中，经常需要传递回调函数。`std::function` 可以用来存储和调用这些**回调函数**。
2. **信号和槽机制**：在 GUI 编程或其他需要信号和槽机制的场景中，可以使用 `std::function` 来存储和**调用槽函数**。
3. **通用算法**：在实现通用算法时，可以使用 `std::function` 来存储和调用用户提供的自定义操作函数。
4. **策略模式**：在策略模式中，可以使用 `std::function` 来存储和调用不同的策略函数，从而实现算法的动态切换。
5. **事件处理**：在事件驱动的编程模型中，可以使用 `std::function` 来存储和调用事件处理函数。
6. **函数对象的多态性**：通过 `std::function`，可以实现函数对象的多态性，使得不同类型的函数对象可以通过统一的接口进行调用。

#### 存储和调用普通函数

```cpp
#include <iostream>
#include <functional>

// 普通函数
int add(int a, int b) {
    return a + b;
}

int main() {
    // 使用 std::function 存储普通函数
    std::function<int(int, int)> func = add;
    std::cout << "Sum: " << func(3, 4) << std::endl;  // 输出：Sum: 7

    return 0;
}
```

#### 存储和调用 Lambda 表达式

```cpp
#include <iostream>
#include <functional>

int main() {
    // 使用 std::function 存储 Lambda 表达式
    std::function<int(int, int)> lambda = [](int a, int b) {
        return a + b;
    };
    std::cout << "Sum: " << lambda(5, 6) << std::endl;  // 输出：Sum: 11

    return 0;
}
```

#### 结合 [`std::bind`](#bind) 使用

```cpp
#include <iostream>
#include <functional>

// 普通函数
int add(int a, int b) {
    return a + b;
}

int main() {
    // 使用 std::bind 绑定函数和参数
    auto boundFunc = std::bind(add, 10, std::placeholders::_1);

    // 使用 std::function 存储绑定的函数
    std::function<int(int)> func = boundFunc;
    std::cout << "Result: " << func(5) << std::endl;  // 输出：Result: 15

    return 0;
}
```

### 函数对象

#### 什么是函数对象

在 C++ 中，函数对象（Function Object），也称为仿函数（Functor），是一个行为类似于函数的对象。函数对象是通过**重载 `operator()` 运算符来实现的**，这使得对象可以像函数一样被调用。函数对象通常用于需要传递可调用对象的场景，例如标准库算法、回调函数等。

#### 函数对象的特点

1. **状态**：**函数对象可以保存状态（成员变量**），这使得它们比普通函数更灵活。
2. **可调用**：通过**重载 `operator()` 运算符**，函数对象可以像函数一样被调用。
3. **类型安全**：函数对象有明确的类型，可以在编译时进行类型检查。
4. **高效**：函数对象的调用通常**可以被内联**，从而提高性能。

#### 函数对象的定义

函数对象通常是通过定义一个类，并在类中重载 `()` 即函数调用运算符来实现的。

在这个示例中，`Adder` 类定义了一个函数对象，它保存了一个状态 `value_`，并通过重载 `operator()` 运算符实现了可调用性。创建 `Adder` 对象时，可以传递一个初始值，然后在调用时将这个值与传入的参数相加。

```cpp
#include <iostream>

// 定义一个函数对象类
class Adder {
public:
    Adder(int value) : value_(value) {}

    // 重载 operator() 运算符
    int operator()(int x) const {
        return x + value_;
    }

private:
    int value_;
};

int main() {
    Adder add5(5);  // 创建一个函数对象，内部保存状态 value_ = 5
    std::cout << "Result: " << add5(10) << std::endl;  // 调用函数对象，输出：Result: 15

    return 0;
}
```

#### 函数对象的应用场景

1. **标准库算法**：C++ 标准库中的许多算法（如 `std::sort`, `std::for_each` 等）可以接受函数对象作为参数，以实现自定义的操作。
2. **回调函数**：在需要回调函数的场景中，可以使用函数对象来保存状态和实现回调逻辑。
3. **策略模式**：在策略模式中，可以使用函数对象来实现不同的策略，并在运行时动态切换策略。
4. **事件处理**：在事件驱动的编程模型中，可以使用函数对象来处理不同的事件。

### bind

1. `std::bind` 是一个函数适配器，用于将**函数与其参数**绑定，**生成一个新的可调用对象**。
2. 这个新的可调用对象可以存储并在以后调用时使用绑定的参数

#### `std::bind` 的作用

- **绑定参数**：将函数的**部分**或全部参数绑定到特定的值，相当于可以**固定函数的某个参数**
- **生成可调用对象**：生成一个新的可调用对象，该对象可以在以后调用时使用绑定的参数。
- **简化函数调用**：通过绑定参数，可以简化函数调用，特别是在需要多次调用相同函数但参数不同的情况下。

#### `std::bind` 的语法

- `callable`：可以是普通函数、成员函数、函数对象或 Lambda 表达式。
- `arg1, arg2, ..., argN`：要绑定的参数，可以是具体的值或占位符（如 `std::placeholders::_1`）。

```cpp
#include <functional>

auto boundFunc = std::bind(callable, arg1, arg2, ..., argN);
```

#### 绑定普通函数的参数

下面的示例中我们绑定 add 函数的第一个参数为 10，然后设置后面的参数为占位符进行绑定。这样再后续使用这个绑定的函数中我们只需要传入第二个参数，第一个参数的值被绑定为10

```cpp
#include <iostream>
#include <functional>

// 普通函数
int add(int a, int b) {
    return a + b;
}

int main() {
    // 使用 std::bind 绑定函数和参数
    auto boundFunc = std::bind(add, 10, std::placeholders::_1);

    // 调用绑定的函数
    std::cout << "Result: " << boundFunc(5) << std::endl;  // 输出：Result: 15

    return 0;
}
```

#### 绑定成员函数的参数

```cpp
#include <iostream>
#include <functional>

class MyClass {
public:
    void printSum(int a, int b) const {
        std::cout << "Sum: " << a + b << std::endl;
    }
};

int main() {
    MyClass obj;

    // 使用 std::bind 绑定成员函数
    auto boundFunc = std::bind(&MyClass::printSum, &obj, std::placeholders::_1, std::placeholders::_2);

    // 调用绑定的成员函数
    boundFunc(3, 4);  // 输出：Sum: 7

    return 0;
}
```

#### 绑定函数对象的参数

```cpp
#include <iostream>
#include <functional>

// 函数对象
struct Adder {
    int operator()(int a, int b) const {
        return a + b;
    }
};

int main() {
    Adder adder;

    // 使用 std::bind 绑定函数对象
    auto boundFunc = std::bind(adder, 10, std::placeholders::_1);

    // 调用绑定的函数对象
    std::cout << "Result: " << boundFunc(5) << std::endl;  // 输出：Result: 15

    return 0;
}
```



### 内联 inline

- 在C++中，内联（inline）是一个关键字，用于提示编译器**将函数的代码直接插入到调用该函数的地方**，而不是进行常规的函数调用。
- 这可以减少函数调用的开销，提高程序的执行效率，特别是对于那些**频繁调用的小函数**。
- Lambda 表达式本质上是一个匿名函数对象，编译器通常会**自动将其内联**

#### 使用内联函数的步骤

1. 使用`inline`关键字定义函数。
2. 编译器会尝试将函数体直接插入到每个调用点。

```cpp
#include <iostream>

// 使用inline关键字定义内联函数
inline int add(int a, int b) {
    return a + b;
}

// 内联函数对象中重载的函数
class Multiply {
public:
    Multiply(int factor) : factor_(factor) {}

    inline void operator()(int& x) const {
        x *= factor_;
    }

private:
    int factor_;
};

int main() {
    int result = add(3, 4);
    std::cout << "Result: " << result << std::endl;
    return 0;
}
```

#### 注意事项：

- 内联只是一个建议，编译器可能会忽略这个建议。
- 内联函数通常定义在头文件中。
- 过于复杂或递归的函数不适合使用内联。

通过使用内联函数，可以在某些情况下提高程序的性能，但需要谨慎使用，以避免代码膨胀。



