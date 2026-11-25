import { expect, test } from '@playwright/test';

test('首页呈现个人信息与主要内容入口', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('empathless');
  await expect(page.getByRole('heading', { level: 1, name: 'empathless' })).toBeVisible();
  const avatar = page.getByRole('img', { name: 'empathless 的头像' });
  await expect(avatar).toHaveAttribute('src', /.+/);
  await expect(avatar).toHaveCSS('object-fit', 'cover');
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '近期文章' })).toBeVisible();
  await expect(page.getByRole('link', { name: '全部文章 →' })).toHaveAttribute('href', '/blog');
});

test('没有项目时首页不显示项目区，项目页给出空状态', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 2, name: '项目' })).toHaveCount(0);

  await page.goto('/projects/');
  await expect(page.getByRole('status')).toContainText('暂无项目');
  await expect(page.getByRole('status').getByRole('link', { name: '文章' })).toHaveAttribute('href', '/blog');
});

test('页面在关键响应式宽度内没有水平溢出', async ({ page }) => {
  for (const path of ['/', '/blog/welcome/', '/links/']) {
    for (const width of [320, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    }
  }
});

test('访客可以从文章列表进入正文并看到目录', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('heading', { level: 1, name: '文章' })).toBeVisible();
  await page.getByRole('link', { name: /欢迎来到我的个人主页/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: '欢迎来到我的个人主页' })).toBeVisible();
  await expect(page.getByText('目录', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: '继续阅读' }).getByRole('link', { name: '< 全部文章' })).toBeVisible();
});

test('窄屏下文章目录默认收起', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/blog/welcome/');

  await expect(page.locator('.toc details')).not.toHaveAttribute('open', '');
  await page.getByText('目录', { exact: true }).click();
  await expect(page.locator('.toc details')).toHaveAttribute('open', '');
});

test('标签页仍高亮“文章”导航', async ({ page }) => {
  await page.goto('/tags/');

  await expect(page.getByRole('navigation', { name: '主导航' }).getByRole('link', { name: '文章' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});

test('主题选择会在页面导航后保留', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');

  const toggle = page.getByRole('button', { name: '切换到深色主题' });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: '切换到浅色主题' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#07080d');

  await page.goto('/about/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('任意页面按 / 进入搜索并聚焦输入框', async ({ page }) => {
  await page.goto('/about/');
  await page.keyboard.press('/');

  await expect(page).toHaveURL(/\/search\/$/);
  await expect(page.getByRole('searchbox', { name: '关键词' })).toBeFocused();
});

test('生产构建提供可用的站内搜索', async ({ page }) => {
  await page.goto('/search/');

  await page.getByRole('searchbox', { name: '关键词' }).fill('Markdown');
  await expect(page.getByRole('status')).toContainText('找到');
  await expect(page.locator('#search-results a[href="/blog/welcome/"]')).toBeVisible();
  await expect(page).toHaveURL(/\?q=Markdown$/);
});
