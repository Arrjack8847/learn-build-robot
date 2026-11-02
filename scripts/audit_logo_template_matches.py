#!/usr/bin/env python3
"""Read-only similarity matcher for verified Intelligence Storm logo layouts.
Does not alter PDF pages; only finds five known recurring raster templates.
"""
from pathlib import Path
import csv, json, os, re, time
import fitz
import numpy as np
import cv2

GROUP=os.environ["AUDIT_GROUP"]
OUT=Path("logo-match-results")/GROUP.replace(" ","_")
OUT.mkdir(parents=True,exist_ok=True)
refs={
 "dark_cover_large":("public/Level 1/Learning/Display & Movement/Hello World/01.Hello World-Slides.pdf",0,(310,140,833,333)),
 "dark_footer_gray":("public/Level 3/Learning/Characters & Structures/Electric Fan/05.Electric Fan-Slides.pdf",-1,(650,449,992,560)),
 "dark_footer_ai":("public/Level 1/Learning/Display & Movement/Hello World/01.Hello World-Slides.pdf",-1,(650,449,992,560)),
 "white_title_black":("public/Level 4/Automation & Security/Tag Recognition/06. Tag Recognition.pdf",0,(134,190,342,270)),
 "yellow_footer_white":("public/Level 4/Automation & Security/Tag Recognition/06. Tag Recognition.pdf",-1,(755,491,975,560)),
}
def normalized(page):
    width=page.rect.width
    pix=page.get_pixmap(matrix=fitz.Matrix(1000/width,1000/width),alpha=False)
    g=np.frombuffer(pix.samples,np.uint8).reshape((pix.height,pix.width,pix.n))
    if g.shape[-1]==4:g=cv2.cvtColor(g,cv2.COLOR_RGBA2GRAY)
    elif g.shape[-1]==3:g=cv2.cvtColor(g,cv2.COLOR_RGB2GRAY)
    return cv2.resize(g,(1000,563),interpolation=cv2.INTER_AREA)
templates={}
for label,(p,pg,b) in refs.items():
    with fitz.open(p) as doc:
       img=normalized(doc[pg])
    x1,y1,x2,y2=b
    templates[label]=(img[y1:y2,x1:x2],b)
pdfs=sorted(Path('public').rglob('*.pdf'))+sorted(Path('curriculum-source').rglob('*.pdf'))
def by_group(path):
    m=re.search(r'(?:^|/)Level[ -]?([1-6])(?:/|$)',path.as_posix(),re.I)
    return f'Level {m[1]}' if m else 'Other'
selected=[x for x in pdfs if by_group(x)==GROUP]
pages=[];file_rows=[];errors=[];start=time.time()
for i,p in enumerate(selected,1):
    count=0;tested=0;error=''
    try:
      with fitz.open(p) as doc:
        for n,page in enumerate(doc,1):
          if abs(page.rect.width/page.rect.height-16/9)>.11:continue
          a=normalized(page)
          if a.shape!=(563,1000):continue
          tested+=1
          for label,(templ,b) in templates.items():
            x1,y1,x2,y2=b
            x1s=max(0,x1-40);y1s=max(0,y1-40)
            x2s=min(1000,x2+40);y2s=min(563,y2+40)
            region=a[y1s:y2s,x1s:x2s]
            if templ.shape[0]>region.shape[0] or templ.shape[1]>region.shape[1]:continue
            score=float(cv2.minMaxLoc(cv2.matchTemplate(region,templ,cv2.TM_CCOEFF_NORMED))[1])
            if score>=.90:
              pages.append({"pdf":p.as_posix(),"page":n,"template":label,
                   "similarity_score":round(score,4),"review_status":"template_match_candidate"})
              count+=1
    except Exception as e:
      error=str(e)[:240];errors.append({"pdf":p.as_posix(),"error":error})
    file_rows.append({"pdf":p.as_posix(),"pages_tested":tested,"matching_templates":count,"error":error})
    if i%10==0 or i==len(selected):
      print(f"LOGO_PROGRESS {GROUP} files={i}/{len(selected)} tested={sum(x['pages_tested'] for x in file_rows)} candidate_matches={len(pages)} elapsed_s={round(time.time()-start)}",flush=True)
def write(name,data,keys):
    with (OUT/name).open("w",newline="",encoding="utf-8-sig") as f:
      w=csv.DictWriter(f,fieldnames=keys);w.writeheader();w.writerows(data)
write("logo_matches.csv",pages,["pdf","page","template","similarity_score","review_status"])
write("files.csv",file_rows,["pdf","pages_tested","matching_templates","error"])
write("errors.csv",errors,["pdf","error"])
summary={"group":GROUP,"pdfs":len(selected),"pages_tested":sum(x["pages_tested"] for x in file_rows),
         "matches":len(pages),"matched_pdf_count":len(set(x["pdf"] for x in pages)),
         "errors":len(errors),"elapsed_s":round(time.time()-start),
         "limitations":"High-confidence similarity to five verified templates only. Other logo shapes/sizes or page ratios may be missed. Does not change source PDFs."}
(OUT/"summary.json").write_text(json.dumps(summary,indent=2),encoding="utf8")
print("LOGO_MATCH_SUMMARY="+json.dumps(summary),flush=True)
