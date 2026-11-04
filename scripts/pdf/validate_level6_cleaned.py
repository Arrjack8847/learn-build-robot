#!/usr/bin/env python3
"""Independent original-vs-edited QA for Level 6 PDFs; fail on visible instructional loss."""
from collections import Counter
from pathlib import Path
import fitz, json, re
SOURCE=Path('public/Level 6/Learning')
CLEAN=Path('/tmp/bsr-level6-cleaned')
CJK=re.compile(r'[\u3400-\u9fff\uf900-\ufaff]')
WORDS=re.compile(r'[a-z]+',re.I)
LOGOS={(1086,268),(586,178)}
report={'source_pdfs':43,'edited_pdfs':0,'pages_checked':0,'render_exact_pages':0,
        'allowed_cover_closing_edits':0,'unexpected_visible_changes':[],'errors':[]}
for original in sorted(SOURCE.rglob('*.pdf')):
    changed=CLEAN/original.relative_to(SOURCE)
    if not changed.is_file():continue
    report['edited_pdfs']+=1
    old=fitz.open(original);new=fitz.open(changed)
    assert len(old)==len(new),(str(original),'pages')
    for i in range(len(old)):
        a=old[i];b=new[i];report['pages_checked']+=1
        try:
            assert a.rect==b.rect and a.rotation==b.rotation,'geometry'
            t1=a.get_text();t2=b.get_text()
            assert not CJK.search(t2),'Chinese glyphs remain'
            original_words=Counter(WORDS.findall(t1.lower()))
            edited_words=Counter(WORDS.findall(t2.lower()))
            assert not (original_words-edited_words),('English words lost',dict(original_words-edited_words))
            legal=lambda t:[l.strip() for l in t.splitlines() if re.search('copyright|all rights reserved|©',l,re.I)]
            assert legal(t1)==legal(t2),'legal attribution altered'
            imgs=lambda p:Counter((z[2],z[3]) for z in p.get_images(full=True)
                                  if (z[2],z[3]) not in LOGOS and (z[2],z[3])!=(1,1))
            assert imgs(a)==imgs(b),'non-target image inventory changed'
            x=a.get_pixmap(matrix=fitz.Matrix(.25,.25),alpha=False)
            y=b.get_pixmap(matrix=fitz.Matrix(.25,.25),alpha=False)
            assert (x.width,x.height)==(y.width,y.height),'render size changed'
            if x.samples==y.samples:
                report['render_exact_pages']+=1
            elif i in (0,len(old)-1):
                report['allowed_cover_closing_edits']+=1
            else:
                report['unexpected_visible_changes'].append((str(original),i+1))
        except Exception as exc:
            report['errors'].append((str(original),i+1,repr(exc)))
    old.close();new.close()
assert report['edited_pdfs']==35,report
assert report['pages_checked']==895,report
assert report['render_exact_pages']==869,report
assert report['allowed_cover_closing_edits']==26,report
assert not report['unexpected_visible_changes'],report
assert not report['errors'],report
Path('/tmp/bsr-level6-cleaned/validation-report.json').write_text(json.dumps(report,indent=2))
print('LEVEL6_VALIDATION_SUCCESS',json.dumps(report))
