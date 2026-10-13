/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Clock, MessageSquare, ExternalLink } from 'lucide-react';
import DecoriumWordmark from './DecoriumWordmark.tsx';
import { BUSINESS, buildWhatsAppUrl } from '../data/business.ts';

interface FooterProps {
  onOpenEnquire: () => void;
}

export default function Footer({ onOpenEnquire }: FooterProps) {
  const whatsappUrl = buildWhatsAppUrl('Hello DECORIUM Hardware Zone, I am enquiring about your architectural hardware catalogue.');

  return (
    <footer data-reveal-section className="bg-[#000000] text-[#F5F5F7] border-t border-white/[0.08] pt-20 pb-12">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.08]">
          
          {/* Brand Column (5 cols) */}
          <div data-reveal className="lg:col-span-5 space-y-5">
            <div className="inline-block text-left">
              <DecoriumWordmark className="items-start text-left" />
            </div>
            
            <p className="text-sm text-[#A1A1A6] leading-relaxed max-w-sm">
              Premium architectural hardware for homes and bespoke interiors. Door handles, entrance pulls, precision tower bolts, and finials in Lahore, Pakistan.
            </p>

            <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-[#C9A24B] font-semibold">
              <span>ARCHITECTURAL HARDWARE</span>
              <span className="text-white/20">·</span>
              <span>LAHORE, PK</span>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div data-reveal className="lg:col-span-3 space-y-4">
            <h4 className="text-xs tracking-wider uppercase text-[#C9A24B] font-semibold">
              COLLECTION DIRECTORY
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A1A1A6]">
              <li>
                <a href="#collection" className="hover:text-[#F5F5F7] transition-colors">
                  Door Handles & Levers
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#F5F5F7] transition-colors">
                  Architectural Entrance Pulls
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#F5F5F7] transition-colors">
                  Heavy Barrel Tower Bolts
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-[#F5F5F7] transition-colors">
                  Finials & Turnpieces
                </a>
              </li>
              <li>
                <a href="#finishes" className="hover:text-[#F5F5F7] transition-colors">
                  Mastered Finishes
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F5F5F7] transition-colors">
                  Showroom & About
                </a>
              </li>
            </ul>
          </div>

          {/* Showroom & Contact (4 cols) */}
          <div data-reveal className="lg:col-span-4 space-y-4">
            <h4 className="text-xs tracking-wider uppercase text-[#C9A24B] font-semibold">
              SHOWROOM & CONTACT
            </h4>
            
            <div className="space-y-3.5 text-xs text-[#A1A1A6]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                <span className="text-[#F5F5F7] leading-relaxed">
                  {BUSINESS.address}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9A24B] shrink-0" />
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="hover:text-[#C9A24B] text-[#F5F5F7] transition-colors font-medium"
                >
                  {BUSINESS.phone} (Tap to call)
                </a>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                <span>{BUSINESS.hours}</span>
              </div>

              <div className="pt-2 flex flex-wrap gap-2.5">
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#F5F5F7] rounded-full transition-colors border border-white/10"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 text-[#86868B]" />
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 btn-gold-primary text-xs uppercase font-semibold rounded-full"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#000000]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div data-reveal className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#86868B]">
          <p>
            &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved. Lahore, Pakistan.
          </p>
          <div className="flex items-center gap-6">
            <a href="#collection" className="hover:text-[#F5F5F7] transition-colors">Catalogue</a>
            <a href="#about" className="hover:text-[#F5F5F7] transition-colors">Showroom</a>
            <button
              type="button"
              onClick={onOpenEnquire}
              className="hover:text-[#C9A24B] transition-colors cursor-pointer"
            >
              Enquire
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
