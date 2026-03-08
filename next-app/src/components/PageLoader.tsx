'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap-config';

const BRAND = 'HEADLESS WP';

export default function PageLoader() {
  const [visible, setVisible] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!loaderRef.current) return;

    // fallback: 4s 強制關閉
    const fallback = setTimeout(() => setVisible(false), 4000);

    const tl = gsap.timeline({
      onComplete: () => {
        clearTimeout(fallback);
        setVisible(false);
      },
    });

    // 逐字出現
    tl.fromTo(
      charsRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.04, duration: 0.5, ease: 'power3.out' }
    )
    // 停留
    .to({}, { duration: 0.4 })
    // Loader 向上退出
    .to(loaderRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
    });

    return () => {
      clearTimeout(fallback);
      tl.kill();
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={loaderRef} className="page-loader">
      <p style={styles.brand} aria-hidden="true">
        {BRAND.split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { if (el) charsRef.current[i] = el; }}
            style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  brand: {
    color: '#fff',
    fontSize: 'clamp(1rem, 4vw, 2rem)',
    letterSpacing: '0.35em',
    fontWeight: 300,
    overflow: 'hidden',
  },
};
