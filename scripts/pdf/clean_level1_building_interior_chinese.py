#!/usr/bin/env python3
"""Level 1 Building interior Chinese-text replacement, preserving existing English and artwork.

Scope:
 - 15 manuals: remove duplicate Chinese-only controller question underneath existing
   English lesson/evaluation text (30 interior pages).
 - Little Owl: remove duplicated Chinese heading beneath English heading (pages 17-18).
 - Hand-cranking Fan: remove duplicated Chinese heading beneath English heading (page 3).
 - Oscillating Fan: replace two Chinese part labels with Square hole / Round hole (page 10).

Run from repo root:
  python scripts/pdf/clean_level1_building_interior_chinese.py
  python scripts/pdf/clean_level1_building_interior_chinese.py --write-public

The default writes review copies only. No GitHub Actions or Learning files.
"""
from __future__ import annotations
import argparse, hashlib, json, re, pathlib, os, collections
import pymupdf as fitz
import numpy as np

QUESTION="控制器上的接口除了传递信息还具有什么作用？"
LITTLE="第五课：猫头鹰"
HAND="第三课：手摇风扇"
SQUARE="方孔"
ROUND="圆孔"
CONTROLLER_NAMES={
  "FUNNY CAT.pdf","Ferocious snake.pdf","Shy penguin.pdf","Sled dog.pdf",
  "Athlete.pdf","Basic programming.pdf","Drummer robot.pdf","Sailboat.pdf",
  "The lawn mower.pdf","Car.pdf","Dynamic screen.pdf","Pendulum ride.pdf",
  "Rotating flying chair.pdf","Skating.pdf","The windmill kingdom.pdf"
}
EXTRA={"Little Owl.pdf","Hand-cranking Fan.pdf","Oscillating Fan.pdf"}
TARGETS=CONTROLLER_NAMES|EXTRA

def git_blob_sha(data:bytes)->str:
    return hashlib.sha1(b"blob "+str(len(data)).encode()+bytes([0])+data).hexdigest()

def chinese_chars(t):
    return "".join(c for c in t if (0x3400<=ord(c)<=0x9fff or 0xf900<=ord(c)<=0xfaff))

def render(page):
    pix=page.get_pixmap(alpha=False,colorspace=fitz.csRGB,matrix=fitz.Matrix(1,1))
    return np.frombuffer(pix.samples,dtype=np.uint8).reshape(pix.height,pix.width,3).copy()

def font_spans(page):
    return [s for b in page.get_text("dict")["blocks"] for ln in b.get("lines",[])
            for s in ln["spans"] if chinese_chars(s["text"])]

def patch_stream(doc,page,kind):
    assert len(page.get_contents())==1, "Expected one content stream per target page"
    xref=page.get_contents()[0];raw=doc.xref_stream(xref)
    matches=list(re.finditer(rb"BT.*?ET",raw,flags=re.S))
    assert matches,"No text objects"
    spans=font_spans(page)
    if kind=="question":
        assert len(spans)==2 and ChineseText(page)==chinese_chars(QUESTION),repr([s["text"] for s in spans])
        assert len(matches)>=2
        candidates=[matches[0],matches[1]]
        assert b"/F1 " in candidates[0].group() and b"/F2 " in candidates[1].group(),"Unknown question font layout"
    elif kind=="owl" or kind=="hand":
        assert len(spans)==1 and ChineseText(page)==chinese_chars(LITTLE if kind=="owl" else HAND)
        candidates=[m for m in matches if b"/C2_0 " in m.group()]
        assert len(candidates)==1, "Duplicated header not uniquely isolated"
    elif kind=="fan":
        assert len(spans)==2 and ChineseText(page)==chinese_chars(SQUARE+ROUND),repr([s["text"] for s in spans])
        candidates=[m for m in matches if b"/C0_0 " in m.group()]
        assert len(candidates)==1
        idx=matches.index(candidates[0])
        assert idx+1<len(matches) and b"/" not in matches[idx+1].group()[2:35], "Unexpected second Chinese label"
        candidates.append(matches[idx+1])
    else:
        raise ValueError(kind)
    # Remove only the isolated Chinese PDF text objects, preserving all English
    # content objects and all original embedded graphics and images.
    for m in reversed(candidates):
        raw=raw[:m.start()]+raw[m.end():]
    doc.update_stream(xref,raw)
    return [tuple(s["bbox"]) for s in spans]

def ChineseText(page):return chinese_chars(page.get_text())

def annotate_english(page):
    # Original text baselines: x~191, y~347 and x~194, y~461 points.
    # Font sizes are reduced for longer English strings; adjacent geometry stays untouched.
    color=(35/255,25/255,22/255)
    page.insert_text((191.4,346.72),"Square hole",fontname="helv",fontsize=8.1,color=color,overlay=True)
    page.insert_text((194.4,460.84),"Round hole",fontname="helv",fontsize=8.3,color=color,overlay=True)

def allowed_rects(kind,original_spans):
    if kind=="fan":return [(186,330,268,357),(188,444,267,470)]
    return [(s[0]-8,s[1]-8,s[2]+8,s[3]+8) for s in original_spans]

