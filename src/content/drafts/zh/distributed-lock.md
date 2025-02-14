---
title: Distributed-Lock
tags:
---

有关于分布式锁的内容，并且使用 Redis + Redisson + RLock 应用简单的分布式锁

<!--more-->

### 为什么需要分布式锁

同样是基于当下分布式和云服务应用的兴起。和单体系统不同分布式系统中可能会有多个节点要访问同一个共享资源。这个时候简单的本地锁肯定是不能够避免这中间的因为并发产生的种种问题。所以需要分布式锁的出现来确保同一时间只有一个节点能够访问该资源，避免数据不一致和竞争条件。

#### 分布式锁和本地锁的区别

1. **应用范围**：
   - **本地锁**：仅在单个进程或单个节点内有效，适用于单机环境。
   - **分布式锁**：在多个节点之间有效，适用于分布式系统。
2. **实现方式**：
   - **本地锁**：通常使用编程语言提供的同步机制（如Java中的`ReentrantLock`、Python中的`threading.Lock`）实现。
   - **分布式锁**：通常使用分布式协调服务（如Zookeeper）、分布式缓存（如Redis）、数据库等实现。

<img src="/Users/wcx/Library/Application Support/typora-user-images/image-20241016195635457.png" alt="image-20241016195635457" style="zoom: 25%;" />

### 分布式锁实现的关键

1. 互斥：事实上这是所有锁实现的前提（如果锁都不能保证互斥那么不就没写）
2. 锁的释放：一开始锁的释放是我们编写释锁逻辑执行的，但是某些情况下释锁逻辑可能出现问题导致锁一致无法释放，从而出现死锁导致服务中断。为解决释锁问题，有以下的一个逐步解决问题的发展过程：
   1. 通过为锁添加过期时间：在加锁的时候为锁设计一个过期时间，一旦超过这个时间就直接讲锁释放，从而避免死锁。但是实际上无法预知占锁逻辑/事务需要执行的时间。如果锁的过期时间过短，很容易出现需要加锁的事务还没有执行结束锁就被释放从而出现问题。
   2. 优雅的锁时间管理：Redisson 的分布式锁实现（WatchDog 模式。提供了一个专门用来监控和续期锁的 **Watch Dog（ 看门狗）**，如果操作共享资源的线程还未执行完成的话，Watch Dog 会不断地延长锁的过期时间，进而保证锁不会因为超时而被释放。
3. 锁的可重入：一个线程（事务）已经获得了一个锁，在执行的过程中因为某些逻辑需要再次获得这个锁。此时不会再去请求获得一个锁（本身就有一个锁了再去请求不就等着死锁吗）而是会直接使用本身已经获得的那个锁。在全部需要这个锁的过程结束后再将这个锁释放

<img src="https://oss.javaguide.cn/github/javaguide/distributed-system/distributed-lock/distributed-lock-redisson-renew-expiration.png" alt="Redisson 看门狗自动续期" style="zoom:50%;" />

### ZooKeeper  实现的分布锁

获锁

1. 首先我们要有一个持久节点`/locks`，客户端获取锁就是在`locks`下创建临时顺序节点。
2. 假设客户端 1 创建了`/locks/lock1`节点，创建成功之后，会判断 `lock1`是否是 `/locks` 下最小的子节点。如果 `lock1`是最小的子节点，则获取锁成功。否则，获取锁失败。（可以类比当前节点是否是队列中的首元素）
3. 如果获取锁失败，则说明有其他的客户端已经成功获取锁。客户端 1 并不会不停地循环去尝试加锁，而是在前一个节点比如`/locks/lock0`上注册一个事件监听器。这个监听器的作用是当前一个节点释放锁之后通知客户端 1（避免无效自旋），这样客户端 1 就加锁成功了。（这里可以类比于挂在到前面的一个节点上形成一个队列，按照队列的排列顺序获锁）

释放锁：

1. 成功获取锁的客户端在执行完业务流程之后，会将对应的子节点删除。（相当于将一个队列中的首元素 pop，并且通知后续的第二个元素 ）
2. 成功获取锁的客户端在出现故障之后，对应的子节点由于是临时顺序节点，也会被自动删除，避免了锁无法被释放

### 在项目中的实现与应用（Redisson RLock）

#### Redisson 配置

依赖获取 + RedissonConfig 定义一下 Redisson 客户端的一些参数 

具体可以参考上一篇 Redisson 实现接口限流的文章

#### 在项目中的实现

定义一个了一个 POST 请求接口 /set，用于设置 Redis 键值对，并对操作进行加锁

关键操作：

1. `redissonClient.getLock()` ：根据名字创建这个锁的对象，但并不是真正去获得锁。
2. `lock.tryLock()` ：真正去获得锁，根据返回值判断是否获得锁
3. `lock.unlock()` ： 在 `finally` 部分释放锁

```java
    @PostMapping("/set")
    public ResultVO<String> setValue(@RequestParam String key, @RequestParam String value) {
        // 创建了一个分布式锁对象，名为 "redisLock"（没有真正意义上去获取锁）
        RLock lock = redissonClient.getLock("redisLock");
        boolean isLocked = false;
        try {
            // 真正 尝试获取锁，等待时间 100 毫秒，租赁时间 10000 毫秒
            
            /*
             * tryLock 方法有三个参数：
             * 1. 等待时间：在放弃尝试获取锁之前等待的时间（这里是 100 毫秒）。
             * 2. 租赁时间：锁自动释放的时间（这里是 10000 毫秒）。
             * 3. 时间单位：时间的单位（这里是毫秒）。
             * 如tryLock成功获取到锁，tryLock 方法返回 true，否则返回 false。
             */
            
            isLocked = lock.tryLock(100, 10000, TimeUnit.MILLISECONDS);
            if (isLocked) {
                // 如果成功获取到锁，设置 Redis 键值对
                redisUtil.set(key, value);
                return ResultVO.buildSuccess("Value set successfully");
            } else {
                // 如果未能获取到锁，返回失败信息
                return ResultVO.buildFailure("Could not acquire lock");
            }
        } catch (InterruptedException e) {
            // 如果获取锁时被中断，设置线程中断状态并返回失败信息
            Thread.currentThread().interrupt();
            return ResultVO.buildFailure("Lock acquisition interrupted");
        } finally {
            // 确保在最终释放锁
            if (isLocked) {
                lock.unlock();
            }
        }
    }
```

