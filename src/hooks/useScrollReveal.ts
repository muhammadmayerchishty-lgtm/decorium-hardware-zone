/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';

/**
 * Custom hook implementing Apple-style scroll reveals:
 * - Each section's elements fade up (translateY 24px to 0, opacity 0 to 1)
 * - Duration: 0.9s
 * - Easing: cubic-bezier(0.25, 0.1, 0.25, 1)
 * - Staggered by 80ms per element
 * - Triggered once via native IntersectionObserver
 * - Full respect for prefers-reduced-motion
 */
export function useScrollReveal() {
  useEffect(() => {
    // 1. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Enable reveal styles now that JS observer is active
    document.documentElement.classList.add('reveal-ready');

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-section]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            const items = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal], .reveal-item'));

            if (items.length > 0) {
              items.forEach((item, index) => {
                item.style.transitionDelay = `${index * 80}ms`;
                item.classList.add('is-revealed');
              });
            } else {
              section.classList.add('is-revealed');
            }

            // Triggered once: stop observing this section
            observer.unobserve(section);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
    };
  }, []);
}
