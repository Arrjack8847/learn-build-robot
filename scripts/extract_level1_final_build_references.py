#!/usr/bin/env python3
"""Generate local candidate reference images from original Level 1 Building PDFs.

Requirements: pip install pymupdf pillow
Usage:
  python scripts/extract_level1_final_build_references.py
  python scripts/extract_level1_final_build_references.py --inspect "Clock_Building.pdf"
  python scripts/extract_level1_final_build_references.py --approve "Clock_Building.pdf:1" "Big head robot_Building.pdf:1"

First run exports candidate page 1 from every recognized Building PDF into a review
directory, without publishing anything to the student UI. Inspect candidate images
before approving: some first pages may contain instructions rather than completed models.
Approvals publish ONLY chosen page renders into public/final-build/level-1/references.
"""
import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REVIEW = ROOT / "artifacts" / "level1-reference-review"
DEST = PUBLIC / "final-build" / "level-1" / "references"
MANIFEST = PUBLIC / "final-build" / "level-1" / "references.json"

def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--approve", nargs="*", default=[], metavar="PDF_NAME:PAGE")
    parser.add_argument("--inspect", nargs="*", default=[], metavar="PDF_NAME",
                        help="Render every page of the named PDF(s) for visual review")
    args = parser.parse_args()
    try:
        import pymupdf as fitz
    except ImportError as exc:
        raise SystemExit("Install PyMuPDF: python -m pip install pymupdf") from exc
    REVIEW.mkdir(parents=True, exist_ok=True)
    DEST.mkdir(parents=True, exist_ok=True)
    if args.inspect:
        for filename in args.inspect:
            path = PUBLIC / filename
            if not path.is_file() or path.suffix.lower() != ".pdf":
                parser.error("Missing PDF under public/: " + filename)
            pages_dir = REVIEW / slug(path.stem)
            pages_dir.mkdir(parents=True, exist_ok=True)
            with fitz.open(path) as doc:
                for page_index, page in enumerate(doc):
                    output = pages_dir / f"page-{page_index + 1:03d}.png"
                    page.get_pixmap(matrix=fitz.Matrix(1.1, 1.1), alpha=False).save(output)
                print("Review all", len(doc), "pages in", pages_dir.relative_to(ROOT))
        if not args.approve:
            return
    approved = {}
    if MANIFEST.exists():
        approved = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for entry in args.approve:
        if ":" not in entry:
            parser.error("Approval must be PDF_NAME:PAGE, for example Clock_Building.pdf:1")
        filename, page_text = entry.rsplit(":", 1)
        if not page_text.isdigit() or int(page_text) < 1:
            parser.error("Page must be a positive integer")
        path = PUBLIC / filename
        if not path.is_file() or path.suffix.lower() != ".pdf":
            parser.error("Missing PDF under public/: " + filename)
        with fitz.open(path) as doc:
            page_index = int(page_text) - 1
            if page_index >= len(doc):
                parser.error("Page is outside PDF: " + entry)
            name = slug(path.stem) + ".png"
            doc[page_index].get_pixmap(matrix=fitz.Matrix(1.8, 1.8), alpha=False).save(DEST / name)
            approved[path.name] = {"image": "/final-build/level-1/references/" + name, "page": int(page_text), "source": path.name}
            print("Approved:", entry)
    if args.approve:
        MANIFEST.parent.mkdir(parents=True, exist_ok=True)
        MANIFEST.write_text(json.dumps(approved, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    else:
        source = (ROOT / "src" / "data" / "pdfActivityManuals.ts").read_text(encoding="utf-8")
        level_one_declarations = source.split("const level2AxeRobotPdfUrl", 1)[0]
        names = sorted(set(re.findall(r'staticPdfUrl\\("([^"]+\\.pdf)"\\)', level_one_declarations)))
        names.insert(0, "Acceleration car_Building.pdf")
        for filename in names:
            path = PUBLIC / filename
            if not path.exists():
                print("Not found:", filename)
                continue
            with fitz.open(path) as doc:
                if not doc.page_count:
                    continue
                out = REVIEW / (slug(path.stem) + "-page-1.png")
                doc[0].get_pixmap(matrix=fitz.Matrix(1.3, 1.3), alpha=False).save(out)
                print("Review candidate:", out.relative_to(ROOT), "pages:", len(doc))
                if len(doc) > 1:
                    last = REVIEW / (slug(path.stem) + f"-page-{len(doc)}.png")
                    doc[-1].get_pixmap(matrix=fitz.Matrix(1.3, 1.3), alpha=False).save(last)
        print("No student images published. Inspect candidates and use --approve for confirmed completed-model pages.")

if __name__ == "__main__":
    main()
