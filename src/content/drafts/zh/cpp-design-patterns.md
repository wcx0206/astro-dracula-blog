---
title: cpp-design-patterns
tags:
---

### Design Patterns in C++ 设计模式

<!--more-->

### 什么是设计模式

- 设计模式（Design Patterns）是软件工程中常见的解决特定问题的通用解决方案。
- 设计模式提供了一种可重用的、最佳的实践，用于解决软件设计中的常见问题。
- 设计模式不是具体的代码，而是解决问题的模板，可以在不同的情况下进行调整和应用。

### 抽象工厂

抽象工厂模式（Abstract Factory Pattern）是**一种创建型设计模式**，它**提供一个接口**，用于创建一系列相关或互相依赖的对象，**而无需指定它们具体的类**。

#### 为什么我们需要抽象工厂

- **解耦**：**将具体类的实例化与使用解耦**，你可以在不知道类的名称的情况通过调用一个接口创建一个具体的对象
- **一致性**：确保一系列相关对象的创建具有一致性。
- **可扩展性**：方便添加新的产品族而不修改现有代码。
- **灵活性**：通过配置文件或运行时参数选择不同的产品族。

#### 实现示例1

<img src="https://ydjsir-cn.oss-cn-shenzhen.aliyuncs.com/notes/C%2B%2B%20exam.assets/5.png" alt="5" style="zoom:50%;" />

Step1：提供Windows GUI类库：WinButton

```c++
WinButton *pb= new WinButton();
pb->SetStyle();
WinLabel *pl = new WinLabel();
pl->SetText();
```

Step2：增加对Mac的支持:MacButton，MacLabel

```c++
MacButton *pb= new MacButton();
pb->SetStyle();
MacLabel *pl = new MacLabel();
pl->SetText();
```

Step3：增加用户跨平台设计的支持：将Button抽象出来

- 通过这一步我们对于创建 button 和 label 这件事就不需要去调用具体的构造函数
- 我们实现的代码会根据目前的系统（style）去创建对应的具体工厂
- 我们调用获得的具体工厂的构建函数就可以创建出想要的对象（button/label）

```c++

class Button; // Abstract Class 
class MacButton: public Button {}; 
class WinButton: public Button {}; 
class Label; // Abstract Class 
class MacLabel: public Label {}; 
class WinLabel: public Label {};

//创建工厂来保证创建的正确性
class AbstractFactory {
public:
    virtual Button* CreateButton() =0;
    virtual Label* CreateLabel() =0;
}; 
class MacFactory: public AbstractFactory {
public:
    MacButton* CreateButton() { return new MacButton; }
    MacLabel* CreateLabel() {  return new MacLabel; }
}; 
class WinFactory: public AbstractFactory {
public:
    WinButton* CreateButton() { return new WinButton; }
    WinLabel*   CreateLabel() { return new WinLabel; }
};

AbstractFactory* fac; //创建抽象工厂的指针
// 使得上面创建的工厂的指针实际指向对应类型具体工厂（派生类可以复制给基类指针）
switch (style) {
case MAC:
    fac = new MacFactory;
    break;
case WIN:
    fac = new WinFactory;
    break;
}
Button* button = fac->CreateButton();
Label* Label = fac->CreateLabel();
```

#### 实现示例2

- 这个示例比上面的更加复杂一些
  - 主要是使用了抽象的产品  `AbstractProductA`
  - 以及添加了调用者 `client`

<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Abstract_factory_UML.svg/1200px-Abstract_factory_UML.svg.png" alt="Abstract factory pattern - Wikipedia" style="zoom:50%;"/>



- 抽象产品：定义一系列相关或互相依赖的产品接口。

  ```cpp
  #include <iostream>
  using namespace std;
  
  // 抽象产品A
  class AbstractProductA {
  public:
      virtual void operationA() const = 0;
      virtual ~AbstractProductA() {}
  };
  
  // 抽象产品B
  class AbstractProductB {
  public:
      virtual void operationB() const = 0;
      virtual ~AbstractProductB() {}
  };
  ```

- 具体产品：实现抽象产品接口的具体类。

  ```cpp
  // 具体产品A1
  class ConcreteProductA1 : public AbstractProductA {
  public:
      void operationA() const override {
          cout << "ConcreteProductA1 operationA" << endl;
      }
  };
  
  // 具体产品A2
  class ConcreteProductA2 : public AbstractProductA {
  public:
      void operationA() const override {
          cout << "ConcreteProductA2 operationA" << endl;
      }
  };
  
  // 具体产品B1
  class ConcreteProductB1 : public AbstractProductB {
  public:
      void operationB() const override {
          cout << "ConcreteProductB1 operationB" << endl;
      }
  };
  
  // 具体产品B2
  class ConcreteProductB2 : public AbstractProductB {
  public:
      void operationB() const override {
          cout << "ConcreteProductB2 operationB" << endl;
      }
  };
  ```

