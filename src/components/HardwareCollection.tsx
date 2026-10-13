/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ArrowUpRight, Compass, Layers, Sliders, Check } from 'lucide-react';

interface HardwareCategory {
  id: string;
  name: string;
  description: string;
  items: HardwareItem[];
}

export interface HardwareItem {
  id: string;
  code: string;
  name: string;
  category: string;
  material: string;
  profile: string;
  dimensions: string;
  finishes: string[];
  features: string[];
}

const CATEGORIES: HardwareCategory[] = [
  {
    id: 'handles',
    name: 'Door Handles',
    description: 'Precision-turned solid brass lever handles with sprung roses and knurled grips.',
    items: [
      {
        id: 'dh-01',
        code: 'DEC-LV-01',
        name: 'Khyber Fluted Lever',
        category: 'Door Handles',
        material: 'Solid Virgin Brass (CW614N)',
        profile: 'Longitudinal Ribbed Cylinder',
        dimensions: 'Handle 135mm · Rose Ø54mm · Projection 62mm',
        finishes: ['Satin Brass', 'Antique Patina', 'Gunmetal'],
        features: ['Precision knurling', 'Heavy-duty sprung rose', 'Dual concealed fixings'],
      },
      {
        id: 'dh-02',
        code: 'DEC-LV-02',
        name: 'Ravi Chamfered Lever',
        category: 'Door Handles',
        material: 'Solid Brass Billet',
        profile: 'Geometric Ergonomic Chamfer',
        dimensions: 'Handle 140mm · Rose Ø52mm · Projection 58mm',
        finishes: ['Polished Brass', 'Satin Brass', 'Gunmetal'],
        features: ['Micrometric edge bevels', 'Grade 304 internal spindle', 'Reversible handing'],
      },
      {
        id: 'dh-03',
        code: 'DEC-LV-03',
        name: 'Mughal Minimalist Lever',
        category: 'Door Handles',
        material: 'Drop-Forged Brass',
        profile: 'Monolithic Tapered Silhouette',
        dimensions: 'Handle 145mm · Rose Ø55mm · Projection 65mm',
        finishes: ['Antique Patina', 'Raw Living Brass', 'Satin Brass'],
        features: ['Tactile thumb depression', 'Concealed grub screw', 'Acoustic nylon washer'],
      },
    ],
  },
  {
    id: 'pulls',
    name: 'Architectural Pulls',
    description: 'Monumental entrance door pulls and cabinet handles with structural substance.',
    items: [
      {
        id: 'pl-01',
        code: 'DEC-PL-01',
        name: 'Anarkali Pillar Entrance Pull',
        category: 'Architectural Pulls',
        material: 'Solid Drawn Brass Rod',
        profile: 'Ribbed Column with Stepped Mounts',
        dimensions: 'Length 600mm / 900mm · Rod Ø32mm · Standoff 70mm',
        finishes: ['Satin Brass', 'Antique Patina', 'Gunmetal'],
        features: ['Back-to-back glass/wood fixings', 'Heavy 4.2kg tactile mass', 'Hand-buffed patina'],
      },
      {
        id: 'pl-02',
        code: 'DEC-PL-02',
        name: 'Shalimar Linear Pull',
        category: 'Architectural Pulls',
        material: 'CNC Milled Brass Slab',
        profile: 'Precision Slotted Architecture',
        dimensions: 'Length 450mm · Width 28mm · Standoff 55mm',
        finishes: ['Satin Brass', 'Polished Brass'],
        features: ['Concealed rear fixing lugs', 'Continuous radius edges', 'Architectural grade'],
      },
    ],
  },
  {
    id: 'bolts',
    name: 'Tower Bolts',
    description: 'Heavy architectural barrel bolts and concealed mortise flush bolts.',
    items: [
      {
        id: 'tb-01',
        code: 'DEC-TB-01',
        name: 'Badshahi Heavy Barrel Bolt',
        category: 'Tower Bolts',
        material: 'Cast Solid Brass',
        profile: 'Hand-Turned Knob with Reinforced Guide',
        dimensions: 'Lengths: 6", 8", 10", 12" · Width 42mm',
        finishes: ['Antique Patina', 'Satin Brass', 'Polished Brass'],
        features: ['Solid drawn brass shot', 'Spring-loaded ball catch', 'Matching countersunk screws'],
      },
      {
        id: 'tb-02',
        code: 'DEC-TB-02',
        name: 'Lahori Concealed Flush Bolt',
        category: 'Tower Bolts',
        material: 'Extruded Architectural Brass',
        profile: 'Mortise Recessed Lever Throw',
        dimensions: 'Length 200mm · Width 20mm · Throw 25mm',
        finishes: ['Satin Brass', 'Gunmetal', 'Polished Brass'],
        features: ['Smooth lever action throw', 'Heavy gauge faceplate', 'Concealed timber edge mount'],
      },
    ],
  },
  {
    id: 'finials',
    name: 'Finials & Turnpieces',
    description: 'Decorative architectural finials, turn snibs, and cylinder escutcheons.',
    items: [
      {
        id: 'fn-01',
        code: 'DEC-FN-01',
        name: 'Acorn Architectural Finial',
        category: 'Finials & Turnpieces',
        material: 'Lathe-Turned Brass',
        profile: 'Classical Fluted Dome',
        dimensions: 'Height 68mm · Base Ø38mm',
        finishes: ['Antique Patina', 'Satin Brass'],
        features: ['M8 threaded stainless rod', 'Precision concentric ribs', 'Jewelry-grade polish'],
      },
      {
        id: 'fn-02',
        code: 'DEC-FN-02',
        name: 'Minimalist Turn Snib',
        category: 'Finials & Turnpieces',
        material: 'Solid Brass Billet',
        profile: 'Cylindrical Coin Grip',
        dimensions: 'Knob Ø35mm · Rose Ø50mm',
        finishes: ['Satin Brass', 'Gunmetal', 'Polished Brass'],
        features: ['Emergency release coin slot', '5mm spindle compatible', 'Smooth 90° detent'],
      },
    ],
  },
  {
    id: 'plates',
    name: 'Plates & Escutcheons',
    description: 'Backplates, keyhole covers, and push plates milled from thick brass gauge.',
    items: [
      {
        id: 'pl-03',
        code: 'DEC-BP-01',
        name: 'Linear Profile Escutcheon',
        category: 'Plates & Escutcheons',
        material: 'Solid Brass Sheet 4mm',
        profile: 'Bevelled Euro / Oval Cylinder Cutout',
        dimensions: '240mm × 45mm × 4mm thickness',
        finishes: ['Satin Brass', 'Antique Patina', 'Gunmetal'],
        features: ['Countersunk bevel holes', 'Chamfered outer rim', 'Includes matched brass screws'],
      },
      {
        id: 'pl-04',
        code: 'DEC-PP-01',
        name: 'Architectural Push Plate',
        category: 'Plates & Escutcheons',
        material: 'Heavy Gauge Brass Plate',
        profile: 'Minimal Radius Rectangle',
        dimensions: '350mm × 75mm × 3mm',
        finishes: ['Satin Brass', 'Polished Brass', 'Antique Patina'],
        features: ['Protective lacquer coat', 'Sub-millimeter edge dressing', 'Laser-cut accuracy'],
      },
    ],
  },
];