def diff_validate(before,after,page_idx,kind,bboxes):
    a=render(before[page_idx]);b=render(after[page_idx])
    assert a.shape==b.shape
    diff=np.any(a!=b,axis=2)
    ys,xs=np.where(diff)
    if len(xs)==0:
        assert kind!="fan",f"Expected English component labels to be rendered on {page_idx+1}"
        return 0,None
    keep=np.zeros(diff.shape,dtype=np.bool_)
    for x0,y0,x1,y1 in allowed_rects(kind,bboxes):
        ix0=max(0,int(x0)-1);iy0=max(0,int(y0)-1)
        ix1=min(keep.shape[1],int(x1)+2);iy1=min(keep.shape[0],int(y1)+2)
        keep[iy0:iy1,ix0:ix1]=True
    changed_outside=int(np.count_nonzero(diff&~keep))
    assert changed_outside==0,f"Unexpected artwork/English changes outside Chinese location: {changed_outside}"
    return int(len(xs)),[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]

def repair(source,destination,manifest):
    name=source.name
    assert name in TARGETS
    data=source.read_bytes()
    assert git_blob_sha(data)==manifest[name]["sha"],f"Source SHA mismatch {name}"
    original=fitz.open(stream=data,filetype="pdf")
    doc=fitz.open(stream=data,filetype="pdf")
    target_pages=[]
    for i,p in enumerate(doc):
        text=ChineseText(p)
        if not text:continue
        if name in CONTROLLER_NAMES:kind="question"
        elif name=="Little Owl.pdf":kind="owl"
        elif name=="Hand-cranking Fan.pdf":kind="hand"
        else:kind="fan"
        expected={"question":QUESTION,"owl":LITTLE,"hand":HAND,"fan":SQUARE+ROUND}[kind]
        assert text==chinese_chars(expected),(name,i+1,repr(text),repr(expected))
        bounds=patch_stream(doc,p,kind)
        if kind=="fan":annotate_english(doc[i])
        target_pages.append({"page":i+1,"kind":kind,"bounds":bounds})
    assert target_pages, f"No target interior Chinese in {name}"
    expected_count={"Little Owl.pdf":2,"Oscillating Fan.pdf":1,"Hand-cranking Fan.pdf":1}
    if name in expected_count:assert len(target_pages)==expected_count[name]
    if name in CONTROLLER_NAMES:
        assert all(x["kind"]=="question" for x in target_pages)
        assert all(x["page"]>1 for x in target_pages)
    destination.parent.mkdir(parents=True,exist_ok=True)
    doc.save(destination,garbage=4,deflate=True)
    doc.close()
    newer=fitz.open(destination)
    assert len(original)==len(newer)
    assert all(a.rect==b.rect for a,b in zip(original,newer))
    before_pages={x["page"]:x for x in target_pages}
    changed=0
    for j in range(len(original)):
        if j+1 in before_pages:
            x=before_pages[j+1]
            assert ChineseText(newer[j])=="",(name,j+1,"Chinese remains",ChineseText(newer[j]))
            eng_before=original[j].get_text()
            eng_after=newer[j].get_text()
            # Extract all ASCII-only instructional spans; do not allow changes or removals.
            def ascii_spans(page):
                return [(s["text"],tuple(round(float(v),1) for v in s["bbox"])) 
                    for block in page.get_text("dict")["blocks"] for line in block.get("lines",[])
                    for s in line["spans"] if s["text"].strip() and all(ord(c)<128 for c in s["text"])]
            prev=ascii_spans(original[j]);nexts=ascii_spans(newer[j])
            for e in prev:
                assert e in nexts,(name,j+1,"existing English span changed",e)
            pixels,box=diff_validate(original,newer,j,x["kind"],x["bounds"])
            x.update({"changed_pixels":pixels,"pixel_diff_bbox":box})
            changed+=1
        else:
            assert ChineseText(original[j])==ChineseText(newer[j])
            assert render(original[j]).tobytes()==render(newer[j]).tobytes(),(name,j+1,"untouched page visually changed")
    result={"filename":name,"pages":len(original),"modified_interior_pages":target_pages,
            "source_git_sha":git_blob_sha(data),"output_sha256":hashlib.sha256(destination.read_bytes()).hexdigest(),
            "unchanged_pages":len(original)-changed,"english_spans_preserved":True}
    return result

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--repo",type=pathlib.Path,default=pathlib.Path("."))
    ap.add_argument("--source-dir",type=pathlib.Path,default=None)
    ap.add_argument("--output-dir",type=pathlib.Path,default=None)
    ap.add_argument("--write-public",action="store_true")
    args=ap.parse_args()
    repo=args.repo
    source_dir=args.source_dir or repo/"public"
    output_dir=args.output_dir or repo/"build"/"level1-building-interior-english"
    m=json.loads((repo/"reports"/"level1-building-interior-original-manifest.json").read_text())
    refs={e["filename"]:e for e in m["files"]}
    assert set(refs)==TARGETS and len(refs)==18
    checks=[]
    for name in sorted(TARGETS):
        source=source_dir/name;destination=output_dir/name
        checks.append(repair(source,destination,refs))
        print("PASS",name,len(checks[-1]["modified_interior_pages"]),"pages",flush=True)
    assert sum(len(x["modified_interior_pages"]) for x in checks)==34
    if args.write_public:
        for name in sorted(TARGETS):
            output=(output_dir/name).read_bytes()
            tmp=(source_dir/name).with_suffix(".pdf.tmp")
            tmp.write_bytes(output)
            os.replace(tmp,source_dir/name)
    report={"files":checks,"pdf_count":len(checks),"interior_pages_cleaned":sum(len(x["modified_interior_pages"]) for x in checks)}
    (output_dir/"report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n")
    print("COMPLETE",report["pdf_count"],"FILES",report["interior_pages_cleaned"],"INTERIOR PAGES")

if __name__=="__main__":main()
