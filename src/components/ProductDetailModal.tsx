/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { X, ArrowLeft, MessageSquare, MessageCircle, Check, ArrowUpRight } from 'lucide-react';
import { Product, PRODUCTS } from '../data/products.ts';
import SafeImage from './SafeImage.tsx';
import { buildProductWhatsAppUrl } from '../data/business.ts';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailModal({ product, onClose, onSelectProduct }: ProductDetailModalProps) {
  // Secondary enquiry form state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string; message?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState<string>('');

  useEffect(() => {
    if (product) {
      setSelectedFinish(product.finish);
      setIsSubmitted(false);
      setClientName('');
      setClientPhone('');
      setClientMessage('');
      setFormErrors({});
    }
  }, [product]);

  // Esc key closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  // Complete the set: 4 related products in distinct categories from tier "ready"
  const relatedProducts = useMemo(() => {
    const ready = PRODUCTS.filter((p) => p.tier === 'ready' && p.id !== product.id);
    const result: Product[] = [];
    const usedCategories = new Set<string>();

    for (const p of ready) {
      if (p.finish === product.finish && !usedCategories.has(p.category)) {
        result.push(p);
        usedCategories.add(p.category);
        if (result.length === 4) break;
      }
    }

    if (result.length < 4) {
      for (const p of ready) {
        if (!result.some((r) => r.id === p.id) && !usedCategories.has(p.category)) {
          result.push(p);
          usedCategories.add(p.category);
          if (result.length === 4) break;
        }
      }
    }

    if (result.length < 4) {
      for (const p of ready) {
        if (!result.some((r) => r.id === p.id)) {
          result.push(p);
          if (result.length === 4) break;
        }
      }
    }

    return result;
  }, [product]);

  const whatsappUrl = buildProductWhatsAppUrl(
    product.name,
    selectedFinish || product.finish,
    product.size
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { name?: string; phone?: string; message?: string } = {};

    if (!clientName.trim()) {
      errors.name = 'Please provide your name.';
    }
    if (!clientPhone.trim() || clientPhone.trim().length < 8) {
      errors.phone = 'Valid phone/WhatsApp required.';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Product details for ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#111113] text-[#F5F5F7] rounded-[28px] shadow-2xl border border-white/[0.12] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#161619]/60 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A1A1A6] hover:text-[#F5F5F7] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#C9A24B]" />
            <span>Back to Collection</span>
          </button>

          <span className="text-[11px] tracking-widest text-[#C9A24B] uppercase font-semibold">
            DECORIUM · PRODUCT DETAILS
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
            aria-label="Close product view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-12 flex-1">
          {/* Main 2-Column Product Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Large Image Panel (6 cols) */}
            <div className="lg:col-span-6 bg-[#161619] rounded-[20px] border border-white/[0.08] p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden group min-h-[380px] sm:min-h-[460px]">
              <div className="w-full h-80 sm:h-96 flex items-center justify-center">
                <SafeImage
                  src={product.image}
                  alt={product.name}
                  productName={product.name}
                  category={product.category}
                  finish={selectedFinish || product.finish}
                  opaque={product.opaque}
                  priority
                  isZoomable
                />
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-[11px] uppercase tracking-wider text-[#86868B]">
                  Hover image to inspect fine detail
                </span>
              </div>
            </div>

            {/* Right Column: Spec & Consultation (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Category & Status */}
              <div className="flex items-center justify-between">
                <span className="micro-label">
                  {product.category}
                </span>
                <span className="text-xs text-[#86868B] uppercase tracking-wider font-semibold">
                  REF: {product.slug.toUpperCase()}
                </span>
              </div>

              {/* Title & Editorial Description */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-heading font-semibold text-[#F5F5F7] leading-tight">
                  {product.name}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-[#A1A1A6] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price Row */}
              <div className="p-4 bg-[#161619] rounded-[16px] border border-white/[0.08] flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#86868B] block">
                    PRICE
                  </span>
                  <span className="text-lg font-semibold text-[#F5F5F7]">
                    {product.price ? `PKR ${product.price.toLocaleString()}` : 'Price on request'}
                  </span>
                </div>
                <span className="text-xs text-[#C9A24B] uppercase tracking-wide font-semibold">
                  IN STOCK · LAHORE
                </span>
              </div>

              {/* Finish Selector */}
              <div>
                <label className="text-xs uppercase tracking-wider text-[#A1A1A6] font-semibold block mb-2">
                  Select Finish
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.finishes.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setSelectedFinish(f)}
                      className={`min-h-[38px] px-4 py-2 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                        selectedFinish === f
                          ? 'bg-[#C9A24B] text-[#000000] border-[#C9A24B] shadow-sm'
                          : 'bg-[#161619] text-[#F5F5F7] border-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specification Grid */}
              <div className="p-5 bg-[#161619] rounded-[16px] border border-white/[0.08] space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-[#A1A1A6]">Size / Profile:</span>
                  <span className="text-[#F5F5F7] font-semibold">{product.size}</span>
                </div>
                {product.specs?.material && (
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-[#A1A1A6]">Material:</span>
                    <span className="text-[#F5F5F7] font-semibold">{product.specs.material}</span>
                  </div>
                )}
                {product.specs?.fixing && (
                  <div className="flex justify-between border-b border-white/[0.06] pb-2">
                    <span className="text-[#A1A1A6]">Mounting / Fixing:</span>
                    <span className="text-[#F5F5F7] font-semibold">{product.specs.fixing}</span>
                  </div>
                )}
                {product.specs?.weight && (
                  <div className="flex justify-between">
                    <span className="text-[#A1A1A6]">Weight:</span>
                    <span className="text-[#F5F5F7] font-semibold">{product.specs.weight}</span>
                  </div>
                )}
              </div>

              {/* Primary Action: Enquire on WhatsApp Pill Button */}
              <div className="pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 min-h-[48px] py-3.5 px-6 btn-gold-primary text-xs uppercase tracking-wider rounded-full shadow-md group font-semibold"
                >
                  <MessageCircle className="w-4 h-4 text-[#000000] group-hover:scale-110 transition-transform" />
                  <span>Enquire on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#000000]" />
                </a>
                <p className="text-[11px] text-center text-[#86868B] mt-2">
                  Pre-fills product name, finish and size for instant consultation.
                </p>
              </div>

              {/* Secondary Action: Send Enquiry Form */}
              <div className="pt-4 border-t border-white/[0.08]">
                <h4 className="text-xs uppercase tracking-wider text-[#A1A1A6] mb-3 font-semibold">
                  Or Send an Architectural Inquiry
                </h4>

                {isSubmitted ? (
                  <div className="p-4 bg-[#161619] border border-[#C9A24B]/40 rounded-[16px] text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center mx-auto">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-semibold text-[#F5F5F7]">
                      Enquiry received for {product.name}
                    </p>
                    <p className="text-[11px] text-[#A1A1A6]">
                      Our Lahore showroom team will reach out to you shortly.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Your Name *"
                          className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
                        />
                        {formErrors.name && (
                          <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.name}</span>
                        )}
                      </div>

                      <div>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="Phone / WhatsApp *"
                          className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
                        />
                        {formErrors.phone && (
                          <span className="text-[10px] text-rose-400 mt-1 block">{formErrors.phone}</span>
                        )}
                      </div>
                    </div>

                    <textarea
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      placeholder="Project details (e.g., number of doors, location in Lahore)..."
                      rows={2}
                      className="w-full bg-[#161619] border border-white/[0.08] rounded-[16px] p-3 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none resize-none"
                    />

                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="w-full min-h-[44px] py-2.5 px-4 bg-white/5 hover:bg-white/10 text-xs uppercase tracking-wider text-[#F5F5F7] rounded-full transition-colors border border-white/10 flex items-center justify-center gap-2 cursor-pointer font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#C9A24B]" />
                      <span>Submit Direct Inquiry</span>
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Complete the Set (4 Related Products) */}
          {relatedProducts.length > 0 && (
            <div className="pt-8 border-t border-white/[0.08]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="micro-label">COHESIVE SUITE</span>
                  <h3 className="text-xl font-heading font-semibold text-[#F5F5F7] mt-1">
                    Complete the set
                  </h3>
                </div>
                <span className="text-xs text-[#86868B] uppercase tracking-wider">
                  Matching pieces
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel: Product) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectProduct(rel)}
                    className="p-3 bg-[#161619] rounded-[20px] border border-white/[0.08] hover:border-[#C9A24B]/50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="w-full mb-2 overflow-hidden rounded-[20px]">
                      <SafeImage
                        src={rel.image}
                        alt={rel.name}
                        productName={rel.name}
                        category={rel.category}
                        finish={rel.finish}
                        opaque={rel.opaque}
                      />
                    </div>
                    <span className="text-[10px] text-[#C9A24B] uppercase tracking-wider font-semibold block">
                      {rel.finish}
                    </span>
                    <h4 className="text-xs font-semibold text-[#F5F5F7] group-hover:text-[#C9A24B] line-clamp-1 mt-0.5">
                      {rel.name}
                    </h4>
                    <span className="text-[11px] text-[#86868B] block mt-1">
                      {rel.price ? `PKR ${rel.price.toLocaleString()}` : 'Price on request'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
