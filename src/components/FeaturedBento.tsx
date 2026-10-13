/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { Product, PRODUCTS } from '../data/products.ts';
import SafeImage from './SafeImage.tsx';

interface FeaturedBentoProps {
  onSelectProduct: (product: Product) => void;
}

export default function FeaturedBento({ onSelectProduct }: FeaturedBentoProps) {
  // Use only tier "ready" products, choosing distinct categories for the flagship bento
  const { largeProducts, smallProducts } = useMemo(() => {
    const readyProducts = PRODUCTS.filter((p) => p.tier === 'ready');
    const selected: Product[] = [];
    const usedCategories = new Set<string>();

    // Pass 1: Select one item per distinct category
    for (const p of readyProducts) {
      if (!usedCategories.has(p.category)) {
        selected.push(p);
        usedCategories.add(p.category);
        if (selected.length === 6) break;
      }
    }

    // Pass 2: Fill remaining slots up to 6 if needed
    if (selected.length < 6) {
      for (const p of readyProducts) {
        if (!selected.some((s) => s.id === p.id)) {
          selected.push(p);
          if (selected.length === 6) break;
        }
      }
    }

    return {
      largeProducts: selected.slice(0, 2),
      smallProducts: selected.slice(2, 6),
    };
  }, []);

  return (
    <section data-reveal-section className="py-[clamp(80px,12vw,140px)] bg-[#0B0B0C] text-[#F5F5F7] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading: Big, Centered Apple Style */}
        <div data-reveal className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
          <h2 className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05] [text-wrap:balance]">
            Featured.
          </h2>
          <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
            Six architectural icons. Finished to be felt.
          </p>
        </div>

        {/* 2 Large Tiles (Wide, Monumental) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {largeProducts.map((product) => (
            <div
              key={product.id}
              data-reveal
              onClick={() => onSelectProduct(product)}
              data-cursor="pointer"
              className="rounded-[28px] bg-[#111113] border border-white/[0.08] hover:border-[#C9A24B]/40 p-6 sm:p-8 flex flex-col justify-between group cursor-pointer transition-all duration-300 shadow-md select-none"
            >
              {/* Product Image Panel */}
              <div className="w-full mb-6">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  productName={product.name}
                  category={product.category}
                  finish={product.finish}
                  opaque={product.opaque}
                  priority
                  isZoomable
                />
              </div>

              {/* Product Info */}
              <div className="flex items-end justify-between gap-4">
                <div className="min-w-0">
                  <span className="text-[11px] uppercase tracking-wider text-[#C9A24B] font-semibold">
                    {product.category}
                  </span>
                  <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors mt-1 leading-snug line-clamp-1 [text-wrap:balance]">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[#A1A1A6] mt-1 line-clamp-1 font-normal">
                    {product.size || product.finish}
                  </p>
                </div>

                <div className="pb-1 shrink-0">
                  <span className="text-sm font-semibold text-[#C9A24B] group-hover:text-[#E6C77A] flex items-center gap-1 transition-colors">
                    <span>View</span>
                    <span className="text-base">›</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Small Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {smallProducts.map((product) => (
            <div
              key={product.id}
              data-reveal
              onClick={() => onSelectProduct(product)}
              data-cursor="pointer"
              className="rounded-[28px] bg-[#111113] border border-white/[0.08] hover:border-[#C9A24B]/40 p-5 sm:p-6 flex flex-col justify-between group cursor-pointer transition-all duration-300 shadow-md select-none"
            >
              {/* Product Image Panel */}
              <div className="w-full mb-4">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  productName={product.name}
                  category={product.category}
                  finish={product.finish}
                  opaque={product.opaque}
                  isZoomable
                />
              </div>

              {/* Product Info */}
              <div className="flex items-end justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#C9A24B] font-semibold">
                    {product.category}
                  </span>
                  <h3 className="font-heading font-semibold text-base sm:text-lg text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors mt-0.5 line-clamp-1 leading-snug [text-wrap:balance]">
                    {product.name}
                  </h3>
                  <p className="text-xs text-[#A1A1A6] mt-0.5 line-clamp-1">
                    {product.size || product.finish}
                  </p>
                </div>

                <div className="pb-0.5 shrink-0">
                  <span className="text-xs font-semibold text-[#C9A24B] group-hover:text-[#E6C77A] flex items-center gap-0.5 transition-colors">
                    <span>View</span>
                    <span>›</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