- 抽象工厂：定义创建一系列相关或互相依赖对象的接口。

  ```cpp
  // 抽象工厂
  class AbstractFactory {
  public:
      virtual AbstractProductA* createProductA() const = 0;
      virtual AbstractProductB* createProductB() const = 0;
      virtual ~AbstractFactory() {}
  };
  ```

- 具体工厂：实现抽象工厂接口的具体类

  ```cpp
  // 具体工厂1
  class ConcreteFactory1 : public AbstractFactory {
  public:
      AbstractProductA* createProductA() const override {
          return new ConcreteProductA1();
      }
      AbstractProductB* createProductB() const override {
          return new ConcreteProductB1();
      }
  };
  
  // 具体工厂2
  class ConcreteFactory2 : public AbstractFactory {
  public:
      AbstractProductA* createProductA() const override {
          return new ConcreteProductA2();
      }
      AbstractProductB* createProductB() const override {
          return new ConcreteProductB2();
      }
  };
  ```

- 客户端代码：使用抽象工厂创建一系列相关对象。

  ```cpp
  void clientCode(const AbstractFactory& factory) {
      AbstractProductA* productA = factory.createProductA(); // 创建对应的产品
      AbstractProductB* productB = factory.createProductB(); 
      productA->operationA(); 
      productB->operationB();
      delete productA;
      delete productB;
  }
  
  int main() {
      ConcreteFactory1 factory1;
      clientCode(factory1);
  
      ConcreteFactory2 factory2;
      clientCode(factory2);
  
      return 0;
  }
  ```

#### 注意点

- **内存管理**：确保创建的对象正确释放，避免内存泄漏。
- **扩展性**：添加新的产品族时，**只需添加新的具体工厂和具体产品类**，不需要修改现有代码。
- **一致性**：确保同一个工厂创建的对象是**相关或互相依赖的**，避免混用不同产品族的对象。
- **抽象层次**：抽象工厂和抽象产品接口定义清晰，具体实现类遵循接口契约。

### 单件模式

#### 为什么需要单件模式

在很多时候我们需要确保某一个类只能有一个对象实例，避免创建多个引发错误和资源浪费

#### 什么是单件模式

单件模式（Singleton Pattern）是一种**创建型设计模式**，确保**一个类只有一个实例**，并**提供一个全局访问点来访问该实例**。

#### 单件模式实现要点

1. **私有构造函数**：
   - 将**构造函数设为私有**，防止外部创建实例。
   - 确保**类的实例只能通过类内部的方法创建**。
2. **静态实例指针**：
   - 使用**静态指针保存类的唯一实例**。
   - 静态指针在类加载时初始化，确保全局唯一。
3. **公有静态方法**：
   - **提供一个公有的静态方法，用于访问类的唯一实例。**
   - 该方法负责创建实例（如果尚未创建）并返回实例指针。
4. **线程安全**：
   - 确保在多线程环境下，实例的创建是线程安全的。
   - 可以使用互斥锁（mutex）或双重检查锁定（double-checked locking）等技术。
5. **防止拷贝和赋值**：
   - 禁止拷贝构造和赋值操作，防止创建多个实例。
   - 可以将拷贝构造函数和赋值操作符设为私有或删除。

#### 实现示例

<img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa17a60bd-0ffc-437b-9553-70b7abc5bfd6_956x674.png" alt="Singleton Design Pattern and 7 Ways to Implement it" style="zoom:50%;" />



```cpp
#include <iostream>

class Singleton {
public:
    // 获取单例实例的静态方法
    static Singleton* getInstance() {
        if (instance == nullptr) {
          	// 当唯一实例为nullptr时调用私有的构造方法进行构建并且赋给static指针
            instance = new Singleton();
        }
      	// static指针不为nullptr，实例已被创建直接返回该唯一指针
        return instance;
    }

    void showMessage() {
        std::cout << "Hello from Singleton!" << std::endl;
    }

    // 禁止拷贝构造和赋值操作
    Singleton(const Singleton&) = delete;
    Singleton& operator=(const Singleton&) = delete;

private:
    // 私有构造函数，防止外部创建实例
    Singleton() {
        std::cout << "Singleton Constructor" << std::endl;
    }

    // 私有析构函数，防止外部销毁实例
    ~Singleton() {
        std::cout << "Singleton Destructor" << std::endl;
    }

    // 静态指针保存唯一实例
    static Singleton* instance;
};

// 初始化静态指针
Singleton* Singleton::instance = nullptr;

int main() {
    // 获取单例实例并调用方法
    Singleton* instance = Singleton::getInstance();
    instance->showMessage();

    return 0;
}
```
