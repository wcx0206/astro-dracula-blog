---
title: Operating-System-Design-and-Implementation
tags:
---

## 操作系统设计与实现

<!--more-->

### IP & CS

- **CS（代码段寄存器）**：被设置为 0xFFFF
- **IP（指令指针寄存器）**：被设置为 0x0000

### .byte  .word  .long

在汇编里，我们可以通过`.byte`、``.word`和`.long`直接插入机器码，分别是插入1、2、4个字节，注意i386是小端机器。

### 小端法和大端法

小端法（Little Endian）是一种字节序的表示方式。在小端法中，多字节数据的低位字节存储在内存的低地址处，而高位字节存储在内存的高地址处。

例如，对于一个32位的整数0x12345678，在小端法的内存布局如下：

```
地址  值
0x00  0x78
0x01  0x56
0x02  0x34
0x03  0x12
```

这种方式与大端法（Big Endian）相反，大端法是将高位字节存储在低地址处，低位字节存储在高地址处。

### orb 与 orl

在x86汇编中，[`orb`](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)和`orl`是用于执行按位或操作的指令，但它们作用于不同的操作数大小：

- [`orb`](vscode-file://vscode-app/Applications/Visual Studio Code.app/Contents/Resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)：对8位（字节）操作数进行按位或操作。
- `orl`：对32位（双字）操作数进行按位或操作。

![image-20240906114206474](/Users/wcx/Library/Application Support/typora-user-images/image-20240906114206474.png)

![image-20240906115947654](/Users/wcx/Library/Application Support/typora-user-images/image-20240906115947654.png)
