/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Product, PRODUCTS, CategoryFilter, FinishFilter, CATEGORIES_LIST, FINISHES_LIST } from '../data/products.ts';
import ProductCard from './ProductCard.tsx';
import SplitHeading from './SplitHeading.tsx';

interface TheCollectionProps {
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  selectedFinish?: FinishFilter;
  onSelectFinish?: (finish: FinishFilter) => void;
  onSelectProduct: (product: Product) => void;
  onQuickEnquire: (product: Product) => void;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export default function TheCollection({
  selectedCategory,
  onSelectCategory,
  selectedFinish: controlledFinish,
  onSelectFinish,
  onSelectProduct,
  onQuickEnquire,
}: TheCollectionProps) {
  // Support both controlled and uncontrolled selectedFinish
  const [internalFinish, setInternalFinish] = useState<FinishFilter>('All');
  const selectedFinish = controlledFinish !== undefined ? controlledFinish : internalFinish;
  const setSelectedFinish = (finish: FinishFilter) => {
    if (onSelectFinish) onSelectFinish(finish);
    setInternalFinish(finish);
  };

  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFinishSheetOpen, setMobileFinishSheetOpen] = useState(false);

  // Filter & Sort Pipeline
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedFinish !== 'All') {
      list = list.filter((p) => p.finish === selectedFinish || p.finishes.includes(selectedFinish));
    }

    if (sortBy === 'featured') {
      list.sort((a, b) => {
        if (a.tier === 'ready' && b.tier !== 'ready') return -1;
        if (a.tier !== 'ready' && b.tier === 'ready') return 1;
        return a.name.localeCompare(b.name);
      });
    } else if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [selectedCategory, selectedFinish, sortBy]);

  const handleResetFilters = () => {
    onSelectCategory('All');
    setSelectedFinish('All');
    setSortBy('featured');
  };

  const finishColorChips: Record<string, string> = {
    All: '#C9A24B',
    Gold: '#C9A24B',
    Brass: '#D4AF37',
    Black: '#1A1A1D',
    Silver: '#CBD5E1',
    Antique: '#8F6F2A',
    Steel: '#94A3B8',
  };

  return (
    <section id="collection" data-reveal-section className="py-[clamp(80px,12vw,160px)] bg-[#000000] border-t border-white/[0.08] overflow-x-clip">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Title */}
        <div data-reveal className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
          <SplitHeading
            text="The Collection."
            className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05]"
          />
          <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
            Every finish. Every detail.
          </p>
        </div>

        {/* Sticky Filter Bar under 48px header (top-12) */}
        <div data-reveal className="sticky top-12 z-30 bg-[#000000]/85 backdrop-blur-xl py-3 mb-10 border-y border-white/[0.08]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            
            {/* Category Filter Pills (pill shaped 980px) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar touch-pan-x">
              <button
                type="button"
                onClick={() => onSelectCategory('All')}
                className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                  selectedCategory === 'All'
                    ? 'btn-gold-primary shadow-xs'
                    : 'bg-[#111113] text-[#A1A1A6] hover:bg-[#1A1A1D] hover:text-[#F5F5F7] border border-white/[0.08]'
                }`}
              >
                All
              </button>
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.name)}
                  className={`min-h-[38px] px-4 py-1.5 text-xs font-semibold rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center justify-center ${
                    selectedCategory === cat.name
                      ? 'btn-gold-primary shadow-xs'
                      : 'bg-[#111113] text-[#A1A1A6] hover:bg-[#1A1A1D] hover:text-[#F5F5F7] border border-white/[0.08]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Controls: Finish Selector & Sort Dropdown */}
            <div className="flex items-center justify-between lg:justify-end gap-3 pt-1 lg:pt-0">
              
              {/* Desktop Inline Finish Selector */}
              <div className="hidden lg:flex items-center gap-1 bg-[#111113] p-1 rounded-full border border-white/[0.08]">
                <span className="text-[11px] tracking-wider uppercase text-[#86868B] px-3 font-semibold">
                  Finish:
                </span>
                {FINISHES_LIST.map((fin) => (
                  <button
                    key={fin}
                    type="button"
                    onClick={() => setSelectedFinish(fin)}
                    className={`min-h-[32px] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide rounded-full transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      selectedFinish === fin
                        ? 'bg-[#C9A24B] text-[#000000]'
                        : 'text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/5'
                    }`}
                  >
                    {fin !== 'All' && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: finishColorChips[fin] }}
                      />
                    )}
                    <span>{fin}</span>
                  </button>
                ))}
              </div>

              {/* Mobile Finish Filter Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileFinishSheetOpen(true)}
                className="lg:hidden min-h-[44px] px-3.5 py-2 bg-[#111113] text-[#F5F5F7] rounded-full border border-white/[0.08] text-xs font-medium flex items-center gap-2 cursor-pointer"
                aria-label="Filter by finish"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>Finish: {selectedFinish}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="w-3 h-3 text-[#C9A24B] absolute left-3 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="min-h-[38px] bg-[#111113] text-[#F5F5F7] text-xs rounded-full pl-8 pr-6 py-1.5 border border-white/[0.08] hover:border-white/20 focus:outline-none transition-colors appearance-none cursor-pointer"
                  aria-label="Sort collection"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>

            </div>
          </div>
        </div>

        {/* 4-Column Responsive Product Grid */}
        {filteredProducts.length > 0 ? (
          <motion.div
            layout
            data-reveal
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickEnquire={onQuickEnquire}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Elegant Apple-Style Empty State */
          <div className="py-24 text-center bg-[#111113] rounded-[24px] border border-white/[0.08] max-w-lg mx-auto p-8">
            <h3 className="font-heading text-xl font-semibold text-[#F5F5F7]">
              No items match this filter
            </h3>
            <p className="text-sm text-[#A1A1A6] mt-2 max-w-xs mx-auto leading-relaxed">
              Try adjusting your category or finish selection to see more hardware pieces.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-6 min-h-[44px] px-6 py-2.5 btn-gold-primary text-xs uppercase tracking-wider rounded-full cursor-pointer font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Mobile Bottom-Sheet for Finish Filters */}
      <AnimatePresence>
        {mobileFinishSheetOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter by finish"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileFinishSheetOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#111113] rounded-t-2xl p-6 border-t border-white/[0.12] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C9A24B]">
                  Select Finish
                </span>
                <button
                  type="button"
                  onClick={() => setMobileFinishSheetOpen(false)}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#A1A1A6] hover:text-[#F5F5F7] cursor-pointer"
                  aria-label="Close finish sheet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {FINISHES_LIST.map((fin) => {
                  const isSelected = selectedFinish === fin;
                  return (
                    <button
                      key={fin}
                      type="button"
                      onClick={() => {
                        setSelectedFinish(fin);
                        setMobileFinishSheetOpen(false);
                      }}
                      className={`w-full min-h-[48px] px-4 py-3 rounded-full flex items-center justify-between border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#C9A24B] text-[#000000] font-semibold border-[#C9A24B]'
                          : 'bg-[#1A1A1D] text-[#F5F5F7] border-white/[0.06] hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {fin !== 'All' ? (
                          <span
                            className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: finishColorChips[fin] }}
                          />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-dashed border-[#C9A24B] shrink-0" />
                        )}
                        <span className="text-sm uppercase tracking-wider">{fin}</span>
                      </div>
                      {isSelected && <span className="text-sm font-semibold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
