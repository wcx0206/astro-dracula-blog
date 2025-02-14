---
title: cpp-dynamic
tags:
---

### Dynamic in Cpp

<!--more-->

## Dynamic variables

动态变量是在运行时创建的变量，它们的类型和值在运行时确定。C++ 中有两种主要的动态变量：指针和引用。



### malloc & free

- malloc 函数用于在**堆上分配**一块指定大小的内存，返回一个指向该内存的指针。

- free 函数用于释放 malloc 分配的内存。
- **`malloc` 申请来的指针不要去移动位置，否则会导致内存泄漏**

```cpp
/**
 * 注意此处不能够写成 *(p ++) = i; 会导致 p 指针指向的地址发生变化
 * 之后的pree(p) 会出现问题
 * 对应的 symbol table 出现错误 不存在
 */

int * p = malloc(sizeof(int) * 8); // 分配一个 int 类型的内存块
for (int i = 0; i < 8; i++) {
    *(p + i) = i; // 初始化内存块
}
free(p); // 释放内存

int *p1 = int[2]{7,15}; // 初始化

```

### new & malloc

new 和 malloc 都是用于在堆上分配内存的函数，但它们之间有几个重要的区别：

- new 是 C++ 中的**关键字**，而 malloc 是 **C 语言中的函数。**
- malloc **不会调用对象的构造函数**，只是简单的分配地址
- new **会调用对象的构造函数**，初始化对象，
- **注意到`new`出来的对象是无名字的，你只能用当时返回的指针去访问它**。



### 动态分配的数组

多维度数组的构建本质上就是多级指针

- `int*`: 指向整数的指针

- `int**`: 指向整数指针的指针

- **内存模型示意**

  ```cpp
  int** ptr
      |
      v
  [ptr1]->[value1]
  [ptr2]->[value2]
  [ptr3]->[value3]
  ```

  

#### 二维数组

```cpp
int rows = 3, cols = 4;
    
    // 分配内存
    int** array2D = new int*[rows]; // 这里创建了一个 int** 指向指针的一个指针
    for(int i = 0; i < rows; i++) {
      // 这里是为每一行进行内存的分配
        array2D[i] = new int[cols];  // new int[] 返回类型为 int*
    }
    
    // 访问和赋值
		// 三种不同的访问形式
    for(int i = 0; i < rows; i++) {
        for(int j = 0; j < cols; j++) {
            *(*(array2D + i) + j) = i * cols + j; // 完全指针
            *(array2D[i] + j) = i * cols + j; // 行中下标 列中指针
            array2D[i][j] = i * cols + j; // 完全下标

            cout << array2D[i][j] << " ";
        }
        cout << endl;
    }
    
    // 释放内存
    for(int i = 0; i < rows; i++) {
        delete[] array2D[i];
    }
    delete[] array2D;
```



#### 三维数组

### `delete` & `delete[]`

delete p 和 delete[] p 的区别在于它们用来释放不同类型的内存。

- delete p 用于释放通过 new 分配的单个对象。
- delete[] p 用于释放通过 new[] 分配的数组。
- 使用 delete[] 删除时后面跟的**数组的首地址**
- 为了避免悬挂指针，删除对象后需要将对应的指针置为 null

  >悬挂指针
	>- 指向已经被释放或无效内存地址的指针
  >- 继续使用这样的指针会导致未定义行为

在面向对象编程时这两个是有所区别的

- 单个对象 (delete p)
  - delete p 调用指针 p 所指向的对象的析构函数。之后，释放该对象占用的内存。
- 数组 (delete[] p)
  - delete[] p 首先调用指针 p 所指向的**每个数组元素的析构函数**，从数组的最后一个元素到第一个元素逐个调用。之后，释放整个数组占用的内存。

### 为什么会引入 `delete & new`

- 因为这两个可以解决初始化函数的析构函数的调用的问题

- 注意到`new`出来的对象数组里面的每一个对象会**被调用默认构造函数（你也必须有）**，但是**原始类型不会被初始化**！你也可以用初始化列表来保证所有的初始化出来都是某个值。

  ```cpp
  // 原始类型数组：元素不会被自动初始化
      int* intArray = new int[3];  // 元素值是随机的垃圾值
  		int* intArray = new int[3]();  // 所有元素初始化为0
  		int* intArray = new int[3]{1, 2, 3};  // 指定初始值
  ```

  



