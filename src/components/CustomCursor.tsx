/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'view' | 'pointer'>('default');
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer and no reduced-motion preference
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || prefersReducedMotion) {
      setEnabled(false);
      return;
    }

    setEnabled(true);

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hovered element cursor hints
      const target = e.target as HTMLElement | null;
      if (target) {
        const viewTarget = target.closest('[data-cursor="view"]');
        if (viewTarget) {
          setCursorType('view');
          return;
        }

        const clickable = target.closest('button, a, input, select, textarea, [role="button"], [data-cursor="pointer"]');
        if (clickable) {
          setCursorType('pointer');
          return;
        }

        setCursorType('default');
      }
    };

    const onMouseDown = () => setIsPressed(true);
    const onMouseUp = () => setIsPressed(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    let animationId: number;

    // Smooth lerp trailing loop for outer ring
    const render = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.22;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.22;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, [isVisible]);

  if (!enabled || !isVisible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none"
    >
      {/* Center Precision Micro-Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#C9A24B] transition-opacity duration-150 ${
          cursorType === 'view' ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Trailing Fluid Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 flex items-center justify-center rounded-full transition-[width,height,background-color,border-color] duration-300 ease-out ${
          cursorType === 'view'
            ? 'w-16 h-16 bg-[#121214]/95 text-[#F5F1E8] border border-[#C9A24B]/50 shadow-xl backdrop-blur-xs'
            : cursorType === 'pointer'
            ? 'w-10 h-10 bg-[#C9A24B]/15 border border-[#C9A24B]/60'
            : isPressed
            ? 'w-6 h-6 border border-[#C9A24B] bg-[#C9A24B]/10'
            : 'w-7 h-7 border border-white/20'
        }`}
      >
        {cursorType === 'view' && (
          <span className="text-[10px] font-body font-semibold tracking-widest uppercase text-[#F5F1E8]">
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
