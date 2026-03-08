'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { buildSplitHTML } from '@/lib/split-text';
import Link from 'next/link';
import type { ProductItem } from '@/lib/wordpress';

const PLACEHOLDER_COLORS = ['#e8e0d5', '#d4c9b8', '#c9bfb0', '#bdb3a6', '#b3a99d', '#a89f96'];

export default function Products({ items }: { items: ProductItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 標題 mask reveal（.line-inner 由 dangerouslySetInnerHTML 渲染）
      const titleInners = titleRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        titleInners,
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1.0, ease: 'power4.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      // 卡片 clip-path reveal（從下往上展開）
      const cards = cardsRef.current?.querySelectorAll<HTMLElement>('.product-card') ?? [];
      gsap.fromTo(
        cards,
        { clipPath: 'inset(100% 0 0 0)', WebkitClipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          WebkitClipPath: 'inset(0% 0 0 0)',
          stagger: 0.08,
          duration: 1.0,
          ease: 'power4.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
        }
      );

      // 卡片 Hover
      cards.forEach((card) => {
        const img = card.querySelector<HTMLElement>('.card-img');
        const overlay = card.querySelector<HTMLElement>('.card-overlay');
        card.addEventListener('mouseenter', () => {
          if (img) gsap.to(img, { scale: 1.06, duration: 0.6, ease: 'power3.out' });
          if (overlay) gsap.to(overlay, { opacity: 1, duration: 0.3 });
        });
        card.addEventListener('mouseleave', () => {
          if (img) gsap.to(img, { scale: 1, duration: 0.5, ease: 'power3.out' });
          if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [items]);

  const displayItems = items.length > 0 ? items : PLACEHOLDER_CARDS;

  return (
    <section ref={sectionRef} style={styles.section} id="products">
      <div style={styles.header}>
        <p style={styles.label}>02</p>
        <h2
          ref={titleRef}
          style={styles.title}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML('PRODUCTS') }}
        />
        <div style={styles.divider} />
      </div>

      <div ref={cardsRef} style={styles.grid}>
        {displayItems.map((item, i) => (
          <Link
            key={item.id}
            href={items.length > 0 ? `/posts/${item.slug}` : '#'}
            style={styles.cardLink}
          >
            <article className="product-card" style={styles.card}>
              <div style={styles.imgWrap}>
                {item.imageUrl ? (
                  <img className="card-img" src={item.imageUrl} alt={item.title} style={styles.img} />
                ) : (
                  <div
                    className="card-img"
                    style={{ ...styles.img, background: PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length] }}
                  />
                )}
                <div className="card-overlay" style={styles.imgOverlay} />
              </div>
              <div style={styles.cardBody}>
                <h3 style={styles.cardTitle} dangerouslySetInnerHTML={{ __html: item.title }} />
                <p style={styles.cardDesc}>{item.description || '點擊查看詳情'}</p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}

const PLACEHOLDER_CARDS: ProductItem[] = Array.from({ length: 4 }, (_, i) => ({
  id: i + 1,
  title: `產品 0${i + 1}`,
  description: '透過 WordPress 後台新增「products」分類的文章即可顯示。',
  imageUrl: '',
  slug: '#',
}));

const styles: Record<string, React.CSSProperties> = {
  section: { padding: '8rem 2rem', background: '#fff' },
  header: { textAlign: 'center', marginBottom: '4rem' },
  label: { fontSize: '0.75rem', letterSpacing: '0.3em', color: '#aaa', marginBottom: '0.75rem' },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#1a1a1a',
    marginBottom: '1rem',
  },
  divider: { width: '3rem', height: '2px', background: '#1a1a1a', margin: '0 auto' },
  grid: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '2rem',
  },
  cardLink: { textDecoration: 'none', color: 'inherit', display: 'block' },
  card: { cursor: 'pointer' },
  imgWrap: { position: 'relative', overflow: 'hidden', marginBottom: '1rem' },
  img: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' },
  imgOverlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.15)', opacity: 0 },
  cardBody: { padding: '0 0.25rem' },
  cardTitle: { fontSize: '1rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.5rem', color: '#1a1a1a' },
  cardDesc: { fontSize: '0.85rem', color: '#888', lineHeight: 1.6 },
};
