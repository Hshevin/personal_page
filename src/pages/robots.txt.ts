export function GET(context: { site?: URL }) {
  const site = context.site ?? new URL('https://personal-page.workers.dev');
  const sitemap = new URL('/sitemap-index.xml', site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
