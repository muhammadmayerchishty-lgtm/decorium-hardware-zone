/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { BUSINESS } from '../data/business.ts';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenEnquire: () => void;
}

export default function Navbar({ onOpenSearch, onOpenEnquire }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Collection', href: '#collection' },
    { label: 'Finishes', href: '#finishes' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full h-12 flex items-center border-b border-white/[0.08] transition-colors"
        style={{
          backgroundColor: 'rgba(10, 10, 11, 0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        }}
      >
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
          
          {/* Left: Wordmark "DECORIUM" (weight 600, letter-spacing 0.2em, 14px) */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 -ml-1 text-[#D2D2D7] hover:text-[#F5F5F7] transition-colors focus:outline-none cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <a
              href="#"
              className="text-[14px] font-semibold tracking-[0.2em] text-[#F5F5F7] hover:opacity-80 transition-opacity uppercase font-sans select-none"
            >
              DECORIUM
            </a>
          </div>

          {/* Center: Centered links in 12px #D2D2D7, turning white on hover */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[12px] tracking-[0.02em] text-[#D2D2D7] hover:text-[#F5F5F7] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right: Search icon + small gold pill "Enquire" */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenSearch}
              className="p-1.5 text-[#D2D2D7] hover:text-[#F5F5F7] transition-colors cursor-pointer"
              aria-label="Search hardware catalogue"
              title="Search collection"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenEnquire}
              className="btn-gold-primary text-[12px] px-3.5 py-1 min-h-[30px] rounded-full font-semibold shadow-xs cursor-pointer"
            >
              Enquire
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          className="fixed inset-0 z-50 bg-[#000000] text-[#F5F5F7] flex flex-col justify-between p-6 sm:p-10 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <span className="text-[14px] font-semibold tracking-[0.2em] uppercase text-[#F5F5F7]">
              DECORIUM
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#D2D2D7] hover:text-[#F5F5F7] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="py-10 space-y-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-3xl font-semibold tracking-[-0.03em] text-[#F5F5F7] hover:text-[#C9A24B] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-6 border-t border-white/[0.08] space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSearch();
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 hover:bg-white/10 rounded-full text-xs text-[#F5F5F7] transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#C9A24B]" />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnquire();
                }}
                className="min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 btn-gold-primary rounded-full text-xs font-semibold cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#000000]" />
                <span>Enquire</span>
              </button>
            </div>

            <p className="text-xs text-[#86868B] text-center pt-2">
              {BUSINESS.address} · {BUSINESS.phone}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