```cpp
#include <iostream>

class MyClass {
public:
    MyClass() {
        std::cout << "Constructor called" << std::endl;
    }
    ~MyClass() {
        std::cout << "Destructor called" << std::endl;
    }
};

int main() {
    // 单个对象情况
    MyClass* p = new MyClass();
    delete p; // 将调用 MyClass 的析构函数

    std::cout << "After deleting single object" << std::endl;

    // 数组情况
    MyClass* arr = new MyClass[3];
    delete[] arr; // 将调用 MyClass 的析构函数 3 次

    std::cout << "After deleting array" << std::endl;

    return 0;
}

```

## 智能指针

### 析构顺序

在 C++ 中，局部变量（包括智能指针）的析构顺序是按照它们在**作用域中声明的逆序进行**的。这意味着最后声明的变量会最先被析构，最先声明的变量会最后被析构。

### 为什么我们要引入并使用智能指针

智能指针是 C++ 标准库提供的一种用于自动管理动态分配内存的工具。智能指针通过 **RAII**（Resource Acquisition Is Initialization）机制，在对象生命周期结束时自动释放内存，避免**内存泄漏和悬挂指针**问题。

#### 1. 自动内存管理

智能指针自动管理动态分配的内存，当智能指针超出作用域时，自动释放内存，避免内存泄漏。

这里自动释放的内存就是创建的**指针所指向对象**所占用的内存。

```cpp
{
    std::unique_ptr<int> ptr = std::make_unique<int>(10);
    // 当 ptr 超出作用域时，自动释放内存 即这里原本分配给int值10的内存被释放
}
```

#### 2. 避免悬挂指针

智能指针确保在对象被销毁后，**指针不会再指向无效的内存地址**，避免悬挂指针问题。

```cpp
std::shared_ptr<int> ptr1 = std::make_shared<int>(10);
std::shared_ptr<int> ptr2 = ptr1; // ptr1 和 ptr2 共享同一个对象
ptr1.reset(); // ptr1 不再指向对象，但对象仍由 ptr2 管理
// 对象不会被销毁，ptr2 仍然有效
```

#### 3. 引用计数

`std::shared_ptr` 使用引用计数来管理对象的生命周期，确保对象在最后一个引用被销毁时才释放内存。

```cpp
std::shared_ptr<int> ptr1 = std::make_shared<int>(10);
std::shared_ptr<int> ptr2 = ptr1; // 引用计数增加

std::cout << "use_count: " << ptr1.use_count() << std::endl; // 输出 2

ptr1.reset(); // 引用计数减少
std::cout << "use_count: " << ptr2.use_count() << std::endl; // 输出 1
```

#### 4. 解决循环引用

```

```



### .get() 方法

`std::shared_ptr`、`std::unique_ptr` 和 `std::weak_ptr` 都提供了 `.get()` 方法。这个方法返回智能指针内部管理的**原始指针（裸指针）**，但不会改变智能指针的**引用计数或所有权**。

```cpp
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor" << std::endl; }
    ~MyClass() { std::cout << "MyClass Destructor" << std::endl; }
    void display() { std::cout << "MyClass::display()" << std::endl; }
};

int main() {
    // std::shared_ptr 示例
    std::shared_ptr<MyClass> sharedPtr = std::make_shared<MyClass>();
    MyClass* rawSharedPtr = sharedPtr.get(); // 获取原始指针
    rawSharedPtr->display(); // 使用原始指针调用方法
    std::cout << "sharedPtr use_count: " << sharedPtr.use_count() << std::endl;

    // std::unique_ptr 示例
    std::unique_ptr<MyClass> uniquePtr = std::make_unique<MyClass>();
    MyClass* rawUniquePtr = uniquePtr.get(); // 获取原始指针
    rawUniquePtr->display(); // 使用原始指针调用方法

    // std::weak_ptr 示例
    std::weak_ptr<MyClass> weakPtr = sharedPtr;
    if (auto lockedSharedPtr = weakPtr.lock()) { // 提升为 shared_ptr
        MyClass* rawWeakPtr = lockedSharedPtr.get(); // 获取原始指针
        rawWeakPtr->display(); // 使用原始指针调用方法
        std::cout << "lockedSharedPtr use_count: " << lockedSharedPtr.use_count() << std::endl;
    } else {
        std::cout << "Object has been destroyed" << std::endl;
    }

    return 0;
}
```

