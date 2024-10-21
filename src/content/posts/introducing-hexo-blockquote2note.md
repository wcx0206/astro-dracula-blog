---
title: Introducing hexo-blockquote2note
tags:
  - Hexo
  - Plugin
categories:
  - CS
  - Web
abbrlink: 55f9ebd1
date: 2024-02-04 17:54:49
---

I use Hexo with the NexT theme to build my blog. I wrote this plugin to solve a pain point I've encountered in this workflow.

<!--more-->

The note tag feature of the NexT theme helps me insert colorful note cards into my posts. However, it's not raw markdown syntax. It looks ugly when I open the raw markdown of my post in an editor.

So I made [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note). By using code comments, I can flag some quote blocks to be treated as the note tags, while still keeping them as normal quote blocks when I open the raw markdown in an outside editor.

## Installation

```bash
npm install hexo-blockquote2note --save
```

## Examples and Previews

```text
<!--blockquote2note-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:default,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:default,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:primary,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:primary,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:info,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:info,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:success,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:success,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:warning,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:warning,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:danger,,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:danger,,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:default,no-icon,-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:default,no-icon,-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:default,no-icon,-->
> #### Header
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:default,no-icon,-->

> #### Header
>
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->

```text
<!--blockquote2note:default,no-icon,This is a summary-->
> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!
<!--end-blockquote2note-->
```

<!--blockquote2note:default,no-icon,This is a summary-->

> Welcome to using [hexo-blockquote2note](https://github.com/BlockLune/hexo-blockquote2note)!

<!--end-blockquote2note-->
