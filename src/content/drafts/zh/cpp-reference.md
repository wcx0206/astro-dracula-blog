---
title: cpp-reference
tags:
---

## C++ Reference 引用

<!--more-->

### 什么是 C++ 中的引用（这里的例子是左值引用）

- **声明引用**：使用 `&` 符号来声明引用。

- 引用（Reference）在 C++ 中的实质是**一个变量的别名**，它提供了一种**间接访问变量的方式**。
- 引用本身并不占用额外的内存空间，而是直接指向被引用的变量。
- 简单的来说 C++ 中的引用可以类似的看作为一种特殊的常量指针
- 引用的特点
  1. **必须初始化**：引用在声明时必须进行初始化。
  2. **不可重新绑定**：一旦引用被初始化，它就不能被重新绑定到另一个对象。
  3. **不占用额外内存**：引用本质上是一个别名，不占用额外的内存。

### 引用的使用

#### 访问并修改对象（变量）的值

有关引用的左值与右值以及引用与变量之间的绑定关系，参考本文下面的具体章节内容

```cpp
int main() {
    int a = 10;
    int& ref = a;  // 声明并初始化引用
    int& ref2 = 10;  // 编译错误 这里的例子都是左值引用 这种是右值引用的情况需要使用 &&
  	int&& ref2 = 10; // 可以编译
    const int& value3 = 10; // 可以编译 因为这里是常量引用

    std::cout << "a: " << a << std::endl;      // 输出 10
    std::cout << "ref: " << ref << std::endl;  // 输出 10

    ref = 20;  // 通过引用修改 a 的值

    std::cout << "a: " << a << std::endl;      // 输出 20
    std::cout << "ref: " << ref << std::endl;  // 输出 20

    return 0;
}
```

#### 引用作为函数参数

引用可以用作函数参数，以避免拷贝大对象并允许函数修改传入的参数。

```cpp
void increment(int& value) {
    value++;
}

int main() {
    int a = 10;
    increment(a);  // 通过引用传递参数

    std::cout << "a: " << a << std::endl;  // 输出 11

    return 0;
}
```

#### 引用作为函数返回值

引用可以用作函数的返回值，以便返回一个对象的引用。

```cpp
#include <iostream>
using namespace std;

int& getElement(int* array, int index) {
    return array[index];
}

int main() {
    int arr[3] = {1, 2, 3};
    int &value = getElement(arr, 1) = 10;  // 修改数组中的元素
    value = 20;  // 修改value的值 会影响到arr[1]
    std::cout << "value: " << value << std::endl;  // 输出 20
    std::cout << "arr[1]: " << arr[1] << std::endl;  // 输出 20
    int value1 = getElement(arr, 1);  // 获取arr[1]的值
    value1 = 30;  // 修改value1的值 不会影响到arr[1]
    std::cout << "value1: " << value1 << std::endl;  // 输出 30
    std::cout << "arr[1]: " << arr[1] << std::endl;  // 输出 20
    return 0;
}
```



### 左值引用和右值引用

- 左值引用（`lvalue reference`）和右值引用（`rvalue reference`）是 C++ 中的两种引用类型
  
#### 左值引用

- 上面介绍的一般引用情况就是左值引用

- 左值引用是指对变量的引用，可以通过 `&` 符号声明。左值引用只能绑定到左值（`lvalue`），**即具有内存地址的对象。**
- 左值引用**可以修改引用的对象**，因为它**指向一个具体的内存地址**。
- 必须初始化：**左值引用在定义时必须初始化**，并且一旦绑定到某个变量，就**不能再改变引用的对象**。
- 用途：
  - 作为函数参数，可以传递变量的引用，避免复制大型对象。
  - 作为函数返回值，可以返回引用，避免返回临时对象的拷贝。
  - 作为类的成员变量，可以引用其他对象，实现对象间的共享。
  
```cpp
int a = 10;
int& ref = a; // ref 是 a 的左值引用
ref = 20; // 修改 a 的值
cout << a << endl; // 输出 20

struct MyClass {
    int value;
    MyClass(int v) : value(v) {}
};

MyClass obj(42);
MyClass& ref = obj; // ref 是 obj 的左值引用
cout << ref.value << endl; // 输出 42

```