![image-20241225112534439](/Users/wcx/Library/Application Support/typora-user-images/image-20241225112534439.png)

### .reset()

`.reset()` 方法是 `std::shared_ptr`、`std::unique_ptr` 和 `std::weak_ptr` 这三种智能指针共有的特性。`.reset()` 方法用于**重置智能指针**，使其**不再管理当前对象**，并可以选择性地**管理一个新的对象。**

#### std::shared_ptr::reset()

`std::shared_ptr` 的 `.reset()` 方法可以重置智能指针，使其不再管理当前对象，并可以选择性地管理一个新的对象。如果没有提供新的对象，引用计数会减少，当引用计数变为 0 时，当前对象会被销毁。

```cpp
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor" << std::endl; }
    ~MyClass() { std::cout << "MyClass Destructor" << std::endl; }
    void display() { std::cout << "MyClass::display()" << std::endl; }
};

int main() {
    std::shared_ptr<MyClass> sharedPtr = std::make_shared<MyClass>();
    std::cout << "sharedPtr use_count: " << sharedPtr.use_count() << std::endl; // 输出 1

    sharedPtr.reset(); // 重置 sharedPtr，不再管理当前对象
    std::cout << "sharedPtr use_count: " << sharedPtr.use_count() << std::endl; // 输出 0

    sharedPtr = std::make_shared<MyClass>(); // 重新管理一个新对象
    std::cout << "sharedPtr use_count: " << sharedPtr.use_count() << std::endl; // 输出 1

    return 0;
}
```

#### std::unique_ptr::reset()

`std::unique_ptr` 的 `.reset()` 方法可以重置智能指针，使其不再管理当前对象，并可以选择性地管理一个新的对象。如果没有提供新的对象，**当前对象会被销毁**。

```cpp
int main() {
    std::unique_ptr<MyClass> uniquePtr = std::make_unique<MyClass>();
    uniquePtr.reset(); // 重置 uniquePtr，不再管理当前对象
    // uniquePtr 现在为空
    uniquePtr = std::make_unique<MyClass>(); // 重新管理一个新对象
    return 0;
}
```

#### std::weak_ptr::reset()

`std::weak_ptr` 的 `.reset()` 方法可以重置智能指针，使其不再观察当前对象。由于 `std::weak_ptr` **不管理对象的生命周期**，因此 `.reset()` **只影响 `std::weak_ptr` 本身**。

```cpp
    std::shared_ptr<MyClass> sharedPtr = std::make_shared<MyClass>();
    std::weak_ptr<MyClass> weakPtr = sharedPtr;
    weakPtr.reset(); // 重置 weakPtr，不再观察当前对象
    // weakPtr 现在为空
    weakPtr = sharedPtr; // 重新观察 sharedPtr 管理的对象
    return 0;
```



### auto_ptr（已被弃用）

####  定义

`auto_ptr` 是 C++ 标准库中的一种智能指针类型，用于**自动管理动态分配的对象的生命周期**。**它在对象销毁时自动释放内存，避免内存泄漏**。

####  特点

- **自动内存管理**：`auto_ptr` 在其生命周期结束时自动释放所管理的对象，避免内存泄漏。
- **所有权转移**：`auto_ptr` 在复制和赋值操作中会转移所有权，这意味着源 `auto_ptr` 将失去对对象的所有权。

```cpp
#include <iostream>
#include <memory>  // 包含 auto_ptr 的头文件

class MyClass {
public:
    MyClass() {
        std::cout << "MyClass Constructor" << std::endl;
    }
    ~MyClass() {
        std::cout << "MyClass Destructor" << std::endl;
    }
    void display() {
        std::cout << "MyClass display()" << std::endl;
    }
};

int main() {
    std::auto_ptr<MyClass> ptr1(new MyClass());  // 创建 auto_ptr 管理 MyClass 对象
    ptr1->display();  // 使用 auto_ptr 访问 MyClass 对象的成员函数

    std::auto_ptr<MyClass> ptr2 = ptr1;  // 所有权转移，ptr1 失去所有权
    if (ptr1.get() == nullptr) {
        std::cout << "ptr1 is null" << std::endl;
    }
    ptr2->display();  // 使用 ptr2 访问 MyClass 对象的成员函数

    return 0;
}
```

