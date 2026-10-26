/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { memo } from 'react';
import { Product } from '../data/products.ts';
import SafeImage from './SafeImage.tsx';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickEnquire: (product: Product) => void;
}

const FINISH_COLOR_CHIPS: Record<string, string> = {
  Gold: '#C9A24B',
  Brass: '#C9A24B',
  Black: '#1A1A1D',
  Silver: '#CBD5E1',
  Antique: '#8F6F2A',
  Steel: '#94A3B8',
};

function ProductCard({ product, onSelect, onQuickEnquire }: ProductCardProps) {
  return (
    <div className="w-full">
      {/* 
        Collection card: rounded 28px, 32px padding (p-8 on sm+ screens),
        No heavy tilt, smooth hover interaction
      */}
      <div
        onClick={() => onSelect(product)}
        data-cursor="pointer"
        className="group relative bg-[#111113] hover:bg-[#151518] rounded-[28px] border border-white/[0.08] hover:border-[#C9A24B]/40 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out cursor-pointer hover:shadow-xl select-none"
      >
        {/* Image Panel */}
        <div className="relative w-full overflow-hidden rounded-[28px]">
          <SafeImage
            src={product.image}
            alt={product.name}
            productName={product.name}
            category={product.category}
            finish={product.finish}
            opaque={product.opaque}
          />

          {/* Category Micro-tag */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#000000]/60 backdrop-blur-xs text-[#F5F5F7] text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-medium border border-white/10">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Details below */}
        <div className="pt-6 space-y-2">
          {/* Product Name: weight 600, 19px */}
          <h3 className="font-heading text-[19px] font-semibold text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors leading-snug line-clamp-1 [text-wrap:balance]">
            {product.name}
          </h3>

          {/* Finish: in #A1A1A6 */}
          <p className="text-sm text-[#A1A1A6] font-normal line-clamp-1">
            {product.finish || 'Solid Brass'}
          </p>

          {/* Bottom Bar: Available Finishes + Gold Enquire › link */}
          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-1.5" title={`Available in ${product.finishes.join(', ')}`}>
              {product.finishes.map((fin) => (
                <span
                  key={fin}
                  className="w-2.5 h-2.5 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: FINISH_COLOR_CHIPS[fin] || '#C9A24B' }}
                  title={fin}
                />
              ))}
            </div>

            {/* Gold Enquire › link */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onQuickEnquire(product);
              }}
              data-cursor="pointer"
              className="min-h-[44px] flex items-center gap-1 text-[13px] font-semibold text-[#C9A24B] hover:text-[#E6C77A] transition-colors cursor-pointer"
              aria-label={`Enquire about ${product.name}`}
            >
              <span>Enquire</span>
              <span className="text-sm">›</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
