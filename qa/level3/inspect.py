import json, glob, re
from pathlib import Path
import fitz
from PIL import Image,ImageDraw,ImageFont

out=Path("qa/level3/diagnostic")
out.mkdir(parents=True,exist_ok=True)
l3=sorted(Path("public/Level 3/Learning").rglob("*.pdf"))
l1=sorted(Path("public/Level 1/Learning").rglob("*.pdf"))
print("L3 files",len(l3),"L1 files",len(l1))
def sample(pdf, tag, pages):
  doc=fitz.open(pdf); diag={"source":str(pdf),"pages":len(doc),"checks":[]}
  for j in pages:
    if j>=len(doc): continue
    page=doc[j]; pl=[]
    pix=page.get_pixmap(matrix=fitz.Matrix(1.0,1.0),alpha=False)
    im=Image.frombytes("RGB",(pix.width,pix.height),pix.samples)
    im.thumbnail((850,450))
    im.save(out/f"{tag}-{j+1:02d}.png")
    for b in page.get_text("dict")["blocks"]:
      if "lines" not in b:continue
      for l in b["lines"]:
        for s in l["spans"]:
          t=s["text"].strip()
          if t and (re.search(r"\u4e00|\u3400|storm|joinmax|zhongming",t,re.I) or j in (0,len(doc)-1)):
            pl.append({"text":t[:180],"rect":[round(n,1) for n in s["bbox"]],"font":s["font"],"size":round(s["size"],1),"color":hex(s["color"])})
    imgs=[]
    for x in page.get_images(full=True):
      for r in page.get_image_rects(x[0]):
        imgs.append({"rect":[round(n,1) for n in r],"xref":x[0]})
    diag["checks"].append({"page":j+1,"width":page.rect.width,"height":page.rect.height,"spans":pl[:100],"images":imgs[:80]})
  return diag
rows=[]
rows.append(sample(l3[0],"l3-cyan", [0,1,4,7,11,16]))
rows.append(sample(l3[10],"l3-dark", [0,1,5,33]))
rows.append(sample(l3[15],"l3-white", [1,24,25,26,27]))
rows.append(sample(l3[16],"l3-space", [0,1,10,11]))
# Reference Level 1: try examples of each family.
for i,p in enumerate(l1):
  if i>=8: break
  rows.append(sample(p,f"l1-{i}", [0,min(1,len(fitz.open(p))-1)]))
(out/"diag.json").write_text(json.dumps(rows,indent=2,ensure_ascii=False))
print("done",len(rows),"records")
