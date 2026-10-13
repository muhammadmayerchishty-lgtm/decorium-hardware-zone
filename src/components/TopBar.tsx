/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BUSINESS } from '../data/business.ts';

export default function TopBar() {
  return (
    <aside 
      aria-label="Provenance notice" 
      className="w-full bg-[#0A0A0B] text-[#B8B2A3] text-[11px] uppercase py-2 px-4 relative z-50 border-b border-white/[0.08]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between font-sans tracking-[0.18em]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A24B] shrink-0" />
          <span className="text-[#F5F1E8] font-medium text-[11px]">
            PREMIUM ARCHITECTURAL HARDWARE · LAHORE, PAKISTAN
          </span>
        </div>
        <div className="text-[11px] text-[#B8B2A3] tracking-[0.14em]">
          <span>{BUSINESS.hoursShort}</span>
        </div>
      </div>
    </aside>
  );
}
