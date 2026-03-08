'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { buildSplitHTML } from '@/lib/split-text';
import type { WhoWeAreData } from '@/lib/wordpress';

const PLACEHOLDER = 'linear-gradient(135deg, #e8e0d5 0%, #d4c9b8 100%)';

export default function WhoWeAre({ data }: { data: WhoWeAreData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const clipWrapRef = useRef<HTMLDivElement>(null);
  const imgInnerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 70%' };

      // 圖片 clip-path reveal（從右向左展開）
      gsap.fromTo(
        clipWrapRef.current,
        { clipPath: 'inset(0 100% 0 0)', WebkitClipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          WebkitClipPath: 'inset(0 0% 0 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: trigger,
        }
      );

      // 圖片本身微縮放
      if (imgInnerRef.current) {
        const imgEl = imgInnerRef.current.firstChild as HTMLElement;
        if (imgEl) {
          gsap.fromTo(imgEl, { scale: 1.12 }, { scale: 1, duration: 1.8, ease: 'power3.out', scrollTrigger: trigger });
        }
      }

      // 標題逐字 reveal
      const titleInners = titleRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        titleInners,
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1.0, ease: 'power4.out', delay: 0.2, scrollTrigger: trigger }
      );

      // Divider scale
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'power3.out', delay: 0.45, scrollTrigger: trigger }
      );

      // Body 逐字 reveal
      const bodyInners = bodyRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        bodyInners,
        { y: '110%' },
        { y: '0%', stagger: 0.04, duration: 0.9, ease: 'power4.out', delay: 0.5, scrollTrigger: trigger }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={styles.section} id="about">
      <div style={styles.inner}>
        {/* 左側圖片 */}
        <div ref={clipWrapRef} style={styles.clipWrap}>
          <div ref={imgInnerRef} style={styles.imgInner}>
            {data.imageUrl ? (
              <img src={data.imageUrl} alt={data.title} style={styles.img} />
            ) : (
              <div style={{ ...styles.img, background: PLACEHOLDER }} />
            )}
          </div>
        </div>

        {/* 右側文字 */}
        <div style={styles.textWrap}>
          <p style={styles.label}>01</p>
          <h2
            ref={titleRef}
            style={styles.title}
            dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.title) }}
          />
          <div ref={dividerRef} style={{ ...styles.divider, transformOrigin: 'left' }} />
          <p
            ref={bodyRef}
            style={styles.body}
            dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.body) }}
          />
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { padding: '8rem 2rem', background: '#faf9f7' },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '5rem',
    flexWrap: 'wrap',
  },
  clipWrap: { flex: '1 1 400px', overflow: 'hidden' },
  imgInner: { overflow: 'hidden' },
  img: { width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
  textWrap: { flex: '1 1 320px' },
  label: { fontSize: '0.75rem', letterSpacing: '0.3em', color: '#aaa', marginBottom: '1rem' },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 700,
    letterSpacing: '0.08em',
    lineHeight: 1.5,
    marginBottom: '1.5rem',
    color: '#1a1a1a',
  },
  divider: { width: '3rem', height: '2px', background: '#1a1a1a', marginBottom: '1.5rem' },
  body: { fontSize: '1rem', lineHeight: 2, color: '#555' },
};
