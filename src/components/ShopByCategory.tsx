/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CATEGORIES_LIST, CategoryFilter } from '../data/products.ts';
import SplitHeading from './SplitHeading.tsx';

interface ShopByCategoryProps {
  onSelectCategory: (category: CategoryFilter) => void;
}

export default function ShopByCategory({ onSelectCategory }: ShopByCategoryProps) {
  return (
    <section id="categories" data-reveal-section className="py-[clamp(80px,12vw,160px)] bg-[#0B0B0C] border-t border-white/[0.08]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div data-reveal className="text-center max-w-[720px] mx-auto mb-14 sm:mb-16">
          <SplitHeading
            text="Shop by Category."
            className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05]"
          />
          <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
            Precision door handles, entrance pulls, tower bolts, finials and plates.
          </p>
        </div>

        {/* Elegant Category Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES_LIST.map((cat, idx) => (
            <button
              key={cat.id}
              data-reveal
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className="group relative h-72 bg-[#111113] hover:bg-[#1A1A1D] rounded-[28px] p-6 text-left border border-white/[0.08] hover:border-[#C9A24B]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer shadow-sm hover:shadow-xl"
            >
              {/* Top Row: Index number & Count badge */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span className="text-xs text-[#86868B] font-medium">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#C9A24B] bg-white/5 px-2.5 py-0.5 rounded-full font-medium border border-white/5">
                  {cat.count}
                </span>
              </div>

              {/* Center Monogram Accent */}
              <div className="relative z-10 my-auto flex items-center justify-center py-2 opacity-50 group-hover:opacity-90 transition-opacity">
                <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A24B] transition-colors">
                  <span className="font-heading text-lg font-semibold text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors">
                    {cat.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Bottom Details with Link style */}
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-sm text-[#C9A24B] group-hover:translate-x-0.5 transition-transform">
                    ›
                  </span>
                </div>

                <p className="text-xs text-[#86868B] pt-1 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
