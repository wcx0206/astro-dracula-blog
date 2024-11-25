# Astro Dracula Blog

<p>
    <a href="../README.md">English</a>
    <strong>简体中文</strong>
</p>

一个快速、简单的博客系统，使用 Dracula 主题，使用 Astro 构建。

[![Astro Dracula Blog](img/hero.webp)](gallery.md)

## :fire: 特性

- [x] :rocket: 快速 & 高性能
- [x] :star: 简洁 & 清晰的设计
- [x] :iphone: 响应式设计
- [x] :vampire_man: Dracula 主题
- [x] :zap: 使用 [Motion](https://motion.dev)（原 Framer Motion）创建的动画
- [x] :mag: 使用 [fuse.js](https://www.fusejs.io/) 构建的模糊搜索
- [x] :world_map: Sitemap & RSS 订阅
- [x] :spider_web: SEO 友好
- [x] :earth_asia: 支持国际化 (`zh` & `en`)
- [x] :triangular_ruler: 支持 Mathjax
- [x] :octocat: [GitHub Alerts](https://github.com/chrisweb/rehype-github-alerts)
- [x] :book: 目录

## :white_check_mark: Lighthouse 评分

<p aligh="center">
    <a href="https://pagespeed.web.dev/analysis/https-blocklune-cc/72o0c25cxa?form_factor=desktop">
        <img alt="Astro Dracula Blog Lighthouse 评分" src="img/lighthouse-score.png" />
    </a>
</p>

## :rocket: 如何使用

文件结构：

```text
.
├── astro.config.mjs
├── package.json
├── public/
├── src/
│   ├── assets/
│   │   └── avatar.webp
│   ├── components/
│   ├── config.ts
│   ├── content/
│   │   ├── config.ts
│   │   ├── drafts/
│   │   │   └── ...
│   │   ├── info/
│   │   │   ├── en/
│   │   │   │   └── about.md
│   │   │   └── zh/
│   │   │       └── about.md
│   │   └── posts/
│   │       ├── en/
│   │       │   └── example-post.md
│   │       └── zh/
│   │           └── example-post.md
│   ├── middleware.ts
│   ├── pages/
│   ├── schemas/
│   ├── styles/
│   └── utils/
├── tailwind.config.mjs
└── tsconfig.json
```

要使用此主题，请按照以下步骤操作：

1. 编辑 `src/config.ts` 以配置您网站的基本信息。您还可以在此处配置您的 [umami](https://umami.is/) 分析和搜索引擎的验证信息。
2. 用您自己的头像替换 `src/assets/avatar.webp`。
3. 在 `src/content/info/en/about.md` 和 `src/info/zh/about.md` 中重写您自己的 “关于” 页面的文本。
4. 删除 `src/content/posts` 中的我的文章并编写您自己的文章。目前该主题支持中文和英文，对于同一篇文章的不同语言版本，您需要确保它们位于 `en` 和 `zh` 目录中并使用相同的文件名。
5. 删除 `public/_redirects` 以及 `public/favicon.svg`，并使用您自己的 Netlify 重定向配置和 favicon 图标。

### 新建文章

要开始编写新文章，您可以使用 `pnpm new` 命令（见下文），或按照以下步骤操作：

1. 如果您正在编写英文版本的文章，请在 `src/content/posts/en` 中创建一个文件，例如 `hello-world.md`。
2. 像这样编辑文件 `src/content/posts/en/hello-world.md`：

```text
---
title: Hello World
tags:
- hello
- my-first-post
date: 2024-11-12 18:50:00
---

Hello! This is my first post!

<!--more-->

I'm writing my first post!
```

### 自定义配色方案

要自定义此主题的配色方案，请编辑以下文件：

- `src/components/prose.astro`
- `src/styles/global.css`
- `src/styles/rehype-github-alerts.css`
- `tailwind.config.mjs`

### 语言配置

目前此主题支持中文和英文，并使用英文作为默认语言。

要切换到中文：

- 编辑 `src/utils/i18n.ts`：

```ts
export const defaultLang : Lang = "zh";
```

- 编辑 `public/_redirects`（确保位于文件末尾）：

```text
/ /en 302! Language=en
/ /zh 302!
```

### 有用的命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览（构建后）
pnpm preview

# 创建新文章（或草稿）
pnpm new
```

`pnpm new` 的详细用法（键入 `pnpm new --help` 以查看）：

```text
Usage: pnpm new [options] <post-title>

Options:
  -l, --lang <en|zh>   设置语言（默认：en）
  -d, --draft          创建草稿文章（默认：false）
  -m, --mdx            使用 MDX 格式（默认：false）
  -h, --help           显示此帮助信息

Example:
  pnpm new "Hello World"
  pnpm new -l zh "你好，世界"
```

> [!Caution]
> 由于[使用的 slug 生成库](https://www.npmjs.com/package/slugify)的原因，对于 “你好，世界” 这样全中文的标题会生成空的 Slug，此时会产生名为 `Untitled.md` 的文件。

## :link: 参考

- [Dracula 主题](https://draculatheme.com/contribute)
- [overreacted.io - Dan's blog](https://overreacted.io/)
- [bearblog.dev](https://bearblog.dev/)
- [Astro Docs](https://docs.astro.build/)
