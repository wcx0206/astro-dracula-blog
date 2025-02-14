---
title: cpp-type
tags:
---

### 有关于 cpp 中类型的内容

<!--more-->

### 类型推断关键字

在C++中，类型推断关键字 `auto` 和 `decltype` 提供了更灵活和简洁的方式来声明变量和推断类型，解决了手动指定类型的繁琐和易错问题。

### auto

#### 作用

`auto` 关键字用于自动推断变量的类型。编译器会根据变量的初始化表达式来确定其类型。

#### 解决的问题

`auto` 关键字减少了手动指定类型的繁琐，特别是在类型复杂或不易记忆的情况下。此外，它提高了代码的可读性和可维护性。

#### 如何使用

使用 `auto` 关键字声明变量时，必须对其进行初始化，以便编译器能够推断出变量的类型。

#### 具体语法

```cpp
auto variable_name = initialization_expression;
```

#### 示例

```cpp
#include <iostream>
#include <vector>

int main() {
    auto x = 5; // x 的类型是 int
    auto y = 3.14; // y 的类型是 double
    auto z = "Hello"; // z 的类型是 const char*

    std::vector<int> vec = {1, 2, 3, 4, 5};
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " "; // it 的类型是 std::vector<int>::iterator
    }
    return 0;
}
```



### decltype

#### 作用

`decltype` 关键字**用于查询表达式的类型**。它**返回表达式的类型**而不实际计算表达式。

#### 解决的问题

`decltype` 关键字允许程序员在**不知道表达式类型的情况下获取其类型**，特别是在模板编程和泛型编程中非常有用。

#### 如何使用

使用 `decltype` 关键字时，只需将其应用于一个表达式，编译器会推断并返回该表达式的类型。

#### 具体语法

```cpp
decltype(expression) variable_name;
```

#### 示例

```cpp
#include <iostream>
int main() {
  int a = 5;
  double b = 3.14;
  decltype(a) x = a; // x 的类型是 int
  decltype(b) y = b; // y 的类型是 double
  auto sum = a + b; // sum 的类型是 double
  decltype(sum) result = sum; // result 的类型是 double
  std::cout << "x: " << x << ", y: " << y << ", result: " << result << std::endl;
  return 0;

}
```



### 对象类型的判断

//todo

- 运行时判断

- 编译时判断
  - 模版类、改写


```c++
//运行时判断，如方法覆盖等情形
int i;
if(typeid(i) == typeid(int) )
    cout << "i is int" << endl;


//编译时判断，如模板类和改写等情形
template<class T>
void func(T t ){
    cout << "i is not int" << endl ;
}
template<> void func<int>(int i){//特化
    cout << "i is int" << endl ;
}
int i;
func(i)
```
