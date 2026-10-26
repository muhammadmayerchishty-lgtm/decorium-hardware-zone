/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const CLEAN_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images-clean');
const OUTPUT_FILE = path.join(ROOT_DIR, 'src', 'data', 'catalog.json');
const IMAGE_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const CATEGORY_BY_FOLDER = {
  accessories: 'accessories',
  'cabinet-handles': 'cabinet-handles',
  'decorative-handles': 'decorative-handles',
  'door-handles': 'door-handles',
  knobs: 'knobs',
  'main-door-pulls': 'main-door-pulls',
  'mortise-locks': 'mortise-locks',
  // These photos do not have reliable product metadata. They are still
  // saleable hardware, so expose them under the safe fallback category.
  uncategorized: 'accessories',
};

const toPosixPath = (value) => value.split(path.sep).join('/');

function titleCase(value) {
  return value.split(/[-_\s]+/).filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function finishFromFilename(filename) {
  const name = filename.toLowerCase();
  if (/antique|bronze/.test(name)) return 'antique';
  if (/black|dark|graphite/.test(name)) return 'black';
  if (/silver|nickel/.test(name)) return 'silver';
  if (/steel/.test(name)) return 'steel';
  if (/gold|brass|yellow/.test(name)) return 'gold';
  return 'brass';
}

function nameFromFilename(filename) {
  const bareName = path.basename(filename, path.extname(filename))
    .replace(/-\d+$/, '')
    .replace(/-(gold|brass|yellow|black|dark|graphite|silver|nickel|steel|antique|bronze|two-tone)$/i, '');
  return titleCase(bareName);
}

function findImages(directory) {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      // Thumbnails are referenced by their full-size sibling, not catalogued.
      if (entry.name.toLowerCase() !== 'thumb') results.push(...findImages(filePath));
    } else if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      results.push(filePath);
    }
  }
  return results;
}

function buildCatalog(imageFiles) {
  return imageFiles.sort((a, b) => a.localeCompare(b)).map((filePath, index) => {
    const relativePath = toPosixPath(path.relative(IMAGES_DIR, filePath));
    const [folderName] = relativePath.split('/');
    const category = CATEGORY_BY_FOLDER[folderName] || 'accessories';
    const filename = path.basename(filePath);
    const thumbnailPath = path.join(path.dirname(filePath), 'thumb', filename);
    const cleanFullPath = path.join(CLEAN_IMAGES_DIR, ...relativePath.split('/'));
    const useCleanImage = fs.existsSync(cleanFullPath);
    const assetRoot = useCleanImage ? 'images-clean' : 'images';
    const full = `/${assetRoot}/${relativePath}`;

    return {
      id: index + 1,
      slug: path.basename(filename, path.extname(filename)).toLowerCase(),
      name: nameFromFilename(filename),
      // The directory is the source of truth for frontend category filters.
      category,
      finish: finishFromFilename(filename),
      background: 'white',
      images: [{
        full,
        thumb: fs.existsSync(thumbnailPath)
          ? `/${assetRoot}/${toPosixPath(path.relative(IMAGES_DIR, thumbnailPath))}`
          : full,
      }],
    };
  });
}

function run() {
  if (!fs.existsSync(IMAGES_DIR)) throw new Error(`Images folder not found: ${IMAGES_DIR}`);

  const imageFiles = findImages(IMAGES_DIR);
  if (imageFiles.length === 0) {
    // Never replace a live catalogue with an empty dataset.
    throw new Error(`No product images found below ${IMAGES_DIR}; catalog was left unchanged.`);
  }

  const catalog = buildCatalog(imageFiles);
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  console.log(`Generated ${catalog.length} catalog products in ${OUTPUT_FILE}`);
}

try {
  run();
} catch (error) {
  console.error(`Catalog generation failed: ${error.message}`);
  process.exitCode = 1;
}
