#!/usr/bin/env python3
"""Generate low-resolution indexed contact sheets for every Level 2 source PDF.
Visual research aid only. It does not approve questions automatically.
"""
from __future__ import annotations
from pathlib import Path
import json
import fitz
from PIL import Image, ImageOps, ImageDraw
ROOT = Path(__file__).resolve().parents[4]
AUDIT = Path(__file__).with_name("source-audit.json")
OUT = ROOT / "quiz-research" / "level2-contact-sheets"
OUT.mkdir(parents=True, exist_ok=True)
projects = json.loads(AUDIT.read_text(encoding="utf-8"))["projects"]
cache = {}
for item in projects:
    pid, source = item["projectId"], item["sourcePdfPath"]
    if source not in cache:
        doc = fitz.open(ROOT / source)
        cache[source] = doc
    doc = cache[source]
    chunk_size, cols, rows, w, h = 20, 5, 4, 480, 340
    for base in range(0, doc.page_count, chunk_size):
        sheet = Image.new("RGB", (cols*w, rows*h), "white")
        draw = ImageDraw.Draw(sheet)
        for offset, index in enumerate(range(base, min(base+chunk_size, doc.page_count))):
            page = doc[index]
            rect = page.rect
            scale = min(450/rect.width, 300/rect.height, 1.2)
            pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
            thumb = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            thumb.thumbnail((w-20, h-40), Image.Resampling.LANCZOS)
            x = (offset % cols)*w + (w-thumb.width)//2
            y = (offset // cols)*h + 25
            sheet.paste(thumb, (x,y))
            draw.text(((offset%cols)*w+15, (offset//cols)*h+5), f"{pid} / slide {index+1}", fill="black")
        name = f"{pid}-slides-{base+1:03d}-{min(base+chunk_size, doc.page_count):03d}.jpg"
        sheet.save(OUT/name, "JPEG", quality=70, optimize=True)
    print(pid, doc.page_count, "pages rendered")
for doc in cache.values():
    doc.close()
print("Generated contact sheets in", OUT)
