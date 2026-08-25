---
title: 用 Markdown 维护一个长期更新的网站
description: 从写作、预览到自动发布，一次内容更新会经过哪些步骤。
publishedAt: 2026-08-25
tags:
  - Astro
  - Markdown
  - 工作流
draft: false
featured: false
---

维护这个网站不需要进入管理后台。文章、项目和友链都是仓库中的文本文件，一次更新通常只有五步：

1. 新建或修改 Markdown/MDX 文件；
2. 在本地检查内容格式；
3. 启动开发服务器预览页面；
4. 推送分支并检查线上预览；
5. 合并到主分支，由 Cloudflare 自动发布。

## 内容也是代码

文章头部的元数据会经过 schema 校验。如果漏写标题、日期格式错误或链接无效，构建会直接失败，而不是把坏数据带到线上。

```yaml
title: 一篇新的学习笔记
publishedAt: 2026-08-26
tags:
  - 学习
draft: false
```

这种工作流不算花哨，却足够透明、可靠，也很容易迁移。
