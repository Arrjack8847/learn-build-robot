#!/usr/bin/env python3
"""Safe Level 2 Learning-only cleanup; preserve English prose and Building manuals.

Text embedded in educational sentences (even if it mentions the former brand)
is protected. Only isolated brand display labels are eligible for replacement.
This script must NOT be used to release PDFs without independent full visual QA.
"""
from pathlib import Path
from collections import Counter
import re, json, tempfile, shutil
import fitz

ROOT=Path("public/Level 2/Learning")
WORK=Path("/tmp/bsr-level2-clean")
OUT=WORK/"output"
OUT.mkdir(parents=True,exist_ok=True)
BRAND=re.compile(r"intelligen(?:t|ce)?\s+storm|smart\s+storm",re.I)
BRAND_ONLY=re.compile(
    r"^\s*(?:intelligen(?:t|ce)?\s+storm|smart\s+storm)"
    r"(?:[\s()\-–—]*series)?\s*$", re.I)

CJK=re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
LOGO_SIZES={(586,178),(1086,268)}
TURQUOISE=(97/255,195/255,208/255)
TARGET_FONTS=("MS-Gothic","MicrosoftJhengHei","MicrosoftYaHei")
reports=[]

def original_spans(pg):
    for block in pg.get_text("dict")["blocks"]:
        for line in block.get("lines",[]):
            for sp in line["spans"]:
                yield sp

def remove_chinese_font_content(src, relative):
    """Remove only visible Han glyphs, never entire Chinese-font text operations.

    Older font-based removal incorrectly erased English (e.g. the "push ups"
    label on Push ups page 7). Locate individual Unicode Han characters via
    raw PDF text extraction and redact only their glyph boxes. Transparent
    redaction preserves original slide backgrounds, images, and English text.
    Any text extraction anomaly is a hard stop, not permission to over-remove.
    """
    if relative.as_posix().startswith("Display & Movement/Hello World/"):
        return src
    doc=fitz.open(src)
    touched=0
    for index,page in enumerate(doc):
        original=page.get_text()
        if not CJK.search(original):
            continue
        target_rects=[]
        for block in page.get_text("rawdict")["blocks"]:
            for line in block.get("lines",[]):
                for span in line.get("spans",[]):
                    for char in span.get("chars",[]):
                        if not CJK.search(char.get("c","")):
                            continue
                        r=fitz.Rect(char["bbox"])
                        if r.is_empty or r.is_infinite:
                            doc.close()
                            raise RuntimeError(f"Invalid Chinese glyph bbox: {src}, page {index+1}")
                        # Tighten glyph box to avoid deleting adjacent Latin
                        # letters (PyMuPDF redacts any character intersecting).
                        margin=min(0.2,r.width*.06,r.height*.06)
                        if margin>0:
                            r=fitz.Rect(r.x0+margin,r.y0+margin,r.x1-margin,r.y1-margin)
                        target_rects.append(r)
        if not target_rects:
            doc.close()
            raise RuntimeError(f"CJK found but glyph positions unavailable: {src}, page {index+1}")
        for r in target_rects:
            page.add_redact_annot(r,fill=False,cross_out=False)
        page.apply_redactions(images=0,graphics=0,text=0)
        if CJK.search(page.get_text()):
            doc.close()
            raise RuntimeError(f"Chinese glyphs remain after selective removal: {src}, page {index+1}")
        touched+=len(target_rects)
    if not touched:
        doc.close()
        return src
    target=WORK/"surgical"/relative
    target.parent.mkdir(parents=True,exist_ok=True)
    doc.save(target,garbage=4,deflate=True)
    doc.close()
    return target

def new_text(t, typ):
    """Replace isolated display branding only; never paraphrase instructional prose."""
    if not BRAND_ONLY.fullmatch(t.strip()):
        return t
    return "Learning Series" if typ == "heading" else "BE STEM READY"

