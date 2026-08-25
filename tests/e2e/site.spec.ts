import { expect, test } from '@playwright/test';

test('首页呈现个人信息与主要内容入口', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Hshevin');
  await expect(page.getByRole('heading', { level: 1, name: 'Hshevin' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '近期文章' })).toBeVisible();
  await expect(page.getByRole('link', { name: '查看全部项目' })).toBeVisible();
});

test('访客可以从文章列表进入正文', async ({ page }) => {
  await page.goto('/blog/');

  await expect(page.getByRole('heading', { level: 1, name: '文章' })).toBeVisible();
  await page.getByRole('link', { name: '用 Markdown 维护一个长期更新的网站' }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: '用 Markdown 维护一个长期更新的网站' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '目录' })).toBeVisible();
});

test('主题选择会在页面导航后保留', async ({ page }) => {
  await page.goto('/');

  const toggle = page.getByRole('button', { name: '切换到深色主题' });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: '切换到浅色主题' })).toHaveAttribute('aria-pressed', 'true');

  await page.goto('/about/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('生产构建提供可用的站内搜索', async ({ page }) => {
  await page.goto('/search/');

  await page.getByRole('searchbox', { name: '关键词' }).fill('Astro');
  await expect(page.getByRole('status')).toContainText('找到');
  await expect(page.locator('#search-results a[href="/blog/content-workflow/"]')).toBeVisible();
  await expect(page).toHaveURL(/\?q=Astro$/);
});