interface HardwareCollectionProps {
  onSelectItem: (item: HardwareItem) => void;
}

export default function HardwareCollection({ onSelectItem }: HardwareCollectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState('handles');

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0];

  return (
    <section id="collection" className="py-24 lg:py-32 bg-[#F4F0E9] border-t border-[#111214]/6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-[#111214]/8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-[1px] bg-[#B08D57]" />
              <span className="micro-label text-[#B08D57]">CATALOGUE MATRIX</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-display font-normal text-[#111214] tracking-tight">
              The Collection
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#111214]/70 max-w-lg leading-relaxed">
              Every piece is machined from solid virgin brass bar stock, hand-dressed, and finished with organic wax seals in Lahore.
            </p>
          </div>

          {/* Interactive Category Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E7E1D7]/70 rounded-md border border-[#111214]/5 self-start md:self-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium tracking-wider uppercase rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                  activeCategoryId === cat.id
                    ? 'bg-[#111214] text-[#F4F0E9] shadow-xs'
                    : 'text-[#111214]/70 hover:text-[#111214] hover:bg-white/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Description Banner */}
        <div className="py-6 flex items-center justify-between text-xs text-[#111214]/60">
          <span>{currentCategory.description}</span>
          <span className="font-mono text-[#B08D57] font-medium">
            {currentCategory.items.length} SPECIFICATIONS AVAILABLE
          </span>
        </div>

        {/* Product Grid (Generous Whitespace, No Pill Sandwiches, Editorial Typography) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {currentCategory.items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group relative bg-[#F4F0E9] p-7 rounded-sm border border-[#111214]/8 hover:border-[#B08D57]/60 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Top metadata */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#111214]/50 font-mono mb-4">
                  <span>{item.code}</span>
                  <span className="group-hover:text-[#B08D57] transition-colors flex items-center gap-1 text-[11px] font-sans font-medium uppercase tracking-wider">
                    SPEC SHEET
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>

                {/* Minimal Architectural Schematic Silhouette (Pure vector SVG, no broken images) */}
                <div className="h-44 w-full bg-[#E7E1D7]/50 rounded-sm mb-6 flex items-center justify-center p-6 border border-[#111214]/5 relative overflow-hidden group-hover:bg-[#E7E1D7]/80 transition-colors">
                  {/* Subtle technical grid in background */}
                  <div 
                    aria-hidden="true"
                    className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#111214_1px,transparent_1px)] [background-size:16px_16px]" 
                  />
                  
                  {/* Vector Silhouette based on category */}
                  <svg viewBox="0 0 200 120" className="w-4/5 h-auto text-[#111214]/85 stroke-current fill-none stroke-[1.25] transition-transform duration-500 group-hover:scale-105">
                    {item.category === 'Door Handles' && (
                      <g>
                        {/* Escutcheon plate */}
                        <circle cx="50" cy="60" r="28" stroke="#B08D57" strokeWidth="1.5" />
                        <circle cx="50" cy="60" r="14" fill="#E7E1D7" stroke="#111214" />
                        {/* Spindle neck */}
                        <rect x="50" y="53" width="26" height="14" fill="#B08D57" stroke="#111214" />
                        {/* Ribbed Lever Bar */}
                        <rect x="76" y="50" width="100" height="20" rx="4" fill="#111214" />
                        {/* Rib knurl details */}
                        <line x1="95" y1="50" x2="95" y2="70" stroke="#B08D57" strokeWidth="1.5" />
                        <line x1="110" y1="50" x2="110" y2="70" stroke="#B08D57" strokeWidth="1.5" />
                        <line x1="125" y1="50" x2="125" y2="70" stroke="#B08D57" strokeWidth="1.5" />
                        <line x1="140" y1="50" x2="140" y2="70" stroke="#B08D57" strokeWidth="1.5" />
                        <line x1="155" y1="50" x2="155" y2="70" stroke="#B08D57" strokeWidth="1.5" />
                      </g>
                    )}

                    {item.category === 'Architectural Pulls' && (
                      <g>
                        {/* Standoff feet */}
                        <rect x="35" y="30" width="22" height="16" fill="#B08D57" />
                        <rect x="35" y="74" width="22" height="16" fill="#B08D57" />
                        {/* Main pillar pull bar */}
                        <rect x="57" y="15" width="22" height="90" rx="3" fill="#111214" stroke="#111214" />
                        {/* Precision fluting */}
                        <line x1="64" y1="20" x2="64" y2="100" stroke="#B08D57" strokeWidth="1.5" />
                        <line x1="72" y1="20" x2="72" y2="100" stroke="#B08D57" strokeWidth="1.5" />
                        {/* Mount backplates */}
                        <circle cx="28" cy="38" r="10" stroke="#111214" fill="#E7E1D7" />
                        <circle cx="28" cy="82" r="10" stroke="#111214" fill="#E7E1D7" />
                      </g>
                    )}

                    {item.category === 'Tower Bolts' && (
                      <g>
                        {/* Base plate */}
                        <rect x="30" y="42" width="130" height="36" fill="#E7E1D7" stroke="#111214" strokeWidth="1.5" />
                        {/* Bolt shoot */}
                        <rect x="20" y="52" width="155" height="16" fill="#111214" rx="2" />
                        {/* Bolt knob */}
                        <circle cx="110" cy="50" r="10" fill="#B08D57" stroke="#111214" />
                        {/* Guides */}
                        <rect x="45" y="42" width="16" height="36" fill="#B08D57" />
                        <rect x="135" y="42" width="16" height="36" fill="#B08D57" />
                      </g>
                    )}

                    {item.category === 'Finials & Turnpieces' && (
                      <g>
                        {/* Finial base */}
                        <path d="M 70 95 L 130 95 L 120 80 L 80 80 Z" fill="#111214" />
                        {/* Decorative fluted acorn / dome */}
                        <path d="M 80 80 C 70 50, 85 25, 100 20 C 115 25, 130 50, 120 80 Z" fill="#B08D57" stroke="#111214" strokeWidth="1.5" />
                        <line x1="100" y1="20" x2="100" y2="80" stroke="#111214" strokeWidth="1.5" />
                        <circle cx="100" cy="18" r="4" fill="#111214" />
                      </g>
                    )}

                    {item.category === 'Plates & Escutcheons' && (
                      <g>
                        {/* Backplate rectangle */}
                        <rect x="70" y="15" width="60" height="90" rx="3" fill="#E7E1D7" stroke="#111214" strokeWidth="1.5" />
                        {/* Spindle hole */}
                        <circle cx="100" cy="40" r="8" fill="#111214" />
                        {/* Euro cylinder teardrop cutout */}
                        <circle cx="100" cy="72" r="6" fill="#111214" />
                        <polygon points="94,72 106,72 104,82 96,82" fill="#111214" />
                        {/* Screw countersinks */}
                        <circle cx="100" cy="22" r="2.5" fill="#B08D57" />
                        <circle cx="100" cy="95" r="2.5" fill="#B08D57" />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Product Title */}
                <h3 className="text-xl font-display font-medium text-[#111214] group-hover:text-[#B08D57] transition-colors">
                  {item.name}
                </h3>
                
                {/* Profile notes */}
                <p className="mt-1 text-xs text-[#111214]/65 leading-relaxed font-sans">
                  {item.profile} · {item.material}
                </p>
              </div>

              {/* Bottom details & available finishes */}
              <div className="pt-6 mt-4 border-t border-[#111214]/8 space-y-3">
                <div className="text-[11px] text-[#111214]/60 font-mono">
                  {item.dimensions}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#111214]/70">
                    <span className="font-medium text-[#111214]">Finishes:</span>
                    <span>{item.finishes.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
