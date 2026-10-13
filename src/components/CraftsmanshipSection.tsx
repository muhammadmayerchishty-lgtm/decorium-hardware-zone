/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phone, MapPin, Clock, ExternalLink } from 'lucide-react';
import { BUSINESS } from '../data/business.ts';
import SplitHeading from './SplitHeading.tsx';

export default function CraftsmanshipSection() {
  const pillars = [
    {
      num: '01',
      title: 'Premium Finishes',
      description:
        'Carefully calibrated surface patinas including satin brass, antique bronze, matte black, and brushed steel designed to complement high-end joinery and doors.',
    },
    {
      num: '02',
      title: 'Complete Suites',
      description:
        'Comprehensive selection of architectural levers, pull handles, tower bolts, finials, and key escutcheons for harmonious residential suites.',
    },
    {
      num: '03',
      title: 'Made for Interiors',
      description:
        'Hardware proportioned for residential and commercial spaces, offering balanced hand feel, clean lines, and durable mechanical operation.',
    },
  ];

  return (
    <section id="about" data-reveal-section className="py-[clamp(80px,12vw,160px)] bg-[#000000] text-[#F5F5F7] border-t border-white/[0.08] relative overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Centered Editorial Section Header */}
        <div data-reveal className="text-center max-w-[720px] mx-auto mb-14 sm:mb-16">
          <SplitHeading
            text="Designed for the details you touch every day."
            className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05]"
          />
          <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
            At DECORIUM, we focus on tactile quality, cohesive finish suites, and prompt architectural service across Lahore and nationwide.
          </p>
        </div>

        {/* 3 Pillars Bento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.num}
              data-reveal
              className="bg-[#111113] p-8 rounded-[24px] border border-white/[0.08] flex flex-col justify-between space-y-6 hover:border-[#C9A24B]/50 transition-colors"
            >
              <div>
                <span className="text-xs uppercase tracking-wider text-[#C9A24B] font-semibold">
                  {pillar.num}
                </span>
                <h3 className="text-xl font-heading font-semibold text-[#F5F5F7] mt-3">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-[#A1A1A6] leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="text-[11px] tracking-[0.1em] uppercase text-[#86868B] border-t border-white/[0.06] pt-4 font-medium">
                DECORIUM HARDWARE ZONE
              </div>
            </div>
          ))}
        </div>

        {/* Contact & Showroom Section */}
        <div id="contact" className="mt-20 pt-16 border-t border-white/[0.08]">
          {/* Big, centered section heading with one-line subhead */}
          <div data-reveal className="text-center max-w-[720px] mx-auto mb-12 sm:mb-16">
            <SplitHeading
              text="Visit the store."
              className="text-[clamp(2.25rem,5vw,4rem)] font-heading font-semibold text-[#F5F5F7] tracking-[-0.03em] leading-[1.05]"
            />
            <p className="text-[17px] text-[#A1A1A6] mt-3 leading-[1.47] tracking-[-0.022em]">
              Explore physical finish samples and complete suites at our Lahore showroom.
            </p>
          </div>

          <div data-reveal className="p-8 sm:p-12 bg-[#111113] rounded-[28px] border border-white/[0.08] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-lg">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[11px] uppercase tracking-wider text-[#C9A24B] font-semibold">
                LAHORE SHOWROOM
              </span>
              <h3 className="text-xl sm:text-2xl font-heading font-semibold text-[#F5F5F7]">
                DECORIUM Hardware Zone
              </h3>
              <p className="text-sm sm:text-base text-[#A1A1A6] max-w-xl leading-relaxed">
                Architects, interior designers, and homeowners are welcome to inspect physical patinas, test mechanical actions, and review architectural schedules with our specialists.
              </p>

              {/* Address, Phone, Hours */}
              <div className="space-y-3 pt-2 text-sm text-[#A1A1A6]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#C9A24B] shrink-0 mt-1" />
                  <span className="text-[#F5F5F7]">{BUSINESS.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <a
                    href={`tel:${BUSINESS.phoneRaw}`}
                    className="hover:text-[#C9A24B] text-[#F5F5F7] transition-colors font-medium"
                  >
                    {BUSINESS.phone}
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                  <span>{BUSINESS.hours}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <a
                href={BUSINESS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#F5F5F7] rounded-full transition-colors border border-white/10 min-h-[44px]"
              >
                <MapPin className="w-4 h-4 text-[#C9A24B]" />
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#86868B]" />
              </a>

              <a
                href={`tel:${BUSINESS.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 btn-gold-primary text-xs font-semibold uppercase tracking-wider rounded-full min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-[#000000]" />
                <span>Call Showroom</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
