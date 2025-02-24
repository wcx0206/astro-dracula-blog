---
title: SQL 中与连接相关的内容
tags:
 - SQL
date: 2025-02-24 16:05:35
---

SQL 中的连接 JOIN，涉及外连接（LEFT RIGHT FULL CROSS）与内连接（INNER）

<!--more-->

### 1. **内连接（INNER JOIN）**

**作用**：只返回两个表中匹配的行
**示例**：

```sql
SELECT employees.name, departments.department_name
FROM employees
INNER JOIN departments 
ON employees.department_id = departments.id;
```

**结果**：仅显示有明确部门归属的员工及其部门名称。

------

### 2. **左连接（LEFT JOIN / LEFT OUTER JOIN）**

**作用**：返回左表全部数据 + 右表匹配的数据（不匹配的右表字段为 `NULL`）**FROM 的为左表**
**示例**：

```sql
SELECT employees.name, departments.department_name
FROM employees
LEFT JOIN departments 
ON employees.department_id = departments.id;
```

**结果**：显示**所有员工**，即使他们没有分配部门（此时 `department_name` 为 `NULL`）。

------

### 3. **右连接（RIGHT JOIN / RIGHT OUTER JOIN）**

**作用**：返回右表全部数据 + 左表匹配的数据（不匹配的左表字段为 `NULL`）
**示例**：

```sql
SELECT employees.name, departments.department_name
FROM employees
RIGHT JOIN departments 
ON employees.department_id = departments.id;
```

**结果**：**显示所有部门**，即使该部门没有员工（此时 `name` 为 `NULL`）。

------

### 4. **全外连接（FULL OUTER JOIN）**

**作用**：返回**左右表所有数据**，匹配的合并，不匹配的补 `NULL`。
 **示例**：

```sql
SELECT employees.name, departments.department_name
FROM employees
FULL OUTER JOIN departments 
ON employees.department_id = departments.id;
```

**注意**：MySQL 不支持 `FULL OUTER JOIN`，但可通过 `LEFT JOIN + RIGHT JOIN + UNION` 实现。

------

### 5. **交叉连接（CROSS JOIN）**

**作用**：返回两表的**笛卡尔积（所有可能的行组合）**。
 **示例**：

```sql
SELECT employees.name, departments.department_name
FROM employees
CROSS JOIN departments;
```

**结果**：每个员工与每个部门组合（例如：10 员工 × 5 部门 = 50 行结果）。

------

### 简化记忆

- **INNER JOIN** → 只要匹配的“交集”。
- **LEFT/RIGHT JOIN** → 保左/右表全部，另一表补 `NULL`。
- **FULL JOIN** → 左右全保留，不匹配的补 `NULL`。
- **CROSS JOIN** → 所有组合，慎用（数据量爆炸！）。
