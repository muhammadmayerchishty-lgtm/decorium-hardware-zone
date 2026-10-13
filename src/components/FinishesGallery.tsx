/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { FinishFilter, PRODUCTS } from '../data/products.ts';
import SplitHeading from './SplitHeading.tsx';
import { buildWhatsAppUrl } from '../data/business.ts';

interface FinishDetail {
  id: string;
  filterKey: FinishFilter;
  name: string;
  swatchLabel: string;
  subtitle: string;
  hex: string;
  description: string;
  process: string;
  bestFor: string;
}

const BRAND_FINISHES: FinishDetail[] = [
  {
    id: 'satin-brass',
    filterKey: 'Gold',
    name: 'Satin Brass',
    swatchLabel: 'Gold',
    subtitle: 'Brushed warm gold finish with smooth protective coating',
    hex: '#C9A24B',
    description: 'A luminous, warm golden hue with directional brushing that catches ambient light without reflective glare.',
    process: 'Directional surface brushing followed by a clear protective seal.',
    bestFor: 'Modern residential interiors, entrance doors, and bespoke cabinetry.',
  },
  {
    id: 'natural-brass',
    filterKey: 'Brass',
    name: 'Natural Brass',
    swatchLabel: 'Brass',
    subtitle: 'Polished natural architectural brass with deep luster',
    hex: '#D4AF37',
    description: 'Classic high-grade architectural brass offering radiant golden luster and authentic tactile weight.',
    process: 'Multi-stage manual wheel buffing followed by micro-lacquer preservation.',
    bestFor: 'Heritage entryways, monumental pulls, luxury estates, and classical suites.',
  },
  {
    id: 'black',
    filterKey: 'Black',
    name: 'Matte Black',
    swatchLabel: 'Black',
    subtitle: 'Deep graphite charcoal finish for high-contrast interiors',
    hex: '#1A1A1D',
    description: 'A moody, deep black tone with low-luster satin finish that pairs effortlessly with dark timbers and natural stone.',
    process: 'Electrostatic powder coat / vapor finish over metal substrate.',
    bestFor: 'Contemporary minimalist spaces, monolithic door pulls, and dark oak facades.',
  },
  {
    id: 'silver',
    filterKey: 'Silver',
    name: 'Brushed Silver & Nickel',
    swatchLabel: 'Silver',
    subtitle: 'Satin architectural silver luster with clean reflection',
    hex: '#CBD5E1',
    description: 'Refined, cool-toned silver luster with delicate tactile drag. Balances light stone, terrazzo, and pale woodwork.',
    process: 'Satin brushed nickel plating with protective lacquer.',
    bestFor: 'Modern apartments, offices, and clean contemporary joinery.',
  },
  {
    id: 'antique',
    filterKey: 'Antique',
    name: 'Antique Patina',
    swatchLabel: 'Antique',
    subtitle: 'Deep bronze-brass undertones with relieved highlights',
    hex: '#8F6F2A',
    description: 'A rich, vintage-inspired finish featuring dark recesses with subtly relieved highlight edges.',
    process: 'Chemical surface oxidation and manual highlight relief.',
    bestFor: 'Heritage homes, classic entry doors, heavy barrel bolts, and turnpieces.',
  },
  {
    id: 'steel',
    filterKey: 'Steel',
    name: 'Industrial Steel',
    swatchLabel: 'Steel',
    subtitle: 'High-durability stainless steel finish',
    hex: '#94A3B8',
    description: 'Subtle gunmetal steel sheen with a quiet, matte micro-texture designed for high-traffic interior usage.',
    process: 'PVD vapor deposition imparting hard-wearing scratch resistance.',
    bestFor: 'High-traffic passage doors, commercial suites, and linear pull bars.',
  },
];

interface FinishesGalleryProps {
  onSelectFinishFilter?: (finish: FinishFilter) => void;
  activeFilter?: FinishFilter;
}

