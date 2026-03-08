'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap-config';

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let rafId = 0;
    let destroyed = false;
    let lenis: { raf: (t: number) => void; on: (e: string, cb: () => void) => void; destroy: () => void } | null = null;

    function raf(time: number) {
      if (destroyed || !lenis) return;
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;

      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }) as typeof lenis;

      // Use arrow function to avoid Lenis calling .bind() on a method reference
      lenis!.on('scroll', () => ScrollTrigger.update());

      rafId = requestAnimationFrame(raf);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }).catch(() => { /* lenis unavailable — degrade gracefully */ });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
    };
  }, []);

  return <>{children}</>;
}
