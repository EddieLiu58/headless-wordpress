import Link from 'next/link';
import { getPosts } from '@/lib/wordpress';

export default async function HomePage() {
  let posts = [];
  try {
    posts = await getPosts();
  } catch {
    // WordPress may not be ready yet
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>最新文章</h1>
      {posts.length === 0 ? (
        <p style={{ color: '#888' }}>
          尚無文章。請先到{' '}
          <a href="http://localhost:8080/wp-admin" target="_blank" rel="noreferrer">
            WordPress 後台
          </a>{' '}
          新增內容。
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {posts.map((post) => (
            <article key={post.id}>
              <h2>
                <Link href={`/posts/${post.slug}`}>
                  <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </Link>
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>
                {new Date(post.date).toLocaleDateString('zh-TW')}
              </p>
              <div
                style={{ color: '#555' }}
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