#### 缺陷

1. **所有权转移**
   - `auto_ptr` 在复制和赋值操作中会转移所有权，这可能导致意外的行为。在现代 C++ 中，建议使用 `std::unique_ptr` 代替 `auto_ptr`，因为 `std::unique_ptr` 提供了更明确的所有权语义。
2. **弃用**
   - `auto_ptr` 在 C++11 标准中被标记为弃用，并在 C++17 标准中被移除。建议使用 `std::unique_ptr` 或 `std::shared_ptr` 代替 `auto_ptr`。



### unique_ptr

因为上面的普通指针和对象声明后都需要自己手动去 free 或 delete，所以引入了智能指针
unique_ptr 是一种智能指针，它是 C++11 中引入的标准库类型，用于管理动态分配的内存。unique_ptr 保证在其生命周期结束时**自动释放所管理的内存**，从而**避免内存泄漏**。

- unique_ptr 不能拷贝，只能移动，因此它只能有一个所有权。当 unique_ptr 被销毁时，它会自动释放所管理的内存。
- 它是独占所有权的智能指针，即一个 std::unique_ptr 对象不能与另一个共享相同的指针。
- unique_ptr 通常用于管理动态分配的对象，但也可以用于管理动态分配的数组。

```cpp
/**
 * 创建 std::unique_ptr ：使用 std::unique_ptr 管理动态分配的对象。
 * 自动释放内存 ：当 std::unique_ptr 超出作用域时，自动调用存储对象的析构函数并释放内存。
 * 禁止所有权转移 ：
 *  可以通过 std::move 转移所有权。
 *  不能直接赋值给另一个 std::unique_ptr。
 */

#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() {
        std::cout << "Constructor called" << std::endl;
    }
    ~MyClass() {
        std::cout << "Destructor called" << std::endl;
    }
    void sayHello() const {
        std::cout << "Hello from MyClass" << std::endl;
    }
};

int main() {
    // 使用 std::unique_ptr 管理单个对象
    std::unique_ptr<MyClass> ptr1(new MyClass()); // 对象的构造函数被调用

    unique_ptr<MyClass> ptr1 = make_unique<MyClass>(); // 使用 make_unique 创建对象
    // 打印消息
    ptr1->sayHello();

    // 所有权转移
    std::unique_ptr<MyClass> ptr2 = std::move(ptr1);

    // 检查 ptr1 是否为空
    if (!ptr1) {
        std::cout << "ptr1 is now nullptr" << std::endl;
    }

    // ptr2 可以使用原来的对象
    ptr2->sayHello();

    // 使用智能指针管理数组
    std::unique_ptr<MyClass[]> arr(new MyClass[3]);

    // 做一些操作
    for (int i = 0; i < 3; ++i) {
        arr[i].sayHello();
    }

    // 不需要显式释放资源，unique_ptr 会自动处理

    return 0;
}

```

### shared_ptr

std::shared_ptr 是一种智能指针，用于共享所有权的管理。多个 shared_ptr 对象可以指向同一个对象，而该对象的生命周期直到最后一个 shared_ptr 释放它时才结束。

#### 主要特点：

- 引用计数 ：每个 shared_ptr 对象都有一个关联的引用计数，当引用计数为零时，所管理的对象被删除。
- 线程安全 ：引用计数的增加和减少是**线程安全**的。

#### 复制操作 (`=`)

复制操作会增加引用计数，使多个 `std::shared_ptr` 实例共享同一个对象。复制操作后，两个 `std::shared_ptr` 都指向同一个对象，并且引用计数增加。

```cpp
class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor" << std::endl; }
    ~MyClass() { std::cout << "MyClass Destructor" << std::endl; }
    void display() { std::cout << "MyClass::display()" << std::endl; }
};

int main(){
    // 创建一个 shared_ptr
    // std::shared_ptr<MyClass> p1 = std::make_shared<MyClass>();
    shared_ptr<MyClass> p1(new MyClass());
    std::cout << "p1 use_count: " << p1.use_count() << std::endl; // 应该输出 1

    {
        // 创建另一个 shared_ptr，指向相同的对象(=)
        std::shared_ptr<MyClass> p2 = p1;
        std::cout << "p1 use_count: " << p1.use_count() << std::endl; // 应该输出 2
        std::cout << "p2 use_count: " << p2.use_count() << std::endl; // 应该输出 2
    }
   // p2 超出作用域，p1 的引用计数减 1
       	std::cout << "p1 use_count: " << p1.use_count() << std::endl; // 应该输出 1
  
}
```