def cover_and_brand(pg, page_num, total):
    """Replace only whole-line standalone brand labels at cover or closing.

    A brand token in a single font span may be inside a sentence split
    across multiple PDF spans. Require the COMPLETE visible line to be
    branding-only before considering any redaction.
    """
    candidates = []
    for block in pg.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            spans = line.get("spans", [])
            if not spans:
                continue
            complete = "".join(sp.get("text", "") for sp in spans).strip()
            if not BRAND_ONLY.fullmatch(complete):
                continue
            if re.search(r"copyright|©|all rights reserved|licen[sc]e", complete, re.I):
                continue
            rect = fitz.Rect(spans[0]["bbox"])
            for sp in spans[1:]:
                rect |= fitz.Rect(sp["bbox"])
            label = ("heading" if page_num == 1 and rect.y0 < 220
                     else "closing" if page_num == total and rect.y0 < 420
                     else None)
            if label is None:
                continue
            candidates.append((spans[0], rect + (-1, -.2, 1, .2), label))

    for first, rect, label in candidates:
        pg.add_redact_annot(rect, fill=TURQUOISE, cross_out=False)
    if candidates:
        pg.apply_redactions(images=0, graphics=0, text=0)

    events = []
    for first, rect, label in candidates:
        new = "Learning Series" if label == "heading" else "BE STEM READY"
        size = first["size"]
        font = "tibo" if "bold" in first["font"].lower() else "tiro"
        available = max(80, min(pg.rect.width - 25 - first["origin"][0],
                                 rect.width + 15))
        width = fitz.get_text_length(new, fontname=font, fontsize=size)
        if width > available:
            size *= available / width
        color_int = first["color"]
        color = tuple((color_int >> shift & 255) / 255 for shift in (16, 8, 0))
        pg.insert_text(first["origin"], new, fontname=font, fontsize=size,
                       color=color, overlay=True)
        events.append((page_num, label))
    return events

def instructional_english(text):
    """Strict prose fingerprint: protect English even if it mentions old brands."""
    parts = []
    for raw in text.splitlines():
        line = raw.strip()
        if not line or BRAND_ONLY.fullmatch(line):
            continue
        if line in ("BE STEM READY", "Learning Series"):
            continue
        line = CJK.sub("", line)
        if line.strip():
            parts.append(line)
    return re.sub(r"\s+", " ", " ".join(parts)).strip()


def process(src):
    rel=src.relative_to(ROOT)
    intermediate=remove_chinese_font_content(src,rel)
    doc=fitz.open(intermediate)
    logo_ids=set()
    for pg in doc:
        for im in pg.get_images(full=True):
            if (im[2],im[3]) in LOGO_SIZES:logo_ids.add(im[0])
    for xref in logo_ids:
        for pg in doc:
            if any(im[0]==xref for im in pg.get_images(full=True)):
                pg.delete_image(xref)
                break
    events=[]
    # Hello World translation edits need separate content approval; leave untouched.
    for index,pg in enumerate(doc):
        events+=cover_and_brand(pg,index+1,len(doc))
    # Never paint over or replace educational cover paragraphs.
    # Acceleration Car and Gyro Transmitter must retain their original English.
    metadata={key:val for key,val in doc.metadata.items() if val is not None}
    # Keep original author, producer, copyright and licensing metadata intact.
    metadata["title"]=src.stem+" | BE STEM READY Learning"
    metadata["keywords"]="BE STEM READY learning edition"
    doc.set_metadata(metadata)
    dest=OUT/rel;dest.parent.mkdir(parents=True,exist_ok=True)
    # Do not normalize/redraw unrelated page content: keep image rendering stable.
    doc.save(dest,garbage=4,deflate=True,clean=False)
    total=len(doc); doc.close()
    check=fitz.open(dest)
    source_check=fitz.open(src)
    for index, (before, after) in enumerate(zip(source_check, check), start=1):
        old_english=instructional_english(before.get_text())
        new_english=instructional_english(after.get_text())
        if old_english != new_english:
            source_check.close()
            check.close()
            raise RuntimeError(
                f"Instructional English regression in {rel} page {index}: "
                f"{old_english[:180]!r} != {new_english[:180]!r}")
    source_check.close()
    hits=[]
    for i,p in enumerate(check):
        if CJK.search(p.get_text()):hits.append(i+1)
        if any(BRAND_ONLY.fullmatch(line.strip()) for line in p.get_text().splitlines()):
            hits.append(i+1)
        for im in p.get_images(full=True):
            if (im[2],im[3]) in LOGO_SIZES:hits.append(i+1)
    assert not hits,(str(rel),hits)
    assert len(check)==total
    check.close()
    return {"path":str(rel),"pages":total,"changed":len(events),"removed_logos":len(logo_ids)}

def main():
    files=sorted(p for p in ROOT.rglob("*.pdf") if "_building_" not in p.name.lower())
    assert len(files)==43,f"Expected 43 eligible Level 2 Learning PDFs, found {len(files)}"
    for index,file in enumerate(files):
        row=process(file);reports.append(row)
        print(f"{index+1:02d}/43 {row['path']} [{row['pages']} pages]",flush=True)
    assert sum(row["pages"] for row in reports)>0
    (WORK/"report.json").write_text(json.dumps({"files":len(reports),"pages":sum(row["pages"] for row in reports),"results":reports},indent=2))
    print("PASS: 43 eligible Level 2 Learning PDFs processed; Building-named fallback excluded")

if __name__=="__main__":main()
