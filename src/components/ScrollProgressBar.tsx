/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

/**
 * Thin luxury gold scroll-progress line at the top of the viewport.
 * Direct DOM transform via requestAnimationFrame ensures zero-overhead 60-120fps tracking.
 */
export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;

    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0 && barRef.current) {
        const progress = Math.min(1, Math.max(0, window.scrollY / scrollHeight));
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateProgress();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-black/40"
    >
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#C9A24B] via-[#E6C77A] to-[#C9A24B] origin-left shadow-[0_0_8px_rgba(201,162,75,0.45)]"
        style={{ transform: 'scaleX(0)', willChange: 'transform' }}
      />
    </div>
  );
}
