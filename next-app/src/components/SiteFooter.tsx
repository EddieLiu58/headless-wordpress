'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap-config';
import { buildCharSplitHTML } from '@/lib/split-text';
import type { FooterData } from '@/lib/wordpress';

export default function SiteFooter({ data }: { data: FooterData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLParagraphElement>(null);
  const socialRef = useRef<HTMLElement>(null);
  const copyrightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = { trigger: sectionRef.current, start: 'top 80%' };

      // 背景 yPercent 視差
      if (bgRef.current) {
        gsap.fromTo(
          bgRef.current,
          { yPercent: 10 },
          { yPercent: -10, ease: 'none', scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
        );
      }

      // 品牌文字逐字 reveal
      const brandInners = brandRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        brandInners,
        { y: '110%' },
        { y: '0%', stagger: 0.04, duration: 0.7, ease: 'power4.out', scrollTrigger: trigger }
      );

      // 社群連結
      gsap.fromTo(socialRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3, scrollTrigger: trigger });

      // 版權
      gsap.fromTo(copyrightRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.5, scrollTrigger: trigger });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bgStyle = data.bgImageUrl
    ? { backgroundImage: `url(${data.bgImageUrl})` }
    : { background: '#111' };

  return (
    <footer ref={sectionRef} style={styles.footer}>
      <div ref={bgRef} style={{ ...styles.bg, ...bgStyle }} />
      <div style={styles.overlay} />

      <div style={styles.content}>
        <p
          ref={brandRef}
          style={styles.brand}
          dangerouslySetInnerHTML={{ __html: buildCharSplitHTML('HEADLESS WP') }}
        />

        <nav ref={socialRef} style={styles.social}>
          {data.instagramUrl !== '#' && (
            <a
              href={data.instagramUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { opacity: 0.5, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { opacity: 1, duration: 0.3 })}
            >
              Instagram
            </a>
          )}
          {data.facebookUrl !== '#' && (
            <a
              href={data.facebookUrl}
              target="_blank"
              rel="noreferrer"
              style={styles.socialLink}
              onMouseEnter={(e) => gsap.to(e.currentTarget, { opacity: 0.5, duration: 0.3 })}
              onMouseLeave={(e) => gsap.to(e.currentTarget, { opacity: 1, duration: 0.3 })}
            >
              Facebook
            </a>
          )}
          {data.instagramUrl === '#' && data.facebookUrl === '#' && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>
              透過 WordPress 頁面「footer-settings」設定社群連結
            </span>
          )}
        </nav>

        <p ref={copyrightRef} style={styles.copyright}>{data.copyright}</p>
      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    position: 'relative',
    padding: '8rem 2rem 4rem',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bg: { position: 'absolute', inset: '-30% 0', backgroundSize: 'cover', backgroundPosition: 'center' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' },
  content: { position: 'relative', zIndex: 1, textAlign: 'center', color: '#fff' },
  brand: { fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.3em', marginBottom: '2rem' },
  social: { display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '3rem' },
  socialLink: { color: '#fff', textDecoration: 'none', fontSize: '0.85rem', letterSpacing: '0.2em' },
  copyright: { fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' },
};
