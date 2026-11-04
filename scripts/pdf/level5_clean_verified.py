#!/usr/bin/env python3
"""Controlled Level 5 Learning PDF cleanup. Only writes into --out."""
import argparse,re,json
from pathlib import Path
import fitz
from pypdf import PdfReader
from pypdf.generic import ContentStream
BRAND=re.compile(r'intelligen(?:t|ce)?\s*storm|smart\s*storm|joinmax',re.I)
CJK=re.compile(r'[\u3400-\u9fff]')
LEGAL=re.compile(r'copyright|all rights reserved|licen[cs]e|©|版权所有|知识产权|著作权',re.I)
LOGOS={(586,178),(1086,268)}
FONT=('microsoftyahei','microsoftjhenghei','ms-gothic')
TURQ=(97/255,195/255,208/255)
def strip_chinese(src,inter):
    doc=fitz.open(src)
    if not any(CJK.search(p.get_text()) for p in doc):
        doc.close();return src,0
    reader=PdfReader(str(src));count=0
    for i,p in enumerate(reader.pages):
        if not CJK.search(doc[i].get_text()):continue
        keys={k for k,v in p.get('/Resources',{}).get('/Font',{}).items() if any(f in str(v.get_object().get('/BaseFont','')).lower() for f in FONT)}
        assert keys,(str(src),i,'No matching fonts')
        contents=doc[i].get_contents()
        assert len(contents)==1,(str(src),i,'Stream count not one')
        stream=ContentStream(p.get_contents(),reader);ops=[];font=None;n=0
        for args,op in stream.operations:
            if op==b'BT':font=None
            if op==b'Tf':font=args[0]
            if op in (b'Tj',b'TJ',b"'",b'"') and font in keys:
                n+=1;count+=1
            else:ops.append((args,op))
        assert n,(str(src),i,'No matching text operators')
        stream.operations=ops
        doc.update_stream(contents[0],stream.get_data(),compress=True)
    inter.parent.mkdir(parents=True,exist_ok=True)
    doc.save(inter,garbage=4,deflate=True)
    doc.close()
    chk=fitz.open(inter)
    assert not any(CJK.search(p.get_text()) for p in chk),str(src)
    chk.close()
    return inter,count
def text_spans(page):
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            yield line['spans']
def color(s):
    v=s['color'];return tuple((v>>k&255)/255 for k in (16,8,0))
def replace_brand(page,num,total):
    groups=[]
    for spans in text_spans(page):
        indiv=[s for s in spans if BRAND.search(s['text'])]
        if indiv:groups.extend(([s],s['text']) for s in indiv)
        elif len(spans)>1 and BRAND.search(''.join(s['text'] for s in spans)):
            groups.append((spans,''.join(s['text'] for s in spans)))
    if not groups:return 0
    changes=[]
    for chain,text in groups:
        s=chain[0];low=text.strip().lower()
        if num==1 and ('series' in low or low=='intelligence storm') and s['bbox'][1]<200:
            label='BE STEM READY Learning';typ='heading'
        elif num==total and 'series' in low:
            label='BE STEM READY';typ='closing'
        elif 'the intelligence storm set is' in low:
            label='This robotics kit helps students explore programming and sensors.';typ='intro'
        elif 'intelligence storm is a building block programming robot research' in low:
            label='This robotics course introduces programming, sensors and motion.';typ='intro'
        elif 'joinmax' in low:
            label='The kit includes sensors and programmable components for learning.';typ='intro'
        else:
            label=BRAND.sub('the robotics kit',text);typ='intro'
        rect=fitz.Rect(s['bbox'])
        for sp in chain[1:]:rect|=fitz.Rect(sp['bbox'])
        rect+=(-.8,-.5,1.2,.6)
        page.add_redact_annot(rect,fill=TURQ if typ in ('heading','closing') else (1,1,1),cross_out=False)
        changes.append((s,rect,label,typ))
    page.apply_redactions(images=0,graphics=0,text=0)
    for s,r,label,typ in changes:
        font='tibo' if 'bold' in s['font'].lower() else 'tiro'
        x,y=s['origin'];size=s['size']
        width=fitz.get_text_length(label,fontname=font,fontsize=size)
        maxw=min(page.rect.width-x-15,max(r.width,390 if typ=='heading' else 510))
        if width>maxw:size*=maxw/width
        size=max(size,11)
        page.insert_text((x,y),label,fontname=font,fontsize=size,color=color(s),overlay=True)
    return len(groups)
