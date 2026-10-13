/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'generated-products.ts');

function determineCategory(tokens) {
  if (tokens.some((t) => t === 'tower' || t === 'bolt')) return 'Tower Bolts';
  if (tokens.some((t) => t === 'finial')) return 'Finials';
  if (tokens.some((t) => t === 'plate' || t === 'shell')) return 'Plates';
  if (tokens.some((t) => t === 'mortise' || t === 'lock')) return 'Mortise Locks';
  if (tokens.some((t) => t === 'knocker')) return 'Door Knockers';
  if (tokens.some((t) => t === 'disc')) return 'Decorative Handles';
  if (tokens.some((t) => t === 'pull' || t === 'bar' || t === 'ringed')) return 'Pulls';
  return 'Handles';
}

function determineFinish(tokens) {
  if (tokens.some((t) => t === 'gold' || t === 'brass' || t === 'yellow')) return 'Gold';
  if (tokens.some((t) => t === 'black' || t === 'dark')) return 'Black';
  if (tokens.some((t) => t.startsWith('silv'))) return 'Silver';
  if (tokens.some((t) => t === 'steel')) return 'Steel';
  if (tokens.some((t) => t === 'antique' || t === 'bronze')) return 'Antique';
  return 'Brass';
}

function formatTitleCaseName(tokens) {
  const formatted = tokens.map((token, index) => {
    // A trailing single letter or number becomes "Style A/B/C" or "Style 2/3"
    if (index === tokens.length - 1) {
      if (/^[a-zA-Z]$/.test(token)) {
        return `Style ${token.toUpperCase()}`;
      }
      if (/^\d+$/.test(token)) {
        return `Style ${token}`;
      }
    }
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  });
  return formatted.join(' ');
}

function generateDescription(category, finish, name) {
  const finishText = finish.toLowerCase();
  switch (category) {
    case 'Tower Bolts':
      return `Architectural heavy-duty barrel bolt with smooth manual throw, presented in ${finishText} finish.`;
    case 'Finials':
      return `Architectural turned finial terminal with refined profile, presented in ${finishText} finish.`;
    case 'Plates':
      return `Architectural escutcheon plate with precision edge contour, presented in ${finishText} finish.`;
    case 'Mortise Locks':
      return `Architectural mortise lock faceplate and hardware mechanism, presented in ${finishText} finish.`;
    case 'Door Knockers':
      return `Heavy entrance door knocker with articulated striker ring, presented in ${finishText} finish.`;
    case 'Decorative Handles':
      return `Decorative architectural disc handle with embossed relief detailing, presented in ${finishText} finish.`;
    case 'Pulls':
      return `Linear architectural pull handle designed for cabinet suites and doors, presented in ${finishText} finish.`;
    case 'Handles':
    default:
      return `Architectural lever handle featuring tactile detailing and balanced hand feel, presented in ${finishText} finish.`;
  }
}

function run() {
  try {
    if (!fs.existsSync(IMAGES_DIR)) {
      console.log('Images folder not found. Generating empty product dataset.');
      writeOutput([]);
      return;
    }

    const files = fs.readdirSync(IMAGES_DIR);
    const validExtensions = new Set(['.webp', '.png', '.jpg', '.jpeg']);
    const imageFiles = files.filter((f) => validExtensions.has(path.extname(f).toLowerCase()));

    if (imageFiles.length === 0) {
      console.log('No valid image files found in /public/images/. Generating empty product dataset.');
      writeOutput([]);
      return;
    }

    // Group by base name to deduplicate: if two files share the same base name, keep the .webp and skip the other
    const baseMap = new Map();
    for (const file of imageFiles) {
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);
      if (!baseMap.has(baseName)) {
        baseMap.set(baseName, file);
      } else {
        const existing = baseMap.get(baseName);
        const existingExt = path.extname(existing).toLowerCase();
        if (ext === '.webp' && existingExt !== '.webp') {
          baseMap.set(baseName, file);
        }
      }
    }

    const deduplicatedFiles = Array.from(baseMap.values()).sort();
    const products = [];

    for (let i = 0; i < deduplicatedFiles.length; i++) {
      const file = deduplicatedFiles[i];
      const ext = path.extname(file).toLowerCase();
      const baseName = path.basename(file, ext);

      // Strip leading numeric code (regex ^\d+(-\d+)*-)
      const stripped = baseName.replace(/^\d+(-\d+)*-/, '');
      const tokens = stripped.split(/[-_]+/).filter(Boolean);

      const name = formatTitleCaseName(tokens);
      const slug = stripped.toLowerCase();
      const category = determineCategory(tokens);
      const finish = determineFinish(tokens);
      const tier = ext === '.webp' || ext === '.png' ? 'ready' : 'extra';
      const opaque = ext === '.jpg' || ext === '.jpeg';
      const image = `/images/${file}`;
      const description = generateDescription(category, finish, name);

      products.push({
        id: `prod-${slug}`,
        slug,
        name,
        category,
        finish,
        image,
        tier,
        opaque,
        description,
      });
    }

    writeOutput(products);
    console.log(`Successfully generated ${products.length} products in ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('Error during product generation (safely caught):', err);
    try {
      writeOutput([]);
    } catch {
      // Never throw
    }
  }
}

function writeOutput(products) {
  const content = `/**
 * AUTO-GENERATED BY scripts/generate-products.mjs
 * DO NOT EDIT MANUALLY.
 */

export interface GeneratedProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  finish: string;
  image: string;
  tier: 'ready' | 'extra';
  opaque: boolean;
  price?: number;
  description: string;
}

export const GENERATED_PRODUCTS: GeneratedProduct[] = ${JSON.stringify(products, null, 2)};
`;

  const dir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
}

run();
