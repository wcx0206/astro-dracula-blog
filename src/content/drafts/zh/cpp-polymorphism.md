---
title: cpp-overriding
tags:
---

## Polymorphism in C++ 多态

记录通过 overriding 、overloading、符号重载、tenplate 实现多态的相关内容

<!--more-->

### Overriding

#### 什么是 Overriding

在 C++ 中，函数重写（Overriding）是指在派生类中重新定义基类中已经存在的虚函数。重写的函数必须具有与基类中被重写的函数相同的名称、参数列表和返回类型。重写是实现多态性（Polymorphism）的关键机制之一。

#### 为什么需要 Overriding

-  实现**多态性（Polymorphism）**：多态性是面向对象编程的一个核心特性，它允许同一个函数调用在不同的上下文中表现出不同的行为。通过重写基类的虚函数，派生类可以提供自己的实现，从而在运行时决定调用哪一个类的函数实现。这种运行时多态性使得代码更加灵活和可扩展。
- 遵循**里氏替换原则**（Liskov Substitution Principle）：里氏替换原则是面向对象编程的一个重要原则，要求**派生类对象能够替换基类对象而不影响程序的正确性**。通过重写基类的虚函数，派生类可以确保其行为与基类一致，从而遵循里氏替换原则。
- 实现接口（Interface）：在设计接口时，**基类通常定义了一组虚函数**，派生类通过重写这些虚函数来实现具体的功能。这样，基类可以作为接口，定义一组通用的操作，而派生类则提供具体的实现。

#### cpp 如何实现 Overriding