#### 移动操作 (`std::move`)

移动操作会将所有权从一个 `std::shared_ptr` 转移到另一个 `std::shared_ptr`，而不会增加引用计数。移动操作后，源 `std::shared_ptr` 将变为空（即不再指向任何对象），目标 `std::shared_ptr` 拥有对象的所有权。

```cpp
class MyClass {
public:
    MyClass() { std::cout << "MyClass Constructor" << std::endl; }
    ~MyClass() { std::cout << "MyClass Destructor" << std::endl; }
    void display() { std::cout << "MyClass::display()" << std::endl; }
};

int main(){
    // 创建一个 shared_ptr
    // std::shared_ptr<MyClass> p1 = std::make_shared<MyClass>();
    shared_ptr<MyClass> p1(new MyClass());
    std::cout << "p1 use_count: " << p1.use_count() << std::endl; // 应该输出 1
    {
      	// 移动 p1，p3 指向 p1 原来的对象 p1 为空(move)
        std::shared_ptr<MyClass> p3 = std::move(p1);
        std::cout << "p1 use_count: " << p1.use_count() << std::endl; // 应该输出 0
        std::cout << "p3 use_count: " << p3.use_count() << std::endl; // 应该输出 1
    }

}
```



### weak_ptr

std::weak_ptr 是一种**不管理所有权的智能指针**，它可以安全地访问由 shared_ptr 所管理的对象，但不影响其生命周期。

主要特点：

- 弱引用 ：weak_ptr **不增加引用计数**，避免了循环引用导致的内存泄漏。
- 悬挂检测 ：可以**使用 lock() 方法转化为 shared_ptr**，以检查对象是否仍然存在。
- 可以用于解决循环引用而导致智能指针无法正确自动释放问题

```cpp
#include <iostream>
#include <memory>

class MyClass {
public:
    MyClass() { std::cout << "Constructor called" << std::endl; }
    ~MyClass() { std::cout << "Destructor called" << std::endl; }
    void sayHello() const { std::cout << "Hello from MyClass" << std::endl; }
};

int main() {
    // 使用 make_shared 创建 shared_ptr
    std::shared_ptr<MyClass> sp1 = std::make_shared<MyClass>();
  
    // 使用 shared_ptr 创建 weak_ptr
    std::weak_ptr<MyClass> wp = sp1;
    std::cout << "wp use_count: " << wp.use_count() << std::endl; // 输出: 1

    // 检查 weak_ptr 是否有效
    if (auto sp3 = wp.lock()) {
        std::cout << "wp is valid, use_count: " << sp3.use_count() << std::endl; // 输出: 2
        sp3->sayHello();
    } else {
        std::cout << "wp is expired" << std::endl;
    }

    // 输出当前 use_count
    std::cout << "Final sp1 use_count: " << sp1.use_count() << std::endl; // 输出: 1

    return 0;
}
// 当 sp1 退出作用域时，引用计数为 0，Destructor 被调用

```

#### 什么是循环依赖

1. 循环依赖问题通常发生在两个或多个对象互相持有 `std::shared_ptr`，导致引用计数永远不会变为零，从而导致内存泄漏。

2. 通过使用 `std::weak_ptr`，可以打破这种循环依赖，因为 `std::weak_ptr` 不会增加引用计数，从而允许对象在没有其他 `std::shared_ptr` 引用时被正确销毁。

3. 循环依赖的示例

   - 下面的例子中，A 持有 B 对象的一个 shared_ptr ，B 持有 A 对象的一个 shared_ptr。

   - 如果超出了作用域，a b 的引用计数都会同时变成 1 而不是 0 这样就无法进行释放

     ```cpp
     #include <iostream>
     #include <memory>
     class B; // 前向声明
     class A {
     public:
         std::shared_ptr<B> ptrB;
         ~A() { std::cout << "A Destructor" << std::endl; }
     };
     class B {
     public:
         std::shared_ptr<A> ptrA;
         ~B() { std::cout << "B Destructor" << std::endl; }
     };
     
     int main() {
         {
             std::shared_ptr<A> a = std::make_shared<A>(); // a 引用数为 1
             std::shared_ptr<B> b = std::make_shared<B>(); // b 引用数为 2
             a->ptrB = b; //  a use_count = 2
             b->ptrA = a; //  b use_count = 2
     
             std::cout << "a use_count: " << a.use_count() << std::endl; // 输出 2
             std::cout << "b use_count: " << b.use_count() << std::endl; // 输出 2
         } // 超出作用域，A 和 B 的析构函数不会被调用，导致内存泄漏
         std::cout << "End of main" << std::endl;
         return 0;
     }
     ```

     

