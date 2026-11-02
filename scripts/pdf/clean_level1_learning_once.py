#!/usr/bin/env python3
"""Controlled Level 1 Learning-only PDF cleanup; no Building/other level edits."""
from pathlib import Path
from collections import Counter
import re, json, tempfile, shutil
import fitz
from pypdf import PdfReader
from pypdf.generic import ContentStream

ROOT=Path("public/Level 1/Learning")
WORK=Path("/tmp/bsr-level1-clean")
OUT=WORK/"output"
OUT.mkdir(parents=True,exist_ok=True)
BRAND=re.compile(r"intelligen(?:t|ce)?\\s+storm|smart\\s+storm|joinmax",re.I)
CJK=re.compile(r"[\\u3400-\\u9fff]")
LOGO_SIZES={(586,178),(1086,268)}
TURQUOISE=(97/255,195/255,208/255)
TARGET_FONTS=("MS-Gothic","MicrosoftJhengHei","MicrosoftYaHei")
reports=[]

def original_spans(pg):
    for block in pg.get_text("dict")["blocks"]:
        for line in block.get("lines",[]):
            for sp in line["spans"]:
                yield sp

def remove_chinese_font_content(src,relative):
    if str(relative).startswith("Display & Movement/Hello World/"):
        return src
    check=fitz.open(src)
    if not any(CJK.search(p.get_text()) for p in check):
        check.close()
        return src
    reader=PdfReader(str(src))
    touched=0
    for index,page in enumerate(reader.pages):
        if not CJK.search(check[index].get_text()):continue
        fontkeys=[]
        for key,ref in page.get("/Resources",{}).get("/Font",{}).items():
            base=str(ref.get_object().get("/BaseFont","")).lower()
            if any(n.lower() in base for n in TARGET_FONTS):fontkeys.append(key)
        if not fontkeys:continue
        contents=check[index].get_contents()
        if len(contents)!=1:continue
        stream=ContentStream(page.get_contents(),reader)
        ops=[];font=None
        for args,op in stream.operations:
            if op==b"BT":font=None
            if op==b"Tf":font=args[0]
            if op in (b"Tj",b"TJ",b"'",b'"') and font in fontkeys:
                touched+=1
            else:ops.append((args,op))
        if touched:
            stream.operations=ops
            check.update_stream(contents[0],stream.get_data(),compress=True)
    if not touched:
        check.close()
        return src
    name=WORK/"surgical"/relative
    name.parent.mkdir(parents=True,exist_ok=True)
    check.save(name,garbage=4,deflate=True)
    check.close()
    return name

def new_text(t,typ):
    s=t.strip(); lower=s.lower()
    if typ=="heading":return "Learning Series"
    if typ=="closing":return "BE STEM READY"
    if "joinmax" in lower and lower.rstrip(".")=="joinmax":return ""
    if "intelligence storm is equipped" in lower:
        return re.sub(r"intelligence storm is equipped with","The robotics kit includes",t,flags=re.I)
    if lower.startswith("the intelligence storm set is"):
        return "This building-block robotics kit supports hands-on learning. It builds the"
    if "intelligence storm is a building block programming robot research" in lower:
        return "This building-block programming kit introduces robotics and sensors."
    if "storm is a building block programming robot" in lower:
        return "This is a building-block programming robotics kit. The kit"
    if lower in ("intelligence storm","intelligence storm - series","intelligence storm series","smart storm - series"):
        return "BE STEM READY"
    return BRAND.sub("the robotics kit",t)

def cover_and_brand(pg, page_num, total):
    events=[]
    candidates=[]
    for sp in list(original_spans(pg)):
        t=sp["text"]
        if not BRAND.search(t):continue
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
            if typ=="intro":size=max(14,size)
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
    for key,val in list(metadata.items()):
        if isinstance(val,str) and BRAND.search(val):metadata[key]=""
    metadata["title"]=src.stem+" | BE STEM READY Learning"
    metadata["keywords"]="BE STEM READY learning edition"
    doc.set_metadata(metadata)
    dest=OUT/rel;dest.parent.mkdir(parents=True,exist_ok=True)
    doc.save(dest,garbage=4,deflate=True,clean=True)
    total=len(doc); doc.close()
    check=fitz.open(dest)
    hits=[]
    for i,p in enumerate(check):
        if BRAND.search(p.get_text()) or CJK.search(p.get_text()):hits.append(i+1)
        for im in p.get_images(full=True):
            if (im[2],im[3]) in LOGO_SIZES:hits.append(i+1)
    assert not hits,(str(rel),hits)
    assert len(check)==total
    check.close()
    return {"path":str(rel),"pages":total,"changed":len(events),"removed_logos":len(logo_ids)}

def main():
    files=sorted(ROOT.rglob("*.pdf"))
    assert len(files)==45,f"Expected 45 Level 1 Learning PDFs, found {len(files)}"
    for index,file in enumerate(files):
        row=process(file);reports.append(row)
        print(f"{index+1:02d}/45 {row['path']} [{row['pages']} pages]",flush=True)
    assert sum(row["pages"] for row in reports)==852
    (WORK/"report.json").write_text(json.dumps({"files":len(reports),"pages":852,"results":reports},indent=2))
    print("PASS: 45 PDFs, 852 pages, targeted branding/text removed")

if __name__=="__main__":main()
