/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, ArrowUpRight, Check, Download, MessageSquare } from 'lucide-react';
import { HardwareItem } from './HardwareCollection.tsx';

interface ItemSpecDrawerProps {
  item: HardwareItem | null;
  onClose: () => void;
  onEnquire: (item: HardwareItem) => void;
}

export default function ItemSpecDrawer({ item, onClose, onEnquire }: ItemSpecDrawerProps) {
  if (!item) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello DECORIUM Hardware Zone, I am requesting architectural specification and quotation for ${item.name} (${item.code}).`
  );
  const whatsappUrl = `https://wa.me/923004000000?text=${whatsappMessage}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} specification`}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#F4F0E9] text-[#111214] h-full overflow-y-auto p-6 sm:p-10 shadow-2xl flex flex-col justify-between border-l border-[#111214]/10 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-[#111214]/10">
            <div>
              <span className="micro-label text-[#B08D57]">{item.category}</span>
              <p className="text-xs font-mono text-[#111214]/50 mt-0.5">{item.code}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#111214]/60 hover:text-[#111214] hover:bg-[#E7E1D7] rounded-full transition-colors cursor-pointer"
              aria-label="Close specification sheet"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title & Profile */}
          <div className="pt-6">
            <h2 className="text-3xl font-display font-medium text-[#111214]">
              {item.name}
            </h2>
            <p className="text-sm text-[#111214]/70 mt-2 font-sans leading-relaxed">
              {item.profile} · Engineered from {item.material}.
            </p>
          </div>

          {/* Technical Specs List */}
          <div className="mt-8 space-y-4 pt-6 border-t border-[#111214]/10">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111214]/50">
              TECHNICAL SPECIFICATIONS
            </h3>

            <div className="bg-[#E7E1D7]/50 rounded-sm p-4 space-y-3 border border-[#111214]/5 text-xs">
              <div className="flex justify-between py-1 border-b border-[#111214]/5">
                <span className="text-[#111214]/60">Dimensions</span>
                <span className="font-mono text-[#111214] font-medium">{item.dimensions}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#111214]/5">
                <span className="text-[#111214]/60">Base Alloy</span>
                <span className="font-mono text-[#111214] font-medium">{item.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#111214]/5">
                <span className="text-[#111214]/60">Spindle Standard</span>
                <span className="font-mono text-[#111214] font-medium">8mm Split Spindle Included</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#111214]/5">
                <span className="text-[#111214]/60">Fixing Centers</span>
                <span className="font-mono text-[#111214] font-medium">38mm Concealed Bolt-Through</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#111214]/60">Origin & Foundry</span>
                <span className="font-mono text-[#111214] font-medium">Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111214]/50 mb-3">
              ARCHITECTURAL ATTRIBUTES
            </h3>
            <ul className="space-y-2 text-xs text-[#111214]/80">
              {item.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Finishes */}
          <div className="mt-8">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#111214]/50 mb-3">
              AVAILABLE PATINA FINISHES
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.finishes.map((fin) => (
                <span
                  key={fin}
                  className="px-3 py-1 bg-white/70 border border-[#111214]/10 rounded-sm text-xs text-[#111214] font-sans"
                >
                  {fin}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 mt-8 border-t border-[#111214]/10 space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#111214] hover:bg-[#2A2D31] text-[#F4F0E9] text-xs font-semibold tracking-widest uppercase rounded-sm transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Enquire Project Pricing on WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => onEnquire(item)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-transparent hover:bg-[#E7E1D7] text-[#111214] border border-[#111214]/20 text-xs font-medium tracking-widest uppercase rounded-sm transition-all cursor-pointer"
          >
            <span>Request Schedule / Quote</span>
          </button>
        </div>
      </div>
    </div>
  );
}
