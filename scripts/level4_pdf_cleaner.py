import fitz, re, json, tempfile, os
from pathlib import Path
import numpy as np

ROOT = Path("app/public/Level 4")
CHINESE = re.compile(r"[\u3400-\u9fff]")
BRANDING = re.compile(r"intelligen(?:ce|t)\s*storm", re.I)
TARGET_LOGOS = {(586, 178), (1086, 268)}
BT = re.compile(rb"\bBT\b.*?\bET\b", re.S)
FONT = re.compile(rb"/([A-Za-z_0-9]+)\s+[-+0-9.]+\s+Tf")

def cjk_font_keys(page):
    names = set()
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                if CHINESE.search(span["text"]):
                    names.add(span["font"])
    keys = set()
    for f in page.get_fonts(full=True):
        if any(name in f[3] for name in names):
            keys.add(f[4].encode("ascii"))
    if names and not keys:
        raise RuntimeError("CJK font resources not found")
    return keys

def strip_cjk_stream(doc, page):
    keys = cjk_font_keys(page)
    if not keys:
        return 0
    removed = 0
    for xref in page.get_contents():
        stream = doc.xref_stream(xref)
        def sub(match):
            nonlocal removed
            fonts = set(FONT.findall(match.group(0)))
            if fonts & keys:
                if fonts - keys:
                    raise RuntimeError("Chinese and English font mixed in one text block")
                removed += 1
                return b"\n"
            return match.group(0)
        fixed = BT.sub(sub, stream)
        if fixed != stream:
            doc.update_stream(xref, fixed, compress=True)
    return removed

def brand_blocks(page):
    return [(fitz.Rect(b[:4]), b[4]) for b in page.get_text("blocks")
            if len(b) > 4 and BRANDING.search(b[4])]

def replace_cover(page):
    hits = page.search_for("Intelligence Storm - Series")
    if len(hits) != 1:
        raise RuntimeError("Unexpected cover: cannot isolate brand title")
    h = hits[0]
    paras = [(fitz.Rect(b[:4]), b[4]) for b in page.get_text("blocks")
             if 290 <= b[1] <= 515 and str(b[4]).strip()]
    if not paras:
        raise RuntimeError("Missing cover description")
    p = fitz.Rect(min(r.x0 for r,t in paras), min(r.y0 for r,t in paras),
                  max(r.x1 for r,t in paras), max(r.y1 for r,t in paras))
    if h.x0 < 20 or h.x1 > 670 or h.y1 > 180 or p.y1 > 535:
        raise RuntimeError("Unsafe cover geometry")
    page.add_redact_annot(fitz.Rect(max(0,h.x0-2),h.y0-1,min(680,h.x1+2),h.y1+1),fill=False,cross_out=False)
    page.add_redact_annot(fitz.Rect(max(0,p.x0-4),p.y0-3,min(page.rect.x1,p.x1+4),p.y1+2),fill=False,cross_out=False)
    page.apply_redactions(images=0,graphics=0,text=0)
    size = 42 if h.height > 55 else 39
    page.insert_text((h.x0,h.y1-8),"Robotics Learning Series",
                     fontname="times-roman",fontsize=size,color=(1,1,1),overlay=True)
    manufacturer = "ZMRobo" if "ZMRobo" in " ".join(t for r,t in paras) else "Joinmax"
    desc = ("This robotics kit, developed by " + manufacturer +
            ", combines building blocks, software, and sensors to create interactive machines.")
    space = page.insert_textbox(fitz.Rect(65 if p.x0>60 else 55,p.y0-4,929,min(524,p.y0+130)),
                     desc,fontname="times-roman",fontsize=22.5,
                     lineheight=1.28,color=(.16,.16,.16),overlay=True)
    if space < -0.01:
        raise RuntimeError("Cover description did not fit")
    return 2

def remove_end_brand(page):
    matches = brand_blocks(page)
    removed = 0
    for r, t in matches:
        if not 175 <= r.y0 <= 340:
            raise RuntimeError("Unexpected closing brand position")
        page.add_redact_annot(fitz.Rect(r.x0-2,r.y0-2,r.x1+2,r.y1+2),fill=False,cross_out=False)
        page.apply_redactions(images=0,graphics=0,text=0)
        removed += 1
    return removed

def process(path):
    original = fitz.open(path)
    pages = len(original)
    sizes = [tuple(p.rect) for p in original]
    logo_xrefs = set()
    for p in original:
        for im in p.get_images(full=True):
            if (im[2],im[3]) in TARGET_LOGOS:
                logo_xrefs.add(im[0])
    for xref in logo_xrefs:
        original[0].delete_image(xref)
    cjk_removed = 0
    brand_ops = 0
    for number,page in enumerate(original):
        cjk_removed += strip_cjk_stream(original,page)
        matches = brand_blocks(page)
        if not matches:
            continue
        if number == 0:
            brand_ops += replace_cover(page)
        elif number == pages-1:
            brand_ops += remove_end_brand(page)
        else:
            raise RuntimeError("Unexpected brand text in lesson body")
    fd,tmp = tempfile.mkstemp(suffix=".pdf",dir=path.parent)
    os.close(fd)
    try:
        original.save(tmp, garbage=4,deflate=True)
        original.close()
        result=fitz.open(tmp)
        if len(result)!=pages or [tuple(p.rect) for p in result]!=sizes:
            raise RuntimeError("Page count or dimensions changed")
        for p in result:
            text=p.get_text()
            if CHINESE.search(text) or BRANDING.search(text):
                raise RuntimeError("Remaining Chinese or branded text")
            p.get_pixmap(matrix=fitz.Matrix(.13,.13),alpha=False)
        result.close()
        os.replace(tmp,path)
    finally:
        if os.path.exists(tmp):os.remove(tmp)
    return dict(path=str(path.relative_to(Path("app"))),pages=pages,
                cjk_text_objects_removed=cjk_removed,logo_resources_removed=len(logo_xrefs),
                brand_text_operations=brand_ops)

def main():
    files=sorted(x for x in ROOT.rglob("*.pdf") if "Building" not in x.relative_to(ROOT).parts)
    assert len(files)==56, ("Expected 56 Level 4 Learning PDFs",len(files))
    results=[]
    for index,path in enumerate(files,1):
        record=process(path)
        results.append(record)
        print("CLEANED",index,"/",len(files),record,flush=True)
    assert sum(x["pages"] for x in results)==1346
    out=Path("level4-clean-report.json")
    out.write_text(json.dumps({"main_start":"b52b9cca94269e30d00024c87e746cec51a55234",
            "summary":{"documents":len(results),"pages":sum(x["pages"] for x in results),
              "cjk_text_objects_removed":sum(x["cjk_text_objects_removed"] for x in results),
              "image_logo_resources_removed":sum(x["logo_resources_removed"] for x in results)},
            "files":results},indent=2))
    print("ALL_LEVEL4_CLEANED 56 PDFs, 1346 pages",flush=True)

if __name__=="__main__":
    main()
