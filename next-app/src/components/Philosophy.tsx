'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { buildSplitHTML } from '@/lib/split-text';
import type { PhilosophyData } from '@/lib/wordpress';

export default function Philosophy({ data }: { data: PhilosophyData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 70%' };

      // 背景視差
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // Headline scrub 聯動 scale
      gsap.fromTo(
        headlineRef.current,
        { scale: 0.82 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', end: 'center center', scrub: true },
        }
      );

      // Headline 逐字 reveal
      const headlineInners = headlineRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        headlineInners,
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1.0, ease: 'power4.out', scrollTrigger: trigger }
      );

      // Body 逐字 reveal
      const bodyInners = bodyRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        bodyInners,
        { y: '110%' },
        { y: '0%', stagger: 0.04, duration: 0.9, ease: 'power4.out', delay: 0.3, scrollTrigger: trigger }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bgStyle = data.imageUrl
    ? { backgroundImage: `url(${data.imageUrl})` }
    : { background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)' };

  return (
    <section ref={sectionRef} style={styles.section} id="philosophy">
      <div ref={bgRef} style={{ ...styles.bg, ...bgStyle }} />
      <div style={styles.overlay} />
      <div style={styles.content}>
        <p style={styles.label}>04</p>
        <h2
          ref={headlineRef}
          style={styles.headline}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.headline) }}
        />
        <div style={styles.divider} />
        <p
          ref={bodyRef}
          style={styles.body}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.body) }}
        />
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    padding: '12rem 2rem',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: { position: 'absolute', inset: '-20% 0', backgroundSize: 'cover', backgroundPosition: 'center' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' },
  content: { position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff', maxWidth: '800px' },
  label: { fontSize: '0.75rem', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' },
  headline: {
    fontSize: 'clamp(2.5rem, 8vw, 6rem)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    lineHeight: 1.3,
    marginBottom: '2rem',
    transformOrigin: 'center',
  },
  divider: { width: '3rem', height: '2px', background: 'rgba(255,255,255,0.6)', margin: '0 auto 2rem' },
  body: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    lineHeight: 2,
    color: 'rgba(255,255,255,0.8)',
    maxWidth: '600px',
    margin: '0 auto',
  },
};
