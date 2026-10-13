/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GENERATED_PRODUCTS, GeneratedProduct } from './generated-products.ts';

export type HardwareCategory = string;
export type HardwareFinish = string;

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  finish: string;
  finishes: string[];
  size?: string;
  image: string;
  tier: 'ready' | 'extra';
  opaque: boolean;
  price?: number; // In PKR, undefined = "Price on request"
  description: string;
  featured?: boolean;
  specs?: {
    material: string;
    projection?: string;
    fixing?: string;
    weight?: string;
  };
}

/**
 * Optional user overrides keyed by product slug.
 * Allows customizing name, price, description, featured, or hidden status.
 */
export interface ProductOverride {
  name?: string;
  price?: number;
  description?: string;
  featured?: boolean;
  hidden?: boolean;
  category?: string;
  finish?: string;
  size?: string;
  specs?: {
    material: string;
    projection?: string;
    fixing?: string;
    weight?: string;
  };
}

export const PRODUCT_OVERRIDES: Record<string, ProductOverride> = {};

// Sort generated list with tier "ready" FIRST and then "extra"
const sortedList = [...GENERATED_PRODUCTS].sort((a, b) => {
  if (a.tier === 'ready' && b.tier !== 'ready') return -1;
  if (a.tier !== 'ready' && b.tier === 'ready') return 1;
  return a.name.localeCompare(b.name);
});

// Merged products list applying overrides and skipping hidden
export const PRODUCTS: Product[] = sortedList
  .filter((gp) => !PRODUCT_OVERRIDES[gp.slug]?.hidden)
  .map((gp: GeneratedProduct, index: number) => {
    const override = PRODUCT_OVERRIDES[gp.slug] || {};
    const finish = override.finish || gp.finish;
    return {
      id: gp.id || `prod-${index + 1}`,
      slug: gp.slug,
      name: override.name || gp.name,
      category: override.category || gp.category,
      finish,
      finishes: [finish, 'Gold', 'Black'].filter((v, i, a) => a.indexOf(v) === i),
      size: override.size || 'Architectural Specification',
      image: gp.image,
      tier: gp.tier,
      opaque: gp.opaque,
      price: override.price !== undefined ? override.price : undefined, // Price stays undefined by default
      description: override.description || gp.description,
      featured: override.featured ?? false,
      specs: override.specs || {
        material: 'Solid Brass & Architectural Metal',
        projection: 'Standard Profile',
        fixing: 'Concealed Fixing',
        weight: 'Solid Core',
      },
    };
  });

// Category descriptions mapping for rich tiles
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Handles: 'Sprung lever handles with fluted grips and precision roses',
  Pulls: 'Architectural entrance pulls and linear cabinet bars',
  'Tower Bolts': 'Heavy architectural barrel bolts and throws',
  Finials: 'Turned architectural finials and snibs',
  Plates: 'Architectural backplates and escutcheons',
  'Mortise Locks': 'Precision architectural mortise locksets',
  'Door Knockers': 'Substantial entrance door knockers and articulated rings',
  'Decorative Handles': 'Architectural disc handles with relief motifs',
};

// Dynamically generate categories with real product counts
const uniqueCategoryNames = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort((a, b) => {
  // Put Handles and Pulls first, then alphabetical
  if (a === 'Handles') return -1;
  if (b === 'Handles') return 1;
  if (a === 'Pulls') return -1;
  if (b === 'Pulls') return 1;
  return a.localeCompare(b);
});

export const CATEGORIES_LIST = uniqueCategoryNames.map((catName) => ({
  id: catName,
  name: catName,
  description: CATEGORY_DESCRIPTIONS[catName] || 'Architectural hardware pieces',
  count: PRODUCTS.filter((p) => p.category === catName).length,
}));

// Dynamic finishes list derived directly from product dataset
const uniqueFinishes = Array.from(new Set(PRODUCTS.map((p) => p.finish))).sort();
export const FINISHES_LIST = ['All', ...uniqueFinishes] as const;

export type FinishFilter = typeof FINISHES_LIST[number];
export type CategoryFilter = 'All' | typeof CATEGORIES_LIST[number]['name'];
