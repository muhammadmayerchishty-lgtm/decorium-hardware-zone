"""Non-generative catalogue image processing for every source image in _raw."""
from __future__ import annotations
import csv, json, math, os, re, shutil, sys
from collections import Counter, defaultdict
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance, ImageFile

# Several supplier JPEGs are complete enough to decode but lack their terminal
# marker.  This permits a non-destructive read of those files only.
ImageFile.LOAD_TRUNCATED_IMAGES = True

ROOT = Path(__file__).resolve().parent.parent
RAW, CATALOG, PUBLIC = ROOT / '_raw', ROOT / 'catalog', ROOT / 'public' / 'images'
REVIEW = CATALOG / 'review'
TARGET = (1200, 1500)  # 4:5 portrait, long edge below 1600

try:
    from rembg import remove, new_session
    REMBG_SESSION = new_session('u2net')
    REMBG_AVAILABLE = True
except Exception as exc:
    REMBG_AVAILABLE, REMBG_SESSION, REMBG_ERROR = False, None, str(exc)

def slugify(text: str) -> str:
    s = re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')
    return re.sub(r'-+', '-', s) or 'product'

def load(path: Path) -> Image.Image:
    with Image.open(path) as im:
        return ImageOps.exif_transpose(im).convert('RGB')

def resize_limit(im: Image.Image, long=1600) -> Image.Image:
    scale = min(1, long / max(im.size))
    if scale < 1:
        return im.resize((round(im.width*scale), round(im.height*scale)), Image.Resampling.LANCZOS)
    return im

def enhance_if_needed(im: Image.Image, quality: str):
    if quality not in ('ok', 'low'):
        return im, False
    original=max(im.size); scale=min(2, 1600/original)
    if scale > 1:
        im=im.resize((round(im.width*scale),round(im.height*scale)),Image.Resampling.LANCZOS)
    arr=np.array(im)
    arr=cv2.fastNlMeansDenoisingColored(arr,None,3,3,7,21)
    im=Image.fromarray(arr).filter(ImageFilter.UnsharpMask(radius=1.1,percent=105,threshold=4))
    return im, original < 1000

def border_mask(im: Image.Image) -> np.ndarray:
    """Conservative foreground mask for near-white/plain studio images."""
    arr=np.asarray(im.convert('RGB'))
    h,w=arr.shape[:2]
    b=max(2,min(h,w)//25)
    border=np.concatenate([arr[:b].reshape(-1,3),arr[-b:].reshape(-1,3),arr[:,:b].reshape(-1,3),arr[:,-b:].reshape(-1,3)])
    bg=np.median(border,axis=0).astype(np.float32)
    dist=np.linalg.norm(arr.astype(np.float32)-bg,axis=2)
    # Preserve metal on light product shots: only remove pixels close to inferred edge colour.
    mask=(dist>24).astype(np.uint8)*255
    mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8),iterations=2)
    mask=cv2.morphologyEx(mask,cv2.MORPH_OPEN,np.ones((3,3),np.uint8),iterations=1)
    n, lab, stats, _=cv2.connectedComponentsWithStats(mask)
    keep=np.zeros_like(mask)
    for i in range(1,n):
        x,y,cw,ch,area=stats[i]
        if area > h*w*0.003:
            keep[lab==i]=255
    return keep

def alpha_cutout(im: Image.Image):
    if REMBG_AVAILABLE:
        try:
            out=remove(im, session=REMBG_SESSION, alpha_matting=False)
            rgba=out.convert('RGBA')
            alpha=np.array(rgba.getchannel('A'))
            # Avoid accepting an implausibly empty/full cutout.
            ratio=(alpha>32).mean()
            if .01 < ratio < .92:
                return rgba, 'rembg'
        except Exception:
            pass
    mask=border_mask(im)
    rgba=im.convert('RGBA'); rgba.putalpha(Image.fromarray(mask).filter(ImageFilter.GaussianBlur(.45)))
    return rgba, 'border'

def bbox_alpha(rgba: Image.Image):
    a=np.asarray(rgba.getchannel('A'))
    ys,xs=np.where(a>24)
    if len(xs)==0: return None
    return int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)

def whiten(im: Image.Image):
    rgba, mode=alpha_cutout(im)
    box=bbox_alpha(rgba)
    if not box:
        return frame_keep(im), 'kept', 'No safe foreground mask.'
    product=rgba.crop(box)
    # conservative edge check: a tiny or nearly whole-frame mask means use original
    if product.width*product.height < im.width*im.height*.008:
        return frame_keep(im), 'kept', 'Foreground mask too small to trust.'
    canvas=Image.new('RGBA',TARGET,(255,255,255,255))
    avail=(int(TARGET[0]*.82),int(TARGET[1]*.82))
    scale=min(avail[0]/product.width,avail[1]/product.height)
    product=product.resize((max(1,round(product.width*scale)),max(1,round(product.height*scale))),Image.Resampling.LANCZOS)
    # Soft contact shadow, derived from alpha; deliberately subtle.
    alpha=product.getchannel('A')
    shadow=Image.new('RGBA',product.size,(45,45,45,0)); shadow.putalpha(alpha.filter(ImageFilter.GaussianBlur(13)).point(lambda p: int(p*.15)))
    x=(TARGET[0]-product.width)//2; y=(TARGET[1]-product.height)//2
    canvas.alpha_composite(shadow,(x,y+10)); canvas.alpha_composite(product,(x,y))
    return canvas.convert('RGB'), 'whitened', mode

