# Personal Page

empathless 的中文个人主页与学习博客，用于介绍自己、记录学习过程、展示项目并收纳友链。

视觉为原创的赛博终端风：浅色是信号黄外框包着居中的黑色终端主舞台（顶栏与页脚落在黄框，主内容与阅读面统一暗色），深色是黑底红青霓虹的全夜景终端；文章正文放在独立的暗色阅读面板上，保证长文舒适可读。不使用任何游戏或参考站的角色、标志和品牌资产。

## 当前实现

首个可运行版本已经完成：

- Astro 7 静态站点、TypeScript strict、Markdown/MDX 与 Content Collections。
- 首页、博客、正文目录、标签、归档、项目、友链、关于和自定义 404。
- 深浅色跟随系统并可手动切换，图标和浏览器顶栏颜色随主题变化；响应式布局、键盘焦点和跳过导航链接。
- 任意页面按 `/` 或 `⌘K`／`Ctrl+K` 打开搜索；标签和归档页导航高亮“文章”。
- 文章页：窄屏目录默认收起，宽屏高亮当前小节，文末提供上一篇／下一篇和回到顶部。
- 没有项目时首页隐藏项目区，项目页显示空状态；友链头像加载失败时显示名字首字。
- Pagefind 构建后静态搜索、RSS、sitemap、robots 和 Web App Manifest。
- Vitest 单元测试、Playwright 浏览器回归测试。
- Cloudflare Workers Static Assets 部署配置和安全响应头。

首版不包含数据库、在线 CMS、登录、评论、公开友链申请后台或多语言路由。

| 路由 | 用途 |
| --- | --- |
| `/` | 个人简介、近期文章、精选项目和技能 |
| `/blog`、`/blog/[slug]` | 文章列表和 Markdown/MDX 正文 |
| `/tags`、`/tags/[tag]` | 标签索引和筛选结果 |
| `/archives` | 按年份归档 |
| `/projects` | 项目展示 |
| `/links` | 友链收纳 |
| `/about` | 完整个人介绍 |
| `/search` | Pagefind 站内搜索 |
| `/rss.xml` | RSS 订阅 |
| `404` | 自定义未找到页面 |

## 本地开发

建议使用满足 Astro 7 要求的 Node.js 版本。安装依赖后即可启动：

```bash
npm ci
npm run dev
```

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动 Astro 开发服务器；此时尚无 Pagefind 索引 |
| `npm run check` | 检查 Astro、TypeScript 和内容 schema |
| `npm test` | 运行 Vitest 单元测试 |
| `npm run build` | 构建静态站点并生成 Pagefind 搜索索引 |
| `npm run preview` | 预览 `dist/` 构建产物 |
| `npm run test:e2e` | 构建后用 Wrangler + Chromium 运行 Playwright |
| `npm run deploy` | 构建并通过 Wrangler 发布到 Cloudflare |

首次运行浏览器测试前，若本机没有测试浏览器：

```bash
npx playwright install chromium
```

## 内容如何更新

内容与页面代码分离，日常更新不需要数据库或管理后台：

各文件的必填字段、空内容写法和完整示例见 [`src/content/README.md`](./src/content/README.md)。

```text
src/content/
├── posts/          # Markdown/MDX 学习记录
├── profile.yaml    # 个人资料、教育经历、技能、社交链接
├── projects.yaml   # 项目列表
└── links.yaml      # 友链列表
```

新文章放入 `src/content/posts/`，文件名会成为 URL slug。示例：

```md
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

这里开始写正文。
```

- 修改个人介绍：编辑 `src/content/profile.yaml`。
- 新增项目：在 `src/content/projects.yaml` 增加一个带唯一 `id` 的条目。
- 新增友链：在 `src/content/links.yaml` 增加一个带唯一 `id` 的条目。
- 调整字段：先修改 `src/content.config.ts` 的 schema，再修改内容文件。
- 保存为草稿：设置 `draft: true`；草稿不会生成公开正文，也不会进入列表、搜索、RSS 或 sitemap。

本地预览内容后，提交并推送分支；合并到 `main` 后由 Cloudflare 自动重新构建，因此线上内容会随 Git 提交更新。

## 部署到 Cloudflare Workers

仓库已包含 `wrangler.jsonc`，会把 `dist/` 作为 Workers Static Assets 发布，并使用自定义 404 与静态缓存规则。

### 首次手动发布

1. 登录 Cloudflare：`npx wrangler login`。
2. 构建时提供站点最终公开地址，确保 canonical、RSS、robots 和 sitemap 使用正确域名：

   ```bash
   SITE_URL=https://你的域名.example npm run deploy
   ```

3. Wrangler 会返回 `workers.dev` 访问地址。若首次发布前还不知道该地址，可先发布一次取得地址，再用正确的 `SITE_URL` 重新发布。

`SITE_URL` 不是密钥，但必须包含 `https://` 且不要以子路径作为站点根目录。未提供时只会使用明确的占位域名 `https://personal-page.example`，不应作为正式发布结果。

### GitHub 自动发布与分支预览

1. 在 Cloudflare Dashboard 创建 Worker，并通过 Workers Builds 连接 GitHub 仓库 `Hshevin/personal_page`。
2. 生产分支设为 `main`。
3. Build command 设为 `npm run build`，Deploy command 设为 `npx wrangler deploy`。
4. 在构建环境变量中设置正式的 `SITE_URL`。
5. 为非生产分支启用 branch builds；每次推送先检查预览版本，合并到 `main` 后自动发布生产版本。

仓库不会保存 Cloudflare API Token、GitHub 凭据或其他密钥。远程仓库已配置为 `origin`，但发布和推送仍由仓库维护者明确执行。

### 自定义域名

在首版 `workers.dev` 地址验证完成后，可在 Worker 的 Settings → Domains & Routes 添加 Custom Domain。根域和 `www` 建议只选择一个 canonical 地址，另一个做永久重定向，然后把 `SITE_URL` 更新为最终域名并重新构建。

Cloudflare 参考文档：[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)、[Static Assets](https://developers.cloudflare.com/workers/static-assets/)、[Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)。

## 项目结构

```text
src/
├── components/         # 共享 UI 组件
├── content/            # 可独立更新的站点内容
├── content.config.ts   # 内容 schema
├── layouts/            # 全站页面骨架和元数据
├── lib/                # 内容排序、标签、阅读时长工具
├── pages/              # Astro 路由
└── styles/             # 全局设计变量与基础样式
tests/e2e/              # Playwright 浏览器测试
public/                 # 头像、Manifest 和 Cloudflare 响应头
wrangler.jsonc          # Workers Static Assets 配置
```

`dist/`、`.astro/`、Pagefind 索引、测试报告等均为生成产物，不应手工编辑或提交。

## 使用 Agent 继续开发

1. 先阅读 [`AGENTS.md`](./AGENTS.md)。
2. 检查 Git 状态、`package.json`、内容 schema 和与任务相关的源码。
3. 按最小可验证增量修改，避免虚构个人信息或扩大后端范围。
4. 运行相关检查、测试、构建与浏览器验证。
5. 功能、命令、内容格式或部署流程变化时同步更新本文档。

如需创建 Python 虚拟环境，使用 `uv`。
