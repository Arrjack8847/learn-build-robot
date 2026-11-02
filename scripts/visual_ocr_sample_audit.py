#!/usr/bin/env python3
"""Read-only sampled visual OCR audit. Produces candidates, never modifies a source PDF."""
import csv
import io
import json
import os
import pathlib
import re
import sys
from collections import Counter
import fitz
import pytesseract
from PIL import Image

GROUP = os.environ.get("AUDIT_GROUP", "Level 1")
OUT = pathlib.Path("visual-ocr-results") / GROUP.replace(" ", "_")
OUT.mkdir(parents=True, exist_ok=True)
PATTERNS = {
    "intelligence_storm": re.compile(r"intelligence\s*[-–—]?\s*storm", re.I),
    "intelligent_storm": re.compile(r"intelligent\s*[-–—]?\s*storm", re.I),
    "zhongming": re.compile(r"zhong\s*ming", re.I),
}
HAN = re.compile(r"[\u3400-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f]")
HAN_RUN = re.compile(r"[\u3400-\u9fff\uf900-\ufaff\U00020000-\U0002fa1f]{2,}")
ALL = sorted(pathlib.Path("public").rglob("*.pdf")) + sorted(pathlib.Path("curriculum-source").rglob("*.pdf"))

def in_group(path):
    m = re.search(r"(?:^|/)Level[ -]?([1-6])(?:/|$)", str(path), re.I)
    group = f"Level {m[1]}" if m else "Other"
    return group == GROUP

def selected_pages(n):
    """Five samples per PDF, chosen before knowing whether OCR will find anything."""
    if not n: return []
    return sorted({0, 1, n // 2, n - 2, n - 1} & set(range(n)))

def as_text(pix):
    im = Image.open(io.BytesIO(pix.tobytes("png")))
    return pytesseract.image_to_string(im, lang="eng+chi_sim", config="--psm 11")

files = []
hits = []
errors = []
pdfs = [p for p in ALL if in_group(p)]
for index, p in enumerate(pdfs, 1):
    item = {"pdf": str(p), "sampled_pages": 0, "native_chinese_sampled": 0,
            "ocr_chinese_sampled": 0, "ocr_storm_sampled": 0, "error": ""}
    try:
        with fitz.open(p) as doc:
            for pageidx in selected_pages(len(doc)):
                page = doc[pageidx]
                native = page.get_text("text") or ""
                # 120 dpi: a useful first-pass OCR compromise for a large image-heavy corpus.
                scale = min(120.0 / 72.0, 2200.0 / max(page.rect.width, page.rect.height))
                scale = max(scale, 0.5)
                pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
                ocr = as_text(pix)
                native_han = len(HAN.findall(native))
                ocr_han = len(HAN.findall(ocr))
                ocr_runs = HAN_RUN.findall(ocr)
                ocr_storm = sum(len(pattern.findall(ocr)) for pattern in PATTERNS.values())
                item["sampled_pages"] += 1
                if native_han: item["native_chinese_sampled"] += 1
                if ocr_han: item["ocr_chinese_sampled"] += 1
                if ocr_storm: item["ocr_storm_sampled"] += 1
                if ocr_han or ocr_storm:
                    hits.append({"pdf": str(p), "page": pageidx + 1,
                        "native_han_count": native_han, "ocr_han_count": ocr_han,
                        "ocr_han_runs": " | ".join(ocr_runs[:15]),
                        "ocr_storm_count": ocr_storm,
                        "ocr_excerpt": " ".join(ocr.split())[:700],
                        "review_status": "candidate_unverified"})
    except Exception as e:
        item["error"] = str(e)[:250]
        errors.append(item)
    files.append(item)
    if index % 10 == 0 or index == len(pdfs):
        print(f"OCR_PROGRESS group={GROUP} files={index}/{len(pdfs)} images={sum(v['sampled_pages'] for v in files)} hits={len(hits)}", flush=True)

def write_csv(name, rows, columns):
    with open(OUT / name, "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)

write_csv("file_summary.csv", files, ["pdf","sampled_pages","native_chinese_sampled","ocr_chinese_sampled","ocr_storm_sampled","error"])
write_csv("ocr_candidates.csv", hits, ["pdf","page","native_han_count","ocr_han_count","ocr_han_runs","ocr_storm_count","ocr_excerpt","review_status"])
write_csv("errors.csv", errors, ["pdf","error"])
summary = {
    "group": GROUP, "pdf_paths":len(pdfs),
    "files_scanned":len(files)-len(errors), "pages_sampled":sum(v["sampled_pages"] for v in files),
    "candidate_pages":len(hits),
    "pdfs_with_ocr_chinese_candidates":sum(v["ocr_chinese_sampled"] > 0 for v in files),
    "pdfs_with_ocr_storm_candidates":sum(v["ocr_storm_sampled"] > 0 for v in files),
    "ocr_chinese_candidate_pages":sum(v["ocr_chinese_sampled"] for v in files),
    "ocr_storm_candidate_pages":sum(v["ocr_storm_sampled"] for v in files),
    "errors":len(errors),
    "method":"First two + middle + last two pages of each PDF, OCR eng+chi_sim at up to 120 dpi.",
    "limitations":"Candidate OCR may be false positives and includes already-extractable text. No image/logo classifier; graphics require manual validation. Un-sampled pages not inspected by OCR. Original PDFs not modified."
}
(OUT/"summary.json").write_text(json.dumps(summary,indent=2,ensure_ascii=False),encoding="utf8")
print("VISUAL_OCR_SUMMARY="+json.dumps(summary,ensure_ascii=False),flush=True)
