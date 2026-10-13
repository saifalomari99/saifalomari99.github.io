import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;
export type Article = CollectionEntry<'writing'>;

/** Sorted by `order` (lower first); ties broken by title. `tier` only affects the badge. */
function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

/** All published projects in display order. */
export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', ({ data }) => !data.draft);
  return sortProjects(all);
}

/** Published articles, newest first. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('writing', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function projectUrl(p: Project): string {
  return `/projects/${p.id}/`;
}

export function articleUrl(a: Article): string {
  return `/writing/${a.id}/`;
}
