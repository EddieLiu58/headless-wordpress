'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { buildSplitHTML } from '@/lib/split-text';
import type { HeroSettings } from '@/lib/wordpress';

const FALLBACK_BG = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)';

export default function Hero({ settings }: { settings: HeroSettings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 視差背景
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          },
        });
      }

      // 標題逐字 reveal（.line-inner 由 dangerouslySetInnerHTML 渲染）
      const titleInners = titleRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        titleInners,
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1.0, ease: 'power4.out', delay: 0.3 }
      );

      // 副標 reveal
      const subtitleInners = subtitleRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        subtitleInners,
        { y: '110%' },
        { y: '0%', stagger: 0.04, duration: 0.9, ease: 'power4.out', delay: 0.55 }
      );

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.9 }
      );

      // 向下箭頭
      gsap.fromTo(
        scrollHintRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power2.out', delay: 1.4 }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bgStyle = settings.imageUrl
    ? { backgroundImage: `url(${settings.imageUrl})` }
    : {};

  return (
    <section ref={sectionRef} style={styles.section}>
      <div
        ref={bgRef}
        style={{
          ...styles.bg,
          ...(settings.imageUrl ? bgStyle : { background: FALLBACK_BG }),
        }}
      />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1
          ref={titleRef}
          style={styles.title}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(settings.title) }}
        />
        <p
          ref={subtitleRef}
          style={styles.subtitle}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(settings.subtitle) }}
        />
        <a
          ref={ctaRef}
          href={settings.ctaLink}
          style={styles.cta}
          onMouseEnter={(e) => gsap.to(e.currentTarget, { backgroundColor: '#fff', color: '#000', duration: 0.3 })}
          onMouseLeave={(e) => gsap.to(e.currentTarget, { backgroundColor: 'transparent', color: '#fff', duration: 0.3 })}
        >
          {settings.ctaText}
        </a>
      </div>

      <div ref={scrollHintRef} style={styles.scrollHint}>↓</div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: {
    position: 'absolute',
    inset: '-30% 0',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: '#fff',
    padding: '0 2rem',
    maxWidth: '800px',
  },
  title: {
    fontSize: 'clamp(2rem, 6vw, 5rem)',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  subtitle: {
    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
    fontWeight: 300,
    letterSpacing: '0.1em',
    marginBottom: '3rem',
    lineHeight: 1.8,
  },
  cta: {
    display: 'inline-block',
    padding: '1rem 3rem',
    border: '1px solid rgba(255,255,255,0.8)',
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '0.25em',
    fontSize: '0.85rem',
    fontWeight: 400,
    backgroundColor: 'transparent',
  },
  scrollHint: {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1.5rem',
    animation: 'bounce 2s infinite',
    zIndex: 1,
    opacity: 0,
  },
};
