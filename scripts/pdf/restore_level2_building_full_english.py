#!/usr/bin/env python3
"""Restore all 60 Level 2 Building PDFs: approved English covers + interior edits.

Run locally from repository root, after running existing approved cover generator:
 python scripts/pdf/generate_level2_building_english_covers.py --source-dir public --output-dir build/level2-building-english
 python scripts/pdf/restore_level2_building_full_english.py --source-dir public --cover-dir build/level2-building-english --output-dir build/level2-building-complete-english

Does NOT overwrite public PDFs, start a deployment or trigger GitHub Actions.
Source validation: pinned original Git blob SHAs from audit 2026-11-19.
Interior Chinese footer coordinates apply exclusively to pinned Level 2 sources.
"""
import argparse,collections,hashlib,json,re,shutil,sys
from pathlib import Path
import numpy as np
import pymupdf as fitz
RX=re.compile('[\u3400-\u9fff\uf900-\ufaff]')
PDFBT=re.compile(rb'\bBT\b(?s:.*?)\bET\b')
TRANSLATION='Besides transmitting information, what other purpose do the controller ports serve?'
ORIG=Path('public')
COVERS=Path('build/level2-building-english')
OUT=Path('build/level2-building-complete-english')
SOURCES = {'Animal trap.pdf': '3c1bfe3b2ebaa836dc54d581ed267fb4b57564cc',
 'Automatic window.pdf': '436e8bdaadc0f85d0101662efcf5c64d43cf99ef',
 'Axe robot_Building.pdf': '7773d60c3031e041fb6d590d2c3c79080c988477',
 'BEE.pdf': '14f650e83617d5aa17d5c5ebe3ed15a549bc17da',
 'Balance.pdf': '953286e4ef78a9c375a054fb39a9d27bde3cbbf5',
 'Balance_v2.pdf': '21df7860ba63c17acc720bc69381d4cf41d34e76',
 'Battery robot_Building.pdf': 'ed758e45369c3d3c67ecb7e4018749bfb10dcf31',
 'Batting robot_Building.pdf': 'ecc67766a5b2b146e76712bb80b5bd0cae602649',
 'Bridge_Building.pdf': '8798795f26e5ce13efd4fff8b96fa21f6aebc33c',
 'Car Steering.pdf': '71d6652607982fe78dae04fad75dc482ae4f7be7',
 'Chimpanzees.pdf': '1c6f7bc66a50a5d6289f30d5f2f016dae2c89d01',
 'Cliff walk.pdf': 'd4fc4797753b387dd6b0bf40b713ca8e706c37c7',
 'Crane.pdf': '9d4ae2829532e9712e04be0d08215abd34f79fbd',
 'Crane_.pdf': '6d67b0f8c9895428b9b7a38e6c90cddd1a396977',
 'Door_Building.pdf': '67668a7e64bc00f196cb7ff009a328d77bdb3090',
 'Double beam crane_Building.pdf': 'd48c08a547336a19d3765d8c7ccb24da13e15ecf',
 'Dung Beetle.pdf': 'c4bb864ddefa921ef5932938fd82abd959dbc8d0',
 'Fan robot_Building.pdf': '9131a51ad4893541d91be8c1a07f3adacd00da0d',
 'Fare Gate.pdf': '602d2dec9f2da62856ec9216c992a06314d5c857',
 'Ferris wheel.pdf': '92a8ffdac55fe538042e20ba7cda47dbce50f834',
 'Flashlight_Building.pdf': 'e14747c661a5eb3b8264d4f63ac1b8c270e0c89f',
 'Forklift.pdf': '87f3e0fd9875afc9603614a159d3a4ac0143686e',
 'Four-wheel Drive.pdf': '84b7453b8e1d0d4b0e30d4c043617b9b81d95547',
 'Gearbox_Building.pdf': '152fdae6b1a305dbd7b8eb1b1dca97ab8d522cf3',
 'Hammer robot.pdf': '3289cba0dc5f248ee4ea637e5dc2bbae5fe4dfbe',
 'Hand crank_Building.pdf': 'aac537c905dafec17ce41d94a53450a866e212a1',
 'Harp_Building.pdf': '8fdc6663611b7aeb684afe9a756cfca658b58106',
 'Headlights.pdf': '961ea85e1cd52a18318791b874a8229cad743c23',
 'Helicopter_Building.pdf': '7f6f3c37f213ffd954216fcc6e42fab93d3ec52a',
 'Jumping machine_Building.pdf': 'fdef944d28b23099fb20fd92139eaf2fd57c6608',
 'LED Scrolling Screen.pdf': 'caecd4ddb7c02e6c315252e960a9e53c6d9f6280',
 'LED Signboard.pdf': '30771acaeda6a6fe9fe0ebd470578f3b197b8aa6',
 'Lifting door_Building.pdf': 'c9462f702c7602c40e1e53001500c2d107f87b7f',
 'Lucky turntable.pdf': '049c3292d095ae3eb9cc8d31d246b93934a007d8',
 'Mechanical dog.pdf': '0b40358a925639d5ffac13f551ac69c1aebc0f96',
 'Mobile Shot.pdf': '542ef439142804b41b71871dc9127650f7a6625b',
 'Pedal Waterwheel.pdf': 'fe3f2245a7c5edf2ff2445b34e665879e2b3079b',
 'Pirate ship_Building.pdf': 'cae6cbbfa3b330627394b7b10e879b8dfc609313',
 'Pliers.pdf': 'b87354730e587b2f22920041c60e61f960703463',
 'Push ups_building.pdf': 'ea79f05e632be704113fb449b0e08ec70c2e1eee',
 'Reverse Parking.pdf': '18cf6c2c0651abacc04114de6e631176a292b994',
 'Robot war.pdf': '8a7f1760c9623ffa6e089c90701648c6e1aecbe3',
 'Rolling Shutter.pdf': 'cbaf3dda9daaa021a88238276dce24a4c2304d4f',
 'Rotating flying chair_Building.pdf': '4291b8dd08df9c651e270e1f855d76b304ecb8d3',
 'Round-trip transportation.pdf': '4302e1cc92b1474f5abdef57a2de9736f42a5e0a',
 'Scaling ladder.pdf': 'f001a8447b56b90a639b2b923b4a33774fa1e76c',
 'Shift gears.pdf': '3041120a52e8b7091c8796580670e2f5ae47dc8f',
 'Smart Window.pdf': '8944d7239b3d078676879a7ecbb6b4a1c35c7444',
 'Spinning bike_Building.pdf': '74a7f32abb7a93532c464e0f04a4ab0430fdf091',
 'Spirograph.pdf': 'e2dd8f8cda4179dc117acf7548e7fdd49aba7361',
 'Swing_Building.pdf': 'd7d3c926d6c880c73df4de9fe6565761c5133ebd',
 'Tank.pdf': '529bccadbde1fc83b5f994d69e412e72e46410da',
 'Teeterboard.pdf': '21df7860ba63c17acc720bc69381d4cf41d34e76',
 'The treadmill.pdf': '30f93ed7184c756294d27c60c6e71c7e88329285',
 'Throwing robot_Building.pdf': 'c6003825dc39d30193501ee58d6d97ce13836d4d',
 'Tightrope walk.pdf': 'fc2a37c7bcfac70c0f1b2afb6ff68f7f21ce02a3',
 'Tower crane_Building.pdf': '1a92c09b5a21f26a51b9868677eb283cd2e3605e',
 'Track Rickshaw.pdf': 'ee0fc85a36ec91eba42afab71e38e97e0504c50e',
 'Treadmill_Building.pdf': 'a0a26bdfea53b51d433bffbf895b7d9c0ba2c8f5',
 'Walking Robot.pdf': 'a12735eb2559ce9044880d77771eb99970216f09'}