#### 右值引用

- 右值引用是指对临时对象的引用，可以通过 **`&&`** 符号声明。右值引用只能绑定到右值（`rvalue`），即**没有内存地址的临时对象**。
- 右值：右值是指临时对象、常量、表达式等，它们**没有内存地址，只能通过引用访问**。
- **右值引用在定义时必须初始化**
  - 这一点与左值类似
- 右值引用在**定义后是可以更改和重新赋值的**
  - 实际上右值引用就相当于一个左值变量（变量名称），在内存中占有空间，自然可以赋值和更改
  - 两个右值引用可以进行赋值，实现是将一个引用指向的内容拷贝到另一个指向的空间中？
- 右值引用只能引用右值，不能引用左值
- 当你将一个右值赋值给右值引用后，实际上这个右值会被你进行持久化变成一个左值（有内存地址）
  - 而当前的这个右值引用就是你访问这个变量的途径（该变量的别名）
- 用途：
  - 移动语义：右值引用可以实现资源的所有权转移，避免资源的复制。
  - 完美转发：右值引用可以实现参数的完美转发，避免参数的拷贝。

```cpp
int&& ref = 10; // ref 是 10 的右值引用
cout << ref << endl; // 输出 10

struct MyClass {
    int value;
    MyClass(int v) : value(v) {}
};

MyClass&& ref = MyClass(42); // ref
cout << ref.value << endl; // 输出 42

MyClass obj(42);
MyClass&& ref = std::move(obj); // ref 是 obj 的右值引用
cout << ref.value << endl; // 输出 42
cout << obj.value << endl; // 输出 0 这里的 obj 的值被移动了已经失去了原来的值
```



### 引用的赋值与绑定

#### 非 const 左值引用

- 非 `const` 引用可以绑定到**左值** （这里值的是普通的左值引用 & ）
  - **右值不可以绑定非常量引用**，避免临时变量的修改造成的问题

#### const 左值引用

`const `引用可以**绑定到左值和右值**。

#### 右值引用 &&

- 但是右值可以绑定到特殊的右值引用上 （`&&`）
- **普通的左值不能绑定到右值引用，需要通过 move 函数进行转化**

```cpp
class A{};
A getA(){
    return A(); //这里返回的是一个右值对象
}
int main() {
    int a = 1;
    int &ra = a; // 左值赋给非const引用 OK
    const A &ca = getA();// 右值赋给const引用 OK
    A &a1 = getA(); //ERROR，右值不能给左值引用
  	A && a2 = getA();  // 右值赋给右值引用 OK
}
```



### move 函数

- `std::move` 是 C++ 标准库中的一个函数，用于**将左值转换为右值引用**，但并不移动对象的资源，只是将对象标记为右值，使其可以绑定到右值引用。
- 主要的用途有：当我们想要使用移动构造函数或者移动赋值函数时，传入的参数为右值引用。但是我们一般获得的对象都是作为左值无法作为参数进行传递，此时可以通过 `std::move` 获得右值。
- 但是通过使用 `std::move`，可以启动**移动构造函数或移动赋值函数**，实现资源的所有权转移。

```cpp
struct MyClass {
    char* data;
    MyClass(const char* str) {
        data = new char[strlen(str) + 1];
        strcpy(data, str);
    }
};

MyClass obj1("Hello");
std::move(obj1); // obj1 被标记为右值
cout << obj1.data << endl; // 输出 Hello
MyClass obj2 = std::move(obj1); // obj1 的资源被移动到 obj2 
                                // 这里的资源移动是因为启动了移动构造函数
cout << obj1.data << endl; // 输出空
cout << obj2.data << endl; // 输出 Hello

```



### 左右值引用的区别

1. **左值引用**
   - **定义**：指向一个左值的引用。
   - **符号**：使用 `&` 符号。
   - **绑定**：非 const 只能绑定到左值，const 则两者皆可
   - **使用场景**：传递大对象、修改参数、返回值优化。
2. **右值引用**
   - **定义**：指向一个右值的引用。
   - **符号**：使用 `&&` 符号。
   - **绑定**：可以绑定到右值，也可以通过 `std::move` 绑定到左值。
   - **使用场景**：移动语义、资源管理、临时对象处理。
   - 
