#!/usr/bin/env python3
"""Debug unexpected visual differences without modifying any source or cleaned PDFs.

Run after clean_level2_learning_once.py:
  python scripts/pdf/diagnose_level2_visual.py --limit 3

Generates local, untracked PNGs and a JSON report in level2-visual-diagnostics/.
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
import fitz

SOURCE=Path("public/Level 2/Learning")
CLEAN=Path("/tmp/bsr-level2-clean/output")
OUT=Path("level2-visual-diagnostics")
BRAND=re.compile(r"intelligen(?:t|ce)?\s+storm|smart\s+storm|智能风暴",re.I)
HAN=re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
LOGO_SIZES={(586,178),(1086,268)}

def render(page, scale=.5):
    pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),alpha=False)
    return Image.frombytes("RGB",(pix.width,pix.height),pix.samples)

def allowed(page, scale=.5):
    # Use the exact same intended-edit mask as independent QA.
    # This includes branding split across spans, not just per-span matches.
    from validate_level2_cleaned import allowed_rectangles
    return [{"kind":kind,"bbox":list(rect)} for rect,kind in allowed_rectangles(page)]

def failure(old,new):
    before=render(old);after=render(new)
    diff=ImageChops.difference(before,after).convert("L").point(lambda x:255 if x>8 else 0)
    mask=Image.new("L",before.size,0)
    d=ImageDraw.Draw(mask)
    objects=allowed(old)
    for obj in objects:
        r=obj["bbox"];gap=15 if obj["kind"]=="text" else (1 if obj["kind"]=="glyph" else 5)
        d.rectangle((max(0,int((r[0]-gap)*.5)),max(0,int((r[1]-gap)*.5)),
                     min(before.width,int((r[2]+gap)*.5+1)),min(before.height,int((r[3]+gap)*.5+1))),fill=255)
    outside=ImageChops.subtract(diff,mask)
    box=outside.getbbox()
    if not box:return None
    n=sum(1 for v in outside.getdata() if v)
    if n<=14:return None
    return {"count":n,"bbox":list(box),"allowed_objects":objects},before,after,outside,diff

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--limit",type=int,default=3,help="Number of failing pages to capture before stopping")
    args=ap.parse_args()
    OUT.mkdir(exist_ok=True)
    records=[];pages=0
    for src in sorted(SOURCE.rglob("*.pdf")):
        if "_building_" in src.name.lower():continue
        dest=CLEAN/src.relative_to(SOURCE)
        if not dest.exists():raise SystemExit("Missing cleaned output: "+str(dest))
        a=fitz.open(src);b=fitz.open(dest)
        for i,(old,new) in enumerate(zip(a,b)):
            pages+=1
            result=failure(old,new)
            if result is None:continue
            row,before,after,outside,diff=result
            row.update({"file":str(src),"page":i+1,
                        "page_dimensions":list(old.rect),
                        "old_images":[{"xref":im[0],"native":[im[2],im[3]],
                        "rects":[list(r) for r in old.get_image_rects(im[0])]}
                        for im in old.get_images(full=True) if old.get_image_rects(im[0])],
                        "clean_images":[{"xref":im[0],"native":[im[2],im[3]]} for im in new.get_images(full=True)]})
            records.append(row)
            prefix=OUT/f"issue-{len(records):02d}"
            before.save(str(prefix)+"-BEFORE.png")
            after.save(str(prefix)+"-AFTER.png")
            outside.save(str(prefix)+"-UNEXPECTED-DIFF.png")
            diff.save(str(prefix)+"-FULL-DIFF.png")
            print(f"UNEXPECTED_DIFFERENCE #{len(records)} file={src.relative_to(SOURCE)} page={i+1} pixels={row['count']} bbox={row['bbox']}",flush=True)
            if len(records)>=args.limit:break
        a.close();b.close()
        if len(records)>=args.limit:break
    (OUT/"issues.json").write_text(json.dumps({"pages_checked":pages,"issues":records},indent=2),encoding="utf-8")
    print("DIAGNOSTIC_REPORT",OUT/"issues.json")
    print("SAFETY: No original or cleaned PDFs were modified. Do not push until diagnosed.")
if __name__=="__main__":main()
