const WP_API_URL = process.env.WORDPRESS_API_URL || 'http://localhost:8080/wp-json';

export interface Post {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }>;
  };
}

export interface Page {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export async function getPosts(page = 1, perPage = 10): Promise<Post[]> {
  const res = await fetch(
    `${WP_API_URL}/wp/v2/posts?page=${page}&per_page=${perPage}&_embed`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(
    `${WP_API_URL}/wp/v2/posts?slug=${slug}&_embed`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch post');
  const posts: Post[] = await res.json();
  return posts[0] ?? null;
}

export async function getPage(slug: string): Promise<Page | null> {
  const res = await fetch(
    `${WP_API_URL}/wp/v2/pages?slug=${slug}`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch page');
  const pages: Page[] = await res.json();
  return pages[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const res = await fetch(
    `${WP_API_URL}/wp/v2/posts?per_page=100&fields=slug`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error('Failed to fetch slugs');
  const posts: Pick<Post, 'slug'>[] = await res.json();
  return posts.map((p) => p.slug);
}
