---
title: cpp-exception-error
tags:
---

### Exception & Error In Cpp 异常与错误

<!--more-->

### exception  & error

#### exception

异常是程序在运行时遇到的非预期情况，它会导致程序的正常流程被中断。
是否可预期？异常分为两种：可预期异常和不可预期异常。可预期异常是程序员可以预先预料到的异常，例如除零错误、数组越界等。不可预期异常是程序员无法预料到的异常，例如内存访问冲突、硬件故障等。

#### error

错误是程序中的缺陷或问题，通常是由于编程错误或逻辑错误引起的，它可能导致程序的正常流程被中断，但不一定会导致程序崩溃。
例如：语法错误、逻辑错误、运行时错误

#### 两者的区别

- **异常（Exception）**：
  - 可捕获和处理的非预期事件。
  - 通常表示程序运行时的可恢复问题。
  - 通过异常处理机制（如 `try-catch` 块）来捕获和处理。
- **错误（Error）**：
  - 严重的、不可恢复的问题。
  - 通常表示程序运行时的致命问题。
  - 通常无法通过异常处理机制来捕获和处理，程序可能会终止运行。

## 异常

- **特征：可以预见、无法避免**
- **作用：提高程序的鲁棒性**

### 常见的处理方式

- 函数参数:
  + **返回值**(特殊的，0或者1)
  + **引用参数(存放一些特定的信息)**
- 逐层返回
- 缺陷：
  - 程序结构不清楚
  - **相同的异常，不同的地方**，需要编写**相同的处理逻辑**是不合理的
  - 传统异常处理方式不能处理**构造函数出现的异常**

### 异常处理机制

一种专门、清晰描述异常处理过程的机制

1. `try`：监控
2. `throw`：抛掷异常对象，不处理
3. `catch`：捕获并处理

```cpp
try{
    //<语句序列>
    //监控
}throw
  //<表达式>，可以是基本类型，拷贝构造函数用来拷贝类
  
  
catch(<类型>[<变量>]){  //变量不重要可以省略
    //<语句序列> 捕获并处理
    //依次退出，不要抛出指向局部变量的指针，解决:直接抛出对象，自动进行拷贝
}
```

#### catch

- 类型：异常类型，匹配规则同函数重载
- 变量：存储异常对象，可省
- 一个try 语句块的后面可以跟**多个catch 语句块**, 用于**捕获不同类型的异常**进行处理

```cpp
void f()
{  ......
     throw 1;
   ......
    throw 1.0;
   ......
     throw "abcd";
   .......
}

try
   {  f();   }
  catch ( int )        //处理throw 1;
   { … }
  catch ( double )     //throw 1.0
  { … }
  catch (char * )      //throw "abcd"
  { … }     

```

### 异常处理的嵌套

- f->g->h 调用关系
- 如果所抛掷的异常对象如果在调用链上未被捕获，则由系统的abort处理（程序直接中断）。

```cpp
f(){
    try{
        g();
    }catch (int)
     { … }
     catch (char *)
     { … }
}
g(){
    try{
        h();
    }catch (int)
    { …  }
}
h(){
  throw 1;   //由g捕获并处理
  throw "abcd"; //由f捕获并处理
}
```

### 自定义异常类

- 在使用时需要注意如果需要 catch 多个异常类，需要注意其中 **catch 块的排列顺序**
- 这样子保证了继承顺序(重要)
  - catch 的过程是顺序向下检查是否符合条件，一旦符合条件就不再向下查找了。

```cpp
class FileErrors { };
class NonExist:public FileErrors { } ;
class WrongFormat:public FileErrors { } ;
class DiskSeekError:public FileErrors { };

int f(){
    try{
        WrongFormat wf;
        throw wf;
    }catch(NonExists&){...}
    catch(DiskSeekError&){...}
    catch(FileErrors){...}  //最后一个可以接住，派生类像基类转换是允许的
}
int f(){
    try{
        WrongFormat wf;
        throw wf;
    }catch(FileErrors){...} //由于先catch了基类，如果成功就不往下，所以下面的派生类都捕获不到
    catch(NonExists&){...}
    catch(DiskSeekError&){...}
}
//Catch exceptions by reference
//尝试多继承，而不是拷贝，避免冗余
```

#### 示例

下面最终的输出是：`MyExceptionBase` （基类）

原因：

- `MyExceptionDerived e` 创建了派生类对象
- 但是 `f(MyExceptionBase& e)` 函数 f 的参数是一个基类对象的引用
- 当你将一个派生类对象传递给 f 时会触发拷贝构造函数，将派生类转化为基类
- 最终 f throw 的是基类

>### 引用切片（Reference Slicing）
>
>#### 1. 定义
>
>引用切片（Reference Slicing）是指当**派生类对象通过基类引用或指针传递时**，派生类对象的特定部分（即派生类新增的成员变量和成员函数）被切割，只保留基类部分。这种现象通常发生在对象赋值、函数参数传递和异常处理等场景中。
>
>#### 2. 发生场景
>
>- **对象赋值**：将派生类对象赋值给基类对象。
>- **函数参数传递**：通过基类引用或指针传递派生类对象。
>- **异常处理**：抛出派生类对象并通过基类引用或指针捕获。

```cpp
class MyExceptionBase {};
class MyExceptionDerived: public MyExceptionBase { };
void f(MyExceptionBase& e) {
    throw e;//调用拷贝构造函数
}
int main() {
    MyExceptionDerived e;
    try {
        f(e);
    }catch(MyExceptionDerived& e) {
        cout << "MyExceptionDerived" << endl;
    }catch(MyExceptionBase& e) {
        cout << "MyExceptionBase" << endl;
    }
}
//输出:MyExceptionBase，为什么?调用了拷贝构造函数，拷贝构造的结果是MyExceptionBase类型的对象
```

