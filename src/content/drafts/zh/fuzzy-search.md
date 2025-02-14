---
title: fuzzy-search
tags:
---

如何实现一个简单的模糊搜索  基于 Go + Kitex + Gorm

<!--more-->

### 什么是模糊搜索

模糊搜索是一种搜索技术，允许用户在查询时使用部分匹配或近似匹配，而不是精确匹配。

可以在用户只知道查询对象的一部分信息的时候，更好的辅助用户快速高效的进行查询。



### SQL 形式

使用层级式的 SQL 语句

先使用 LIKE 关键字查询出所有符合 `'%keyword%' ` 的结果

然后根据不同的场景，使用 ORDER 关键字按照匹配程度进行排序（相似度排序）

```sql
SELECT * FROM Music WHERE name LIKE '%keyword%' ORDER BY CASE
  WHEN name = 'keyword' THEN 1
  WHEN name LIKE 'keyword%' THEN 2
  WHEN name LIKE '%keyword%' THEN 3
  ELSE 4
END;
```



### Go 形式

```

```

