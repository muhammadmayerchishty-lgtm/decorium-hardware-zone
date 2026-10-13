/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, X, ArrowUpRight } from 'lucide-react';
import { PRODUCTS, Product } from '../data/products.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (product: Product) => void;
}

export default function SearchModal({ isOpen, onClose, onSelectItem }: SearchModalProps) {
  const [query, setQuery] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredItems = PRODUCTS.filter((item) => {
    const q = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.finish.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      (item.size ? item.size.toLowerCase().includes(q) : false)
    );
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search hardware catalogue"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#111113] text-[#F5F5F7] rounded-[28px] shadow-2xl border border-white/[0.12] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#161619]/60">
          <Search className="w-5 h-5 text-[#C9A24B] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search door handles, pulls, tower bolts, finials, plates..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base text-[#F5F5F7] placeholder:text-[#86868B] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A1A1A6] hover:text-[#F5F5F7] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-2">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#86868B]">
              No architectural hardware matches &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filteredItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="w-full text-left p-3.5 rounded-[16px] hover:bg-[#161619] transition-colors flex items-center justify-between group cursor-pointer border border-transparent hover:border-white/[0.06]"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#C9A24B] font-semibold uppercase tracking-wider">
                      {item.finish}
                    </span>
                    <span className="text-white/20" aria-hidden="true">·</span>
                    <span className="text-xs text-[#A1A1A6]">{item.category}</span>
                  </div>
                  <h4 className="text-sm font-heading font-semibold text-[#F5F5F7] group-hover:text-[#C9A24B] transition-colors mt-0.5">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#86868B] line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs font-semibold text-[#F5F5F7]">
                    {item.price ? `PKR ${item.price.toLocaleString()}` : 'Price on request'}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#86868B] group-hover:text-[#C9A24B] transition-colors" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Search Footer hint */}
        <div className="px-5 py-2.5 bg-[#161619]/40 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-[#86868B]">
          <span>Tip: Press Esc to close</span>
          <span className="text-[#C9A24B] font-semibold">{filteredItems.length} products found</span>
        </div>
      </div>
    </div>
  );
}
