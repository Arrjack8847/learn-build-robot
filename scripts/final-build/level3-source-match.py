import json,os,time
from pathlib import Path
import numpy as np,cv2,pymupdf
cv2.setNumThreads(2)
root=Path(__file__).resolve().parents[2]
refs=json.loads((root/'src/data/finalBuild/level-3-references.json').read_text())['references']
detector=cv2.SIFT_create(nfeatures=1000,contrastThreshold=0.025)
matcher=cv2.BFMatcher(cv2.NORM_L2)
def points(gray):
 return detector.detectAndCompute(gray,None)
def score_pair(k1,d1,page_gray):
 k2,d2=points(page_gray)
 if d1 is None or d2 is None or len(d2)<8:return None
 pairs=matcher.knnMatch(d1,d2,k=2)
 good=[m for p in pairs if len(p)==2 for m,n in [p] if m.distance<0.73*n.distance]
 if len(good)<7:return None
 pts1=np.float32([k1[x.queryIdx].pt for x in good]).reshape(-1,1,2)
 pts2=np.float32([k2[x.trainIdx].pt for x in good]).reshape(-1,1,2)
 H,mask=cv2.findHomography(pts1,pts2,cv2.RANSAC,5)
 if mask is None or H is None:return {'good':len(good),'inliers':0,'coverage':0.0}
 n=int(mask.sum())
 coverage=float(np.linalg.norm(pts1[mask.reshape(-1).astype(bool)].max(axis=0)-pts1[mask.reshape(-1).astype(bool)].min(axis=0))) if n>0 else 0.
 return {'good':len(good),'inliers':n,'coverage':round(coverage,2),'H':H.tolist()}
rows=[];start=time.monotonic()
for idx,r in enumerate(refs):
 candidate=cv2.imread(str(root/'public/final-build/level-3'/f"{r['variantId']}.webp"))
 if candidate is None:
  rows.append({'variantId':r['variantId'],'status':'candidate-not-readable'});continue
 cand_gray=cv2.cvtColor(candidate,cv2.COLOR_BGR2GRAY)
 if max(cand_gray.shape)>680:cand_gray=cv2.resize(cand_gray,None,fx=680/max(cand_gray.shape),fy=680/max(cand_gray.shape))
 k1,d1=points(cand_gray)
 pdf=root/'.cache/level3-official-pdfs'/r['source']['wixMediaId']
 results=[]
 with pymupdf.open(pdf) as doc:
  for page_number,page in enumerate(doc,1):
   pix=page.get_pixmap(matrix=pymupdf.Matrix(1.2,1.2),alpha=False,colorspace=pymupdf.csGRAY)
   page_gray=np.frombuffer(pix.samples,np.uint8).reshape(pix.height,pix.width)
   z=score_pair(k1,d1,page_gray)
   if z:results.append({**z,'pageNumber':page_number,'pageShape':[pix.width,pix.height]})
 results.sort(key=lambda x:(x['inliers'],x['good']),reverse=True)
 best=results[0] if results else None
 if best and 'H' in best:
  H=np.asarray(best['H'],np.float64);h,w=cand_gray.shape
  corner=np.float32([[0,0],[w,0],[w,h],[0,h]]).reshape(-1,1,2)
  projected=cv2.perspectiveTransform(corner,H).reshape(-1,2)
  pw,ph=best['pageShape'];x0=float(np.clip(projected[:,0].min()/pw,0,1));x1=float(np.clip(projected[:,0].max()/pw,0,1));y0=float(np.clip(projected[:,1].min()/ph,0,1));y1=float(np.clip(projected[:,1].max()/ph,0,1))
  best['normalizedCandidatePageBox']={'x':round(x0,5),'y':round(y0,5),'width':round(max(0,x1-x0),5),'height':round(max(0,y1-y0),5)}
 if best and best.get('inliers',0)>=14 and best.get('coverage',0)>=70:status='automated-source-page-match-strong-not-finished-model-approval'
 elif best and best.get('inliers',0)>=8:status='automated-source-page-match-tentative'
 else:status='no-reliable-automated-source-page-match'
 row={'variantId':r['variantId'],'project':r['projectName'],'version':r['variantLabel'],'pdf':r['source']['wixMediaId'],'pdfSha256':r['source']['pdfSha256'],'candidateImageFile':f"public/final-build/level-3/{r['variantId']}.webp",'candidateFeatures':len(k1),'topPageMatches':results[:3],'status':status,'sourcePictureEvidenceStillNeedsHumanReview':True,'approved':False}
 rows.append(row)
 print(f"{idx+1:02d}/42 {r['variantId']:<52} {status} "+str([(x['pageNumber'],x['inliers']) for x in results[:2]]),flush=True)
res={'date':'2026-11-23','tool':'PyMuPDF rendered PDF pages + OpenCV SIFT two-neighbor Lowe ratio + RANSAC','limits':'Automated similarity is not independent final-model validation and does not establish correctness of crop or questions','stats':{'sourcesChecked':len(rows),'strongMatches':sum(x['status'].startswith('automated-source-page-match-strong') for x in rows),'tentativeMatches':sum(x['status']=='automated-source-page-match-tentative' for x in rows),'unmatched':sum(x['status']=='no-reliable-automated-source-page-match' for x in rows),'approved':0,'seconds':round(time.monotonic()-start,1)},'variants':rows}
(root/'reports/final-build-level-3-candidate-source-page-matches-20261123.json').write_text(json.dumps(res,indent=2)+'\n')
print('SUMMARY',json.dumps(res['stats']))

