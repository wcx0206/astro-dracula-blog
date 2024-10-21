---
title: C++ const 用法汇总
toc: true
tags:
  - C & C++
  - const
categories:
  - CS
  - Languages
  - C & Cpp
abbrlink: 7ec6ba38
date: 2022-11-17 20:05:00
---

最开始只是用 const 来定义常量，学到了指针传参的时候又知道了用 const 来防止一些值的修改，学到类的时候又看到非静态成员函数后边加个 const 来干嘛干嘛，然后么又听说什么顶层 const、底层 const... 真是越学越迷糊了，赶紧做一波整理。

<!--more-->

**[2023 年 3 月 24 日更新：]** 此文章已经重写，请查看：_[The const and constexpr in C++ (REMAKE)](/posts/3358bcc1.html)_

## 最基本的用法 —— 定义常量

这个不必多说，直接上代码：

```c++
int a = 1;
const int b = 1;
a = 2; // 正确：a 没有 const 修饰，可以改变其值
b = 2; // 错误：b 有 const 修饰，不能改变其值
```

除了这个，还有一点是，虽然似乎我们可以通过一些“骚操作”改变 const 修饰的变量（常量?）的值，但是输出的时候，会发现结果并没有改变。看下边的代码：

```c++
#include <iostream>
using namespace std;

int main()
{
    const int x = 7;
    int *p = (int *)&x;
    // 奇怪的骚操作
    // 直接 int *p = &x; 是不行的
    // 但这样可以
    // 这样我们就可以通过指针 p 来直接操作那块内存
    *p = 12;
    cout << x << endl;
    cout << *p << endl;
    return 0;
}

/*
输出结果：
7
12
*/
```

但是如果加上 `volatile` 关键词，却可以发现结果也可以跟着变：

```c++
#include <iostream>
using namespace std;

int main()
{
    volatile const int x = 7;
    int *p = (int *)&x;
    *p = 12;
    cout << x << endl;
    cout << *p << endl;
    return 0;
}

/*
输出结果：
12
12
*/
```

但是，上边的 `const` 修饰的都不是全局变量。如果修饰的是全局变量，我们似乎就不能通过指针的小把戏来改变 `const` 的值了：

```c++
// 错误代码：
// 这玩意儿能通过编译，但是压根跑不起来

#include <iostream>
using namespace std;

const int x = 1;

int main()
{
    int *p1 = (int *)&x;
    *p1 = 7;
    cout << "x = " << x << endl;
    cout << "*p1 = " << *p1 << endl;
    return 0;
}
```

但如果加上了 `volatile` 依然可以跑，并且也可以用指针来修改它的值：

```c++
#include <iostream>
using namespace std;

volatile const int y = 2;

int main()
{
    int *p2 = (int *)&y;
    *p2 = 8;
    cout << "y = " << y << endl;
    cout << "*p2 = " << *p2 << endl;
    return 0;
}

/*
运行结果：
y = 8
*p2 = 8
*/
```

总结一下，就是——

1. 如果是局部的 `const`，那至少有两方面的保护：一是编译检查，看看我们下边的代码是否显而易见地尝试去改变它的值，如果有那就报错；二是编译器的自动优化，编译器会把这个变量的值复制一份放到寄存器里，所以即使我们用指针改变了原来内存里的值，输出的结果还是原来的值（备份到寄存器的原来的值的拷贝），所以当我们使用 `voliatile` 关键字关闭了编译器的这种优化，让程序每运行到要用到这个 `const` 修饰的变量的时候都去原来的地址读取值的时候，我们的小把戏成功了。
2. 如果是全局的 `const`，还会有其他的机制，具体还没弄清楚，不过你可以看看[《Linux 系统编程学习总结 （二）ELF - 知乎》](https://zhuanlan.zhihu.com/p/145323002)这篇文章，也许会有帮助？

## 顶层 const 和底层 const

首先，讨论顶层底层的 const，一般都是对指针变量才有意义。那么啥是顶层 const？啥是底层 const？

> **顶层 const**（top-level const）表示指针**本身**是个常量;
> **底层 const**（low-level const）表示指针所指的**对象**是一个常量。

举几个例子：

```c++
int x = 7;
int y = 12;
int *const p1 = &x;       // 顶层 const
const int *p2 = &x;       // 底层 const
const int *const p3 = &x; // 左边是底层 const, 右边是顶层 const
p1 = &y;                  // 错误，p1 是顶层 const 修饰的，所以 p1 指向的地址是确定的，无法更改它的指向
p2 = &y;                  // 正确，p2 没有被顶层 const 修饰，这意味着我们可以修改它的指向
p3 = &y;                  // 错误
*p1 = y;                  // 正确，p1 没有被底层 const 修饰，这意味着我们可以修改它指向的值
*p2 = y;                  // 错误，p2 是底层 const 修饰的，我们无法改变它指向的值
*p3 = y;                  // 错误
```

也就是说：

- 仅仅被顶层 const 修饰，意味着指针变量的指向无法改变，但可以操作指向的值（指针常量? 指针（地址）是个常量）；
- 仅仅被底层 const 修饰，意味着指针变量的指向可以改变，但无法操作指向的值（常量指针？ 指向常量的指针）；
- 如果两重修饰，那么就就没办法改变指针的指向，也没办法操作指向的值。

顺便一说对于引用的情况。因为引用必须初始化并且初始化完成后（起玩别名后就不能改变它引用的对象了），所以 `const int &` 就是顶层的，并且没有 `int & const` 这种写法。

## 函数中的 const

### 参数列表中的 const

其实就是希望函数运行过程中不改变这个变量的值。比如写函数原型的时候用 `const int &`，其中 `const` 表示这个函数对这个变量的操作是只读的，不会改变原来的值，而 `&` 的作用就是，既然这里只是要读一读这个变量的值，并不对它进行操作，那我就不创建副本了，直接用它自己。

### 返回的 const

这边还没弄清楚，以后弄清楚了再写。

## 类的非静态成员函数后边跟的 const

这样可以让这个函数的 `this` 是只读的。

看这篇文章：[《C\C++ 中函数后面加 const_51CTO 博客\_c++ const 函数》](https://blog.51cto.com/u_11495341/3040168)

> 非静态成员函数后面加 const（加到非成员函数或静态成员后面会产生编译错误）表示成员函数隐含传入的 this 指针为 const 指针，决定了在该成员函数中， 任意修改它所在的类的成员的操作都是不允许的（因为隐含了对 this 指针的 const 引用）
> 唯一的例外是对于 mutable 修饰的成员。加了 const 的成员函数，可以被非 const 对象和 const 对象调用，但不加 const 的成员函数 只能被非 const 对象调用。

## 参考资料

- [《C++ const 用法小结 （欢迎大家拍砖） - karllen - 博客园》](https://www.cnblogs.com/Forever-Kenlen-Ja/p/3776991.html)
- [《Linux 系统编程学习总结 （二）ELF - 知乎》](https://zhuanlan.zhihu.com/p/145323002)
- [《C\C++ 中函数后面加 const_51CTO 博客\_c++ const 函数》](https://blog.51cto.com/u_11495341/3040168)
- [《C++ 顶层 const 和底层 const - 知乎》](https://zhuanlan.zhihu.com/p/499784237)
- [《C++ 干货系列 —— 顶层 const 和底层 const - 知乎》](https://zhuanlan.zhihu.com/p/161560391)
