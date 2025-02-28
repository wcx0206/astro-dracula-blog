---
title: redis 常用语句
tags:
 - tag1
 - tag2
 - tag3
date: 2025-02-24 16:59:13
---

Redis 常用命令速查

<!--more-->

### 如何连接到 Redis （命令行）

```bash
redis-cli
```

### 过期时间相关

#### 设置过期时间（设置时长）

```bash
EXPIRE <key> <seconds> # 单位为秒
EXPIRE mykey 60  # 设置键 mykey 在 60 秒后过期 如果设置成功返回1 如何键不存在返回0

PEXPIRE <key> <milliseconds> # 单位为毫秒
PEXPIRE mykey 5000  # 设置键 mykey 在 5000 毫秒后过期
```

#### 直接设定过期的具体时间（Unix 时间戳）

```bash
EXPIREAT <key> <timestamp>
EXPIREAT mykey 1700000000  # 设置键 mykey 在 Unix 时间戳 1700000000 时过期

PEXPIREAT <key> <timestamp>
PEXPIREAT mykey 1700000000000  # 设置键 mykey 在 Unix 时间戳 1700000000000 毫秒时过期
```

#### 可以在 SET 设置键值对的时候直接设置

```bash
SET mykey "value" EX 60 # EX 秒
SET mykey "value" PX 5000 # PX 毫秒
```

#### 查看过期时间

```bash
TTL <key>
TTL mykey  # 返回剩余秒数，如果键不存在返回 -2，如果键没有设置过期时间返回 -1

PTTL <key> # 以毫秒为单位
```

#### 移除过期时间

```bash
PERSIST <key>
PERSIST mykey  # 如果成功移除过期时间，返回 1；如果键没有过期时间或键不存在，返回 0
```



### 字符串（String）

- **`SET key value`**：设置键值对。

  ```bash
  SET mykey "Hello"
  ```

- **`GET key`**：获取键的值。

  ```bash
  GET mykey
  ```

- **`INCR key`**：将键的值加 1。

  ```bash
  INCR counter
  ```

- **`DECR key`**：将键的值减 1。

  ```bash
  DECR counter
  ```

### 列表（List）

- **`LPUSH key value`**：将值插入到列表头部。

  ```bash
  LPUSH mylist "item1"
  ```

- **`RPUSH key value`**：将值插入到列表尾部。

  ```bash
  RPUSH mylist "item2"
  ```

- **`LRANGE key start stop`**：获取列表中指定范围的元素。

  ```bash
  LRANGE mylist 0 -1  # 获取整个列表
  ```

- **`LREM key count value`**：从列表中删除指定数量的值。

  ```bash
  LREM mylist 2 "item1"  # 从左到右删除最多 2 个值为 "item1" 的元素
  ```

### 集合（Set）

- **`SADD key member`**：将成员添加到集合中。

  ```bash
  SADD myset "item1"
  SREM myset "itSm1" "item2"  # 删除 Set 中的 "item1" 和 "item2"
  ```

- **`SMEMBERS key`**：获取集合中的所有成员。

  ```bash
  SMEMBERS myset
  ```

- **`SISMEMBER key member`**：检查成员是否在集合中。

  ```bash
  SISMEMBER myset "item1"
  ```

### 有序集合（Sorted Set）

- **`ZADD key score member`**：将成员及其分数添加到有序集合中。

  ```bash
  ZADD myzset 10 "item1"
  ```

- **`ZRANK key member`**：获取成员在有序集合中的排名（从小到大）。

  ```bash
  ZRANK myzset "item1"
  ```

- **`ZRANGE key start stop`**：获取有序集合中指定范围的成员。

  ```bash
  ZRANGE myzset 0 -1
  ```

### 哈希（Hash）

- **`HSET key field value`**：设置哈希表中的字段值。

  ```bash
  HSET user:1 name "Alice"
  ```

- **`HGET key field`**：获取哈希表中的字段值。

  ```bash
  HGET user:1 name
  ```

- **`HGETALL key`**：获取哈希表中的所有字段和值。

  ```bash
  HGETALL user:1
  ```

### 其他常用命令

- **`DEL key`**：删除键。

  ```bash
  DEL mykey
  ```

- **`FLUSHDB`**：清空当前数据库。

  ```bash
  FLUSHDB
  ```

- **`FLUSHALL`**：清空所有数据库。

  ```bash
  FLUSHALL
  ```

- **`KEYS pattern`**：查找符合模式的键。

  ```bash
  KEYS mykey
  ```

- **`INFO`**：获取 Redis 服务器的信息和统计。

  ```bash
  INFO
  ```

