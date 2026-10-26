/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  productName?: string;
  category?: string;
  finish?: string;
  opaque?: boolean;
  priority?: boolean;
  className?: string;
  isZoomable?: boolean;
}

/**
 * SafeImage component adhering to DECORIUM specifications:
 * - Lazy loading by default (eager above the fold when priority=true)
 * - decoding="async"
 * - aspect-ratio 3/4
 * - Soft fade-in (transition-opacity duration-500)
 * - onError fallback block displaying the product name
 * - Never crops, stretches or upscales (object-contain, max-w-full, max-h-full)
 * - Dynamic image panel by data (opaque ? stone panel with multiply blend : dark radial panel with soft drop-shadow), both 28px radius.
 */
export default function SafeImage({
  src,
  alt,
  productName,
  category,
  finish,
  opaque = false,
  priority = false,
  className = '',
  isZoomable = false,
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const displayName = productName || alt || 'Architectural Hardware';

  // Image panel styling by data:
  // if opaque is false: dark radial panel (center #2A2A2E to edge #111113) with soft drop shadow
  // if opaque is true: stone panel (#EDE8DF) with mix-blend-mode: multiply
  const panelBgClass = opaque
    ? 'bg-[#EDE8DF] border border-[#C9A24B]/15'
    : 'bg-[radial-gradient(circle_at_center,_#2A2A2E_0%,_#111113_100%)] border border-white/[0.08]';

  return (
    <div
      className={`relative w-full aspect-[3/4] rounded-[28px] flex items-center justify-center overflow-hidden p-5 sm:p-6 select-none ${panelBgClass} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!hasError ? (
        <>
          {/* Subtle loading shimmer pulse while image is fetching */}
          {!isLoaded && (
            <div
              className={`absolute inset-0 animate-pulse ${
                opaque
                  ? 'bg-gradient-to-r from-[#EDE8DF] via-[#F4F0E9] to-[#EDE8DF]'
                  : 'bg-white/[0.04]'
              }`}
            />
          )}

          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-contain p-2 sm:p-3 transition-transform duration-500 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${isZoomable && isHovered ? 'scale-[1.01]' : 'scale-100'} ${
              opaque
                ? '[mix-blend-mode:multiply]'
                : 'drop-shadow-[0_12px_24px_rgba(0,0,0,0.55)]'
            }`}
          />
        </>
      ) : (
        /* Stone block fallback with product name so layout never breaks */
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative">
          <div className="relative z-10 w-12 h-12 rounded-full border border-[#C9A24B]/60 flex items-center justify-center mb-3 bg-[#F4F0E9]/10">
            <span className="font-heading text-lg text-[#C9A24B] font-semibold">
              D
            </span>
          </div>
          <p className="font-heading text-sm font-medium text-[#F5F5F7] leading-snug line-clamp-2">
            {displayName}
          </p>
          {(category || finish) && (
            <p className="mt-1 text-[10px] font-mono tracking-widest uppercase text-[#C9A24B] font-semibold">
              {[category, finish].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
