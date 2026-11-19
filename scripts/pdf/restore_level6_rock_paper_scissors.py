#!/usr/bin/env python3
"""Restore the five selectable Chinese component labels on page 14 ONLY.

Checks the exact original Git blob ID and fails closed on unexpected label
positions/counts or post-edit visual differences outside the edited area.
Visual QA images still require human review of component relationships.
No GitHub Actions, no other levels and no Learning PDFs are touched.

Usage:
  python scripts/pdf/restore_level6_rock_paper_scissors.py \
    --input ORIGINAL.pdf --output ENGLISH.pdf --qa-dir QA_DIRECTORY
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
from pathlib import Path
import fitz

EXPECTED_GIT_BLOB = 'af9423f2a5191ca8577b18cd3fa827da09fd829b'
PAGE_INDEX = 13
TRANSLATIONS = (
    ('大型马达', 'Large Motor', 2),
    ('AI模块', 'AI Module', 1),
    ('中型马达', 'Medium Motor', 1),
    ('控制器', 'Controller', 1),
)
HAN = re.compile(r'[\u3400-\u9fff\uf900-\ufaff]')

def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b'blob ' + str(len(data)).encode('ascii') + b'\0' + data).hexdigest()

def span_color(page: fitz.Page, target: fitz.Rect) -> tuple[float, float, float]:
    hits = []
    for block in page.get_text('dict')['blocks']:
        for line in block.get('lines', ()):
            for span in line.get('spans', ()):
                box = fitz.Rect(span['bbox'])
                if box.intersects(target) and HAN.search(span.get('text', '')):
                    c = int(span.get('color', 0))
                    hits.append(((c >> 16 & 255)/255, (c >> 8 & 255)/255, (c & 255)/255))
    return hits[0] if hits else (0., 0., 0.)

def pixdigest(page: fitz.Page, scale=1.0) -> str:
    p = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    return hashlib.sha256(p.samples).hexdigest()

def save_png(page: fitz.Page, out: Path, scale=1.75) -> None:
    page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False).save(out)

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--input', required=True, type=Path)
    ap.add_argument('--output', required=True, type=Path)
    ap.add_argument('--qa-dir', required=True, type=Path)
    ap.add_argument('--allow-unverified-input', action='store_true',
                    help='Only for synthetic tests; NEVER for production')
    args = ap.parse_args()
    if args.input.resolve() == args.output.resolve():
        ap.error('Output must not overwrite the source')
    source = args.input.read_bytes()
    original_blob = git_blob_sha(source)
    if original_blob != EXPECTED_GIT_BLOB and not args.allow_unverified_input:
        ap.error(f'Unexpected source SHA {original_blob}; expected {EXPECTED_GIT_BLOB}. No edit performed.')
    if args.allow_unverified_input:
        print('WARNING: source hash verification disabled; synthetic testing ONLY')

    doc = fitz.open(stream=source, filetype='pdf')
    if len(doc) != 14:
        ap.error(f'Expected 14 original pages; got {len(doc)}')
    original_dims = [(p.rect.width, p.rect.height) for p in doc]
    untouched_digests = [pixdigest(doc[i]) for i in range(PAGE_INDEX)]
    untouched_text = [doc[i].get_text() for i in range(PAGE_INDEX)]
    before_page_text = doc[PAGE_INDEX].get_text()
    pg = doc[PAGE_INDEX]

    labels = []
    for zh, en, required in TRANSLATIONS:
        boxes = sorted(pg.search_for(zh), key=lambda r: (round(r.y0, 2), round(r.x0, 2)))
        if len(boxes) != required:
            ap.error(f'Expected {required} exact matches for {zh!r}, found {len(boxes)}. No edit performed.')
        for box in boxes:
            target = fitz.Rect(box)
            redact = fitz.Rect(target.x0-.12, target.y0-.12, target.x1+.12, target.y1+.12)
            color = span_color(pg, target)
            width_per_point = fitz.get_text_length(en, fontname='helv', fontsize=1)
            size = min(10.5, target.height*.79, max(1., target.width)/width_per_point)
            if size < 5.5:
                ap.error(f'Too little room for legible {en!r} at {tuple(box)} (would be {size:.2f} pt).')
            labels.append({'chinese':zh,'english':en,
                           'original_rect':[round(v,3) for v in target],
                           'redact_rect':[round(v,3) for v in redact],
                           'font_size':round(size,2),'color':color})
    if len(labels) != 5:
        ap.error('Expected exactly five labels')
    for label in labels:
        pg.add_redact_annot(fitz.Rect(label['redact_rect']), fill=False, cross_out=False)
    pg.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE,
                        graphics=fitz.PDF_REDACT_LINE_ART_NONE,
                        text=fitz.PDF_REDACT_TEXT_REMOVE)
    for label in labels:
        r = fitz.Rect(label['original_rect'])
        font_size = label['font_size']
        baseline = r.y0 + (r.height + font_size*.74)/2
        pg.insert_text((r.x0,baseline),label['english'],fontname='helv',
                       fontsize=font_size,color=tuple(label['color']),overlay=True)
    args.qa_dir.mkdir(parents=True,exist_ok=True)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    doc.save(args.output,garbage=3,deflate=True)
    doc.close()

    edited = fitz.open(args.output)
    assert len(edited)==14,'Page count changed'
    assert [(p.rect.width,p.rect.height) for p in edited]==original_dims,'Page dimensions changed'
    for i in range(PAGE_INDEX):
        assert pixdigest(edited[i])==untouched_digests[i],f'Visual change on untouched page {i+1}'
        assert edited[i].get_text()==untouched_text[i],f'Text change on untouched page {i+1}'
    after_page_text=edited[PAGE_INDEX].get_text()
    assert not HAN.search(after_page_text),'Extractable Chinese remains on page 14'
    for label in labels:
        assert label['english'] in after_page_text,f"Missing output label {label['english']}"
    original_tokens=set(re.findall(r'[A-Za-z][A-Za-z0-9]+',before_page_text))
    added_tokens=set(w for pair in TRANSLATIONS for w in pair[1].split())
    after_tokens=set(re.findall(r'[A-Za-z][A-Za-z0-9]+',after_page_text))
    missing=sorted(original_tokens-after_tokens-added_tokens)
    assert not missing,f'Original English words disappeared: {missing}'
    src=fitz.open(stream=source,filetype='pdf')
    save_png(src[PAGE_INDEX],args.qa_dir/'rock-paper-scissors-page14-before.png')
    save_png(edited[PAGE_INDEX],args.qa_dir/'rock-paper-scissors-page14-after.png')
    manifest={'input_git_blob_sha':original_blob,
              'output_git_blob_sha':git_blob_sha(args.output.read_bytes()),
              'source_pages':14,'output_pages':14,'source_dimensions':original_dims,
              'labels':labels,'other_pages_pixel_identical':13,
              'remaining_extractable_chinese_on_page14':0,
              'source_hash_verified':original_blob==EXPECTED_GIT_BLOB,
              'page14_illustration_review':'PENDING human visual verification',
              'full_41_pdf_image_chinese_audit':'NOT PERFORMED'}
    (args.qa_dir/'rock-paper-scissors-page14-manifest.json').write_text(
        json.dumps(manifest,indent=2,ensure_ascii=False)+'\n')
    print(json.dumps({'output':str(args.output),'labels':len(labels),
                      'source_verified':manifest['source_hash_verified'],
                      'pages':14,'unchanged_pages':13},indent=2))

if __name__=='__main__':
    main()
