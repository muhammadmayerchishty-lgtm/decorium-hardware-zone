/**
 * Removes only continuous, near-black edge bands from catalogue imagery.
 * This targets mobile navigation bars and letterboxing without cropping the
 * product itself. Full-size files and their generated thumbnails stay paired.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from '../tools/node_modules/sharp/lib/index.js';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const OUTPUT_IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images-clean');
const VALID_EXTENSIONS = new Set(['.webp', '.png', '.jpg', '.jpeg']);
const DARK_PIXEL_MAX = 16;
const MIN_BAND_SIZE = 12;
const MAX_TRIM_FRACTION = 0.2;

async function findFullImages(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.toLowerCase() !== 'thumb') files.push(...await findFullImages(filePath));
    } else if (entry.isFile() && VALID_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(filePath);
    }
  }
  return files;
}

function edgeBandLength(data, width, height, channels, edge) {
  const horizontal = edge === 'top' || edge === 'bottom';
  const total = horizontal ? height : width;
  const span = horizontal ? width : height;
  const direction = edge === 'top' || edge === 'left' ? 1 : -1;
  let length = 0;

  for (let step = 0; step < total; step += 1) {
    const index = direction === 1 ? step : total - 1 - step;
    let darkPixels = 0;
    for (let offset = 0; offset < span; offset += 1) {
      const x = horizontal ? offset : index;
      const y = horizontal ? index : offset;
      const pixel = (y * width + x) * channels;
      if (data[pixel] <= DARK_PIXEL_MAX && data[pixel + 1] <= DARK_PIXEL_MAX && data[pixel + 2] <= DARK_PIXEL_MAX) {
        darkPixels += 1;
      }
    }
    // Solid letterboxing and Android navigation bars are almost full-width
    // black, unlike dark products that occupy a smaller portion of a row.
    if (darkPixels / span >= 0.94) length += 1;
    else break;
  }

  return length >= MIN_BAND_SIZE && length <= total * MAX_TRIM_FRACTION ? length : 0;
}

async function trimImage(filePath) {
  const input = sharp(filePath, { animated: false });
  const { data, info } = await input.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const top = edgeBandLength(data, width, height, channels, 'top');
  const bottom = edgeBandLength(data, width, height, channels, 'bottom');
  const left = edgeBandLength(data, width, height, channels, 'left');
  const right = edgeBandLength(data, width, height, channels, 'right');
  const cropWidth = width - left - right;
  const cropHeight = height - top - bottom;

  if (!top && !bottom && !left && !right) return null;
  if (cropWidth < width * 0.6 || cropHeight < height * 0.6) return null;

  const relativePath = path.relative(IMAGES_DIR, filePath);
  const outputPath = path.join(OUTPUT_IMAGES_DIR, relativePath);
  const thumbnailPath = path.join(path.dirname(outputPath), 'thumb', path.basename(filePath));
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.mkdir(path.dirname(thumbnailPath), { recursive: true });
  const output = sharp(filePath).extract({ left, top, width: cropWidth, height: cropHeight });
  const fullImage = await output.webp({ quality: 84, effort: 6 }).toBuffer();
  await fs.writeFile(outputPath, fullImage);
  const thumbnail = await sharp(fullImage).resize({ width: 640, height: 640, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 }).toBuffer();
  await fs.writeFile(thumbnailPath, thumbnail);

  return { file: path.relative(ROOT_DIR, filePath).split(path.sep).join('/'), top, bottom, left, right };
}

const images = await findFullImages(IMAGES_DIR);
const trimmed = [];
for (const image of images) {
  const result = await trimImage(image);
  if (result) trimmed.push(result);
}

const report = { scanned: images.length, trimmed: trimmed.length, files: trimmed };
await fs.writeFile(path.join(ROOT_DIR, 'catalog', 'image-trim-report.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Scanned ${report.scanned} images; trimmed ${report.trimmed} black-barred images.`);
