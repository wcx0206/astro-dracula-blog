---
title: 2025 年的图床解决方案
tags:
- image-hosting
- cloudflare
- s3-image-port
date: 2024-12-03 14:45:43
---

作为一个使用 Markdown 进行日常写作的 Blogger，我不可避免地需要使用一个图床服务。过去，我使用过像 [sm.ms](https://sm.ms/)、[路过图床](https://imgse.com/) 等公共图床服务，也使用过基于 GitHub 的自建方案，但这些方案都有各自的问题，包括但不限于国内外连接速度、图片被和谐或丢失等。但现在，我有了一个完整的自建解决方案，它基于 [Cloudflare R2](https://www.cloudflare.com/zh-cn/developer-platform/products/r2/)、[S3 Image Port](https://iport.yfi.moe/) 和 [WebP Cloud Services](https://webp.se)。

<!--more-->

这个方案源于朋友的[《把 S3 ( R2 / OSS / COS ... ) 作为图床使用的图片管理方案》](https://yfi.moe/post/manage-website-images)一文。在文中，作者介绍道他将他的博客图片全部迁移到了 Cloudflare R2 上，并自己写了一个名为 [S3 Image Port](https://github.com/yy4382/s3-image-port) 的前端面板用于管理这些图片。

所谓 S3，原来指的是 Amazon Simple Storage Service，是 Amazon 提供的一种文件存储服务。由于 Amazon 在云领域老大哥的地位，S3 成为了云上存储事实上的一种标准。R2 则是 Cloudflare 提供的文件存储服务，兼容 S3。理论上在这个方案中，您可以选择任意兼容 S3 的存储服务（例如阿里云 OSS，腾讯云 COS 等），但 Cloudflare R2 的最大优势在于其没有出口带宽费用（财大气粗 Cloudflare！），特别适合图床这一应用场景。

在我注意到 S3 Image Port 这个项目时，我发现这正是我需要的！我也加入了这个项目的贡献者行列，为其添加了一些新功能，并帮助完善了[文档](https://docs.iport.yfi.moe)，还为其绘制了一个简单的 Logo。

那么 WebP Cloud Services 呢？众所周知，WebP 是一种比起传统 JPEG 和 PNG 格式更加高效的图片格式，专门设计用于网络传输。尽管 S3 Image Port 提供了基础的转换图片格式的功能，但 WebP Cloud Services 提供的功能更为强大，除了转换，还包括了根据设备选择不同大小的图片等。
