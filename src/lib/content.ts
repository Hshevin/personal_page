export type PublishablePost = {
  data: {
    draft: boolean;
    publishedAt: Date;
    tags: string[];
  };
};

export function getPublishedPosts<T extends PublishablePost>(
  posts: readonly T[],
  now = new Date(),
): T[] {
  return posts
    .filter((post) => !post.data.draft && post.data.publishedAt <= now)
    .toSorted(
      (left, right) =>
        right.data.publishedAt.getTime() - left.data.publishedAt.getTime(),
    );
}

export function estimateReadingMinutes(content: string): number {
  const chineseCharacters = content.match(/\p{Script=Han}/gu)?.length ?? 0;
  const latinWords = content.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)?.length ?? 0;
  const minutes = chineseCharacters / 400 + latinWords / 200;

  return Math.max(1, Math.ceil(minutes));
}

export function getTagCounts<T extends PublishablePost>(
  posts: readonly T[],
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();

  for (const { data } of posts) {
    for (const tag of data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  const collator = new Intl.Collator('zh-CN');

  return Array.from(counts, ([name, count]) => ({ name, count })).toSorted(
    (left, right) => right.count - left.count || collator.compare(left.name, right.name),
  );
}
