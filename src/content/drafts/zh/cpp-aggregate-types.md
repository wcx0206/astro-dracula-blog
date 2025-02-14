---
title: cpp-type
tags:
---

### Aggregate Types in Cpp

聚合类型

<!--more-->

### [struct](./cpp-struct)

### tuple 元组

- tuple 是一种标准库容器，用于存储多个不同类型的值。它类似于 struct ，但更加灵活，因为它允许存储不同类型的元素，而**不需要定义一个新的类型**。
- tuple 在内存中的实现
  - 成员按照声明顺序存储
  - tuple 的总大小必须是最大成员对齐要求的整数倍
  - 每个成员必须按照自身的对齐要求进行对齐
    - 每个成员相对于起始位置的偏移量**必须是该成员大小的整数倍**
  - 成员之间**可能需要填充以满足对齐要求**


```cpp
#include <iostream>
#include <tuple>

int main() {
    tuple<int, double, string> myTuple = make_tuple(1, 3.14, "Hello");

    // 修改 tuple 元素
    get<0>(myTuple) = 42;
    get<1>(myTuple) = 2.718;
    get<2>(myTuple) = "World";


    // 获取 tuple 的大小
    cout << "Tuple size: " << tuple_size<decltype(myTuple)>::value << endl;

    // 获取 tuple 中某个元素的类型
    using FirstElementType = tuple_element<0, decltype(myTuple)>::type;
    cout << "First element type: " << typeid(FirstElementType).name() << endl;


    // 访问 tuple 元素
    cout << "Integer: " << get<0>(myTuple) << endl;
    cout << "Double: " << get<1>(myTuple) << endl;
    cout << "String: " << get<2>(myTuple) << endl;

    return 0;
}

```

### optional

- optional 是一个标准库容器，用于**存储可能不存在的值**。它类似于指针，但提供了更多的功能和安全性。
- 在某些情况下，我们可能无法确定一个值是否存在。
  - 例如，当我们尝试从一个 map 中查找一个键对应的值时，如果键不存在，我们无法确定返回值是否有效。这时，我们可以使用 optional 来表示这种可能不存在的值。

```cpp
#include <iostream>
#include <optional>

using namespace std;

// 一个示例函数，返回一个可能不存在的值
optional<int> findValue(bool condition) {
    if (condition) {
        return 42; // 返回一个值
    } else {
        return nullopt; // 返回空的optional
    }
}

int main() {
    // 创建一个空的optional
    optional<int> opt1;

    // 创建一个包含值的optional
    optional<int> opt2 = 42;

    // 使用findValue函数获取一个optional
    optional<int> opt3 = findValue(true);
    optional<int> opt4 = findValue(false);

    // 访问optional的值 使用*
    if (opt1) {
        cout << "opt1 contains a value: " << *opt1 << endl;
    } else {
        cout << "opt1 is empty" << endl;
    }

    if (opt2.has_value()) {   // 与 if (opt2) 等价
        cout << "opt contains a value: " << *opt2 << endl;
    } else {
        cout << "opt is empty" << endl;
    }

    if (opt3) {
        cout << "opt3 contains a value: " << *opt3 << endl;
    } else {
        cout << "opt3 is empty" << endl;
    }

    if (opt4) {
        cout << "opt4 contains a value: " << *opt4 << endl;
    } else {
        cout << "opt4 is empty" << endl;
    }

    // 修改optional的值
    opt1.emplace(100);
    cout << "opt1 after emplace: " << *opt1 << endl;

    opt2 = 200;
    cout << "opt2 after assignment: " << *opt2 << endl;

    // 重置optional
    opt1.reset();
    if (opt1) {
        cout << "opt1 contains a value: " << *opt1 << endl;
    } else {
        cout << "opt1 is empty after reset" << endl;
    }

    return 0;
}
```

![image-20241229003012000](/Users/wcx/Library/Application Support/typora-user-images/image-20241229003012000.png)

### union 联合体

- union 是一种特殊的数据结构，它允许在同一内存位置存储不同的数据类型。与 struct 不同，union 中的所有成员共享同一块内存，因此只能同时存储**一个成员**的值。
- union：不提供类型安全，**使用时需要手动跟踪当前存储的类型**，不提供类型转换，不提供构造函数和析构函数
- Union 在内存中的实现:
  - 所有成员**共享同一块内存空间**
  - 内存大小由**最大成员决定**
  - 所有成员的**起始地址相同**

