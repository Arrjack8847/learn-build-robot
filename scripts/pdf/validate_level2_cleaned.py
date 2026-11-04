#!/usr/bin/env python3
"""Independent original-versus-cleaned Level 2 PDF integrity and visual-region QA."""
from __future__ import annotations
import argparse, collections, hashlib, json, re
from pathlib import Path
import fitz
from PIL import Image, ImageChops, ImageDraw

SOURCE=Path('public/Level 2/Learning')
CLEAN=Path('/tmp/bsr-level2-clean/output')
PROOF=Path('/tmp/bsr-level2-proof')
HAN=re.compile(r'[\u3400-\u9fff\uf900-\ufaff]')
BRAND=re.compile(r'intelligen(?:t|ce)?\s+storm|smart\s+storm|joinmax|智能风暴',re.I)
COPYRIGHT=re.compile(r'copyright|©|all rights reserved|licen[sc]e',re.I)
LOGO_SIZES={(586,178),(1086,268)}

def lines(text):
    return collections.Counter(x.strip() for x in text.splitlines() if x.strip())

def preserved_lines(text):
    return collections.Counter(x.strip() for x in text.splitlines()
                               if x.strip() and not HAN.search(x) and not BRAND.search(x))

def allowed_rectangles(page):
    result=[]
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            for span in line['spans']:
                if HAN.search(span['text']) or BRAND.search(span['text']):
                    result.append((fitz.Rect(span['bbox']),"text"))
    for image in page.get_images(full=True):
        if (image[2],image[3]) not in LOGO_SIZES: continue
        for rect in page.get_image_rects(image[0]):
            result.append((rect,"image"))
    return result

def render(page, scale=.5):
    pm=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
    return Image.frombytes("RGB",(pm.width,pm.height),pm.samples)

def check_diff(original, cleaned, regions):
    before=render(original);after=render(cleaned)
    assert before.size==after.size,("render dimensions",before.size,after.size)
    d=ImageChops.difference(before,after).convert('L').point(lambda x:255 if x>8 else 0)
    if not d.getbbox():return 0,0,before,after
    permitted=Image.new('L',before.size,0);draw=ImageDraw.Draw(permitted)
    scale=.5
    for box,kind in regions:
        gap=15 if kind=="text" else 5
        x0=max(0,int((box.x0-gap)*scale));y0=max(0,int((box.y0-gap)*scale))
        x1=min(before.width,int((box.x1+gap)*scale+1))
        y1=min(before.height,int((box.y1+gap)*scale+1))
        draw.rectangle((x0,y0,x1,y1),fill=255)
    outside=ImageChops.subtract(d,permitted)
    bbox=outside.getbbox()
    if bbox:
        n=sum(1 for v in outside.getdata() if v)
        # Strong bound: no educational text/graphics may change outside target areas.
        assert n<=14,("Unexpected visible change outside branding/Chinese regions",
                      n,bbox)
    return sum(1 for v in d.getdata() if v), (sum(1 for v in outside.getdata() if v) if bbox else 0), before, after

def run(mode):
    source_all=sorted(SOURCE.rglob('*.pdf'))
    assert len(source_all)==44,('Source PDF inventory changed',len(source_all))
    building=[p for p in source_all if '_building_' in p.name.lower()]
    assert len(building)==1 and 'Double beam crane' in str(building[0]),building
    eligible=[p for p in source_all if p not in building]
    assert len(eligible)==43
    if mode=='sample':
        names=['Axe robot_Powerpoint.pdf','Automatic window.pdf',
               'Mechanical dog_PowerPoint-R.pdf','13.Teeterboard_PowerPoint.pdf']
        paths=[next(p for p in eligible if p.name==name) for name in names]
    else:paths=eligible
    PROOF.mkdir(parents=True,exist_ok=True)
    records=[];checked_pages=0;visual_edits=0;all_images=0
    for i,src in enumerate(paths):
        dest=CLEAN/src.relative_to(SOURCE)
        assert dest.is_file(),('Output not found',str(dest))
        assert dest.read_bytes().startswith(b'%PDF-'),dest
        old=fitz.open(src);new=fitz.open(dest)
        assert len(old)==len(new) and len(old)>0,(src,'page count mismatch')
        for key in ('author','creator','producer','subject','creationDate','modDate'):
            assert old.metadata.get(key)==new.metadata.get(key),(src,key,'metadata lost')
        edits=0;legal_pages=0
        for pi,(a,b) in enumerate(zip(old,new)):
            checked_pages+=1
            assert a.rect==b.rect and a.rotation==b.rotation,(src,pi+1,'geometry changed')
            atext=a.get_text();btext=b.get_text()
            assert not HAN.search(btext),(src,pi+1,'untranslated Chinese remains')
            assert not BRAND.search(btext),(src,pi+1,'selectable brand remains')
            missing=preserved_lines(atext)-lines(btext)
            assert not missing,(src,pi+1,'nonbrand English lost',dict(missing))
            legal_before=[x.strip() for x in atext.splitlines() if COPYRIGHT.search(x)]
            legal_after=[x.strip() for x in btext.splitlines() if COPYRIGHT.search(x)]
            assert legal_before==legal_after,(src,pi+1,'legal line changed',legal_before,legal_after)
            legal_pages+=bool(legal_before)
            for image in b.get_images(full=True):
                assert (image[2],image[3]) not in LOGO_SIZES,(src,pi+1,'matching embedded logo remains')
            changed,outside,before,after=check_diff(a,b,allowed_rectangles(a))
            if changed:edits+=1
            if mode=='sample' and pi in {0,len(old)-1, min(2,len(old)-1)}:
                tag=f'{i:02d}-{pi+1:02d}'
                before.thumbnail((820,620));after.thumbnail((820,620))
                before.save(PROOF/f'{tag}-before.png',optimize=True)
                after.save(PROOF/f'{tag}-after.png',optimize=True)
        old.close();new.close()
        visual_edits+=edits
        records.append({'path':str(src),'pages':len(fitz.open(src)),
                        'changed_pages':edits,'legal_pages_preserved':legal_pages,
                        'sha256_clean':hashlib.sha256(dest.read_bytes()).hexdigest()})
        print(f'VALIDATED {i+1:02d}/{len(paths)} {records[-1]["pages"]:3d} pages '
              f'changed_pages={edits} {src.name}',flush=True)
    result={'mode':mode,'source_pdfs':44,'eligible_learning_pdfs':43,'building_fallback_excluded':str(building[0]),
            'checked_pdfs':len(records),'checked_pages':checked_pages,
            'visibly_changed_pages':visual_edits,'no_lost_english':True,
            'legal_notices_preserved':True,'all_pages_rendered':True,
            'unchanged_page_artwork_preserved':True,'records':records}
    (PROOF/f'qa-{mode}.json').write_text(json.dumps(result,indent=2,ensure_ascii=False))
    print('VALIDATION_SUCCESS',json.dumps({k:v for k,v in result.items() if k!='records'}),flush=True)

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--mode',choices=['sample','full'],required=True)
    run(ap.parse_args().mode)
