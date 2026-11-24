import hashlib,json,os,urllib.request,concurrent.futures,time
from pathlib import Path
import pymupdf
root=Path(__file__).resolve().parents[2]
refs=json.loads((root/'src/data/finalBuild/level-3-references.json').read_text())['references']
sources={}
for r in refs:
 s=r['source']; sources[s['wixMediaId']]=s
outdir=root/'.cache/level3-official-pdfs';outdir.mkdir(parents=True,exist_ok=True)
def process(pair):
 media,s=pair
 p=outdir/media
 try:
  if not p.exists() or p.stat().st_size<1000:
   req=urllib.request.Request(s['wixUrl'],headers={'User-Agent':'BE-STEM-Level3-Source-Verification/1.0'})
   with urllib.request.urlopen(req,timeout=90) as response:
    if response.status!=200: raise ValueError('HTTP '+str(response.status))
    payload=response.read()
   if not payload.startswith(b'%PDF-'):raise ValueError('Not PDF')
   p.write_bytes(payload)
  data=p.read_bytes()
  sha=hashlib.sha256(data).hexdigest()
  git=hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
  repair=(s.get('historicalEnglishRepair') or {}).get('gitBlobSha1')
  identity='original' if git==s['historicalGitBlobSha1'] else ('english-repaired' if git==repair else 'MISMATCH')
  with pymupdf.open(p) as doc:
   pages=len(doc)
   first=(doc[0].rect.width,doc[0].rect.height)
   last=(doc[-1].rect.width,doc[-1].rect.height)
  return {'id':media,'filename':s['filename'],'path':str(p),'bytes':len(data),'sha256':sha,'githubBlobSha1':git,'sourceIdentity':identity,'expectedPages':s['historicalPageCount'],'currentPages':pages,'pageCountMatch':pages==s['historicalPageCount'],'expectedSha256Match':sha==s['pdfSha256'],'page1Size':first,'lastPageSize':last,'ok':identity!='MISMATCH' and pages==s['historicalPageCount'] and sha==s['pdfSha256']}
 except Exception as e:return {'id':media,'filename':s['filename'],'ok':False,'error':str(e)}
start=time.monotonic()
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as ex:
 results=list(ex.map(process,sources.items()))
summary={'sourcePdfs':len(results),'pdfDownloadVerified':sum('sha256' in r for r in results),'sourceIdentityPass':sum(r.get('sourceIdentity') in ('original','english-repaired') for r in results),'currentPdfSha256Pass':sum(r.get('expectedSha256Match') is True for r in results),'pymupdfPageCountPass':sum(r.get('pageCountMatch') is True for r in results),'allGatesPass':sum(r['ok'] for r in results),'seconds':round(time.monotonic()-start,1)}
report={'date':'2026-11-23','tool':'pymupdf + hashlib SHA-256 + original/repaired Git blob SHA-1','summary':summary,'sourceResults':results,'note':'No image or question approval implied by source byte integrity'}
(root/'reports/final-build-level-3-official-pdf-run-20261123.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(summary))
for r in results:
 if not r['ok']:print('BLOCKED',r['filename'],r.get('error','source/page/hash mismatch'))

