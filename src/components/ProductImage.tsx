/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Product } from '../data/products.ts';

interface ProductImageProps {
  product: Product;
  className?: string;
  isZoomable?: boolean;
}

export default function ProductImage({ product, className = '', isZoomable = false }: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Finish color accent mapping
  const finishColorMap: Record<string, { bg: string; border: string; accent: string }> = {
    Gold: { bg: 'from-[#F3ECE1] to-[#E9DCB8]', border: '#B08D57', accent: '#D4AF37' },
    Black: { bg: 'from-[#2A2D31] to-[#111214]', border: '#44484E', accent: '#6B7280' },
    Silver: { bg: 'from-[#EFEFF1] to-[#DCDDE1]', border: '#9CA3AF', accent: '#CBD5E1' },
    Antique: { bg: 'from-[#E7DFCE] to-[#C8B896]', border: '#8C6A35', accent: '#A07E44' },
    Steel: { bg: 'from-[#E2E4E8] to-[#C9CED6]', border: '#64748B', accent: '#94A3B8' },
  };

  const currentTheme = finishColorMap[product.finish] || finishColorMap.Gold;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F4F0E9] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!imageError ? (
        <img
          src={product.image}
          alt={product.name}
          onError={() => setImageError(true)}
          className={`w-full h-full object-contain p-4 transition-transform duration-500 ease-out ${
            isZoomable && isHovered ? 'scale-110' : 'scale-100'
          }`}
          loading="lazy"
        />
      ) : (
        /* Luxury Architectural Gradient Placeholder */
        <div
          className={`w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${currentTheme.bg} relative select-none`}
        >
          {/* Subtle architectural schematic grid */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#111214_1px,transparent_1px)] [background-size:16px_16px]"
          />

          {/* Dynamic SVG Silhouette tailored to category */}
          <div
            className={`relative z-10 w-full max-w-[180px] h-48 flex items-center justify-center transition-transform duration-500 ${
              isZoomable && isHovered ? 'scale-110' : 'scale-100'
            }`}
          >
            {/* Ambient metallic soft glow */}
            <div
              className="absolute w-28 h-28 rounded-full blur-2xl opacity-40 pointer-events-none"
              style={{ backgroundColor: currentTheme.border }}
            />

            <svg
              viewBox="0 0 160 220"
              className="w-full h-full drop-shadow-md"
              style={{ color: product.finish === 'Black' ? '#E7E1D7' : '#111214' }}
            >
              {product.category === 'Handles' && (
                <g transform="translate(15, 30)">
                  {/* Escutcheon Rose */}
                  <ellipse cx="65" cy="80" rx="36" ry="48" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  <ellipse cx="65" cy="80" rx="22" ry="30" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                  {/* Pivot collar */}
                  <rect x="52" y="70" width="26" height="20" rx="4" fill={currentTheme.border} />
                  {/* Lever Arm with fluting */}
                  <rect x="68" y="66" width="72" height="26" rx="13" fill="currentColor" />
                  <line x1="86" y1="68" x2="86" y2="90" stroke={currentTheme.border} strokeWidth="2" />
                  <line x1="98" y1="68" x2="98" y2="90" stroke={currentTheme.border} strokeWidth="2" />
                  <line x1="110" y1="68" x2="110" y2="90" stroke={currentTheme.border} strokeWidth="2" />
                  <line x1="122" y1="68" x2="122" y2="90" stroke={currentTheme.border} strokeWidth="2" />
                </g>
              )}

              {product.category === 'Pulls & Bars' && (
                <g transform="translate(25, 20)">
                  {/* Standoff pedestals */}
                  <rect x="25" y="30" width="24" height="18" rx="2" fill={currentTheme.border} />
                  <rect x="25" y="130" width="24" height="18" rx="2" fill={currentTheme.border} />
                  {/* Tall vertical architectural pull bar (never cropped) */}
                  <rect x="49" y="10" width="22" height="160" rx="11" fill="currentColor" />
                  <line x1="56" y1="20" x2="56" y2="160" stroke={currentTheme.border} strokeWidth="2" />
                  <line x1="64" y1="20" x2="64" y2="160" stroke={currentTheme.border} strokeWidth="2" />
                  {/* Base roses */}
                  <circle cx="18" cy="39" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="18" cy="139" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                </g>
              )}

              {product.category === 'Tower Bolts' && (
                <g transform="translate(25, 30)">
                  {/* Backplate */}
                  <rect x="20" y="20" width="70" height="120" rx="3" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" />
                  {/* Shoot rod */}
                  <rect x="48" y="5" width="14" height="150" rx="4" fill="currentColor" />
                  {/* Turning knob */}
                  <circle cx="55" cy="70" r="14" fill={currentTheme.border} stroke="currentColor" strokeWidth="2" />
                  {/* Guides */}
                  <rect x="36" y="32" width="38" height="16" fill="currentColor" fillOpacity="0.8" />
                  <rect x="36" y="100" width="38" height="16" fill="currentColor" fillOpacity="0.8" />
                </g>
              )}

              {product.category === 'Finials' && (
                <g transform="translate(25, 25)">
                  {/* Base mount */}
                  <rect x="35" y="125" width="40" height="20" rx="2" fill="currentColor" fillOpacity="0.7" />
                  {/* Stepped collar */}
                  <path d="M 40 125 L 70 125 L 65 105 L 45 105 Z" fill={currentTheme.border} />
                  {/* Fluted Acorn Dome */}
                  <path
                    d="M 45 105 C 30 70, 45 35, 55 25 C 65 35, 80 70, 65 105 Z"
                    fill="currentColor"
                  />
                  <line x1="55" y1="25" x2="55" y2="105" stroke={currentTheme.border} strokeWidth="2" />
                  <circle cx="55" cy="22" r="6" fill={currentTheme.border} />
                </g>
              )}

              {product.category === 'Plates & Escutcheons' && (
                <g transform="translate(25, 15)">
                  {/* Tall vertical plate */}
                  <rect x="25" y="10" width="60" height="170" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
                  {/* Bevel internal groove */}
                  <rect x="30" y="15" width="50" height="160" rx="2" fill="currentColor" fillOpacity="0.06" />
                  {/* Lever spindle hole */}
                  <circle cx="55" cy="50" r="10" fill="currentColor" />
                  {/* Euro Cylinder cutout */}
                  <circle cx="55" cy="110" r="8" fill="currentColor" />
                  <polygon points="48,110 62,110 59,124 51,124" fill="currentColor" />
                  {/* Screw fixing holes */}
                  <circle cx="55" cy="26" r="3" fill={currentTheme.border} />
                  <circle cx="55" cy="164" r="3" fill={currentTheme.border} />
                </g>
              )}
            </svg>
          </div>

          {/* Micro placeholder label */}
          <div className="mt-2 text-center z-10">
            <span
              className="text-[9px] font-mono tracking-widest uppercase font-semibold"
              style={{ color: currentTheme.border }}
            >
              {product.category} · {product.finish}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
