#!/usr/bin/env python3
"""Controlled cleanup of Level 6 Learning PDFs only.

The Chinese text is hidden beneath existing English: remove only isolated
Chinese-font PDF text operators, not overlapping English glyphs.
Dark Intelligence Storm logos are independent image resources on first/last
pages: remove only those two resources and preserve the rest of the artwork.
"""
from pathlib import Path
import fitz, json, re, sys

SOURCE=Path(sys.argv[1] if len(sys.argv)>1 else 'public/Level 6/Learning')
DEST=Path(sys.argv[2] if len(sys.argv)>2 else '/tmp/bsr-level6-cleaned')
DEST.mkdir(parents=True,exist_ok=True)
CJK=re.compile(r'[\u3400-\u9fff\uf900-\ufaff]')
LOGOS={(1086,268):'cover',(586,178):'closing'}

def text_spans(page):
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines',[]):
            yield from line.get('spans',[])

def remove_overlaid_chinese(doc,page,index,lesson):
    if not CJK.search(page.get_text()):return 0
    chinese_fonts={s['font'] for s in text_spans(page) if CJK.search(s.get('text',''))}
    english=[s for s in text_spans(page) if s['font'] in chinese_fonts
             and s['text'].strip() and not CJK.search(s['text'])]
    assert not english,(lesson,index+1,'Chinese font also holds English')
    resources={f[4] for f in page.get_fonts(full=True) if any(cf in f[3] for cf in chinese_fonts)}
    assert resources,(lesson,index+1,'missing Chinese font resources')
    streams=page.get_contents()
    assert len(streams)==1,(lesson,index+1,'unexpected content streams')
    original=doc.xref_stream(streams[0]); hits=[]
    def remove_block(m):
        block=m.group(0)
        fonts={x.decode('ascii') for x in re.findall(rb'/([A-Za-z0-9_]+)\s+[0-9.]+\s+Tf\b',block)}
        if fonts & resources:
            assert fonts <= resources,(lesson,index+1,'mixed-font Chinese text block')
            hits.append(block)
            return b''
        return block
    updated=re.sub(rb'BT\b.*?\bET\b',remove_block,original,flags=re.S)
    assert hits and len(updated)<len(original),(lesson,index+1,'Chinese operators absent')
    doc.update_stream(streams[0],updated)
    return len(hits)

def remove_dark_logo(doc,page,index,total,lesson):
    target=(1086,268) if index==0 else ((586,178) if index==total-1 else None)
    if not target:return 0
    found={a[0] for a in page.get_images(full=True) if (a[2],a[3])==target}
    if not found:return 0
    assert len(found)==1,(lesson,index+1,'multiple target logos')
    for xref in found:page.delete_image(xref)
    page=doc.reload_page(page)
    if index==0:
        heading='BE STEM READY'
        desc='Robotics Learning Series'
        size=36; width=fitz.get_text_length(heading,fontname='hebo',fontsize=size)
        page.insert_text(((720-width)/2,170),heading,fontname='hebo',fontsize=size,
                         color=(.94,.96,.97),overlay=True)
        size=20; width=fitz.get_text_length(desc,fontname='helv',fontsize=size)
        page.insert_text(((720-width)/2,207),desc,fontname='helv',fontsize=size,
                         color=(.84,.88,.90),overlay=True)
    else:
        title='BE STEM READY'
        size=22; width=fitz.get_text_length(title,fontname='hebo',fontsize=size)
        page.insert_text((703-width,369),title,fontname='hebo',fontsize=size,
                         color=(.94,.96,.97),overlay=True)
    return len(found)

def main():
    paths=sorted(SOURCE.rglob('*.pdf'))
    assert len(paths)==43,('expected 43 Level 6 Learning PDFs',len(paths))
    report=[]
    for path in paths:
        doc=fitz.open(path)
        page_count=len(doc)
        removed_chinese=0;removed_logos=0
        for i in range(len(doc)):
            removed_chinese+=remove_overlaid_chinese(doc,doc[i],i,path.parent.name)
        for i in range(len(doc)):
            removed_logos+=remove_dark_logo(doc,doc[i],i,len(doc),path.parent.name)
        changed=bool(removed_chinese or removed_logos)
        if changed:
            dst=DEST/path.relative_to(SOURCE);dst.parent.mkdir(parents=True,exist_ok=True)
            doc.save(dst,garbage=4,deflate=True,clean=False)
            check=fitz.open(dst)
            assert len(check)==page_count,(path,'page count changed')
            for pi,page in enumerate(check):
                assert not CJK.search(page.get_text()),(path,pi+1,'Chinese remains')
                assert all((a[2],a[3]) not in LOGOS for a in page.get_images(full=True)),(path,pi+1,'logo remains')
            check.close()
        report.append({'path':path.relative_to(SOURCE).as_posix(),'pages':page_count,
                       'changed':changed,'chinese_blocks_removed':removed_chinese,
                       'brand_images_removed':removed_logos})
        print('LEVEL6_CLEAN',report[-1],flush=True)
        doc.close()
    result={'total':len(paths),'changed':sum(r['changed'] for r in report),
            'chinese_blocks_removed':sum(r['chinese_blocks_removed'] for r in report),
            'brand_images_removed':sum(r['brand_images_removed'] for r in report),
            'files':report}
    assert result['changed']==35,result
    assert result['chinese_blocks_removed']==56,result
    assert result['brand_images_removed']==26,result
    (DEST/'cleanup-report.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print('LEVEL6_CLEANUP_SUMMARY',json.dumps({k:v for k,v in result.items() if k!='files'}))
if __name__=='__main__':main()
