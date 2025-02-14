---
title: cpp-预编译
tags:
---

### C++ 中的预编译指令

<!--more-->

### C++ 中的预编译指令

预编译指令是C/C++编译器在编译源代码之前处理的指令。它们通常以 `#` 开头，用于指示编译器在实际编译代码之前进行某些操作。预编译指令主要用于文件包含、宏定义、条件编译等。

### 常见的预编译指令及其作用和使用方法

1. **`#include`**

   - **作用**：包含头文件的内容。

     ```cpp
     #include <header_file> // 包含标准库头文件
     #include "header_file" // 包含用户定义的头文件
     ```

     

2. **`#define`**

   - **作用**：定义宏，宏可以是常量或函数样式的代码片段。

     ```cpp
     #define PI 3.14159 // 定义常量宏
     #define SQUARE(*x*) ((x) * (x)) // 定义函数样式宏
     ```

     

3. **`#undef`**

   - **作用**：取消宏定义。

     ```cpp
     #undef PI // 取消之前定义的 PI 宏
     ```

     

4. **`#ifdef`**

   - **作用**：如果宏已定义，则编译其后的代码。

     ```cpp
     #ifdef MACRO_NAME
     // 如果 MACRO_NAME 已定义，则编译这部分代码
     #endif
     ```

     

5. **`#ifndef`**

   - **作用**：如果宏未定义，则编译其后的代码。

     ```cpp
     #ifndef MACRO_NAME
     // 如果 MACRO_NAME 未定义，则编译这部分代码
     #endif
     ```

     

6. **`#if`**

   - **作用**：根据条件表达式的值来决定是否编译其后的代码。

     ```cpp
     #if CONDITION
     // 如果 CONDITION 为真，则编译这部分代码
     #endif
     ```

     

7. **`#else`**

   - **作用**：与 `#if`、`#ifdef` 或 `#ifndef` 配合使用，提供条件编译的另一分支。

     ```cpp
     #if CONDITION
     // 如果 CONDITION 为真，则编译这部分代码
     #endif
     ```

     

8. **`#elif`**

   - **作用**：与 `#if` 配合使用，提供另一个条件分支。

     ```cpp
     #if CONDITION1
     // 如果 CONDITION1 为真，则编译这部分代码
     #elif CONDITION2
     // 否则，如果 CONDITION2 为真，则编译这部分代码
     #endif
     ```

     

9. **`#endif`**

   - **作用**：结束一个条件编译块。

     ```cpp
     #if CONDITION
     // 条件编译代码
     #endif
     ```

     

10. **`#pragma`**

    - **作用**：提供特定于编译器的指令。

      ```cpp
      #pragma once // 防止头文件被多次包含（编译器特定）
      ```

      

11. **`#error`**

    - **作用**：在编译时生成错误信息并终止编译。

      ```cpp
      #error "This is an error message"
      ```

      

12. **`#line`**

    - **作用**：改变编译器报告的行号和文件名。

      ```cpp
      #line 100 "new_file_name"
      ```

      

    