LOGO_PAGES = {'Balance.pdf': [3, 4, 5, 6, 7, 8, 9],
 'Bridge_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
 'Crane_.pdf': [2,
                4,
                5,
                6,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                28,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40],
 'Door_Building.pdf': [2, 3, 4, 6, 7, 8, 9, 10],
 'Double beam crane_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
 'Flashlight_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
 'Gearbox_Building.pdf': [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
 'Hand crank_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 10],
 'Harp_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9],
 'Jumping machine_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 17, 18],
 'Lifting door_Building.pdf': [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26],
 'Pirate ship_Building.pdf': [2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15],
 'Rotating flying chair_Building.pdf': [2, 3, 4, 5, 6, 8, 9, 10],
 'Tower crane_Building.pdf': [3, 6, 7, 8, 11, 12, 13, 15, 17, 18]}
manifest=[{'path':'public/'+filename} for filename in SOURCES]
cover_names=set()
APPROVED_COVERS={'Gearbox_Building.pdf', 'Walking Robot.pdf', 'Balance.pdf', 'Door_Building.pdf', 'Scaling ladder.pdf', 'Harp_Building.pdf', 'Flashlight_Building.pdf', 'Pliers.pdf', 'Pirate ship_Building.pdf', 'Teeterboard.pdf', 'Hand crank_Building.pdf', 'Rotating flying chair_Building.pdf', 'Bridge_Building.pdf', 'Mechanical dog.pdf', 'Double beam crane_Building.pdf', 'Balance_v2.pdf', 'Jumping machine_Building.pdf', 'Crane_.pdf', 'Tower crane_Building.pdf', 'Lifting door_Building.pdf'}
logo_pages={name:set(pages) for name,pages in LOGO_PAGES.items()}
def cjk_n(s):return len(RX.findall(s))
def keep_english(s):return re.sub(r'[^A-Za-z0-9]', '',RX.sub('',s))
def remove_chinese_text_objects(doc,page):
 text_before=page.get_text();ch_before=cjk_n(text_before)
 if not ch_before:return page,[]
 removed=[]
 for xref in page.get_contents():
  stream=doc.xref_stream(xref);ms=list(PDFBT.finditer(stream)); select=[]
  for i,m in enumerate(ms):
   doc.update_stream(xref,stream[:m.start()]+stream[m.end():]);page=doc.reload_page(page)
   cjk_delta=ch_before-cjk_n(page.get_text())
   doc.update_stream(xref,stream);page=doc.reload_page(page)
   if cjk_delta>0:select.append(i)
  if select:
   out=stream
   for i in reversed(select):out=out[:ms[i].start()]+out[ms[i].end():]
   doc.update_stream(xref,out);page=doc.reload_page(page)
   removed.append({'xref':xref,'blocks_removed':select})
 if cjk_n(page.get_text()):raise ValueError(f'Unable to remove all extractable Chinese on page {page.number+1}')
 if keep_english(page.get_text())!=keep_english(text_before):raise ValueError(f'English changed while removing Chinese from page {page.number+1}')
 return page,removed

def gitsha(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
def main():
 global ORIG,COVERS,OUT,cover_names
 ap=argparse.ArgumentParser();ap.add_argument('--only');ap.add_argument('--source-dir',type=Path,default=ORIG);ap.add_argument('--cover-dir',type=Path,default=COVERS);ap.add_argument('--output-dir',type=Path,default=OUT);args=ap.parse_args()
 ORIG=args.source_dir; COVERS=args.cover_dir; OUT=args.output_dir;OUT.mkdir(parents=True,exist_ok=True)
 cover_names=set(x.name for x in COVERS.glob('*.pdf'))
 if cover_names != APPROVED_COVERS:raise ValueError(f'Expected 20 approved cover PDFs; found {len(cover_names)} unexpected: {sorted(cover_names^APPROVED_COVERS)}')
 rows=[]
 for e in manifest:
  name=Path(e['path']).name
  if args.only and name!=args.only:continue
  before=ORIG/name; approved=COVERS/name
  assert before.exists(),name
  content=before.read_bytes()
  assert gitsha(content)==SOURCES[name],f'Source Git blob mismatch for {name}'
  doc=fitz.open(approved if name in cover_names else before)
  original=fitz.open(before)
  assert len(doc)==len(original),name
  ch=[];modifiedpages=set();approved_cover=name in cover_names;local_logos=logo_pages.get(name,set())
  for i in range(len(doc)):
   p=doc[i];baseline=p.get_text();hidden=[s for block in p.get_text('dict')['blocks'] for line in block.get('lines',[]) for s in line.get('spans',[]) if RX.search(s.get('text',''))]
   if i>0 and hidden:
    colors={s['color'] for s in hidden}
    if colors != {0xffffff} and not (name=='Tank.pdf' and i==11):raise ValueError(f'Unexpected visible colors on {name} page {i+1}: {colors}')
    p,blocks=remove_chinese_text_objects(doc,p)
    if name=='Tank.pdf' and i==11:
     p.insert_text((187,339),'Round hole',fontsize=8,fontname='helv',color=(0.14,0.14,0.14))
     p.insert_text((91,394),'Round hole',fontsize=8,fontname='helv',color=(0.14,0.14,0.14))
     kind='visible_round_hole_labels'
    elif colors=={0xffffff}:
     p.insert_text((235,327),TRANSLATION,fontsize=8,fontname='helv',render_mode=3)
     kind='invisible_english_replaces_original_invisible_chinese'
    else:raise ValueError(f'Unknown visible Chinese requiring manual translation: {name} p{i+1}')
    assert not RX.search(p.get_text()),f'CJK left in {name} p{i+1}'
    ch.append({'page':i+1,'kind':kind,'blocks':blocks})
    modifiedpages.add(i)
   if i+1 in local_logos:
    # The unilingual ZMROBO text at the left of the footer remains untouched.
    # Raster logo has a pure white background; only the five Chinese characters to its right are masked.
    p.draw_rect(fitz.Rect(416.4,565.0,511.5,580.3),color=None,fill=(1,1,1),overlay=True)
    ch.append({'page':i+1,'kind':'raster_footer_chinese_logo_replaced_by_existing_english_ZMROBO'})
    modifiedpages.add(i)
  out=OUT/name
  if modifiedpages or approved_cover:doc.save(out,garbage=4,deflate=True)
  else:shutil.copyfile(before,out)
  doc.close();changed=fitz.open(out)
  assert len(changed)==len(original)
  errors=[]
  for i,p in enumerate(changed):
   src=original[i]
   assert p.rect==src.rect,(name,i,'dimension')
   if i>0 and RX.search(p.get_text()):errors.append(f'Chinese remains extractable on {i+1}')
   if i not in modifiedpages and not(i==0 and approved_cover):
    x=src.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
    y=p.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False)
    if x.samples!=y.samples:errors.append(f'Unexpected raster change page {i+1}')
   elif i>0:
    a=np.frombuffer(src.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False).samples,dtype=np.uint8)
    b=np.frombuffer(p.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False).samples,dtype=np.uint8)
    if len(a)!=len(b):errors.append(f'Pix dimension differs page {i+1}')
    else:
     pw=src.get_pixmap(matrix=fitz.Matrix(1,1),alpha=False).width;diff=np.any(a.reshape(-1,3)!=b.reshape(-1,3),axis=1).reshape(-1,pw)
     if diff.any():
      ys,xs=np.where(diff)
      # Only documented adjustment rectangles can change raster pixels.
      allowed=np.zeros(diff.shape,dtype=bool)
      if i+1 in local_logos:allowed[564:582,415:513]=True
      if name=='Tank.pdf' and i==11:
       allowed[316:345,180:250]=True;allowed[370:405,85:160]=True
      if np.logical_and(diff,~allowed).any():errors.append(f'Pixel change outside expected repair regions page {i+1}')
  results={'path':e['path'],'original_blob_sha':gitsha(content),'original_pages':len(original),'approved_cover':approved_cover,'changed_pages':sorted(i+1 for i in modifiedpages),'translated_text_pages':sorted({r['page'] for r in ch if 'invisible' in r['kind'] or 'round_hole' in r['kind']}),'logo_pages':sorted(local_logos),'repairs':ch,'file_size':out.stat().st_size,'final_blob_sha':gitsha(out.read_bytes()),'final_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'issues':errors}
  rows.append(results);(OUT/'validation.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2))
  print(f"{'PASS' if not errors else 'FAIL'} {len(rows)}/{60 if not args.only else 1}: {name}: {len(original)} pages, cover={approved_cover}, interior={len(modifiedpages)}, issues={errors[:3]}",flush=True)
  original.close();changed.close()
  if errors:raise ValueError(f'Validation failed: {name} {errors}')
 print('FINAL SUMMARY files',len(rows),'pages',sum(x['original_pages'] for x in rows),'cover',sum(x['approved_cover'] for x in rows),'interior_files',sum(bool(x['changed_pages']) for x in rows),'interior_pages',sum(len(x['changed_pages']) for x in rows))
if __name__=='__main__':main()
