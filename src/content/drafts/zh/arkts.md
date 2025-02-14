---
title: ArkTS
tags:
---

<h2 style="text-align: center">ArkTS 装饰器</h2>

<!--more-->

## 装饰器

#### 什么是 装饰器



### `@Entry` 和 `@Component` 装饰器

```typescript
@Entry
@Component
@State
```

- **`@Entry`**：这个装饰器标记了应用的入口组件。OpenHarmony 应用启动时会加载这个组件。
- **`@Component`**：这个装饰器标记了一个组件类，使其成为一个可复用的 UI 组件。
- **`@State`**：这个装饰器用于定义组件的状态变量。状态变量的变化会触发组件的重新渲染。

