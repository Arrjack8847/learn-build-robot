#!/usr/bin/env python3
"""Audit all 41 Level 6 Building PDFs using the registered Wix originals.

Download each original into a local read-only cache, verify its Git blob SHA,
scan the text layer of all pages, and render every interior page to visual
contact sheets. Image-embedded Chinese MUST still be checked visually;
this script never claims the contact sheets were inspected.

Usage from repository root:
  python scripts/pdf/audit_level6_building_interior.py --out-dir ./level6-audit

No GitHub Actions, Learning PDF edits, or changes to other levels.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import re
from urllib.request import urlopen,Request
import fitz
from PIL import Image, ImageOps, ImageDraw

REGISTRY=Path('src/data/levelSixWixPdfUrls.ts')
SOURCE_REPORT=Path('reports/level6-building-cover-audit-20261119.json')
HAN=re.compile(r'[\u3400-\u9fff\uf900-\ufaff]')
CARD_W,CARD_H=420,328
COLS,ROWS=3,4

def gitblob(data:bytes)->str:
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\x00'+data).hexdigest()

def registry_urls(text:str)->dict[str,str]:
    m=re.search(r'levelSixWixPdfUrls:\s*Readonly<Record<string, string>>\s*=\s*(\{[\s\S]*?\});',text)
    if not m:
        raise ValueError('Could not parse Level 6 Wix registry')
    return json.loads(m.group(1))

def get_verified_file(url:str,destination:Path,sha:str)->bytes:
    if destination.exists():
        data=destination.read_bytes()
        if gitblob(data)==sha:return data
        raise RuntimeError(f'Cached file has wrong SHA: {destination}')
    req=Request(url,headers={'User-Agent':'BE-STEM-READY-Level6-PDF-Audit/1.0'})
    with urlopen(req,timeout=90) as r:
        data=r.read()
    if gitblob(data)!=sha:
        raise RuntimeError(f'Downloaded PDF differs from GitHub main: {destination}')
    destination.parent.mkdir(parents=True,exist_ok=True)
    destination.write_bytes(data)
    return data

def contact_sheet(images:list[tuple[Image.Image,int]],out:Path,title:str)->None:
    canvas=Image.new('RGB',(COLS*CARD_W,ROWS*CARD_H),'#e7ebee')
    draw=ImageDraw.Draw(canvas)
    for idx,(im,n) in enumerate(images):
        row,col=divmod(idx,COLS)
        xx,yy=col*CARD_W,row*CARD_H
        paste=ImageOps.contain(im,(CARD_W-20,CARD_H-52))
        canvas.paste(paste,(xx+(CARD_W-paste.width)//2,yy+29))
        draw.text((xx+10,yy+6),f'{title[:31]} - page {n}',fill='#152030')
    out.parent.mkdir(parents=True,exist_ok=True)
    canvas.save(out,optimize=True)

def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--out-dir',required=True,type=Path)
    ap.add_argument('--root',type=Path,default=Path('.'))
    args=ap.parse_args()
    root=args.root.resolve()
    source=json.loads((root/SOURCE_REPORT).read_text())
    urls=registry_urls((root/REGISTRY).read_text())
    entries=source['files']
    assert len(entries)==41,'41 PDFs expected from prior audit'
    assert len({v['path'] for v in entries})==41
    assert len({v['original_blob_sha'] for v in entries})==41
    findings=[]
    total_pages=0
    for idx,item in enumerate(entries,1):
        path=item['path']
        rel=path.removeprefix('public/')
        url=urls.get(rel)
        if not url:raise KeyError(f'No Wix URL for {rel}')
        data=get_verified_file(url,args.out_dir/'originals'/rel,item['original_blob_sha'])
        doc=fitz.open(stream=data,filetype='pdf')
        if len(doc)!=item['original_page_count']:
            raise RuntimeError(f'Page count changed for {path}')
        total_pages+=len(doc)
        text_hits=[]
        contact=[]
        for i,page in enumerate(doc):
            if i>0:
                pix=page.get_pixmap(matrix=fitz.Matrix(.75,.75),alpha=False)
                im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
                contact.append((im,i+1))
                if len(contact)==COLS*ROWS or i==len(doc)-1:
                    sheet_number=(i-1)//(COLS*ROWS)+1
                    safe=f'{idx:02d}-'+re.sub(r'[^A-Za-z0-9_-]+','-',Path(path).stem)[:60]
                    contact_sheet(contact,args.out_dir/'contact_sheets'/safe/f'contact-{sheet_number:03d}.png',safe)
                    contact=[]
            chars=''.join(HAN.findall(page.get_text()))
            if chars:
                text_hits.append({'page':i+1,'han_chars':len(chars),'chinese_text':chars[:250]})
        findings.append({'path':path,'pages':len(doc),'source_sha':item['original_blob_sha'],
                         'source_sha_verified':True,'text_layer_han_findings':text_hits,
                         'interior_images_visually_reviewed':False})
        print(f'[{idx:02d}/41] {len(doc)} pages, {len(text_hits)} Chinese text-layer pages: {path}',flush=True)
    assert total_pages==1007,(total_pages,1007)
    report={'scope':'Level 6 Building PDFs ONLY','inventory':41,'total_pages':total_pages,
            'source_git_blob_sha_verified':41,'all_interior_pages_rendered':True,
            'visual_chinese_image_audit_complete':False,
            'warning':'All contact sheets still require actual visual review for image-embedded Chinese.',
            'manuals':findings}
    (args.out_dir/'level6-interior-contact-sheet-scan.json').write_text(
        json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print('All interiors rendered; human visual audit for embedded Chinese still REQUIRED.')

if __name__=='__main__':
    main()