def clean_one(src,dst,rel,inter):
    source=fitz.open(src)
    sizes=[(p.rect.width,p.rect.height,p.rotation) for p in source]
    s,removed=strip_chinese(src,inter)
    doc=fitz.open(s)
    logos=set()
    for p in doc:
        for im in p.get_images(full=True):
            if (im[2],im[3]) in LOGOS:logos.add(im[0])
    for ref in logos:
        for p in doc:
            if any(im[0]==ref for im in p.get_images(full=True)):
                p.delete_image(ref);break
    brands=sum(replace_brand(p,i,len(doc)) for i,p in enumerate(doc,1))
    if rel=='Autonomous Navigation & Ranging/Autonomous driving/03. Autonomous Driving.pdf':
        p=doc[7]
        p.insert_text((108.8,345.1),'Offset 120',fontname='helv',fontsize=7.2,color=(0,0,0))
        for xy,label in [((235.56,174.29),'Aiming'),((241.44,195.89),'frame'),((273.05,246.14),'Baseline'),((276.60,397.92),'Road')]:
            p.insert_text(xy,label,fontname='helv',fontsize=18,color=(0,0,0))
    meta={k:v for k,v in doc.metadata.items() if v is not None}
    for k,v in list(meta.items()):
        if isinstance(v,str) and BRAND.search(v):meta[k]=''
    meta['title']=src.stem+' | BE STEM READY Learning'
    doc.set_metadata(meta)
    dst.parent.mkdir(parents=True,exist_ok=True)
    doc.save(dst,garbage=4,deflate=True,clean=True)
    doc.close()
    result=fitz.open(dst)
    assert len(result)==len(source),(rel,'page count')
    assert [(p.rect.width,p.rect.height,p.rotation) for p in result]==sizes,(rel,'page dimensions')
    for i,p in enumerate(result):
        assert not CJK.search(p.get_text()),(rel,i+1,'CJK remains')
        assert not BRAND.search(p.get_text()),(rel,i+1,'brand remains')
        assert not any((im[2],im[3]) in LOGOS for im in p.get_images(full=True)),(rel,i+1,'logo remains')
        if LEGAL.search(source[i].get_text()):
            for line in source[i].get_text().splitlines():
                if LEGAL.search(line):assert line.strip() in p.get_text(),(rel,i+1,'legal text changed')
        pix=p.get_pixmap(matrix=fitz.Matrix(.4,.4),alpha=False)
        assert pix.width>0 and pix.height>0,(rel,i+1,'render failed')
    result.close();source.close()
    return {'file':rel,'pages':len(sizes),'chinese_ops':removed,'brand_spans':brands,'logo_objects':len(logos)}
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--root',required=True);parser.add_argument('--out',required=True)
    parser.add_argument('--inter',required=True);args=parser.parse_args()
    root=Path(args.root);out=Path(args.out);inter=Path(args.inter)
    files=sorted(root.rglob('*.pdf'))
    assert len(files)==51,len(files)
    report=[]
    for i,src in enumerate(files,1):
        relative=src.relative_to(root).as_posix()
        result=clean_one(src,out/relative,relative,inter/relative)
        report.append(result)
        print(str(i)+'/51',relative,'pages',result['pages'],flush=True)
    totals={'files':len(report),'pages':sum(x['pages'] for x in report),'cjk_ops':sum(x['chinese_ops'] for x in report),'brand_spans':sum(x['brand_spans'] for x in report),'logo_objects':sum(x['logo_objects'] for x in report)}
    assert totals['pages']==1251,totals
    (out.parent/'level5-report.json').write_text(json.dumps({'totals':totals,'files':report},indent=2))
    print('VERIFIED',json.dumps(totals),flush=True)
if __name__=='__main__':main()
