# 内容编写规范

本目录保存站点的可编辑内容。字段定义以 [`src/content.config.ts`](../content.config.ts) 为准；修改字段结构时，应同时更新 schema、本文件和示例内容。

## 通用规则

- 文件统一使用 UTF-8 编码和两个空格缩进，不使用 Tab。
- `profile.yaml`、`projects.yaml`、`links.yaml` 的顶层必须是数组；每个条目必须包含唯一的 `id`。
- YAML 文件不能留成 0 字节空文件。没有项目或友链时，文件完整内容写为 `[]`。
- 布尔值和数字不要加引号，例如 `featured: false`、`order: 10`。
- URL 必须是完整地址并包含协议，例如 `https://example.com`。
- 包含 `:`、`#` 或其他 YAML 特殊字符的普通文本建议使用引号包裹。
- 不要在内容文件中填写密码、Token、证件号、住址等秘密或敏感信息。
- 编辑后先运行 `npm run check`；准备发布前运行 `npm run build`。

## 文章：`posts/*.md` 与 `posts/*.mdx`

文件名会成为文章 URL slug。建议使用小写英文、数字和连字符：

```text
posts/learning-astro.md → /blog/learning-astro/
```

每篇文章必须以 frontmatter 开始，且不能是空文件：

```md
---
title: 使用 Astro 构建个人主页
description: 记录个人主页的技术选型与实现过程。
publishedAt: 2026-08-26
updatedAt: 2026-08-27
tags:
  - Astro
  - Web
cover: /images/astro-cover.webp
draft: false
featured: false
---

这里开始写文章正文。

## 第一节

正文支持标准 Markdown。

### 小节

二级和三级标题会进入文章目录。
```

字段说明：

| 字段 | 必填 | 格式与含义 |
| --- | --- | --- |
| `title` | 是 | 文章标题，1–100 个字符 |
| `description` | 是 | 摘要，1–220 个字符 |
| `publishedAt` | 是 | ISO 日期或日期时间，例如 `2026-08-26` |
| `updatedAt` | 否 | 最后更新时间，格式同上 |
| `tags` | 否 | 字符串数组，默认 `[]` |
| `cover` | 否 | 站内绝对路径或完整图片 URL |
| `draft` | 否 | 草稿开关，默认 `false`；草稿不会公开生成 |
| `featured` | 否 | 是否优先显示在首页，默认 `false` |

需要导入 Astro 组件时使用 `.mdx`。import 必须放在 frontmatter 结束之后：

```mdx
---
title: 带提示组件的文章
description: 演示如何在 MDX 中使用站内组件。
publishedAt: 2026-08-26
draft: true
---

import Note from '../../components/Note.astro';

<Note title="提示">
  这里可以编写 Markdown 内容。
</Note>
```

不再需要某篇文章时，应删除对应 `.md` 或 `.mdx` 文件；不要把文件内容清空，否则 Astro 仍会加载它并因缺少 frontmatter 而构建失败。

## 个人资料：`profile.yaml`

当前页面读取数组中的第一项，因此该文件应保留且只维护一个 `id: main` 条目：

```yaml
- id: main
  name: Hshevin
  tagline: 持续学习，也持续记录。
  avatar: /avatar.svg
  location: 城市名称
  bio:
    - 第一段个人简介。
    - 第二段个人简介。
  socials:
    - label: GitHub
      url: https://github.com/Hshevin
  education:
    - institution: 学校名称
      program: 专业或项目名称
      period: 2022–2026
      url: https://example.edu
  skills:
    - category: 正在学习
      items:
        - Deep Learning
        - Open Source
    - category: 常用工具
      items:
        - Git
        - Neovim
```

字段说明：

| 字段 | 必填 | 格式与含义 |
| --- | --- | --- |
| `id` | 是 | 固定使用 `main` |
| `name` | 是 | 页面显示名称 |
| `tagline` | 是 | 首页的一句话介绍 |
| `avatar` | 是 | 站内绝对路径或完整图片 URL |
| `location` | 否 | 公开展示的位置；不建议填写精确住址 |
| `bio` | 是 | 至少包含一个非空段落 |
| `socials` | 是 | 社交链接数组；没有时写 `[]` |
| `education` | 否 | 教育经历数组；没有时写 `[]` 或省略 |
| `skills` | 是 | 技能分组数组；每组 `items` 至少一项 |

## 项目：`projects.yaml`

文件顶层是项目数组；没有项目时完整内容写为 `[]`。

```yaml
- id: personal-page
  title: 个人主页
  summary: 一个用于记录学习和展示项目的静态站点。
  stack:
    - Astro
    - TypeScript
  links:
    - label: GitHub
      url: https://github.com/Hshevin/personal_page
  featured: true
  order: 10
```

字段说明：

| 字段 | 必填 | 格式与含义 |
| --- | --- | --- |
| `id` | 是 | 唯一标识，建议使用小写英文和连字符 |
| `title` | 是 | 项目名称 |
| `summary` | 是 | 项目简介 |
| `stack` | 是 | 技术栈字符串数组；没有时写 `[]` |
| `links` | 否 | 项目相关链接，默认 `[]` |
| `featured` | 否 | 是否在首页展示，默认 `false` |
| `order` | 否 | 排序整数，数值越大越靠前，默认 `0` |

## 友链：`links.yaml`

文件顶层是友链数组；没有友链时完整内容写为 `[]`。

```yaml
- id: example-site
  name: Example Site
  url: https://example.com/
  avatar: https://example.com/favicon.svg
  description: 一句话介绍这个站点。
  category: 朋友
  order: 10
```

字段说明：

| 字段 | 必填 | 格式与含义 |
| --- | --- | --- |
| `id` | 是 | 唯一标识，建议使用小写英文和连字符 |
| `name` | 是 | 站点或朋友名称 |
| `url` | 是 | 包含 `https://` 的完整地址 |
| `avatar` | 是 | 站内绝对路径或完整图片 URL |
| `description` | 是 | 非空简介 |
| `category` | 是 | 分类名称，相同分类会归为一组 |
| `order` | 否 | 排序整数，数值越大越靠前，默认 `0` |

## 发布前检查

```bash
npm run check
npm test
npm run build
```

出现 `Must be an array or object` 时，先检查 YAML 是否为空或顶层是否缺少数组结构。出现 `data does not match collection schema` 时，按错误提示核对文章 frontmatter 的必填字段与数据类型。

当 `projects.yaml` 或 `links.yaml` 写为 `[]` 时，Astro 可能输出 `No items found` 或 collection is empty 提示；这是空集合的预期信息，只要命令最终退出码为 `0`，就不会阻断部署。