4. 循环依赖的解决

   - 将其中某一个对象中的指针从 shared_ptr 转化为 weak_ptr
   - 在离开作用域之后，按照声明的逆序先析构 std::shared_ptr<B> b，此时 b 的引用计数 - 1 变为 1 对象 B 未被释放
   - 接着析构 std::shared_ptr<A> a ，因为 a 的引用计数此时 -1 变为 0，所以释放 A 对象
   - 析构 A 对象的过程中会使得 std::shared_ptr<B> b 的引用计数 -1 变为 0
   - 此时开始析构 B 对象

   ```cpp
   #include <iostream>
   #include <memory>
   
   class B; // 前向声明
   
   class A {
   public:
       std::shared_ptr<B> ptrB;
       ~A() { std::cout << "A Destructor" << std::endl; }
   };
   
   class B {
   public:
       std::weak_ptr<A> ptrA; // 使用 weak_ptr 避免循环引用
       ~B() { std::cout << "B Destructor" << std::endl; }
   };
   
   int main() {
       {
           std::shared_ptr<A> a = std::make_shared<A>();
           std::shared_ptr<B> b = std::make_shared<B>();
   
           a->ptrB = b;
           b->ptrA = a; // 使用 weak_ptr 避免循环引用
   
           std::cout << "a use_count: " << a.use_count() << std::endl; // 输出 1
           std::cout << "b use_count: " << b.use_count() << std::endl; // 输出 2
       } // 超出作用域，A 和 B 的析构函数会被调用
       std::cout << "End of main" << std::endl;
       return 0;
   }
   ```

   



### unique_ptr、shared_ptr 和 weak_ptr 对比

- unique_ptr ：
  - **独占所有权**。
  - **禁止拷贝和赋值**，可以转移所有权（通过 std::move）。
  - 适用于独占资源的管理，不能与其他指针共享。
- shared_ptr ：
  - **共享所有权**，允许多个 shared_ptr 指向同一个对象。
  - 使用**引用计数**来管理对象的生命周期。
  - 适用于需要**共享资源的场景**，引用计数为零时才会释放对象。
- weak_ptr ：
  - 弱引用，不管理对象的生命周期，不增加引用计数。
  - 防止 shared_ptr 的**循环引用导致内存泄漏**。
  - 适用于需要临时访问 shared_ptr 所管理对象的场景，且不影响对象生命周期。



### malloc & realloc

#### `malloc`

`malloc`（memory allocation）用于分配指定大小的内存块，并返回指向该内存块的指针。分配的内存块未初始化，可能包含任意数据。

语法

- `size`：要分配的内存块的大小（以字节为单位）。
- 返回值：指向分配的内存块的指针。如果分配失败，返回 `NULL`。

```cpp
void* malloc(size_t size);

#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr;
    size_t n = 5;

    // 分配内存
    arr = (int*)malloc(n * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed\n");
        return 1;
    }

    // 使用分配的内存
    for (size_t i = 0; i < n; i++) {
        arr[i] = i + 1;
        printf("%d ", arr[i]);
    }
    printf("\n");

    // 释放内存
    free(arr);

    return 0;
}
```

#### `realloc`

`realloc`（reallocation）用于调整已分配内存块的大小。它可以扩展或缩小内存块，并返回指向新内存块的指针。新内存块可能位于不同的内存地址。

语法

- `ptr`：指向先前分配的内存块的指针。如果 `ptr` 为 `NULL`，`realloc` 的行为类似于 `malloc`。
- `size`：新内存块的大小（以字节为单位）。
- 返回值：指向新内存块的指针。如果分配失败，返回 `NULL`，原内存块保持不变。

```cpp
void* realloc(void* ptr, size_t size);
```



1. 