​    

```cpp
#include <iostream>

union MyUnion {
  // 虽然定义了三个但是实际上只能存储其中的一个
    int intValue;
    float floatValue;
    char charValue;
};

int main() {
    MyUnion u;
    u.intValue = 42;
    cout << "intValue: " << u.intValue << endl;

    u.floatValue = 3.14f;
    cout << "floatValue: " << u.floatValue << endl;

    u.charValue = 'A';
    cout << "charValue: " << u.charValue << endl;

    // 注意：由于所有成员共享同一块内存，最后一次赋值会覆盖之前的值
    cout << "intValue after charValue assignment: " << u.intValue << endl;

    return 0;
}

```

### variant

- `variant` 是一种标准库容器，它可以存储多个不同类型的值，但只能同时存储一个值。与 `union` 不同，`variant` 会自动处理**内存分配和类型转换**，因此更加安全和易用。
- ==typesafe union==
  - 提供类型安全，可以使用 `std::get` 和 `std::holds_alternative` 检查和访问当前存储的类型
- 但是使用 variant 时需要注意，如果访问了一个不存在的类型，会抛出 `std::bad_variant_access` 异常
- 如何修复这个问题？可以使用 `std::get_if `函数，它会返回一个指向存储的值的指针，如果值不存在，则返回 `nullptr`

```cpp
#include <iostream>
#include <variant>

int main() {
    variant<int, float, string> v;

    v = 42;
    cout << "int value: " << get<int>(v) << endl;

    v = 3.14f;
    cout << "float value: " << get<float>(v) << endl;

    v = "Hello, World!";
    cout << "string value: " << get<string>(v) << endl;

    // 使用 holds_alternative 检查当前存储的类型
    if (holds_alternative<int>(v)) {
        cout << "v holds an int" << endl;
    } else if (holds_alternative<float>(v)) {
        cout << "v holds a float" << endl;
    } else if (holds_alternative<string>(v)) {
        cout << "v holds a string" << endl;
    }

    return 0;
}
```

### 三剑客 

any、variant 和 optional 被称为“三剑客”，它们都是C++17引入的标准库容器，用于处理不同类型的数据和状态

### any

- any 是一种标准库容器，它可以**存储任意类型的值**。any 类似于 void* 指针，但提供了更多的功能和安全性。

- any 可以**存储任意类型的值**，但在**访问时需要进行类型检查**，否则会抛出 std::bad_any_cast 异常。
- 如何解决？可以使用 **any_cast 函数进行类型转换**，它会检查当前存储的类型是否与指定的类型匹配，如果不匹配，则抛出异常。
- ==type-safe void*==

```cpp
#include <iostream>
#include <any>
#include <string>

using namespace std;

int main() {
    // 创建和初始化 std::any
    any a = 42; // 存储 int 类型
    cout << "int value: " << any_cast<int>(a) << endl;

    // 存储 string 类型
    // 使用 any.type() 获取存储的类型 a.type().name() 获取类型名称
    // a.any.type() == typeid(int) a.any.type() == typeid(string)  使用typeid进行判断
    a = string("Hello, World!"); 
    cout << "string value: " << any_cast<string>(a) << endl;
    cout << "type of a: " << a.type().name() << endl;

    // 访问 std::any 的值
    try {
        cout << "wrong type: " << any_cast<float>(a) << endl; // 错误的类型转换
    } catch (const bad_any_cast& e) {
        cout << "Caught exception: " << e.what() << endl;
    }

    // 检查 std::any 是否包含值
    any b;
    if (b.has_value()) {
        cout << "b contains a value" << endl;
    } else {
        cout << "b is empty" << endl;
    }

    b = 100;
    if (b.has_value()) {
        cout << "b contains a value: " << any_cast<int>(b) << endl;
    } else {
        cout << "b is empty" << endl;
    }

    // 重置 std::any
    b.reset();
    if (b.has_value()) {
        cout << "b contains a value" << endl;
    } else {
        cout << "b is empty after reset" << endl;
    }

    return 0;
}
```



