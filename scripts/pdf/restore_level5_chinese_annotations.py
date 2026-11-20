#!/usr/bin/env python3
"""Repair seven visually confirmed Chinese annotations in Level 5 Building PDFs.

Inputs: exactly the original, Git-hash-verified Level 5 Building PDFs staged
under --source-root/public/Level 5/Building/...; does not alter source files.
Outputs: only five PDFs under --output (basename paths), never Learning PDFs.
Run from repository root (PyMuPDF required):

  python scripts/pdf/restore_level5_chinese_annotations.py \
    --source-root build/level5-building-verified-originals \
    --output build/level5-building-english-repaired

All annotation rectangles are from direct 220%-scale PDF page renders.
Compare all changed pages against the originals before publishing binaries.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    import fitz

# Page numbers below are 1-based. Rectangles are in original render pixels
# at zoom 2.2. Both the Chinese-image redaction and inserted English have
# manually constrained bounds, preserving every diagram outside the boxes.
REPAIRS = {
    "02.Smart Cash Register-Building Manual.pdf": [
        (20, (1239,311,1625,398), (1242,316,1780,391),
         "Red lines indicate rubber bands.", 16.0, "black"),
    ],
    "03.Spanish Bullfight-Building Manual.pdf": [
        (6, (804,1022,1128,1110), (801,1029,1450,1107),
         "Install the two pins close together.", 16.0, "black"),
        (8, (248,1048,922,1129), (255,1055,935,1127),
         "Offset opposing pins by 180°.", 16.0, "black"),
        (9, (1017,1038,1701,1121), (1017,1045,1720,1119),
         "Offset opposing pins by 180°.", 16.0, "black"),
    ],
    "08. Welcome Sign-Building Manual.pdf": [
        (12, (1300,222,1710,306), (1298,224,1815,304),
         "Fit the rubber band as shown.", 16.0, "black"),
    ],
    "10.Machine Gun-Building Manual.pdf": [
        (29, (380,848,790,1010), (385,857,818,1022),
         "Attach the rubber band here.\nConnect the 3-hole solid pin\n"
         "and axle-sleeve connector\npin together.", 13.0, "black"),
    ],
    "27. Chairoplane-Building Manual.pdf": [
        (30, (1258,256,1713,406), (1265,267,1785,409),
         "Install the 7-hole beams\nin staggered layers.", 17.2, "red"),
    ],
}

def blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest()

def as_rect(coords):
    return fitz.Rect(*(v / 2.2 for v in coords))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path("."))
    parser.add_argument("--source-root", type=Path,
                        default=Path("build/level5-building-verified-originals"))
    parser.add_argument("--output", type=Path,
                        default=Path("build/level5-building-english-repaired"))
    args = parser.parse_args()
    repo = args.repo.resolve()
    source = args.source_root if args.source_root.is_absolute() else repo / args.source_root
    output = args.output if args.output.is_absolute() else repo / args.output
    manifest = json.loads((repo / "reports/level5-building-english-audit-20261119.json")
                          .read_text(encoding="utf-8"))
    by_name = {}
    for item in manifest["files"]:
        basename = Path(item["path"]).name
        if basename in by_name:
            raise ValueError("Ambiguous PDF basename: " + basename)
        by_name[basename] = item
    if set(REPAIRS) - set(by_name):
        raise ValueError("Repair target is missing from original inventory")
    output.mkdir(parents=True, exist_ok=True)
    outcomes = []
    for filename, changes in REPAIRS.items():
        entry = by_name[filename]
        pdf = source / entry["path"]
        data = pdf.read_bytes()
        if blob_sha(data) != entry["git_blob_sha"] or len(data) != entry["git_object_bytes"]:
            raise ValueError("Original PDF hash/size mismatch: " + filename)
        doc = fitz.open(stream=data, filetype="pdf")
        if doc.needs_pass:
            raise ValueError("Encrypted PDF: " + filename)
        original_page_count = len(doc)
        for number, box, text_box, translation, font_size, color in changes:
            if number < 1 or number > original_page_count:
                raise ValueError("Invalid repair page number")
            page = doc[number - 1]
            page.add_redact_annot(as_rect(box), fill=(1,1,1), cross_out=False)
            page.apply_redactions(images=2, graphics=0, text=0)
            color_rgb = (0.92, 0.08, 0.07) if color == "red" else (0,0,0)
            remaining = page.insert_textbox(
                as_rect(text_box), translation, fontname="helv",
                fontsize=font_size, color=color_rgb, align=0,
                lineheight=1.12, overlay=True)
            if remaining < 0:
                raise ValueError(f"Translation overflow: {filename} page {number}")
        target = output / filename
        doc.save(target, garbage=4, deflate=True)
        doc.close()
        repaired = fitz.open(target)
        if len(repaired) != original_page_count:
            raise ValueError("Page count changed: " + filename)
        repaired.close()
        outcomes.append({"original": entry["path"], "repaired": str(target),
                         "changed_pages": [x[0] for x in changes],
                         "new_git_blob_sha": blob_sha(target.read_bytes())})
        print(f"REPAIRED: {filename} | pages {outcomes[-1]['changed_pages']}", flush=True)
    (output / "repair-validation.json").write_text(
        json.dumps({"files": outcomes, "note": "Visual regression required before publishing"},
                   indent=2) + "\n", encoding="utf-8")
    print(f"Completed {len(outcomes)} repaired PDFs; seven page areas.")

if __name__ == "__main__":
    main()