export default function FinishesGallery({ onSelectFinishFilter, activeFilter }: FinishesGalleryProps) {
  const [selectedFinish, setSelectedFinish] = useState<FinishDetail>(BRAND_FINISHES[0]);

  const handleApplyFilter = (finish: FinishDetail) => {
    setSelectedFinish(finish);
    if (onSelectFinishFilter) {
      onSelectFinishFilter(finish.filterKey);
      const collectionElem = document.getElementById('collection');
      if (collectionElem) {
        collectionElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="finishes" data-reveal-section className="py-[clamp(80px,12vw,160px)] bg-[#0B0B0C] border-t border-white/[0.08]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header */}
        <div data-reveal className="text-center max-w-[720px] mx-auto mb-14 sm:mb-16">
          <SplitHeading
            text="Choose your finish."
            className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05]"
          />
          <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
            Every DECORIUM piece is finished to provide tactile weight and lasting surface durability.
          </p>
        </div>

        {/* Finishes Grid / Interactive Selector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Finish Selector Strip (5 cols) */}
          <div data-reveal className="lg:col-span-5 space-y-2.5">
            {BRAND_FINISHES.map((finish) => {
              const isSelected = selectedFinish.id === finish.id;
              const isFilterActive = activeFilter === finish.filterKey;

              const count = PRODUCTS.filter((p) => p.finish === finish.filterKey).length;

              return (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => setSelectedFinish(finish)}
                  className={`w-full text-left p-4 sm:p-5 rounded-[20px] border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#111113] border-[#C9A24B] shadow-lg'
                      : 'bg-[#111113]/50 border-white/[0.06] hover:border-white/20 hover:bg-[#111113]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: finish.hex }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-base sm:text-lg text-[#F5F5F7] font-semibold leading-none">
                          {finish.name}
                        </h3>
                        {isFilterActive && (
                          <span className="text-[10px] uppercase tracking-wider bg-[#C9A24B] text-[#000000] px-2 py-0.5 rounded-full font-semibold">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#86868B] mt-1 line-clamp-1">
                        {finish.subtitle}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono tracking-wider text-[#C9A24B] bg-white/5 px-2.5 py-0.5 rounded-full font-medium border border-white/5">
                      {count}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#C9A24B] shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Finish Highlight Card (7 cols) */}
          <div data-reveal className="lg:col-span-7 bg-[#111113] p-8 sm:p-10 rounded-[24px] border border-white/[0.08] shadow-lg relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
                <div>
                  <span className="micro-label">FINISH SPECIFICATION</span>
                  <h3 className="text-2xl sm:text-3xl font-heading font-semibold text-[#F5F5F7] mt-1">
                    {selectedFinish.name}
                  </h3>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#C9A24B] bg-white/5 px-3 py-1 rounded-full font-semibold border border-white/10 hidden sm:inline-block">
                    {PRODUCTS.filter((p) => p.finish === selectedFinish.filterKey).length} products
                  </span>
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 shadow-md" style={{ backgroundColor: selectedFinish.hex }} />
                </div>
              </div>

              <p className="text-base text-[#A1A1A6] leading-relaxed">
                {selectedFinish.description}
              </p>

              {/* Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/[0.08]">
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold mb-1">
                    SURFACE PROCESS
                  </h4>
                  <p className="text-xs text-[#F5F5F7] leading-relaxed">
                    {selectedFinish.process}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold mb-1">
                    RECOMMENDED APPLICATION
                  </h4>
                  <p className="text-xs text-[#F5F5F7] leading-relaxed">
                    {selectedFinish.bestFor}
                  </p>
                </div>
              </div>

              {/* Action buttons with 980px pill buttons */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => handleApplyFilter(selectedFinish)}
                  className="btn-gold-primary min-h-[44px] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-full cursor-pointer shadow-xs gap-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#000000]" />
                  <span>Filter Collection by {selectedFinish.swatchLabel}</span>
                </button>

                <a
                  href={buildWhatsAppUrl(`Hello DECORIUM Hardware Zone, I would like to enquire about pieces available in ${selectedFinish.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-secondary text-xs uppercase tracking-wider font-semibold text-[#C9A24B] hover:text-[#E6C77A] transition-colors"
                >
                  <span>Enquire on WhatsApp</span>
                  <span className="text-sm">›</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
