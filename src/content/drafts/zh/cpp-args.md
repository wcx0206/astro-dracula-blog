---
title: cpp-args
tags:
---

### 可变参数有关内容

<!--more-->

### 为什么需要有可变参数传递

- 在构建某些函数的时候我们需要传递多个参数，但是可能无法确定具体参数的个数。
- 当然我们可以将参数封装为一个 list 进行传递，但是这里有内存和性能的开销。并且我们传递的参数类型往往是不一样的，简单的封装为一个 list 也是无法实现的。
- 我们更加希望函数可以逐个捕获我们传递的所有参数，这样子的传参方式也更加简单。
- 具体的例子可以参考 `printf` 函数的实现，就是可变参数的一种使用场景，往往传递的需要进行输出的参数的数量和类型都是不确定。
- 基于这种考虑，cpp 提供了三种可变参数传递的方式：
  - `va_list` 
  - 可变参数模版
  - `initializer_list`

### va_list

- `va_list`: 保存可变参数信息的类型

  - ```cpp
    va_list marker;//拿到一个指针,这个指针是字符串开始的位置
    ```

- `va_start`: 初始化 `va_list`，指向**第一个可变参数**

  - ```cpp
    va_start(args, count);// 2. 初始化，count是最后一个固定参数
    ```

- `va_arg`: 获取当前参数，并将指针移到下一个

  - ```cpp
    int value = va_arg(args, int); // 需要提供正确的类型
    ```

- `va_end`: 清理 `va_list`

- 注意

  - 必须有至少一个固定参数
  - `va_arg `需要正确的类型参数
  - 参数类型提升：`char/short -> int, float -> double`

- 示例：print 函数的实现

```cpp
#include <iostream>
using namespace std;

void MyPrint(char *s, ...){
    va_list marker;//拿到一个指针,这个指针是字符串开始的位置
    va_start(marker,s);//找到参数的位置，s的位置
    int i=0;
    char c;
    while ((c=s[i]) != '\0'){
        if (c != '%')
            cout << c;
        else{
            i++;
            switch (c=s[i]){
                case 'f': cout << va_arg(marker,double); break;
                case 'd': cout << va_arg(marker,int);break;
                case 'c': cout << va_arg(marker,char);break;
		    }
	    }
   	    i++;
    }
    cout << endl;
    va_end(marker);//将当前指针回归原始状态          
}
int main(){
	MyPrint("double: %f integer: %d string: %c ",1.1, 100, 'A');
}
```



### 可变参数模版

//todo

```cpp
// 2. 可变参数模板
template<typename T>
T sum_template(T arg) {
    return arg;
}

template<typename T, typename... Args>
T sum_template(T first, Args... args) {
    return first + sum_template(args...);
}

int main() {
    // 模板方式调用
    cout << "模板方式: " << sum_template(1, 2, 3, 4) << endl;
    return 0;
}
```

### initializer_list

//todo

```cpp
// 3. initializer_list
int sum_init_list(std::initializer_list<int> list) {
    int sum = 0;
    for(auto item : list) {
        sum += item;
    }
    return sum;
}

int main() {
    // initializer_list方式调用
    cout << "initializer_list: " << sum_init_list({1, 2, 3, 4, 5}) << endl;
    return 0;
}
```

