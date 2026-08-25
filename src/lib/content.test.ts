import { describe, expect, it } from 'vitest';

import {
  estimateReadingMinutes,
  getPublishedPosts,
  getTagCounts,
} from './content';

type TestPost = {
  id: string;
  data: {
    draft: boolean;
    publishedAt: Date;
    tags: string[];
  };
};

const post = (
  id: string,
  publishedAt: string,
  options: { draft?: boolean; tags?: string[] } = {},
): TestPost => ({
  id,
  data: {
    draft: options.draft ?? false,
    publishedAt: new Date(publishedAt),
    tags: options.tags ?? [],
  },
});

describe('getPublishedPosts', () => {
  it('excludes drafts and future posts, then sorts newest first', () => {
    const posts = [
      post('older', '2026-01-01'),
      post('future', '2027-01-01'),
      post('draft', '2026-07-01', { draft: true }),
      post('newer', '2026-08-01'),
    ];

    const result = getPublishedPosts(posts, new Date('2026-08-26T00:00:00Z'));

    expect(result.map(({ id }) => id)).toEqual(['newer', 'older']);
  });

  it('does not mutate the input order', () => {
    const posts = [post('older', '2026-01-01'), post('newer', '2026-08-01')];

    getPublishedPosts(posts, new Date('2026-08-26T00:00:00Z'));

    expect(posts.map(({ id }) => id)).toEqual(['older', 'newer']);
  });
});

describe('estimateReadingMinutes', () => {
  it('returns at least one minute for short content', () => {
    expect(estimateReadingMinutes('一段很短的学习笔记。')).toBe(1);
  });

  it('accounts for both Chinese characters and Latin words', () => {
    const chinese = '学'.repeat(400);
    const english = Array.from({ length: 200 }, () => 'astro').join(' ');

    expect(estimateReadingMinutes(`${chinese} ${english}`)).toBe(2);
  });
});

describe('getTagCounts', () => {
  it('counts tags and orders by count then Chinese locale name', () => {
    const posts = [
      post('one', '2026-01-01', { tags: ['Astro', '学习'] }),
      post('two', '2026-02-01', { tags: ['Astro', '随笔'] }),
    ];

    expect(getTagCounts(posts)).toEqual([
      { name: 'Astro', count: 2 },
      { name: '随笔', count: 1 },
      { name: '学习', count: 1 },
    ]);
  });
});
