"""Replace only the catalogue rows changed from crop/whiten to keep.

This correction intentionally preserves all untouched product outputs.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path

from process_catalog import CATALOG, PUBLIC, RAW, enhance_if_needed, frame_keep, load, save_webp, slugify

# Actions before the conservative correction.  These IDs were changed in
# catalog.csv after the source-background audit.
CROP_IDS = {2, 4, 6, 7, 10, 11, 12, 16, 17, 19, 40, 43, 44, 45, 46, 47,
            49, 51, 52, 53, 54, 55, 57, 58, 59, 61, 62, 64, 76, 83, 101}
WHITEN_IDS = {22, 23, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,
              50, 114, 115, 118, 124}
CHANGED_IDS = CROP_IDS | WHITEN_IDS


def url(category: str, name: str, thumb: bool = False) -> str:
    middle = '/thumb' if thumb else ''
    return f'/images/{category}{middle}/{name}.webp'


def main() -> None:
    with (CATALOG / 'catalog.csv').open(newline='', encoding='utf-8-sig') as handle:
        rows = list(csv.DictReader(handle))
    by_id = {int(row['id']): row for row in rows}

    # Recreate precisely the old generated file allocation, without writing any
    # untouched item.  Crop rows consumed product_count filename slots.
    counts: dict[tuple[str, str], int] = {}
    old_names: dict[int, list[str]] = {}
    for row in rows:
        ident = int(row['id'])
        if row['action'] in ('flag', 'reshoot') or row['duplicate_of'].strip():
            continue
        old_action = 'crop' if ident in CROP_IDS else 'whiten' if ident in WHITEN_IDS else row['action']
        pieces = int(row['product_count']) if old_action == 'crop' else 1
        key = (row['category'], slugify(f"{row['product_name']}-{row['finish']}"))
        names = []
        for _ in range(pieces):
            counts[key] = counts.get(key, 0) + 1
            names.append(f'{key[1]}-{counts[key]}')
        old_names[ident] = names

    catalog_path = Path(__file__).resolve().parent.parent / 'src' / 'data' / 'catalog.json'
    products = json.loads(catalog_path.read_text(encoding='utf-8'))
    product_map = {(p['category'], p['name'], p['finish']): p for p in products}
    corrected = []

    for ident in sorted(CHANGED_IDS):
        row = by_id[ident]
        if row['action'] != 'keep' or ident not in old_names:
            continue  # skipped duplicate row 36 has no product output.
        names = old_names[ident]
        chosen = names[0]
        src = RAW / row['file']
        original = load(src)
        original, _ = enhance_if_needed(original, row['quality'])
        framed = frame_keep(original)
        full = PUBLIC / row['category'] / f'{chosen}.webp'
        thumb = PUBLIC / row['category'] / 'thumb' / f'{chosen}.webp'
        width, height = save_webp(framed, full, thumb)

        key = (row['category'], row['product_name'], row['finish'])
        product = product_map[key]
        old_full = {url(row['category'], name) for name in names}
        product['images'] = [image for image in product['images'] if image['full'] not in old_full]
        product['images'].append({'full': url(row['category'], chosen), 'thumb': url(row['category'], chosen, True), 'width': width, 'height': height})

        # The first name was reused above; remaining old crop pieces no longer
        # represent a listing and can safely be removed.
        for name in names[1:]:
            for path in (PUBLIC / row['category'] / f'{name}.webp', PUBLIC / row['category'] / 'thumb' / f'{name}.webp'):
                path.unlink(missing_ok=True)
        corrected.append(ident)

    catalog_path.write_text(json.dumps(products, indent=2), encoding='utf-8')
    print(json.dumps({'corrected_ids': corrected, 'corrected_count': len(corrected)}, indent=2))


if __name__ == '__main__':
    main()
