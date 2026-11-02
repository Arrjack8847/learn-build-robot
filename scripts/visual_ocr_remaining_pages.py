#!/usr/bin/env python3
"""Full page OCR follow-up to prior five-page sample audit; read-only.

Does NOT alter PDFs. OCR results are candidates, especially isolated Han chars.
"""
import csv
import io
import json
import os
import pathlib
import re
import time
import fitz
from PIL import Image
import pytesseract

GROUP = os.environ["AUDIT_GROUP"]
SHARD = int(os.environ["AUDIT_SHARD"])
OUT = pathlib.Path("full-ocr-results") / (GROUP.replace(" ","_")+"_"+str(SHARD))
OUT.mkdir(parents=True, exist_ok=True)
han = re.compile(r"[\u3400-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f]")
han_runs = re.compile(r"[\u3400-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f]{2,}")
words = {
    "intelligence_storm": re.compile(r"\bintelligence\s*[-–—]?\s*storm\b",re.I),
    "intelligent_storm":re.compile(r"\bintelligent\s*[-–—]?\s*storm\b",re.I),
    "zhongming":re.compile(r"\bzhong\s*ming\b",re.I),
    "smart_storm_chinese":re.compile("智能风暴|智能風暴"),
}
FILES=sorted(pathlib.Path("public").rglob("*.pdf"))+sorted(pathlib.Path("curriculum-source").rglob("*.pdf"))
def by_level(p):
    m=re.search(r"(?:^|/)Level[ -]?([1-6])(?:/|$)",str(p),re.I)
    return f"Level {m[1]}" if m else "Other"
pdfs=[p for p in FILES if by_level(p)==GROUP]
selected=[p for i,p in enumerate(pdfs) if i%2==SHARD]
def skip_pages(n):
    return {i for i in (0,1,n//2,n-2,n-1) if 0<=i<n}
rows=[]; files=[]; errors=[]; started=time.time()
for i,p in enumerate(selected,1):
    meta={"pdf":p.as_posix(),"group":GROUP,"shard":SHARD,"pages_total":0,"pages_scanned":0,
          "ocr_han_pages":0,"ocr_han_runs_pages":0,"ocr_english_brand_pages":0,
          "ocr_chinese_brand_pages":0,"error":""}
    try:
        with fitz.open(p) as doc:
            meta["pages_total"]=len(doc)
            for idx in range(len(doc)):
                if idx in skip_pages(len(doc)): continue
                page=doc[idx]
                # Up to 100dpi for the first complete coverage pass.
                sc=min(100/72, 2200/max(page.rect.width,page.rect.height))
                sc=max(.5,sc)
                pix=page.get_pixmap(matrix=fitz.Matrix(sc,sc),alpha=False)
                im=Image.open(io.BytesIO(pix.tobytes("png")))
                raw=pytesseract.image_to_string(im,lang="eng+chi_sim",config="--psm 11")
                native=page.get_text("text") or ""
                n_han=len(han.findall(raw))
                runs=han_runs.findall(raw)
                storm=sum(len(words[k].findall(raw)) for k in ("intelligence_storm","intelligent_storm"))
                chstorm=len(words["smart_storm_chinese"].findall(raw))
                zhong=len(words["zhongming"].findall(raw))
                # All positive OCR matches listed, even if extractable duplicate.
                if n_han or storm or chstorm or zhong:
                    rows.append({
                       "pdf":p.as_posix(),"page":idx+1,"native_han_count":len(han.findall(native)),
                       "ocr_han_count":n_han,"ocr_han_runs":" | ".join(runs[:20]),
                       "ocr_storm_count":storm,"ocr_chinese_brand_count":chstorm,
                       "ocr_zhongming_count":zhong,
                       "native_storm_count":sum(len(words[k].findall(native)) for k in ("intelligence_storm","intelligent_storm")),
                       "ocr_excerpt":" ".join(raw.split())[:500],
                       "review_status":"candidate_unverified"
                    })
                meta["pages_scanned"]+=1
                meta["ocr_han_pages"]+=bool(n_han)
                meta["ocr_han_runs_pages"]+=bool(runs)
                meta["ocr_english_brand_pages"]+=bool(storm or zhong)
                meta["ocr_chinese_brand_pages"]+=bool(chstorm)
    except Exception as e:
        meta["error"]=str(e)[:250]
        errors.append({"pdf":p.as_posix(),"error":meta["error"]})
    files.append(meta)
    if i%5==0 or i==len(selected):
       print(f"FULL_OCR_PROGRESS {GROUP} shard={SHARD} files={i}/{len(selected)} "
             f"pages={sum(v['pages_scanned'] for v in files)} candidates={len(rows)} "
             f"elapsed_s={round(time.time()-started)}",flush=True)
def save(name,records,keys):
    with (OUT/name).open("w",newline="",encoding="utf-8-sig") as f:
        w=csv.DictWriter(f,fieldnames=keys,extrasaction="ignore")
        w.writeheader()
        w.writerows(records)
save("pages.csv",rows,["pdf","page","native_han_count","ocr_han_count","ocr_han_runs",
     "ocr_storm_count","ocr_chinese_brand_count","ocr_zhongming_count","native_storm_count",
     "ocr_excerpt","review_status"])
save("files.csv",files,["pdf","group","shard","pages_total","pages_scanned","ocr_han_pages",
      "ocr_han_runs_pages","ocr_english_brand_pages","ocr_chinese_brand_pages","error"])
save("errors.csv",errors,["pdf","error"])
summary={"group":GROUP,"shard":SHARD,"assigned_pdfs":len(selected),
         "scanned_pdfs":sum(not v["error"] for v in files),
         "scanned_pages":sum(v["pages_scanned"] for v in files),
         "candidate_pages":len(rows),
         "han_candidate_pages":sum(v["ocr_han_pages"] for v in files),
         "han_multi_character_candidate_pages":sum(v["ocr_han_runs_pages"] for v in files),
         "english_brand_candidate_pages":sum(v["ocr_english_brand_pages"] for v in files),
         "chinese_brand_candidate_pages":sum(v["ocr_chinese_brand_pages"] for v in files),
         "errors":len(errors),
         "elapsed_seconds":round(time.time()-started),
         "limitations":"Candidate OCR only, not verified branding. Full coverage when combined with sample results. PDF files not modified."}
(OUT/"summary.json").write_text(json.dumps(summary,indent=2,ensure_ascii=False),encoding="utf8")
print("FULL_OCR_SUMMARY="+json.dumps(summary,ensure_ascii=False),flush=True)