部分内容可以参考继承部分：[cpp-inheritance](./cpp-inheritance#虚基类)

1. 在基类中声明虚函数：使用 virtual 关键字在基类中声明虚函数。
2. 在派生类中重写[虚函数](./10-oo-cpp.md#六、虚函数)：在派生类中重新定义基类的虚函数。可以使用 override 关键字来显式表示这是一个重写的函数（C++11 及以上版本）。
3. 使用基类指针或引用调用虚函数：通过**基类指针或引用**调用虚函数，程序会在运行时决定调用哪一个类的函数实现。当然你也可以使用派生类对象调用虚函数。
4. 语法格式
   1. ：`virtual 返回类型 函数名(参数列表) { ... }` 类中定义
   2. ：`返回类型 函数名(参数列表) override { ... }` 派生类中定义

```cpp
// 基类
class Animal {
public:
    // 虚函数，允许派生类重写
    virtual void makeSound() const {
        std::cout << "Animal makes a sound" << std::endl;
    }
};
// 派生类
class Dog : public Animal {
public:
    // 重写基类的虚函数
    void makeSound() const override {
        std::cout << "Dog barks" << std::endl;
    }
};
class Cat : public Animal {
public:
    // 重写基类的虚函数
    void makeSound() const override {
        std::cout << "Cat meows" << std::endl;
    }
};
void playSound(const Animal& animal) {
    animal.makeSound();
}
int main() {
    Dog dog;
    Cat cat;
    playSound(dog); // 输出: Dog barks
    playSound(cat); // 输出: Cat meows
    return 0;
}
```

### overriding & overloading 实现 Polymorphism

在 C++ 中，函数重写和函数重载可以共同协作来实现多态性。函数重写主要用于实现运行时多态性，而函数重载主要用于实现编译时多态性。通过结合使用这两种机制，可以在不同层次上实现多态性，从而提高代码的灵活性和可扩展性。

```cpp
#include <iostream>
#include <string>

// 基类
class Base {
public:
    // 虚函数重载
    virtual void show() const {
        std::cout << "Base class show function with no arguments" << std::endl;
    }
    virtual void show(int i) const {
        std::cout << "Base class show function with int: " << i << std::endl;
    }
    virtual void show(double d) const {
        std::cout << "Base class show function with double: " << d << std::endl;
    }
};

// 派生类
class Derived : public Base {
public:
    void show(double d) const override {
        std::cout << "Derived class show function with double: " << d << std::endl;
    }
};

int main() {
    Base* basePtr;
    Derived derivedObj;
    // 基类指针指向派生类对象
    basePtr = &derivedObj;
    // 调用虚函数，后期绑定决定调用派生类的实现
    basePtr->show();       // 输出: Base class show function with no arguments
    basePtr->show(3.14);    // 输出: Derived class show function with double: 3.14
    return 0;
}
```



### 函数重载

函数重载要求**名同、参数不同**，而**不能只通过返回值的类型**进行区分。

#### 歧义转换

1. 按照**顺序**匹配
2. 找到**最佳**匹配
   1. 原则一:这个匹配**每一个参数不必其他的匹配更差**
   2. 原则二:这个匹配**有一个参数更精确匹配**

> 重载是为了让事情有效率，而不是过分有效率。

### 单目操作符重载

#### `++`与`--`

- 关键点在于如何区分前置操作符还是后置操作符
  - a++ 后置
  - ++a 前置
- 前置操作符的重载没有特殊的，正常编写即可
- 后置操作符的重载需要带一个 `(int)` 参数进行标识 （右值 a++）
  - `int` 参数仅用于区分前置和后置，不实际使用
  - `int`  是 `dummy argument` 哑元变量，就是惯例

##### 返回值类型的不同

1. 前置 `++` 运算符重载 (++a)

- **返回对象的引用**：`A&`
- **原因**：前置 `++` 运算符在增加对象值后，**直接返回修改后的对象引用，避免不必要的对象拷贝**，提高性能。

2. 后置 `++` 运算符重载 (a++)

- **返回对象的副本**：`A`
- **原因**：后置 `++` 运算符在增加对象值前，需要返回**对象的原始状态**，因此**返回一个对象副本**。

```cpp
class Counter {
    int value;
    public:
        Counter() { value = 0; }
        Counter& operator ++()//++a 左值
        {
            value ++;
            return *this;  // 先执行++再返回该对象的引用
        }
        Counter operator ++(int)//a++ 右值，int是dummy argument 哑元变量，就是惯例
        {
            Counter temp = *this;
            value++;
            return temp;
        }
}
```



#### `<<`

`ostream& operator << (ostream& o, Day& d)`，**返回引用保证可以链式调用**,如果没有&，那么在第一个 return 出现了对象拷贝，容易出现临时变量不能返回拷贝的问题。

```c++
#include <iostream>
using namespace std;

enum Day { SUN, MON, TUE, WED, THU, FRI, SAT };

// 重载 << 操作符
ostream& operator<<(ostream& o, Day& d) {
    switch (d) {
        case SUN: o << "SUN"; break;
        case MON: o << "MON"; break;
        case TUE: o << "TUE"; break;
        case WED: o << "WED"; break;
        case THU: o << "THU"; break;
        case FRI: o << "FRI"; break;
        case SAT: o << "SAT"; break;
    }
    return o;  // 返回 ostream 引用以支持链式调用
}

int main() {
    Day today = WED;
    cout << "Today is " << today << endl;  // 使用重载的 << 操作符输出 Day 对象
    return 0;
}
```



#### `=`

- `A& operator = (A& a)`不可以被继承，**返回引用对象**。
- 在 `=` 复制的过程中，尽可能地避免出现自我复制的情况（可以在程序入口检查）。
- 重载 `=` 可以避免浅拷贝引发的悬挂指针，内存无法释放等问题

```c++
class A {
    int x,y ;
    char *p ;
    public :
        A& operator = (A& a) {
            //赋值
            x = a.x;
            y = a.y;
            delete []p;
            p = new char[strlen(a.p)+1];
            strcpy(p,a.p);
            return *this;//也会出现悬指针
        }//还有问题，就是赋值自身会出现问题
};
A a, b;
a = b;//调用自己的复制

//idle pointer，B被析构的时候会将p释放掉，导致p指向已经被释放掉的指针
//Memory leak,A申请的区域可能没有办法被释放

//更安全的拷贝，先new再delete
char *pOrig = p;
p = new char ...
strcpy();
delete pOrig;
return *this;

//自我复制问题
if(this == &a)
    return *this;
```

#### `[]`

- `char& operator[](int i)`
- 对于一个符号可以构建多个重载函数（对于const 和 非 const 对象）
  - 可以是通过参数列表不同进行重载
  - 也可以是通过返回数据**是否为 const** 进行多重载，但是参数列表后也需要**添加 const 标识常量函数**，因为 const 对象只能够调用 const 成员函数

```c++
class string {
    char *p;
    public :
        string(char *p1){
            p = new char [strlen(p1)+ 1];
            strcpy(p,p1);//#pragma warning(disable:4996)来屏蔽问题
        }
        char& operator[](int i){
            return p[i];
        }
        const char operator[](int i) const{
            return p[i];
        }
        //可以用两个重载函数吗?是可以的
        virtual ~string() { delete[] p ; }
};
string s("aacd");
s[2] = 'b' ;
//第一个重载加上const可以使得const或者非const对象都可以调用
const string cs('const');
cout << cs[0];
const cs[0] = 'D';
//const 版本不想被赋值(返回const的)，非const版本想要被赋值，之后再进行重载的时候就需要同时重载两个
```



#### `()`

1. **类型转**换:`operator double()`
2. **函数调用**:`double operator()(double,int,int)` 
   - 可以通过这个实现对象函数


```c++
//类型转换
class Rational {
    public: Rational(int n1, int n2) {
        n = n1;
        d = n2;
    }
    operator double() {//类型转换操作符，语法特殊
        return (double)n/d;
    }
    private:
        int n, d;
};

//函数调用
class Func {
    double para;
    int lowerBound , upperBound ;
    public:
        double operator()(double,int,int);
};
Func f;
f(2.4, 0, 8);
```

### 不支持重载的操作符

不可以重载的操作符:

- `.`(成员访问操作符)
- `.*`(成员指针访问运算符，如下)
- `::`(域操作符)
- `?:`(条件操作符)
- `sizeof`:也不重载

#### 原因

- 前两个为了防止类访问出现混乱。
- `::`后面是名称不是变量。
- `?`  `:`条件运算符涉及到跳转，如果重载就影响了理解

#### 不建议重载的操作符号

永远不要重载`&&`和`||`，否则**你会丢失短路算法的优势**，还可能影响理解。



### 全局函数重载操作符

友元：`friend <retType> operator #(<arg1>,<arg2>)`

格式：`<ret type> operator #(<arg1>,<arg2>)`

**注意: `=`、`()`、`[]`、`->`不可以作为全局函数重载**

1. 单目运算符最好重载为**类的成员函数**
2. 双目运算符最好**重载为类的友元函数**

问题：为什么禁止在类外禁止重载赋值操作符?

1. 如果没有类内提供一个赋值操作符，则编译器会默认提供一个类内的复制操作符。
2. 查找操作符**优先查找类内，之后查找全局**，所以全局重载赋值操作符不可能被用到。

### 双目操作符重载

#### 加减乘除

类内重载也不是不可以，但是你在面对两个操作数类型不同的情形的时候你得写两个，还得考虑执行顺序，这不好。所以还是**推荐全局重载。**

类内友元的定义： `friend Complex operator+(Complex& c1 , Complex& c2);` （以加法为例）

```c++
// 全局函数重载至少包含一个用户自定义类型
Complex operator+ (Complex& c1 , Complex& c2 ) {
    Complex temp;
    temp.real = c1.real + c2.real;
    temp.imag = c1.imag + c2.imag;
    return temp;
}
// RVO 优化后
Complex operator+ (Complex& c1 , Complex& c2 ) {
    return Complex(c1.real + c2.real, c1.imag + c2.imag);
}
```

- 返回拷贝，不是引用，效率不太高?
  - 为了解决这个问题可以进行**返回值优化**：先计算，最后生成一个对象返回。**（在`return`语句里面`new`）**

>返回值优化（RVO）是一种编译器优化技术，用于避免在返回局部对象时的拷贝构造。通过直接在返回位置构造对象，减少不必要的拷贝，提高效率。



#### `->`

- 为二元运算符，重载的时候**按照一元操作符重载**描述。`A*operator->()`
- 重载 `->` 操作符使得自定义类对象**可以像指针一样访问其成员或成员函数**。
  - 重载 `->` 操作符通常**返回一个指针或具有 `operator->` 的对象**。
  - 需要**递归调用 `operator->`** 直到**返回实际的指针**。



```c++
#include <iostream>

class Inner {
public:
    void display() {
        std::cout << "Inner::display()" << std::endl;
    }
};

class Outer {
private:
    Inner* inner;
public:
    Outer() {
        inner = new Inner();
    }

    ~Outer() {
        delete inner;
    }

    // 重载 -> 操作符
    Inner* operator->() {
        return inner;
    }

    // 常量版本的重载 -> 操作符
    const Inner* operator->() const {
        return inner;
    }
};

int main() {
    Outer outer;
    outer->display();  // 使用重载的 -> 操作符访问 Inner 的成员函数

    const Outer constOuter;
    constOuter->display();  // 使用常量版本的重载 -> 操作符访问 Inner 的成员函数

    return 0;
}
```

### 结合操作符重载的多维数组结果

#### 隐式转换

- 隐式转换是指编译器在需要时自动将一种类型转换为另一种类型，而**不需要显式的类型转换操作符**。隐式转换通常发生在函数调用、赋值操作和表达式求值时。
- 如果一个类有一个**单参数的构造函数**，并且该构造函数没有被声明为 `explicit`（显式），那么该构造函数可以用于隐式转换。这种构造函数称为**转换构造函数**（conversion constructor）。

#### 多维数组的实现

```c++
class Array2D{
    private:
        int *p;
        int num1, num2;
    public:
	    class Array1D{
          public:
                Array1D(int *p) { this->p = p; }
                int& operator[ ] (int index) { return p[index]; }
                const int operator[ ] (int index) const { return p[index]; }
	        private:
		        int *p;
        };
        Array2D(int n1, int n2) {
            p = new int[n1 * n2];
            num1 = n1;
            num2 = n2;
        }
        virtual ~Array2D() {
            delete [] p;
        }
       // 这里的返回值可以是Array1D就是发生了 隐式转换：int* 转换为 Array1D 
        Array1D operator[](int index) {
            return p + index * num2;
        }
        const Array1D operator[] (int index) const {
            return p+index*num2;
        }
};
```



### 重载 `new` 和 `delete` 操作符

- 频繁调用系统的存储管理，影响效率
- 程序自身管理内存，提高效率

#### 实现方法

1. 调用系统存储分配，申请一块较大的内存
2. 针对该内存，自己管理存储分配、去配
3. 通过重载 `new` 与 `delete` 来实现
4. 重载的 `new` 与 `delete` 是静态成员(隐式的，不需要额外声明，不允许操作任何类的数据成员)
5. 重载的 `new` 与 `delete` 遵循类的访问控制，可继承(注意派生类和继承类的大小问题)

#### 重载 new

- `void *operator new (size_t size,  …)`

- 名：` operator new`

- 返回类型： `void *`

- 第一个参数：`size_t（unsigned int）`

  - 系统自动计算对象的大小，并传值给 size

- 其它参数：

  - 可有可无 `A * p = new (…) A` ， … 表示传给 new 的其它实参

- 注意： 

  - new 的重载**可以有多个**

  - 如果重载了new，那么通过new 动态创建该类的对象时将**不再调用内置的（预定义的）new**

全局重载

```c++
#include <iostream>
#include <cstdlib>  // for malloc and free

// 全局重载 new 操作符
void* operator new(size_t size) {
    std::cout << "Global custom new operator called. Size: " << size << std::endl;
    void* p = std::malloc(size);
    if (!p) {
        throw std::bad_alloc();
    }
    return p;
}

// 全局重载 delete 操作符
void operator delete(void* p) noexcept {
    std::cout << "Global custom delete operator called." << std::endl;
    std::free(p);
}

class MyClass {
public:
    int x;
    MyClass(int val) : x(val) {
        std::cout << "Constructor called with value: " << x << std::endl;
    }
};

int main() {
    // 使用全局重载的 new 操作符
    MyClass* obj = new MyClass(42);
    delete obj;  // 使用全局重载的 delete 操作符

    return 0;
}
```

类内重载

```cpp
#include <iostream>
#include <cstdlib>  // for malloc and free

class MyClass {
public:
    int x;
    MyClass(int val) : x(val) {
        std::cout << "Constructor called with value: " << x << std::endl;
    }

    // 类内重载 new 操作符
    void* operator new(size_t size) {
        std::cout << "Class custom new operator called. Size: " << size << std::endl;
        void* p = std::malloc(size);
        if (!p) {
            throw std::bad_alloc();
        }
        return p;
    }

    // 类内重载 delete 操作符
    void operator delete(void* p) noexcept {
        std::cout << "Class custom delete operator called." << std::endl;
        std::free(p);
    }
};

int main() {
    // 使用类内重载的 new 操作符
    MyClass* obj = new MyClass(42);
    delete obj;  // 使用类内重载的 delete 操作符

    return 0;
}
```



#### delete的部分

1. `void operator delete(void *,size_t size)`
2. 名：`operator delete`
3. 返回类型: void
4. 第一个参数: `void *` (必须)：被撤销对象的地址
5. 第二个参数:可有可无; 如果有，则必须为 size_t 类型：被撤销对象的大小
6. delete 的**重载只能有一个**
7. 如果重载了delete，那么通过 delete 撤消对象时将不再调用内置的(预定义的)delete
8. 动态删除其**父类的所有的**。
9. 如果子类中有一个虚继承函数，则size_t大小会根据继承情况进行确定大小

<div STYLE="page-break-after: always;"></div>



