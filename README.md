# Personal Page

一个以中文内容为主的个人主页与学习博客，用于介绍自己、记录学习过程、展示项目并收纳友链。

页面的信息层级和窄栏阅读体验参考 [Arthals' ink](https://arthals.ink/)，但本站将使用原创的字体层级、配色、动效和组件细节，不复制参考站的品牌资产。

## 当前状态

仓库目前处于规划阶段，只包含项目说明和 Agent 协作规则，尚未创建 Astro 脚手架、安装依赖或配置部署。

已经确定的首版范围：

- 中文单语言站点。
- 个人介绍、学习博客、项目展示和友链。
- 标签、归档、静态搜索、RSS、深浅色和响应式布局。
- Markdown/MDX + Git 内容更新流程。
- Cloudflare Workers + GitHub 自动部署。
- Cloudflare Web Analytics 隐私友好统计。

首版不包含数据库、在线 CMS、登录、评论系统、公开友链申请后台或多语言路由。

## 计划页面

| 路由 | 用途 |
| --- | --- |
| `/` | 个人头部、简介、精选或最新文章、教育经历和技能 |
| `/blog` | 文章列表 |
| `/blog/[slug]` | Markdown/MDX 文章正文 |
| `/tags` | 标签索引 |
| `/tags/[tag]` | 指定标签的文章列表 |
| `/archives` | 按年份归档 |
| `/projects` | 项目展示 |
| `/links` | 友链卡片 |
| `/about` | 完整个人介绍 |
| `/search` | Pagefind 静态搜索 |
| `/rss.xml` | RSS 订阅 |
| `404` | 自定义未找到页面 |

## 目标技术架构

- Astro 6 静态输出。
- TypeScript strict。
- Astro Content Collections 管理和校验结构化内容。
- Markdown/MDX 支持正文、代码、公式和受控嵌入组件。
- Pagefind 在构建完成后生成静态中文搜索索引，无需搜索服务器。
- Cloudflare Workers 托管 `dist` 静态资源。
- GitHub 分支预览和 `main` 自动发布。

所有版本相关实现应以项目实际锁定的依赖和官方文档为准。

## 计划内容结构

脚手架落地后，内容预计集中在以下位置：

```text
src/content/
├── posts/          # Markdown/MDX 学习记录
├── profile.yaml    # 个人资料、教育经历、技能和社交链接
├── projects.yaml   # 项目信息
└── links.yaml      # 友链信息
```

页面组件只负责布局和展示，不应硬编码个人资料、文章、项目或友链。

计划中的文章 frontmatter 示例：

```yaml
---
title: 使用 Astro 构建个人主页
description: 记录个人主页的技术选型与实现过程。
publishedAt: 2026-08-26
updatedAt: 2026-08-26
tags:
  - Astro
  - Web
draft: false
featured: false
---
```

实际字段由未来的 `src/content.config.ts` 统一定义和校验。`draft: true` 的文章不会进入正式环境的列表、搜索、RSS 或 sitemap。

## 内容更新流程

站点上线后的日常更新不需要登录后台：

1. 在 `src/content/posts/` 新建或修改 Markdown/MDX 文件，或编辑对应 YAML 数据。
2. 本地运行内容检查、构建和预览。
3. 将修改推送到短生命周期分支。
4. 使用 Cloudflare 生成的分支预览地址检查页面。
5. 合并到 `main`，由 Cloudflare Workers Builds 自动构建并发布。

这种方式让内容与代码一起版本管理，可以通过 Git diff 审阅，也可以随时回滚到历史版本。

## 开发命令

以下命令是脚手架完成后的目标接口，**当前尚未提供，也不能执行**：

| 计划命令 | 预期用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run check` | 检查 Astro、TypeScript 和内容 schema |
| `npm run build` | 构建站点并生成 Pagefind 索引 |
| `npm test` | 运行单元和内容逻辑测试 |
| `npm run test:e2e` | 运行真实浏览器端到端测试 |
| `npm run preview` | 预览生产构建产物 |

创建 `package.json` 后，应以其中的实际 scripts 为准，并同步更新本节。

## 计划部署流程

1. 将仓库托管到 GitHub，以 `main` 为生产分支。
2. 在 Cloudflare Workers Builds 中连接该仓库。
3. 生产构建使用 `npm run build`，部署使用 `npx wrangler deploy`。
4. 非生产分支使用 Worker preview version，合并前先检查预览地址。
5. 首发使用 `workers.dev` 地址。
6. 域名准备好后加入 Cloudflare Zone，再为 Worker 绑定 Custom Domain；根域和 `www` 只保留一个规范地址，另一地址重定向过去。

部署配置、`.gitignore`、依赖锁文件和真实 CI 命令将在 Astro 脚手架创建时加入，不在当前文档初始化提交中预先伪造。

## 使用 Agent 继续开发

开始新的开发任务时：

1. 先阅读 [`AGENTS.md`](./AGENTS.md)。
2. 检查 Git 状态、实际目录、`package.json` 和现有配置，不要仅依赖本 README 的规划描述。
3. 根据当前阶段实现最小、可验证的增量。
4. 运行仓库中实际存在且与改动相关的检查、测试和构建。
5. 当技术栈、目录、命令、内容格式或部署流程变化时，同步更新本 README。

## 项目边界

- 不提交 `.env`、API Token、密钥、Cloudflare/GitHub 凭据或其他敏感信息。
- 不手工修改 `dist/`、Pagefind 索引等构建产物。
- 未经确认不增加 CMS、数据库、账号、评论、多语言或常驻后端。
- 如需创建 Python 虚拟环境，使用 `uv`。
