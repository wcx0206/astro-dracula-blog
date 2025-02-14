---
title: afl
tags:
---

AFL++ 与模糊测试

<!--more-->

### 什么是 AFL

AFL（American Fuzzy Lop）是一种开源的模糊测试工具，用于发现软件中的漏洞和错误。它通过生成大量随机输入数据并将其提供给目标程序，以观察程序的行为并检测潜在的崩溃或异常。AFL 采用了基于覆盖率的反馈机制，可以有效地探索程序的不同执行路径，从而提高发现漏洞的概率。



### 使用 AFL

参考 AFL++ https://github.com/AFLplusplus/AFLplusplus?tab=readme-ov-file

#### 使用 Docker 进行部署和运行测试

```bash
docker pull aflplusplus/aflplusplus
docker run -ti -v /location/of/your/target:/src aflplusplus/aflplusplus
```
