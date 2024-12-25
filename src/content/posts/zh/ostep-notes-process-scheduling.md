---
title: 进程调度 - OSTEP 笔记
tags:
 - note
 - operating-system
 - ostep
 - process
 - process-scheduling
date: 2024-12-25 18:59:00
---

这是我的 [OSTEP 系列笔记](/zh/posts/ostep-notes)的一部分，此篇主要包含了进程调度的相关知识，包括调度指标和各种调度策略的说明。

<!--more-->

## 调度指标

为了比较不同调度策略，我们需要一些指标。

任务的 **周转时间（turnaround time）** 定义为任务的完成时间减去任务到达的时间，即：

$$
T_{周转时间} = T_{完成时间} - T_{到达时间}
$$

周转时间是一个 **性能指标**。另一类指标是 **公平性指标**。性能和公平往往是矛盾的。
