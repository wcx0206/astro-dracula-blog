---
title: java集合结构
tags:
 - Java
date: 2025-02-26 09:35:28
---

### Java 各种集合的底层实现

<!--more-->

参考文章：[JavaGuide  集合概述](https://javaguide.cn/java/collection/java-collection-questions-01.html)

### 整体概览

- 实现 `Collection` 的容器，主要用于**单一元素**
- 实现 `Map` 接口，主要用户存储**键值对**



![Java 集合框架概览](https://oss.javaguide.cn/github/javaguide/java/collection/java-collection-hierarchy.png)

## Collection

### Set

- `HashSet`(无序，唯一): 基于 `HashMap` 实现的，底层采用 `HashMap` 来保存元素。
- `LinkedHashSet`: `LinkedHashSet` 是 `HashSet` 的子类，并且其内部是通过 `LinkedHashMap` 来实现的。
- `TreeSet`(有序，唯一): 红黑树(自平衡的排序二叉树)。

### List

- `ArrayList`：`Object[]` 数组，线程不安全
- `Vector`：`Object[]` 数组，线程安全
- `LinkedList`：双向链表(JDK1.6 之前为循环链表，JDK1.7 取消了循环)。

#### ArrayList

`ArrayList` 继承于 `AbstractList` ，实现了 `List`, `RandomAccess`, `Cloneable`, `java.io.Serializable` 这些接口。

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{

  }
```

- `List` : 表明它是一个列表，支持添加、删除、查找等操作，并且可以通过下标进行访问。
- `RandomAccess` ：这是一个标志接口，表明实现这个接口的 `List` 集合是支持 **快速随机访问** 的。在 `ArrayList` 中，我们即可以通过元素的序号快速获取元素对象，这就是快速随机访问。
- `Cloneable` ：表明它具有拷贝能力，可以进行深拷贝或浅拷贝操作。
- `Serializable` : 表明它可以进行序列化操作，也就是可以将对象转换为字节流进行持久化存储或网络传输，非常方便。



### Queue

`PriorityQueue`: `Object[]` 数组来实现小顶堆。

`DelayQueue`:`PriorityQueue`。

`ArrayDeque`: 可扩容动态双向数组。

## Map

- `HashMap`：JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是 `HashMap` 的主体，链表则是主要为了**解决哈希冲突**而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，**将链表转化为红黑树**，以减少搜索时间。
- `LinkedHashMap`：`LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，**增加了一条双向链表**，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了**访问顺序相关逻辑**。
- `Hashtable`：数组+链表组成的，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的。
- `TreeMap`：红黑树（自平衡的排序二叉树）。
