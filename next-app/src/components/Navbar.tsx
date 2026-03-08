'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // 初始狀態：透明背景
    gsap.set(nav, { backgroundColor: 'rgba(255,255,255,0)', backdropFilter: 'blur(0px)' });

    const st = ScrollTrigger.create({
      start: 'top -80px',
      onEnter: () =>
        gsap.to(nav, {
          backgroundColor: 'rgba(255,255,255,0.95)',
          duration: 0.4,
          ease: 'power2.out',
        }),
      onLeaveBack: () =>
        gsap.to(nav, {
          backgroundColor: 'rgba(255,255,255,0)',
          duration: 0.3,
          ease: 'power2.out',
        }),
    });

    return () => st.kill();
  }, []);

  return (
    <nav ref={navRef} className="navbar">
      <Link href="/" style={styles.logo}>
        HEADLESS WP
      </Link>
      <div style={styles.links}>
        <a href="#about" style={styles.link}>ABOUT</a>
        <a href="#products" style={styles.link}>PRODUCTS</a>
        <a href="#what-we-do" style={styles.link}>WHAT WE DO</a>
        <a href="#philosophy" style={styles.link}>PHILOSOPHY</a>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  logo: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    letterSpacing: '0.2em',
    mixBlendMode: 'difference',
  },
  links: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    mixBlendMode: 'difference',
  },
};
