---
title: cpp-Modules
tags:
---

### C++ 中通过 Modules 模块来对代码进行组织

<!--more-->

### 什么是 Modules 

C++20 引入了模块（Modules）这一特性，用于替代**传统的头文件和源文件的组织方式**。模块提供了一种更高效、	和编译方式，减少了编译时间和依赖管理的复杂性。

### Modules 的基本概念

1. **模块声明**：使用 `module` 关键字声明一个模块。

2. **导出声明**：使用 `export` 关键字导出模块中的类、函数、变量等，使其可以被其他模块使用。

3. **导入模块**：使用 `import` 关键字导入其他模块。

4. **参考的文件结构**：

   ```
   project/
   ├── main.cpp
   ├── math_module.cpp
   └── math_module.ixx
   ```

### Modules 的基本组成

#### xxx_module.ixx

- 这是模块接口文件，定义并导出模块中的类、函数和全局变量。
- 形式和作用上比较类似先前的 .h 文件
- 语法：`export module xxx`

```cpp
export module math_module;

export class Calculator {
public:
    Calculator();
    int add(int a, int b);
    int subtract(int a, int b);
};

export int global_variable = 42;

export int multiply(int a, int b);
```

#### xxx_module.cpp

- 这是模块实现文件，实现模块接口中声明的类、函数和全局变量.
- 这个与普通的源文件意义相同，同样都是 `.cpp`
- 语法：`module xxx` 
  - 这里的 xxx 需要是上面定义过的 Moudle

```cpp
module math_module;

Calculator::Calculator() {}

int Calculator::add(int a, int b) {
    return a + b;
}

int Calculator::subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}
```

#### xxx.cpp（需要使用模块的地方，例如 main.cpp）

- 导入并使用模块中的类、函数和全局变量。
- 语法：`import xxx`

```cpp
import math_module;
#include <iostream>

int main() {
    Calculator calc;
    std::cout << "Add: " << calc.add(3, 4) << std::endl;
    std::cout << "Subtract: " << calc.subtract(10, 5) << std::endl;
    std::cout << "Multiply: " << multiply(6, 7) << std::endl;
    std::cout << "Global Variable: " << global_variable << std::endl;
    return 0;
}
```