### 特殊的异常处理

#### 无参数 `throw`

- 无参数 `throw` 用于重新抛出当前捕获的异常。它只能在 `catch` 块内部使用，**重新抛出当前捕获的异常**，以便在**更高层次的 `try` 块中处理**。
- 可以实现一个异常在多层之间进行不同的处理。

下面的列子中 

1. `functionB` 捕获处理了 `functionA` 抛出的异常
2. `funtionB ` 重新抛出异常
3. `main` 函数中进行捕获和处理

```cpp
#include <iostream>
#include <stdexcept>

void functionA() {
    throw std::runtime_error("Error in functionA");
}

void functionB() {
    try {
        functionA();
    } catch (const std::runtime_error& e) {
        std::cout << "Caught exception in functionB: " << e.what() << std::endl;
        throw;  // 重新抛出异常
    }
}

int main() {
    try {
        functionB();
    } catch (const std::exception& e) {
        std::cout << "Caught exception in main: " << e.what() << std::endl;
    }

    return 0;
}
```



#### `catch(...)`

- `catch(...)` 是一个捕获所有异常的捕获块。它可以**捕获任何类型的异常**，但**无法访问异常对象的具体信息**。
- 通常用于捕获所有**未被**其他 `catch` 块捕获的异常，以进行**通用的错误处理或资源清理**。

```cpp
#include <iostream>
#include <stdexcept>

void functionC() {
    throw std::runtime_error("Error in functionC");
}

int main() {
    try {
        functionC();
    } catch (const std::runtime_error& e) {
        std::cout << "Caught std::runtime_error: " << e.what() << std::endl;
    } catch (...) {
        std::cout << "Caught an unknown exception" << std::endl;
    }

    return 0;
}
```



### 多出口导致的碎片问题

- 在异常处理的整个流程中如果**多个地方 `throw`**，则意味着这里**有多个出口。**

- `Java `中在异常处理这一部分提供了 `finally`操作，无论在哪里没有抛出最后都会执行 `finally` ，将内存缓存进行自己的处理。可是C++中没有`finally`，那怎么进行处理呢？
- 在 `C++` 中，执行完异常处理后，**必然执行析构函数**。
  - RAII 技术
    - 通过**对象的生命周期**管理资源，确保资源在对象销毁时自动释放。
    - 在异常处理过程中，析构函数会被调用，从而确保资源被正确释放。

```c++
//Know what functions C++ silently writes and calls
class Empty { }; 
class Empty {
    //以下是C++默认提供给空类的方法
    Empty();
    Empty(const Empty&);
    ~Empty();
    Empty& operator=(const Empty&);
    Empty *operator &();
    const Empty* operator &() const;
};
```



### 异常处理防资源泄露的例子

1. 收养中心每天产生一个文件，包含当天的收养个案信息
2. 读取这个文件，为每个个案做适当的处理

<img src="https://ydjsir-cn.oss-cn-shenzhen.aliyuncs.com/notes/C%2B%2B%20exam.assets/2.png" style="zoom:50%;" />

```c++
class ALA{//Adorable Little Animal
    public:
        virtual void processAdoption() = 0;
};
class Puppy: public ALA{
    public:
        virtual void processAdoption();
};
class Kitten: public ALA{
    public:
        virtual void processAdoption();
};
void processAdoptions(istream& dataSource){ 
    while (dataSource){
        ALA *pa = readALA(dataSource);
        try{
            pa->processAdoption();//处理可能会出现问题
        }catch (…){
            delete pa;
            throw;
        }
        delete pa;//正常执行也要进行处理，这就是多出口的问题
    }
}
```

结构破碎：

- 被迫重复“清理码”
- 2次 `delete pa` (不符合**集中式处理**的想法、同时容易导致维护困难的问题)

**集中处理？用析构函数（智能指针）**

```cpp
template <class T>
class auto_ptr {
public:
    // 构造函数，接受一个指向 T 类型对象的指针
    auto_ptr(T *p = 0) : ptr(p) {}
    ~auto_ptr() { delete ptr; }
    // 重载 -> 操作符，返回指针
    T* operator->() const { return ptr; }
    // 重载 * 操作符，返回引用
    T& operator*() const { return *ptr; }

private:
    T* ptr;  // 指向 T 类型对象的指针
};

//结合智慧指针使用
void processAdoptions(std::istream& dataSource) {
    while (dataSource) {
        // 使用 auto_ptr 管理 readALA 返回的指针
        auto_ptr<ALA> pa(readALA(dataSource));
        // 使用 auto_ptr 重载的 -> 操作符访问 ALA 对象的成员函数
        pa->processAdoption();
        // 当 pa 超出作用域时，auto_ptr 的析构函数会自动释放内存
    }
}
```

**使用新的智能指针进行实现**

```cpp
std::unique_ptr<ALA> readALA(std::istream& dataSource) {
    std::string type;
    dataSource >> type;
    if (type == "puppy") {
        return std::make_unique<Puppy>();
    } else if (type == "kitten") {
        return std::make_unique<Kitten>();
    } else {
        throw std::runtime_error("Unknown animal type");
    }
}

void processAdoptions(std::istream& dataSource) {
    while (dataSource) {
        std::unique_ptr<ALA> pa;
        try {
            pa = readALA(dataSource);
            pa->processAdoption(); // 处理可能会出现问题
        } catch (...) {
            // 这里不需要手动 delete pa，因为 unique_ptr 会自动释放内存
            throw;
        }
        // 这里不需要手动 delete pa，因为 unique_ptr 会自动释放内存
    }
}
```