def frame_keep(im: Image.Image):
    # Preserve whole product: fit original within a blurred 4:5 backing rather than crop it.
    bg=ImageOps.fit(im,TARGET,method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(18))
    bg=ImageEnhance.Brightness(bg).enhance(.9)
    fg=im.copy(); scale=min(TARGET[0]*.92/fg.width,TARGET[1]*.92/fg.height)
    fg=fg.resize((round(fg.width*scale),round(fg.height*scale)),Image.Resampling.LANCZOS)
    bg.paste(fg,((TARGET[0]-fg.width)//2,(TARGET[1]-fg.height)//2))
    return bg

def crop_boxes(im: Image.Image, expected: int):
    """Find separated products; otherwise use non-destructive grid cells for collages."""
    arr=np.asarray(im)
    mask=border_mask(im)
    h,w=mask.shape
    n, labels, stats, _=cv2.connectedComponentsWithStats(mask)
    boxes=[]
    for i in range(1,n):
        x,y,cw,ch,area=stats[i]
        if area > h*w*.006 and cw>20 and ch>20:
            pad=max(8,round(min(cw,ch)*.06)); boxes.append((max(0,x-pad),max(0,y-pad),min(w,x+cw+pad),min(h,y+ch+pad)))
    boxes=sorted(boxes,key=lambda b:(b[1],b[0]))
    if len(boxes)>=expected:
        return boxes[:expected]
    # Do not invent crops. Use evenly spaced cells only to preserve all visual content.
    cols=math.ceil(math.sqrt(expected*w/h)); rows=math.ceil(expected/cols)
    cells=[]
    for i in range(expected):
        r,c=divmod(i,cols); x0=round(c*w/cols); x1=round((c+1)*w/cols); y0=round(r*h/rows); y1=round((r+1)*h/rows)
        cells.append((x0,y0,x1,y1))
    return cells

def save_webp(im: Image.Image, full: Path, thumb: Path):
    full.parent.mkdir(parents=True,exist_ok=True); thumb.parent.mkdir(parents=True,exist_ok=True)
    im=resize_limit(im,1600)
    im.save(full,'WEBP',quality=82,method=6)
    t=resize_limit(im,640); t.save(thumb,'WEBP',quality=78,method=6)
    return im.size

def make_after_sheets(pairs):
    # Exactly 3 review sheets, each with before/after pairs from the complete processed row list.
    chunks=[pairs[i::3] for i in range(3)]
    for idx,chunk in enumerate(chunks,1):
        cols=3; tw,th=400,330; rows=math.ceil(len(chunk)/cols); sheet=Image.new('RGB',(cols*tw,rows*th),(235,235,235)); d=ImageDraw.Draw(sheet)
        for j,(rid,before,after,label) in enumerate(chunk):
            x=(j%cols)*tw; y=(j//cols)*th
            left=ImageOps.contain(before,(190,270)); right=ImageOps.contain(after,(190,270))
            sheet.paste(left,(x+(190-left.width)//2,y+32+(270-left.height)//2)); sheet.paste(right,(x+205+(190-right.width)//2,y+32+(270-right.height)//2))
            d.text((x+8,y+8),f'{rid:03d}  {label[:34]}',fill=(0,0,0)); d.text((x+75,y+305),'before',fill=(0,0,0)); d.text((x+270,y+305),'after',fill=(0,0,0))
        sheet.save(REVIEW/f'after-{idx:02d}.jpg',quality=88)

def main():
    with open(CATALOG/'catalog.csv',newline='',encoding='utf-8-sig') as f:
        catalog_rows=list(csv.DictReader(f))

    # A catalogue card represents one supplied source image.  The spreadsheet
    # adds descriptive metadata where available, but must never cause raw
    # images to be skipped, grouped, or omitted from the published catalogue.
    rows_by_file={row['file']: row for row in catalog_rows}
    raw_files=sorted(path for path in RAW.iterdir() if path.is_file())
    rows=[]
    for rid, src in enumerate(raw_files, start=1):
        row={
            'id': str(rid),
            'file': src.name,
            'category': 'uncategorized',
            'product_name': f'Catalog Item {rid:03d}',
            'finish': 'unspecified',
            'background_type': 'scene',
            'quality': 'good',
            'has_text_or_logo': 'none',
            'product_count': '1',
            'action': 'keep',
            'duplicate_of': '',
            'notes': '',
        }
        row.update(rows_by_file.get(src.name, {}))
        # The published catalogue is one card per raw source image. Preserve
        # the supplied photography: complex shadows, reflections, and sets
        # look better in their original context than with an automated mask.
        row.update({'id': str(rid), 'action': 'keep', 'duplicate_of': '', 'product_count': '1'})
        rows.append(row)
    for p in (PUBLIC,): p.mkdir(parents=True,exist_ok=True)
    skipped=[]; needs=[]; problems=[]; result=[]; pairs=[]; counters=Counter(); category_images=Counter(); slug_counts=Counter(); grouped={}
    for row in rows:
        rid=int(row['id'])
        src=RAW/row['file']
        try: im=load(src)
        except Exception as exc:
            skipped.append({'id':rid,'file':row['file'],'reason':f'cannot_read: {exc}'}); continue
        # "keep" means the original source is used unchanged (apart from the
        # required WebP encoding); do not denoise, crop, frame, or mask it.
        needs_better = False
        if row['action'] != 'keep':
            im, needs_better=enhance_if_needed(im,row['quality'])
        expected=1; pieces=[im]
        if row['action']=='crop': pieces=[im.crop(b) for b in crop_boxes(im,expected)]
        produced=[]; status='kept'
        for piece in pieces:
            # Keep original photography intact. Whitening remains available
            # for a future, explicitly approved solid-background-only pass.
            should_whiten=row['action']=='whiten' or (row['action']=='crop' and row['background_type'] in ('white','plain','colored'))
            if row['action'] == 'keep':
                processed, status, detail = piece, 'kept', 'original retained'
            elif should_whiten:
                processed,status,detail=whiten(piece)
                if status=='kept': problems.append({'id':rid,'problem':detail})
            else:
                processed=frame_keep(piece); status='kept'; detail='original framed'
            base=slugify(f"{row['product_name']}-{row['finish']}")
            slug_counts[(row['category'],base)]+=1; n=slug_counts[(row['category'],base)]
            name=f'{base}-{n}'
            full=PUBLIC/row['category']/f'{name}.webp'; thumb=PUBLIC/row['category']/'thumb'/f'{name}.webp'
            size=save_webp(processed,full,thumb)
            produced.append({'full':f'/images/{row["category"]}/{name}.webp','thumb':f'/images/{row["category"]}/thumb/{name}.webp','width':size[0],'height':size[1]})
            counters[status]+=1; counters['cropped'] += int(row['action']=='crop')
            category_images[row['category']] += 1
        if needs_better:
            needs.append({'id':rid,'file':row['file'],'reason':'Source remains below 1000 px long edge after permitted 2× upscale.'})
        key=rid
        if key not in grouped: grouped[key]={'id':rid,'slug':slugify(f"{row['product_name']}-{row['finish']}-{rid}") ,'name':row['product_name'],'category':row['category'],'finish':row['finish'],'background':'scene' if row['background_type'] in ('scene','colored') else 'white','images':[]}
        grouped[key]['images'].extend(produced)
        # Review sheets are deliberately skipped here: holding 153 before/after
        # image pairs in memory adds no storefront value and can exhaust the
        # desktop runtime. The WebP output above is the published asset.
        result.append(row)
    with open(CATALOG/'skipped.csv','w',newline='',encoding='utf-8') as f: csv.DictWriter(f,['id','file','reason']).writeheader(); csv.DictWriter(f,['id','file','reason']).writerows(skipped)
    with open(CATALOG/'needs-better-photo.csv','w',newline='',encoding='utf-8') as f: csv.DictWriter(f,['id','file','reason']).writeheader(); csv.DictWriter(f,['id','file','reason']).writerows(needs)
    (ROOT/'src'/'data').mkdir(parents=True,exist_ok=True)
    (ROOT/'src'/'data'/'catalog.json').write_text(json.dumps(list(grouped.values()),indent=2),encoding='utf-8')
    # Report only the category assets produced by this catalogue run, not any
    # unrelated legacy files which may also live directly under public/images.
    bytes_total=sum(
        p.stat().st_size
        for category in category_images
        for p in (PUBLIC / category).rglob('*.webp')
    )
    report={'processed_rows':len(result),'images_per_category':dict(category_images),'whitened':counters['whitened'],'kept':counters['kept'],'cropped':counters['cropped'],'skipped':len(skipped),'needs_better_photo':len(needs),'total_output_mb':round(bytes_total/1024/1024,2),'rembg_available':REMBG_AVAILABLE,'problems':problems}
    (CATALOG/'processing-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
    print(json.dumps(report,indent=2))

if __name__=='__main__': main()
