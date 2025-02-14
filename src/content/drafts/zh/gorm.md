---
title: gorm
tags:
---

Gorm 的一些特性和使用方法

<!--more-->

### ORM

如果 `ORM` 没有被提出时，对于数据库中的记录和表我们只能够编写 `sql` 语句来对其进行操作。显然对于大量需要操作数据库的情景这是十分复杂麻烦的，故出现了 `ORM` 技术

-  ORM（Object-Relational Mapping，对象关系映射）
- 是一种编程技术，用于在面向对象的编程语言（如 Java、Python、Go 等）和关系型数据库（如 MySQL、PostgreSQL、SQLite 等）之间**建立映射关系**。
- ORM 的核心思想是：
  - 将数据库中的**表和表中的记录**映射为编程语言中的**类和对象（这里也可能是 struct ）**
  - 这样在编写代码时就可以通过**操作对象的方式**来操作数据库，而无需直接编写 SQL 语句。



## GORM

 [GORM 官方文档](https://gorm.io/zh_CN/docs/)

### 什么是 GOM

The fantastic ORM library for Golang aims to be developer friendly.

![image-20250122114638453](/Users/wcx/Library/Application Support/typora-user-images/image-20250122114638453.png)

### GORM 的使用



###  GORM's soft delete feature

在 GORM（Go 的 ORM 库）中，软删除和硬删除是两种不同的删除记录的方式：

1. **软删除（Soft Delete）**：

   - 软删除不会真正从数据库中删除记录，而是通过设置一个标志（通常是 `DeletedAt` 字段）来标记记录已被删除。

   - 软删除的记录在查询时默认不会被返回，但仍然存在于数据库中，可以通过特殊查询条件找回。

     ![image-20241105001855709](/Users/wcx/Library/Application Support/typora-user-images/image-20241105001855709.png)

2. **硬删除（Hard Delete）**：

   - 硬删除会真正从数据库中删除记录，删除后记录无法恢复。

```go
func main() {
    db, _ := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})

    // 自动迁移模式
    db.AutoMigrate(&User{})

    // 创建用户
    db.Create(&User{Name: "John"})

    // 软删除用户
    db.Delete(&User{}, 1)
  
    // 硬删除用户
    db.Unscoped().Delete(&User{}, 1)

    // 查询未删除的用户
    var users []User
    db.Find(&users)
    fmt.Println(users)

    // 查询所有用户，包括已删除的
    db.Unscoped().Find(&users)
    fmt.Println(users)

  
}
```

