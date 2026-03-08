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

export interface HeroSettings {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaLink: string;
}

export async function getHeroSettings(): Promise<HeroSettings> {
  const defaults: HeroSettings = {
    title: '近百年縫製技術的傳承',
    subtitle: 'We are highly motivated to present GOOD SLEEP to as many people as possible',
    imageUrl: '',
    ctaText: 'EXPLORE',
    ctaLink: '#products',
  };

  try {
    const res = await fetch(
      `${WP_API_URL}/wp/v2/pages?slug=homepage-hero&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return defaults;
    const pages = await res.json();
    if (!pages.length) return defaults;

    const page = pages[0];
    const media = page._embedded?.['wp:featuredmedia']?.[0];
    return {
      title: page.title?.rendered || defaults.title,
      subtitle: page.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || defaults.subtitle,
      imageUrl: media?.source_url || defaults.imageUrl,
      ctaText: defaults.ctaText,
      ctaLink: defaults.ctaLink,
    };
  } catch {
    return defaults;
  }
}

// ── Section helpers ──────────────────────────────────────────────

type WpPage = {
  title: { rendered: string };
  excerpt?: { rendered: string };
  content?: { rendered: string };
  _embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string }> };
};

async function fetchSection(slug: string): Promise<WpPage | null> {
  try {
    const res = await fetch(
      `${WP_API_URL}/wp/v2/pages?slug=${slug}&_embed`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const pages: WpPage[] = await res.json();
    return pages[0] ?? null;
  } catch {
    return null;
  }
}

// ── Who We Are ───────────────────────────────────────────────────
export interface WhoWeAreData {
  title: string;
  body: string;
  imageUrl: string;
}

export async function getWhoWeAre(): Promise<WhoWeAreData> {
  const defaults: WhoWeAreData = {
    title: 'WHO WE ARE',
    body: '我們致力於為每個人帶來最高品質的睡眠體驗，傳承近百年的工藝精神，以最嚴謹的態度縫製每一件產品。',
    imageUrl: '',
  };
  const p = await fetchSection('who-we-are');
  if (!p) return defaults;
  return {
    title: p.title?.rendered || defaults.title,
    body: p.content?.rendered?.replace(/<[^>]+>/g, '').trim() || defaults.body,
    imageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaults.imageUrl,
  };
}

// ── Products ─────────────────────────────────────────────────────
export interface ProductItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  slug: string;
}

export async function getProducts(): Promise<ProductItem[]> {
  try {
    const res = await fetch(
      `${WP_API_URL}/wp/v2/posts?categories_slug=products&per_page=6&_embed`,
      { next: { revalidate: 60 } }
    );
    // fallback: try tag
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return [];
    return posts.map((p: Post & { _embedded?: { 'wp:featuredmedia'?: Array<{ source_url: string }> } }) => ({
      id: p.id,
      title: p.title.rendered,
      description: p.excerpt.rendered.replace(/<[^>]+>/g, '').trim(),
      imageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
      slug: p.slug,
    }));
  } catch {
    return [];
  }
}

// ── What We Do ───────────────────────────────────────────────────
export interface WhatWeDoData {
  title: string;
  body: string;
  photos: string[];
}

export async function getWhatWeDo(): Promise<WhatWeDoData> {
  const defaults: WhatWeDoData = {
    title: 'WHAT WE DO',
    body: '自1923年由北村貞吉創立以來，我們將傳統工藝與現代技術完美結合，每一道工序都代表著對品質的承諾。',
    photos: [],
  };
  const p = await fetchSection('what-we-do');
  if (!p) return defaults;

  // Parse image URLs from content
  const content = p.content?.rendered || '';
  const imgMatches: string[] = [];
  const re = /src="([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) imgMatches.push(m[1]);

  return {
    title: p.title?.rendered || defaults.title,
    body: content.replace(/<[^>]+>/g, '').trim() || defaults.body,
    photos: imgMatches.length ? imgMatches : defaults.photos,
  };
}

// ── Philosophy ───────────────────────────────────────────────────
export interface PhilosophyData {
  headline: string;
  body: string;
  imageUrl: string;
}

export async function getPhilosophy(): Promise<PhilosophyData> {
  const defaults: PhilosophyData = {
    headline: 'MAKURA ≠ PILLOW',
    body: '枕頭不僅僅是寢具，它是文化的延伸、工藝的結晶，是每一個夜晚與清晨之間的守護者。',
    imageUrl: '',
  };
  const p = await fetchSection('philosophy');
  if (!p) return defaults;
  return {
    headline: p.title?.rendered || defaults.headline,
    body: p.content?.rendered?.replace(/<[^>]+>/g, '').trim() || defaults.body,
    imageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaults.imageUrl,
  };
}

// ── Footer ───────────────────────────────────────────────────────
export interface FooterData {
  bgImageUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  copyright: string;
}

export async function getFooterSettings(): Promise<FooterData> {
  const defaults: FooterData = {
    bgImageUrl: '',
    instagramUrl: '#',
    facebookUrl: '#',
    copyright: `© ${new Date().getFullYear()} All Rights Reserved.`,
  };
  const p = await fetchSection('footer-settings');
  if (!p) return defaults;
  const content = p.content?.rendered || '';
  const igMatch = content.match(/instagram\.com[^\s"<]*/);
  const fbMatch = content.match(/facebook\.com[^\s"<]*/);
  return {
    bgImageUrl: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || defaults.bgImageUrl,
    instagramUrl: igMatch ? `https://${igMatch[0]}` : defaults.instagramUrl,
    facebookUrl: fbMatch ? `https://${fbMatch[0]}` : defaults.facebookUrl,
    copyright: p.excerpt?.rendered?.replace(/<[^>]+>/g, '').trim() || defaults.copyright,
  };
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
