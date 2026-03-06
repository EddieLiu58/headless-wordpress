import { getPost, getAllPostSlugs } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs().catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export default async function PostPage({ params }: Props) {
  const post = await getPost(params.slug).catch(() => null);

  if (!post) notFound();

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <article>
      <Link href="/" style={{ fontSize: '0.875rem' }}>
        &larr; 返回列表
      </Link>
      <h1
        style={{ margin: '1.5rem 0 0.5rem' }}
        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
      />
      <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '1.5rem' }}>
        {new Date(post.date).toLocaleDateString('zh-TW')}
      </p>
      {featuredImage && (
        <img
          src={featuredImage.source_url}
          alt={featuredImage.alt_text}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '1.5rem' }}
        />
      )}
      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}
