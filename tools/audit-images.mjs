import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve('..');
const source = path.join(root, '_raw');
const review = path.join(root, 'catalog', 'review');
const files = (await fs.readdir(source)).filter(f => /\.(jpe?g)$/i.test(f)).sort();

function dct(values) {
  const n = 32, out = Array.from({length:n}, () => Array(n).fill(0));
  for (let u=0; u<n; u++) for (let v=0; v<n; v++) {
    let sum=0;
    for (let x=0; x<n; x++) for (let y=0; y<n; y++) sum += values[x*n+y]*Math.cos(Math.PI*(2*x+1)*u/(2*n))*Math.cos(Math.PI*(2*y+1)*v/(2*n));
    out[u][v]=sum;
  }
  return out;
}
function phash(gray) {
  const c=dct(gray); const vals=[];
  for(let u=0;u<8;u++) for(let v=0;v<8;v++) if(u||v) vals.push(c[u][v]);
  const sorted=[...vals].sort((a,b)=>a-b), median=sorted[Math.floor(sorted.length/2)];
  return vals.map(v=>v>median?'1':'0').join('').match(/.{1,4}/g).map(b=>parseInt(b,2).toString(16)).join('');
}
function hamming(a,b) { let n=0; for(let i=0;i<a.length;i++) { let x=parseInt(a[i],16)^parseInt(b[i],16); while(x){n+=x&1;x>>=1;} } return n; }
function esc(s) { return String(s).replace(/[&<>]/g, x=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[x])); }

const records=[];
for(let i=0;i<files.length;i++) {
  const file=files[i], full=path.join(source,file), stat=await fs.stat(full);
  const image=sharp(full,{failOn:'none'}).rotate(); const meta=await image.metadata();
  const raw=await image.resize(32,32,{fit:'fill'}).grayscale().raw().toBuffer();
  const px=[...raw]; let sum=0, sumSq=0, count=0;
  for(let y=1;y<31;y++) for(let x=1;x<31;x++) { const k=y*32+x; const lap=px[k-32]+px[k+32]+px[k-1]+px[k+1]-4*px[k]; sum+=lap;sumSq+=lap*lap;count++; }
  const sharpness=sumSq/count-(sum/count)**2;
  records.push({id:i+1,file,width:meta.width,height:meta.height,file_size:stat.size,sharpness:Math.round(sharpness*100)/100,phash:phash(px),duplicate_of:''});
}
for(let i=0;i<records.length;i++) {
  const candidates=[];
  for(let j=0;j<i;j++) { const distance=hamming(records[i].phash,records[j].phash); if(distance<=8) candidates.push(j); }
  if(candidates.length) {
    const best=[...candidates,i].map(k=>records[k]).sort((a,b)=> b.sharpness-a.sharpness || b.width*b.height-a.width*a.height || b.file_size-a.file_size)[0];
    if(best!==records[i]) records[i].duplicate_of=best.id;
  }
}
await fs.writeFile(path.join(root,'catalog','image-metadata.json'), JSON.stringify(records,null,2));

const columns=4, rows=5, perSheet=20, tileW=520, tileH=430;
for(let start=0;start<records.length;start+=perSheet) {
  const group=records.slice(start,start+perSheet), width=columns*tileW, height=rows*tileH;
  const composites=[];
  for(let n=0;n<group.length;n++) {
    const r=group[n], left=(n%columns)*tileW, top=Math.floor(n/columns)*tileH;
    const label=`${String(r.id).padStart(3,'0')} — ${r.file}`;
    const svg=Buffer.from(`<svg width="${tileW}" height="${tileH}"><rect width="100%" height="100%" fill="white"/><text x="14" y="30" font-family="Arial" font-size="20" font-weight="bold" fill="black">${esc(label)}</text></svg>`);
    const product=await sharp(path.join(source,r.file),{failOn:'none'}).rotate().resize(tileW-24,tileH-58,{fit:'contain',background:{r:245,g:245,b:245,alpha:1}}).jpeg({quality:85}).toBuffer();
    const tile=await sharp(svg).composite([{input:product,left:12,top:46}]).jpeg({quality:90}).toBuffer();
    composites.push({input:tile,left,top});
  }
  const canvas=sharp({create:{width,height,channels:3,background:{r:220,g:220,b:220}}}).composite(composites).jpeg({quality:90});
  await canvas.toFile(path.join(review,`sheet-${String(Math.floor(start/perSheet)+1).padStart(2,'0')}.jpg`));
}
console.log(JSON.stringify({images:records.length,sheets:Math.ceil(records.length/perSheet),duplicates:records.filter(r=>r.duplicate_of).length},null,2));
