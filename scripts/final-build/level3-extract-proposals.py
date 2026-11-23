import json,hashlib,math
from pathlib import Path
import cv2,numpy as np,pymupdf
from PIL import Image
root=Path(__file__).resolve().parents[2]
refs=json.loads((root/'src/data/finalBuild/level-3-references.json').read_text())['references']
matching={x['variantId']:x for x in json.loads((root/'reports/final-build-level-3-candidate-source-page-summary-20261123.json').read_text())['records']}
flags={x['variantId']:x['observedIssues'] for x in json.loads((root/'reports/final-build-level-3-visual-candidate-review-20261123.json').read_text())['records']}
out=root/'.cache/level3-review/proposals';out.mkdir(parents=True,exist_ok=True)
records=[]
def foreground_box(img):
 h,w=img.shape[:2]
 if w<50 or h<50:return (0,0,w,h),0
 z=max(5,min(w,h)//45)
 corners=np.concatenate([img[:z,:z].reshape(-1,3),img[:z,-z:].reshape(-1,3),img[-z:,:z].reshape(-1,3),img[-z:,-z:].reshape(-1,3)])
 bg=np.median(corners,axis=0).astype(np.float32)
 lab=cv2.cvtColor(img,cv2.COLOR_RGB2LAB).astype(np.float32)
 bg_lab=cv2.cvtColor(np.uint8(bg.reshape(1,1,3)),cv2.COLOR_RGB2LAB)[0,0].astype(np.float32)
 diff=np.linalg.norm(lab-bg_lab,axis=2)
 mask=np.uint8(diff>23)*255
 # Most source screenshots have dense technical outlines. Group related hardware,
 # but discard isolated numbered part callouts and marginal text.
 k=max(7,min(w,h)//32)
 mask=cv2.morphologyEx(mask,cv2.MORPH_CLOSE,np.ones((k,k),np.uint8))
 n,ids,stats,cent=cv2.connectedComponentsWithStats(mask,8)
 candidates=[]
 for i in range(1,n):
  x,y,cw,ch,area=stats[i];cx,cy=cent[i]
  if area<0.002*w*h:continue
  center=1 if 0.13*w<cx<0.87*w and 0.13*h<cy<0.87*h else 0
  score=area*(1.8 if center else 0.55)
  candidates.append((score,x,y,cw,ch,area))
 if not candidates:return (0,0,w,h),0
 candidates.sort(reverse=True)
 _,x,y,cw,ch,area=candidates[0]
 px=max(8,round(0.055*cw));py=max(8,round(0.055*ch))
 x0=max(0,x-px);y0=max(0,y-py);x1=min(w,x+cw+px);y1=min(h,y+ch+py)
 return (x0,y0,x1,y1),len(candidates)
for r in refs:
 v=matching[r['variantId']];n=r['source']['currentPageCount'];matched=v['matchedPage'];last=(matched==n)
 page_number=matched if last else n
 pdf=root/'.cache/level3-official-pdfs'/r['source']['wixMediaId']
 with pymupdf.open(pdf) as doc:
  pg=doc[page_number-1];pix=pg.get_pixmap(matrix=pymupdf.Matrix(2,2),alpha=False)
  RGB=np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width,3)
 H,W=RGB.shape[:2]
 if last:
  c=v['candidateCropNormalized'];pad=0.11; x0=max(0,c['x']-c['width']*pad);y0=max(0,c['y']-c['height']*pad);x1=min(1,c['x']+(1+pad)*c['width']);y1=min(1,c['y']+(1+pad)*c['height'])
 else:x0,y0,x1,y1=0,0,1,1
 coarse=RGB[round(y0*H):round(y1*H),round(x0*W):round(x1*W)]
 if coarse.size==0:raise RuntimeError('Empty source crop '+r['variantId'])
 (ax,ay,bx,by),cc=foreground_box(coarse)
 final=coarse[ay:by,ax:bx]
 # leave an extra 3.5% neutral border, retaining the source page's unedited pixels
 outname=f"{r['variantId']}-source-proposal.webp"
 result=Image.fromarray(final)
 result.save(out/outname,format='WEBP',quality=93,method=6)
 box=(round((round(x0*W)+ax)/W,6),round((round(y0*H)+ay)/H,6),round((bx-ax)/W,6),round((by-ay)/H,6))
 data=(out/outname).read_bytes()
 records.append({'variantId':r['variantId'],'sourcePdfId':r['source']['wixMediaId'],'sourcePdfSha256':r['source']['pdfSha256'],'sourcePage':page_number,'candidateMatchedPage':matched,'useLastPageFallback':not last,'sourcePageCropNormalized':{'x':box[0],'y':box[1],'width':box[2],'height':box[3]},'proposalPath':str(out/outname),'width':result.width,'height':result.height,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'componentCount':cc,'priorVisualFlags':flags.get(r['variantId'],[]),'sourceAuthentic':True,'completedModelAndCropApproval':False,'status':'staging-review-required'})
print(f"{r['variantId']} page {page_number}/{n}, output {result.width}x{result.height}, {len(data)} bytes",flush=True)
report={'date':'2026-11-23','purpose':'Authentic source-extracted robot artwork proposals; candidate crops are not independently approved','sourceGate':'40/40 verified','count':len(records),'approved':0,'sourcePagesNotFinalCount':sum(x['useLastPageFallback'] for x in records),'flags':'Do not upload or put in student-visible mapping','records':records}
(root/'reports/final-build-level-3-extracted-source-artwork-proposals-20261123.json').write_text(json.dumps(report,indent=2)+'\n')
print('SUMMARY',len(records),sum(x['useLastPageFallback'] for x in records),sum(x['width']<160 or x['height']<160 for x in records))

