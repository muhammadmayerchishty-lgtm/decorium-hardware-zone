/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../data/business.ts';

export default function FloatingWhatsApp() {
  const whatsappUrl = buildWhatsAppUrl(
    'Hello DECORIUM Hardware Zone, I would like to enquire about your architectural hardware collection.'
  );

  return (
    <aside
      aria-label="Direct WhatsApp contact"
      className="fixed bottom-6 right-6 z-40 flex items-center group"
    >
      {/* Tooltip on hover */}
      <div 
        role="tooltip"
        className="mr-3 px-3 py-1.5 bg-[#121214] text-[#F5F1E8] text-[11px] font-body tracking-wide rounded-sm shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap hidden sm:block border border-white/10"
      >
        <span>Enquire on WhatsApp</span>
        <span className="text-[#C9A24B] ml-1.5 font-mono">· Online</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="min-h-[48px] min-w-[48px] w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_4px_24px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 relative border-2 border-white/20 focus:outline-none cursor-pointer"
        aria-label="Enquire with DECORIUM Hardware Zone on WhatsApp"
        title="Chat on WhatsApp (+92 321 8860070)"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        
        {/* Subtle gold indicator dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#C9A24B] rounded-full border-2 border-[#0A0A0B]" />
      </a>
    </aside>
  );
}
