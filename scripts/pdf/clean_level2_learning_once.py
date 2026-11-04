#!/usr/bin/env python3
"""Controlled Level 2 Learning-only PDF cleanup; preserve other levels and Building manuals."""
from pathlib import Path
from collections import Counter
import re, json, tempfile, shutil
import fitz

ROOT=Path("public/Level 2/Learning")
WORK=Path("/tmp/bsr-level2-clean")
OUT=WORK/"output"
OUT.mkdir(parents=True,exist_ok=True)
BRAND=re.compile(r"intelligen(?:t|ce)?\s+storm|smart\s+storm",re.I)
CJK=re.compile(r"[\u3400-\u9fff\uf900-\ufaff]")
LOGO_SIZES={(586,178),(1086,268)}
TURQUOISE=(97/255,195/255,208/255)
TARGET_FONTS=("MS-Gothic","MicrosoftJhengHei","MicrosoftYaHei")
reports=[]
# Source pages with invisible Chinese glyphs geometrically overlapping English.
# Redacting these removes visible educational words. Preserve them unchanged;
# record explicit selectable-CJK exceptions instead of destroying lesson text.
CJK_EXCEPTIONS={
 "Biomimicry/Chimpanzees.pdf": {13},
 "Foundational Robots/Hammer robot.pdf": {21},
 "Foundational Robots/The treadmill.pdf": {17},
 "Manipulators/Cliff walk.pdf": {11},
 "Manipulators/Ferris wheel.pdf": {20},
 "Manipulators/Round-trip transportation.pdf": {14},
 "Mechanisms and Concepts/Animal trap.pdf": {16},
 "Mechanisms and Concepts/Headlights.pdf": {13},
}
# Covers whose source has duplicate/overlapping brand paragraph text objects.
# Rebuild the white text-only body once; keep image-rich turquoise art untouched.
COVER_BODY_REWRITES={
 "Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf",
 "Mechanisms & Simulators/Crane/Crane_Powerpoint.pdf",
 "Mechanisms & Simulators/Door/Door_Powerpoint.pdf",
 "Mechanisms & Simulators/Gearbox/Gearbox_Powerpoint.pdf",
 "Vehicles & Complex Movers/Lifting door/Lifting door_Powerpoint.pdf",
}

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
        if index+1 in CJK_EXCEPTIONS.get(relative.as_posix(),set()):
            continue
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

def new_text(t,typ):
    # Preserve Joinmax, ZMROBO, and other non-target manufacturer attribution.
    s=t.strip()
    if typ=="heading":return "Learning Series"
    if typ=="closing":return "BE STEM READY"
    if s.lower() in ("intelligence storm","intelligent storm","smart storm"):
        return "BE STEM READY"
    s=re.sub(r"(?i)the\s+intelligen(?:t|ce)\s+storm\s+set", "This robotics kit",s)
    s=re.sub(r"(?i)intelligen(?:t|ce)\s+storm", "this robotics kit",s)
    s=re.sub(r"(?i)smart\s+storm", "this robotics kit",s)
    if s.startswith("this robotics kit"):s="This"+s[4:]
    return s

def cover_and_brand(pg, page_num, total):
    events=[]
    candidates=[]
    for sp in list(original_spans(pg)):
        t=sp["text"]
        if not BRAND.search(t):continue
        if re.search(r"copyright|©|all rights reserved|licen[sc]e",t,re.I):continue
        label="heading" if page_num==1 and ("series" in t.lower() or t.strip().lower()=="intelligence storm") and sp["bbox"][1]<220 else ("closing" if page_num==total and "storm" in t.lower() and sp["bbox"][1]<420 else "intro")
        replacement=new_text(t,label)
        color=TURQUOISE if label in ("heading","closing") else (1,1,1)
        rect=fitz.Rect(sp["bbox"])+(-1,-.2,1,.2)
        candidates.append((sp,rect,replacement,color,label))
    for sp,r,new,bg,typ in candidates:
        pg.add_redact_annot(r,fill=bg,cross_out=False)
    if candidates:
        pg.apply_redactions(images=0,graphics=0,text=0)
    for sp,r,new,bg,typ in candidates:
        if new:
            size=sp["size"]
            font="tibo" if "bold" in sp["font"].lower() else "tiro"
            available=max(80,min(pg.rect.width-25-sp["origin"][0],sp["bbox"][2]-sp["bbox"][0]+15))
            width=fitz.get_text_length(new,fontname=font,fontsize=size)
            if width>available:size*=available/width
            if typ=="intro":size=min(sp["size"],max(10,size))
            v=sp["color"]; color=tuple((v>>j &255)/255 for j in (16,8,0))
            pg.insert_text(sp["origin"],new,fontname=font,fontsize=size,color=color,overlay=True)
        events.append((page_num,typ))
    # Some closing logos have the name split into adjacent spans.
    if BRAND.search(pg.get_text()):
        for block in pg.get_text("dict")["blocks"]:
            for line in block.get("lines",[]):
                spans=line["spans"]
                if len(spans)<2:continue
                complete="".join(sp["text"] for sp in spans)
                if not BRAND.search(complete):continue
                area=fitz.Rect(spans[0]["bbox"])
                for sp in spans[1:]:area|=fitz.Rect(sp["bbox"])
                area+=(-1.3,-.4,1.3,.4)
                first=spans[0]
                pg.add_redact_annot(area,fill=TURQUOISE,cross_out=False)
                pg.apply_redactions(images=0,graphics=0,text=0)
                pg.insert_text(first["origin"],"BE STEM READY",fontname="tibo",fontsize=first["size"],color=(1,1,1))
                events.append((page_num,"split-brand"))
    return events

