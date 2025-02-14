---
title: ArkTs-Basics
tags:
---

有关于 ArkTs 以及 ArkTs 项目的一些基本知识

<!--more-->



### Ability

`Ability` 是 OpenHarmony 中的一个基本概念，类似于 Android 中的 `Activity` 或 `Service`。它表示应用程序的一个功能单元，可以是一个界面（页面）或一个后台服务。`Ability` 负责处理应用程序的生命周期事件，如启动、停止、恢复等。

#### 主要类型的 Ability

1. **PageAbility**：用于管理具有用户界面的页面。
2. **ServiceAbility**：用于管理后台服务，没有用户界面。



#### EntryAbility

`EntryAbility` 是一种特殊类型的 `Ability`，它是应用程序的入口点。每个 OpenHarmony 应用程序都必须有一个 `EntryAbility`，它是用户启动应用程序时首先进入的 `Ability`。



#### EntryBackupAbility

在 OpenHarmony 框架中，`EntryBackupAbility` 是一种特殊类型的 `Ability`，用于在主入口能力（`EntryAbility`）不可用时提供备用入口。它通常用于在某些特殊情况下（例如，主入口能力加载失败或某些条件不满足时）提供备用的启动路径。
