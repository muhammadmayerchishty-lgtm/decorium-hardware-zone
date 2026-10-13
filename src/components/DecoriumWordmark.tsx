/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface DecoriumWordmarkProps {
  className?: string;
  isCompact?: boolean;
}

export default function DecoriumWordmark({ className = '', isCompact = false }: DecoriumWordmarkProps) {
  return (
    <div className={`flex flex-col items-start select-none ${className}`}>
      <span
        className={`font-semibold tracking-[0.2em] text-[#F5F5F7] uppercase font-sans ${
          isCompact ? 'text-[14px]' : 'text-[15px]'
        }`}
      >
        DECORIUM
      </span>
      <span className="text-[10px] tracking-[0.16em] uppercase text-[#86868B] font-medium mt-0.5">
        HARDWARE ZONE · LAHORE
      </span>
    </div>
  );
}