def hello_world_task(doc):
    # These two panels were translated in the previously approved test.
    p=doc[7]
    hits=p.search_for("Display Chinese characters")
    if hits:
        rect=fitz.Rect(73,241,647,304)
        p.add_redact_annot(rect,fill=(1,1,1),cross_out=False)
        p.apply_redactions(images=0,graphics=0,text=0)
        p.insert_text((73.776,257.47),'Display "Welcome!" on the second line of the screen',fontsize=15.96,fontname="tiro",color=(0,0,0))
    p=doc[10]
    for r in p.search_for("你好世界"):
        p.add_redact_annot(r+(-1,-1,1,1),fill=(1,1,1),cross_out=False)
    p.apply_redactions(images=0,graphics=0,text=0)
    p.insert_text((211.27,168.05),"Welcome!",fontsize=12,fontname="tiro",color=(0,0,0))

def restore_branded_cover_body(doc, relative):
    """Replace only the plain-white body of five verified cover layouts.

    The source PDFs contain overlapping/duplicate original brand text streams
    that the prior span-by-span redactor damaged. Redact only text (not images,
    vector art or backgrounds) in the lower white paragraph area, then render
    a single neutral English description retaining all educational details
    and the original Joinmax manufacturer attribution.
    """
    if relative.as_posix() not in COVER_BODY_REWRITES:
        return
    p=doc[0]
    area=fitz.Rect(0,280,960,540)
    p.add_redact_annot(area,fill=False,cross_out=False)
    p.apply_redactions(images=0,graphics=0,text=0)
    description=(
        "This robotics kit is a building block programming robot research and development by Joinmax. "
        "The kit is equipped with various sensors such as sound sensitivity, color sensor, touch sensor, "
        "photoelectric sensor, color light, ultrasonic, camera and many building blocks parts. "
        "Students can build various building block robots with their imagination, and use graphical "
        "programming software to program the robot and experience the joy of hands-on creation."
    )
    area=fitz.Rect(40,290,920,528)
    for size in (21,20,19,18):
        remainder=p.insert_textbox(area,description,fontsize=size,fontname="tiro",
                                   lineheight=1.2,color=(0,0,0),overlay=True)
        if remainder>=0:
            return
    raise RuntimeError("Could not safely typeset cover paragraph: "+relative.as_posix())


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
    if str(rel).startswith("Display & Movement/Hello World/"):
        hello_world_task(doc)
    for index,pg in enumerate(doc):
        events+=cover_and_brand(pg,index+1,len(doc))
    restore_branded_cover_body(doc,rel)
    # Preserve legible instructional cover paragraphs; these two had overlapping
    # old title paragraphs in the approved preview.
    if str(rel) in (
       "Autonomous Navigation & Ranging/Acceleration car/Acceleration car_Powerpoint.pdf",
       "Sensor-Focused Robots/Gyro transmitter/Gyro transmitter_Powerpoint.pdf"):
        p=doc[0]
        p.draw_rect(fitz.Rect(0,270,960,540),fill=(1,1,1),color=None,overlay=True)
        body=("This building-block robotics course introduces sensors and visual programming. "
              "Students can construct robots with the provided parts, then program their "
              "movements and behavior using a graphical coding environment.")
        assert p.insert_textbox(fitz.Rect(40,293,920,470),body,fontname="tiro",fontsize=23,lineheight=1.35,color=(0,0,0),overlay=True)>=0
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
    hits=[]
    for i,p in enumerate(check):
        if BRAND.search(p.get_text()):hits.append(i+1)
        if CJK.search(p.get_text()) and (i+1 not in CJK_EXCEPTIONS.get(rel.as_posix(),set())):
            hits.append(i+1)
        for im in p.get_images(full=True):
            if (im[2],im[3]) in LOGO_SIZES:hits.append(i+1)
    assert not hits,(str(rel),hits)
    assert len(check)==total
    check.close()
    return {"path":str(rel),"pages":total,"changed":len(events),"removed_logos":len(logo_ids),
            "preserved_cjk_exception_pages":sorted(CJK_EXCEPTIONS.get(rel.as_posix(),set()))}

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
