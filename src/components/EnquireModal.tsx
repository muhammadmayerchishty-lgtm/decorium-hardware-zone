/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { X, MessageSquare, Send, Check } from 'lucide-react';
import { BUSINESS, buildWhatsAppUrl } from '../data/business.ts';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialItemCode?: string;
}

export default function EnquireModal({ isOpen, onClose, initialItemCode }: EnquireModalProps) {
  const [name, setName] = useState('');
  const [city, setCity] = useState('Lahore');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState(initialItemCode ? `Specific Item: ${initialItemCode}` : 'Full Residence Package');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const whatsappMessage = `Hello DECORIUM Hardware Zone,
Name: ${name || 'Client'}
City: ${city}
Interest: ${interest}
${notes ? `Notes: ${notes}\n` : ''}
I would like to enquire about hardware consultation and pricing.`;

  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enquire with DECORIUM Hardware Zone"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[#111113] text-[#F5F5F7] rounded-[28px] shadow-2xl border border-white/[0.12] overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08] bg-[#161619]/60">
          <div>
            <span className="micro-label">ENQUIRY DESK</span>
            <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F5F5F7] mt-0.5">
              Enquire with DECORIUM
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#A1A1A6] hover:text-[#F5F5F7] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body or Submitted State */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#C9A24B]/20 text-[#C9A24B] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-2xl font-heading font-semibold text-[#F5F5F7]">
              Enquiry Received
            </h4>
            <p className="text-sm text-[#A1A1A6] max-w-md mx-auto leading-relaxed">
              Thank you for reaching out. Our team will contact you via WhatsApp or phone with catalog details.
            </p>
            <div className="pt-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-2.5 btn-gold-primary text-xs uppercase font-semibold rounded-full"
              >
                <MessageSquare className="w-4 h-4 text-[#000000]" />
                <span>Open in WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. M. Chishty"
                  className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-semibold">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lahore, DHA"
                  className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-semibold">
                Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-semibold">
                Hardware Interest
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full bg-[#161619] border border-white/[0.08] rounded-full px-4 py-2.5 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none"
              >
                <option value="Door Handles & Levers">Door Handles & Levers</option>
                <option value="Entrance Door Pulls">Entrance Door Pulls</option>
                <option value="Tower Bolts & Accessories">Tower Bolts & Accessories</option>
                <option value="Full Residence Package">Full Residence Package</option>
                <option value="Bespoke Architect Consultation">Bespoke Architect Consultation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#A1A1A6] mb-1.5 font-semibold">
                Project Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Share number of doors, preferred finish (e.g., satin brass or black), or timeline..."
                className="w-full bg-[#161619] border border-white/[0.08] rounded-[18px] p-3 text-xs text-[#F5F5F7] focus:border-[#C9A24B] focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 btn-gold-primary min-h-[44px] py-3 px-6 text-xs uppercase font-semibold tracking-wider rounded-full flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#000000]" />
                <span>Send Enquiry</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-secondary flex-1 min-h-[44px] py-3 px-6 text-xs uppercase font-semibold tracking-wider rounded-full flex items-center justify-center gap-1.5 cursor-pointer border border-[#C9A24B]"
              >
                <MessageSquare className="w-4 h-4 text-[#C9A24B]" />
                <span>WhatsApp Directly</span>
                <span className="text-sm">›</span>
              </a>
            </div>

            <p className="text-[11px] text-[#86868B] text-center pt-2">
              Showroom located at {BUSINESS.address} · {BUSINESS.phone}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
