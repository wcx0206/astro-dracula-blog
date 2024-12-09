---
title: 我的 Rime 配置
tags:
  - rime
  - input-method
categories:
  - Misc
abbrlink: dc298524
date: 2024-02-15 10:41:37
---

[Rime](https://rime.im/) 是一款输入法引擎，有着开源、多平台、支持高度自定义等特点。这篇博文记录了我在 macOS 平台上基于鼠须管（[rime/squirrel](https://github.com/rime/squirrel)）和雾凇拼音（[iDvel/rime-ice](https://github.com/iDvel/rime-ice)）的 Rime 配置。

<!--more-->

## 下载和安装

```bash
# 安装 「鼠须管」
brew install --cask squirrel

# 安装 「东风破」 并使用它来安装 「雾凇拼音」
git clone --depth=1 git@github.com:rime/plum.git # 克隆 「东风破」 的仓库到本地
cd plum
bash rime-install iDvel/rime-ice:others/recipes/full # 安装 「雾凇拼音」
```

> [!Tip]
> **在「添加输入法」中找不到 Rime？** 安装完成后，你可能需要登出（Log Out）你的当前 macOS 用户并重新登入后，才能在添加输入法中找到 Rime。

## 我的自定义配置

导航到 `~/Library/Rime`，通过修改 `default.yaml`、`squirrel.yaml` 等文件，可以对 Rime 进行高度的自定义。而比起直接修改这些文件，更建议的方法是[打补丁](https://dvel.me/posts/rime-ice/#%E4%BB%A5-patch-%E7%9A%84%E6%96%B9%E5%BC%8F%E6%89%93%E8%A1%A5%E4%B8%81)。下边是我的补丁文件：

```yaml
# default.custom.yaml
patch:
  schema_list:
    - schema: double_pinyin_flypy # 小鹤双拼
  menu:
    page_size: 4 # 候选词个数
  key_binder:
    # 以词定字（上屏当前词句的第一个或最后一个字）
    # 使用 - = 进行以词定字
    select_first_character: "minus"
    select_last_character: "equal"

    bindings:
      # 翻页 [ ]
      - { when: paging, accept: bracketleft, send: Page_Up }
      - { when: has_menu, accept: bracketright, send: Page_Down }
```

```yaml
# squirrel.custom.yaml
patch:
  style:
    color_scheme: apathy
    color_scheme_dark: apathy

    candidate_list_layout: linear # stacked | linear
    text_orientation: horizontal # horizontal | vertical
    font_face: "LXGW WenKai" # 请先安装 [lxgw/LxgwWenKai](https://github.com/lxgw/LxgwWenKai)
```

## 参考资料

- _[RIME | 中州韻輸入法引擎](https://rime.im/)_
- _[RIME 鼠须管输入法简明使用教程 - BAI YUN](https://baiyun.me/rime-simple-tutorial)_
- _[Rime 配置：雾凇拼音 - Dvel's Blog](https://dvel.me/posts/rime-ice/)_
