#!/usr/bin/env python3
"""Read-only inventory of Level 5 Learning PDFs. No source mutations."""
from pathlib import Path
from collections import Counter
import argparse, json, re, os
import fitz

ROOT=Path("public/Level 5/Learning")
REPORT=Path("/tmp/bsr-level5-worker")
BRAND=re.compile(r"intelligen(?:t|ce)?\s*storm|smart\s*storm|joinmax",re.I)
CJK=re.compile(r"[\u3400-\u9fff]")
LEGAL=re.compile(r"copyright|all rights reserved|licen[cs]e|©|版权所有|知识产权|著作权",re.I)
KNOWN_LOGO_DIMS={(586,178),(1086,268)}

def inventory():
    pdfs=sorted(ROOT.rglob("*.pdf"))
    assert len(pdfs)==51, f"Expected 51 Level 5 Learning PDFs, got {len(pdfs)}"
    REPORT.mkdir(parents=True,exist_ok=True)
    rows=[]
    images=Counter()
    for i,path in enumerate(pdfs,1):
        d=fitz.open(path)
        out={"path":str(path.relative_to(ROOT)), "pages":len(d),"bytes":path.stat().st_size,
             "pages_cjk":[], "pages_brand":[], "pages_legal":[], "cjk_characters":0,
             "brand_spans":[],"cjk_spans":[],"logo_instances":[],"metadata_brand":[],"image_candidates":[]}
        meta=d.metadata
        out["metadata_brand"]=[k for k,v in meta.items() if isinstance(v,str) and BRAND.search(v)]
        for pno,page in enumerate(d,1):
            raw=page.get_text()
            matches=CJK.findall(raw)
            bmatches=BRAND.findall(raw)
            out["cjk_characters"]+=len(matches)
            if matches:out["pages_cjk"].append(pno)
            if bmatches:out["pages_brand"].append(pno)
            if LEGAL.search(raw):out["pages_legal"].append(pno)
            for block in page.get_text("dict")["blocks"]:
                for line in block.get("lines",[]):
                    for span in line.get("spans",[]):
                        t=span["text"]
                        item={"page":pno,"text":t[:180],"bbox":[round(v,2) for v in span["bbox"]],
                              "font":span["font"],"size":round(span["size"],2)}
                        if BRAND.search(t):out["brand_spans"].append(item)
                        if CJK.search(t):out["cjk_spans"].append(item)
            for image in page.get_images(full=True):
                xref,w,h=image[0],image[2],image[3]
                images[(w,h)]+=1
                rects=page.get_image_rects(xref)
                for r in rects:
                    candidate={"page":pno,"xref":xref,"pixels":[w,h],
                               "rect":[round(r.x0,1),round(r.y0,1),round(r.x1,1),round(r.y1,1)]}
                    if (w,h) in KNOWN_LOGO_DIMS:out["logo_instances"].append(candidate)
                    if pno in (1,2,len(d)-1,len(d)) and (r.width<page.rect.width*.5 or r.height<page.rect.height*.35):
                        if len(out["image_candidates"])<80:out["image_candidates"].append(candidate)
        d.close()
        rows.append(out)
        print(f"{i:02d}/51 pages={out['pages']:02d} cjk={len(out['pages_cjk']):02d} brand={len(out['pages_brand']):02d} logo={len(out['logo_instances']):02d} {out['path']}",flush=True)
    summary={"pdfs":len(rows),"pages":sum(x["pages"] for x in rows),
      "pages_cjk":sum(len(x["pages_cjk"]) for x in rows),
      "pages_brand":sum(len(x["pages_brand"]) for x in rows),
      "cjk_characters":sum(x["cjk_characters"] for x in rows),
      "logo_instances":sum(len(x["logo_instances"]) for x in rows),
      "files_with_cjk":sum(bool(x["pages_cjk"]) for x in rows),
      "files_with_brand":sum(bool(x["pages_brand"]) for x in rows),
      "files_with_legal":sum(bool(x["pages_legal"]) for x in rows),
      "files_with_brand_meta":sum(bool(x["metadata_brand"]) for x in rows),
      "top_image_dimensions":[{"dim":list(k),"instances":v} for k,v in images.most_common(25)]}
    (REPORT/"audit.json").write_text(json.dumps({"summary":summary,"files":rows},indent=2,ensure_ascii=False))
    print("SUMMARY_JSON="+json.dumps(summary),flush=True)
    print("EXAMPLES_BRAND="+json.dumps([{"file":x["path"],"spans":x["brand_spans"][:4]} for x in rows if x["brand_spans"]][:12],ensure_ascii=False),flush=True)
    print("EXAMPLES_CJK="+json.dumps([{"file":x["path"],"spans":x["cjk_spans"][:3]} for x in rows if x["cjk_spans"]][:10],ensure_ascii=False),flush=True)
    return summary

if __name__=="__main__":
    inventory()
