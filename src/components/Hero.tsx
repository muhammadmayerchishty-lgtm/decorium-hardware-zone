/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero3DHandle from './Hero3DHandle.tsx';
import { buildWhatsAppUrl } from '../data/business.ts';

interface HeroProps {
  onExploreClick: () => void;
  onEnquireClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  const whatsappUrl = buildWhatsAppUrl(
    'Hello DECORIUM Hardware Zone, I would like to enquire about your architectural hardware collection in Lahore.'
  );

  return (
    <section data-reveal-section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20 pb-16 lg:pt-24 lg:pb-20 bg-[#000000]">
      {/* Soft gold ambient glow behind 3D canvas */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] bg-[#C9A24B]/15 rounded-full blur-[170px] pointer-events-none"
      />

      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
        {/* Apple-style Centered Text Stack */}
        <div
          data-reveal
          className="max-w-[820px] flex flex-col items-center space-y-5"
        >
          {/* H1: weight 600, clamp(3rem, 8vw, 6.5rem), line-height 1.02, letter-spacing -0.035em */}
          <h1 className="font-heading font-semibold text-[clamp(3rem,8vw,6.5rem)] leading-[1.02] tracking-[-0.035em] text-[#F5F5F7] [text-wrap:balance]">
            <span>Hardware, </span>
            <span className="bg-gradient-to-r from-[#E6C77A] to-[#C9A24B] bg-clip-text text-transparent">
              refined.
            </span>
          </h1>

          {/* Subheading: weight 400, color #A1A1A6 */}
          <p className="text-lg sm:text-xl text-[#A1A1A6] font-normal max-w-xl mx-auto leading-[1.47] tracking-[-0.015em] [text-wrap:balance]">
            Handles, pulls, bolts and finials. Finished to be felt.
          </p>

          {/* Buttons: pill shaped (border-radius 980px). Primary = gold gradient; secondary = gold text link with "›" */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-3">
            <button
              type="button"
              onClick={onExploreClick}
              data-cursor="pointer"
              className="btn-gold-primary px-8 py-3.5 text-[15px] font-semibold tracking-[-0.01em] rounded-full cursor-pointer shadow-lg min-h-[44px]"
            >
              Explore collection
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="btn-gold-secondary text-[15px] font-medium text-[#C9A24B] hover:text-[#E6C77A] transition-colors flex items-center gap-1 min-h-[44px] cursor-pointer"
            >
              <span>Enquire on WhatsApp</span>
              <span className="text-base">›</span>
            </a>
          </div>
        </div>

        {/* 3D Hardware Canvas: Centered & Large */}
        <div
          data-reveal
          className="w-full max-w-[920px] mt-8 sm:mt-12 relative flex items-center justify-center"
        >
          <div className="w-full">
            <Hero3DHandle />
          </div>
        </div>
      </div>
    </section>
  );
}
