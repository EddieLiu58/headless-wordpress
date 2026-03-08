'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { buildSplitHTML } from '@/lib/split-text';
import type { WhatWeDoData } from '@/lib/wordpress';

const PLACEHOLDER_COLORS = ['#d4c9b8', '#c9bfb0', '#bdb3a6', '#b3a99d'];

export default function WhatWeDo({ data }: { data: WhatWeDoData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  // Store the pinning ScrollTrigger so useLayoutEffect can kill it
  // synchronously (before React removes DOM nodes).
  const pinSTRef = useRef<ScrollTrigger | null>(null);

  const photos = data.photos.length > 0 ? data.photos : PLACEHOLDER_COLORS;

  // Kill the pin BEFORE React removes DOM nodes.
  // useLayoutEffect cleanup is synchronous (commit phase), so it runs before
  // React's DOM mutations — preventing the removeChild error caused by
  // ScrollTrigger moving the section inside a pin-spacer div.
  useLayoutEffect(() => {
    return () => {
      pinSTRef.current?.kill(true);
      pinSTRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textTrigger = { trigger: sectionRef.current, start: 'top 75%' };

      // 標題逐字 reveal
      const titleInners = titleRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        titleInners,
        { y: '110%' },
        { y: '0%', stagger: 0.06, duration: 1.0, ease: 'power4.out', scrollTrigger: textTrigger }
      );

      // Body 逐字 reveal
      const bodyInners = bodyRef.current?.querySelectorAll('.line-inner') ?? [];
      gsap.fromTo(
        bodyInners,
        { y: '110%' },
        { y: '0%', stagger: 0.04, duration: 0.9, ease: 'power4.out', delay: 0.2, scrollTrigger: textTrigger }
      );

      const track = trackRef.current;
      if (!track) return;

      const getDistance = () => track.scrollWidth - window.innerWidth;

      // containerAnimation must be a GSAP tween (not a ScrollTrigger instance).
      // gsap.to with a scrollTrigger option creates both the tween and the pin.
      const containerTween = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${getDistance() + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Store the underlying ScrollTrigger for layout-effect cleanup
      if (containerTween.scrollTrigger) {
        pinSTRef.current = containerTween.scrollTrigger;
      }

      // 每張圖片 clip-path reveal（containerAnimation 與 pin 同步）
      const photoWraps = track.querySelectorAll<HTMLElement>('.photo-wrap');
      photoWraps.forEach((wrap, i) => {
        const offset = i * 15;
        gsap.fromTo(
          wrap,
          { clipPath: 'inset(0 100% 0 0)', WebkitClipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            WebkitClipPath: 'inset(0 0% 0 0)',
            ease: 'power4.inOut',
            scrollTrigger: {
              containerAnimation: containerTween,
              trigger: wrap,
              start: `left ${80 - offset}%`,
              end: `left ${30 - offset}%`,
              scrub: 1,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [photos]);

  return (
    <section ref={sectionRef} style={styles.section} id="what-we-do">
      <div style={styles.header}>
        <p style={styles.label}>03</p>
        <h2
          ref={titleRef}
          style={styles.title}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.title) }}
        />
        <div style={styles.divider} />
        <p
          ref={bodyRef}
          style={styles.body}
          dangerouslySetInnerHTML={{ __html: buildSplitHTML(data.body) }}
        />
      </div>

      <div ref={trackRef} style={styles.track}>
        {photos.map((src, i) => (
          <div key={i} className="photo-wrap" style={styles.photoWrap}>
            {data.photos.length > 0 ? (
              <img src={src} alt={`製程 ${i + 1}`} style={styles.photo} />
            ) : (
              <div style={{ ...styles.photo, background: src }} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  section: { background: '#1a1a1a', color: '#fff', overflow: 'hidden' },
  header: { maxWidth: '700px', margin: '0 auto', padding: '8rem 2rem 4rem', textAlign: 'center' },
  label: { fontSize: '0.75rem', letterSpacing: '0.3em', color: '#888', marginBottom: '0.75rem' },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    letterSpacing: '0.15em',
    marginBottom: '1rem',
  },
  divider: { width: '3rem', height: '2px', background: '#fff', margin: '0 auto 1.5rem' },
  body: { fontSize: '1rem', lineHeight: 2, color: '#aaa' },
  track: { display: 'flex', gap: '1.5rem', padding: '2rem 3rem 6rem', width: 'max-content' },
  photoWrap: { flexShrink: 0, overflow: 'hidden' },
  photo: { width: '40vw', maxWidth: '520px', aspectRatio: '4/3', objectFit: 'cover', display: 'block' },
};
