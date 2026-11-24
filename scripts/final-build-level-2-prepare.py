#!/usr/bin/env python3
"""Level 2 source-faithful image preparation. Never approves by itself.
Requires pymupdf and Pillow. Fetches hosted Building PDFs into a temporary
workspace and writes only cropped model WebPs plus source evidence.
"""
import argparse
import concurrent.futures
import hashlib
import io
import json
import urllib.request
from pathlib import Path
import pymupdf
from PIL import Image, ImageChops

MANUAL_INDICES = (1,2,3,4,5,6,7,10,11,12,20,21,22,23,24,36,37,38,39,40,41,42,43,44,47,48,54,55,56,57)
VARIANT_REVIEW_IDS = {"level-2-jumping-machine", "level-2-hand-crank"}
def sha256(data): return hashlib.sha256(data).hexdigest()
def gh_sha1(data):
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\x00" + data).hexdigest()
def load_json(url):
    with urllib.request.urlopen(url, timeout=45) as response:
        return json.load(response)
def download(item):
    row, directory = item
    src = row["source"]
    req = urllib.request.Request(src["url"], headers={"User-Agent":"Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=65) as response: raw = response.read()
    if not raw.startswith(b"%PDF"): raise ValueError("Not PDF: " + row["variantId"])
    path = directory / (row["variantId"] + ".pdf")
    path.write_bytes(raw)
    with pymupdf.open(stream=raw, filetype="pdf") as pdf:
        pages = pdf.page_count
        cjk = sum(any(0x3400 <= ord(ch) <= 0x9fff for ch in p.get_text()) for p in pdf)
    expected=src.get("sha256")
    if expected and expected != sha256(raw): raise ValueError("PDF hash changed: " + row["variantId"])
    previous=src.get("priorEvidence")
    if previous and gh_sha1(raw) != previous["gitBlobSha1"]:
        raise ValueError("Historic Git object SHA mismatch: " + row["variantId"])
    return {"variantId":row["variantId"],"pdfSha256":sha256(raw),"gitBlobSha1":gh_sha1(raw),
            "pageCount":pages,"byteCount":len(raw),"cjkExtractablePages":cjk}
def pick_image(pdf, id):
    page=pdf[-1]
    choices=[]
    for record in page.get_image_info(xrefs=True):
        x=record.get("xref") or 0
        x0,y0,x1,y1=record["bbox"]; w=x1-x0;h=y1-y0
        if x and w>90 and h>80 and w*h<page.rect.width*page.rect.height*0.8 and record["width"]>=250 and record["height"]>=250:
            choices.append((w*h,record))
    choices.sort(key=lambda x:x[0], reverse=True)
    if not choices: raise ValueError("No distinct finished-model image on final page: " + id)
    index=1 if id in VARIANT_REVIEW_IDS else 0
    obj=choices[index][1]
    bbox=pymupdf.Rect(*obj["bbox"])
    xref=obj["xref"]
    if id=="level-2-hand-crank":
        bbox=bbox+pymupdf.Rect(-3,-3,3,3)
        pix=page.get_pixmap(matrix=pymupdf.Matrix(2.2,2.2),clip=bbox,alpha=False)
        im=Image.frombytes("RGB",(pix.width,pix.height),pix.samples)
        xref=None
        method="pixel-crop-from-original-rendered-PDF-page"
    else:
        raw=pdf.extract_image(xref)["image"]
        im=Image.open(io.BytesIO(raw)).convert("RGB")
        maskxref={x[0]:x[1] for x in page.get_images(full=True)}.get(xref)
        if maskxref:
            m=Image.open(io.BytesIO(pdf.extract_image(maskxref)["image"])).convert("L")
            if m.size!=im.size: m=m.resize(im.size)
            im.putalpha(m)
        method="original-embedded-PDF-image"
    if im.mode=="RGB":
        diff=ImageChops.difference(im,Image.new("RGB",im.size,"white")).convert("L").point(lambda n:255 if n>24 else 0)
        box=diff.getbbox()
        if box:
            pad=max(12,int(max(im.size)*0.04))
            box=(max(0,box[0]-pad),max(0,box[1]-pad),min(im.width,box[2]+pad),min(im.height,box[3]+pad))
            if box[2]-box[0]>im.width*0.2 and box[3]-box[1]>im.height*0.2: im=im.crop(box)
    return im, {"pdfPage":len(pdf),"pdfImageXref":xref,"pdfCrop":[round(x,1) for x in bbox], "sourceMethod":method}
def output_webp(original):
    candidates=[]
    for edge,quality in ((800,64),(720,50),(660,41),(610,34)):
        im=original.copy()
        im.thumbnail((edge,edge),Image.Resampling.LANCZOS)
        if im.width<320 or im.height<200: continue
        f=io.BytesIO(); im.save(f,format="WEBP",quality=quality,method=2)
        data=f.getvalue()
        candidates.append((data,im.size,quality))
        if len(data)<=23000: break
    if not candidates: raise ValueError("Unable to reach minimum WebP resolution")
    return next((x for x in candidates if len(x[0])<=23000), min(candidates,key=lambda x:len(x[0])))
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--branch",default="feat/final-build-level-2")
    parser.add_argument("--output",default="/tmp/level2")
    parser.add_argument("--only-uncommitted",action="store_true")
    args=parser.parse_args()
    root=Path(args.output); (root/"pdfs").mkdir(parents=True,exist_ok=True)
    (root/"images").mkdir(exist_ok=True); (root/"chunks").mkdir(exist_ok=True)
    url="https://raw.githubusercontent.com/Arrjack8847/learn-build-robot/"+args.branch+"/src/data/finalBuild/level-2-audit.json"
    variants=load_json(url)["variants"]
    if len(variants)!=60:raise ValueError("Unexpected variant count")
    chosen=[variants[i-1] for i in MANUAL_INDICES]
    if args.only_uncommitted:
        already={"level-2-mechanical-dog","level-2-tongs","level-2-jumping-machine","level-2-scaling-ladder","level-2-tower-crane","level-2-manual-flashlight","level-2-rotating-flying-chair","level-2-see-saw-v1","level-2-see-saw-v2","level-2-bridge","level-2-door"}
        chosen=[r for r in chosen if r["variantId"] not in already]
    with concurrent.futures.ThreadPoolExecutor(max_workers=9) as pool:
        docs=list(pool.map(download,[(r,root/"pdfs") for r in chosen]))
    evidence=[]
    for row,source in zip(chosen,docs):
        id=row["variantId"]
        with pymupdf.open(root/"pdfs"/(id+".pdf")) as pdf:
            photo,detail=pick_image(pdf,id)
        raw,(width,height),quality=output_webp(photo)
        target=root/"images"/(id+".webp");target.write_bytes(raw)
        with Image.open(target) as check:
            check.load()
            assert check.format=="WEBP" and (check.width,check.height)==(width,height)
        folder=root/"chunks"/id; folder.mkdir(exist_ok=True)
        for offset in range(0,len(raw),1440):
            (folder/(f"{offset//1440:04d}.bin")).write_bytes(raw[offset:offset+1440])
        evidence.append({**source,**detail,"variantId":id,"filename":id+".webp",
                         "width":width,"height":height,"webpSha256":sha256(raw),
                         "webpBytes":len(raw),"webpQuality":quality,
                         "chunks":(len(raw)+1439)//1440})
    (root/"evidence.json").write_text(json.dumps(evidence,indent=2))
    print(json.dumps({"completed":len(evidence),"images":[{"id":x["variantId"],"chunks":x["chunks"],"webpBytes":x["webpBytes"]} for x in evidence]}))
if __name__=="__main__":main()
