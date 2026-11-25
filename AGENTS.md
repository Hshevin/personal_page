# 个人主页项目 Agent 指南

## 项目目标

本项目是 empathless 的中文个人主页，用于个人介绍、学习博客、项目展示和友链收纳。视觉为原创赛博终端风（浅色为信号黄外框 + 居中黑色终端主舞台、内部统一暗色；深色为全夜景终端），可参考高饱和游戏界面的气质，但不得使用任何游戏或参考站的角色、标志、名称和品牌资产。

## 当前状态

- 首个可运行版本已完成，使用 Astro 7 静态输出；不要再按空仓库或待创建脚手架处理。
- 依赖、脚本和真实版本以 `package.json`、`package-lock.json` 及现有配置为准。
- 已实现首页、博客、正文、标签、归档、项目、友链、关于、搜索、RSS、sitemap、robots 和 404。
- Pagefind 索引在 `npm run build` 的 Astro 构建之后生成；开发服务器中没有搜索索引属于预期行为。
- `wrangler.jsonc` 将 `dist/` 作为 Cloudflare Workers Static Assets 发布，当前没有 Worker 服务端代码。
- 下一阶段优先补全用户的真实资料与内容、连接 Cloudflare Workers Builds、绑定正式域名；不要擅自虚构个人经历。

## 技术架构

- Astro 7、TypeScript strict、静态输出。
- Markdown/MDX 文章和 Astro Content Collections schema。
- YAML 保存个人资料、项目和友链。
- Pagefind 提供构建后静态中文搜索。
- Vitest 负责内容工具测试，Playwright 通过本地 Wrangler 预览运行浏览器回归测试。
- Cloudflare Workers 托管静态资源，GitHub 作为代码与内容源。

涉及 Astro、Cloudflare、MDX、Pagefind 等版本相关实现时，先检查已安装版本，再查阅对应版本的官方文档，不凭记忆套用旧 API。

## 页面与路由

除非用户明确调整范围，站点保持以下页面：

- `/`：个人头部、简介、近期文章、精选项目和技能。
- `/blog`、`/blog/[slug]`：文章列表与正文。
- `/tags`、`/tags/[tag]`：标签索引与筛选结果。
- `/archives`：按年份归档。
- `/projects`、`/links`、`/about`：项目、友链和完整介绍。
- `/search`：Pagefind 静态搜索。
- `/rss.xml`、`/robots.txt`、sitemap 和自定义 404。

## 内容与代码分离

个人内容不得硬编码到页面组件中：

- `src/content/posts/`：Markdown/MDX 文章。
- `src/content/profile.yaml`：姓名、头像、简介、社交链接、教育经历和技能。
- `src/content/projects.yaml`：项目名称、简介、技术栈和相关链接。
- `src/content/links.yaml`：友链名称、网址、头像、描述和分类。
- `src/content.config.ts`：所有内容 schema 的唯一事实来源。
- `src/content/README.md`：面向内容编辑者的格式规范；schema 变化时必须同步更新。

文章必须包含 `title`、`description`、`publishedAt`，可使用 `updatedAt`、`tags`、`cover`、`draft` 和 `featured`。新增或调整字段时，先更新 schema，再更新内容示例和 README。`draft: true` 的文章不得进入生产列表、路由、搜索、RSS 或 sitemap。

## 设计与体验约束

- 中文优先；装饰只用在页头、面板和标签上，文章正文保持在阅读面板里，不复制参考站或游戏的品牌资产。
- 使用语义化 HTML、清晰标题层级、可见焦点和键盘可操作交互。
- 正文与交互对比度应达到 WCAG 2.1 AA。
- 移动端优先，至少检查 320、768、1024 和 1440 px 宽度。
- 深浅色遵循系统偏好，用户选择应持久化且避免首屏闪烁。
- 优先静态 HTML 和少量原生脚本，不为简单交互加入客户端框架。

## 范围边界

未经用户明确确认，不得加入在线 CMS、数据库、登录、评论、公开友链申请后台、邮件服务、多语言路由或其他常驻后端。Cloudflare Web Analytics 也应在用户完成账号与域名配置后再启用。

不得提交 `.env`、令牌、密钥、个人隐私数据或 Cloudflare/GitHub 凭据。不得手工编辑 `dist/`、`.astro/`、`playwright-report/`、`test-results/`、Pagefind 索引等生成产物。

## 工作流程与验证

1. 修改前阅读本文件、`README.md`、相关源码、schema 和测试。
2. 若文档、代码与用户最新要求冲突，以用户要求为准并同步修正文档。
3. 保持改动聚焦；内容模型变化先改 schema，功能变化同步 README。
4. 完成后检查 diff，确认没有密钥、生成文件、无关改动或虚构资料。

按改动风险运行实际存在的命令：

- `npm run check`
- `npm test`
- `npm run build`
- `npm run test:e2e`（涉及页面、样式或交互时）

浏览器测试还应检查响应式、键盘交互和控制台错误。首次在一台机器运行 Playwright 前，可能需要执行 `npx playwright install chromium`。

如需创建 Python 虚拟环境，必须使用 `uv`。

## Git 规范

- `main` 应始终保持可构建和可部署。
- 功能开发使用短生命周期分支；Codex 创建分支时默认使用 `codex/` 前缀。
- 使用 Conventional Commits，并让每个提交只包含一个逻辑变化。
- 提交前检查 staged diff 和验证结果。
- 不提交用户未要求的改动，不擅自推送远程、发布、打标签或改写共享历史。

## 完成标准

- 用户要求与相关验收条件已实现。
- 相关检查、单元测试、构建及浏览器测试已通过。
- README 和项目规则与当前实现一致。
- Git diff 中没有秘密信息、生成产物或无关变化。
