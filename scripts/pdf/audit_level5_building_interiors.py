#!/usr/bin/env python3
"""Read-only Level 5 Building PDF text/image audit. No GitHub Actions.

Use from the repository root after original PDF binaries are available:
  python scripts/pdf/audit_level5_building_interiors.py
  python scripts/pdf/audit_level5_building_interiors.py --render-all
  python scripts/pdf/audit_level5_building_interiors.py --render-all --ocr

The script never writes to public/ and never modifies any PDF. A zero-detection
result is NOT an English-only certification until every page is visually reviewed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    import fitz

HAN = re.compile(
    r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
    r"\U00020000-\U0002a6df\U0002a700-\U0002b73f"
    r"\U0002b740-\U0002b81f\U0002b820-\U0002ceaf]+"
)

def git_blob_sha(blob: bytes) -> str:
    header = b"blob " + str(len(blob)).encode("ascii") + b"\x00"
    return hashlib.sha1(header + blob).hexdigest()

def han_matches(text: str) -> list[str]:
    return HAN.findall(text or "")

def rendered_page(page, destination: Path, dpi: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    pix = page.get_pixmap(
        matrix=fitz.Matrix(dpi / 72, dpi / 72),
        colorspace=fitz.csRGB, alpha=False
    )
    pix.save(str(destination))

def available_chinese_ocr() -> bool:
    if not shutil.which("tesseract"):
        return False
    p = subprocess.run(["tesseract", "--list-langs"],
                       capture_output=True, text=True, check=False)
    return p.returncode == 0 and "chi_sim" in p.stdout.split()

def ocr_suspects(png: Path) -> list[str]:
    p = subprocess.run(
        ["tesseract", str(png), "stdout", "-l", "chi_sim+eng", "--psm", "11"],
        capture_output=True, text=True, check=False
    )
    if p.returncode:
        raise RuntimeError(f"OCR failed for {png}: {p.stderr[:500]}")
    return han_matches(p.stdout)

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--repo", type=Path, default=Path("."))
    ap.add_argument("--output", type=Path, default=Path("build/level5-building-english-audit"))
    ap.add_argument("--render-all", action="store_true",
                    help="Export every page as a PNG for mandatory visual review")
    ap.add_argument("--ocr", action="store_true",
                    help="Suggest image-embedded Chinese using Tesseract chi_sim+eng")
    ap.add_argument("--dpi", type=int, default=150)
    args = ap.parse_args()

    root = args.repo.resolve()
    output = args.output if args.output.is_absolute() else root / args.output
    output.mkdir(parents=True, exist_ok=True)

    manifest = json.loads(
        (root / "reports/level5-building-english-audit-20261119.json")
        .read_text(encoding="utf-8")
    )
    originals = manifest["files"]
    assert len(originals) == 45, "Expected exactly 45 inventoried PDFs"
    assert len({item["path"] for item in originals}) == 45

    if args.ocr and not available_chinese_ocr():
        raise RuntimeError(
            "Chinese OCR is unavailable. Install Tesseract and chi_sim data; "
            "do not certify pages based on English-only OCR."
        )

    result = {
        "source_commit": manifest["source"]["commit"],
        "scope": "Level 5 Building PDFs only",
        "source_count": len(originals),
        "pdfs_rehashed": 0,
        "pages_text_scanned": 0,
        "pages_rendered": 0,
        "pages_ocr_scanned": 0,
        "visual_review_completed": False,
        "english_only_certified": False,
        "confirmed_replacements": [],
        "note": ("Extractable text is mechanically checked. OCR is an unconfirmed "
                 "candidate detector; every page image still needs visual review."),
        "files": [],
    }
    for index, item in enumerate(originals, start=1):
        path = root / item["path"]
        if not path.is_file():
            raise FileNotFoundError(
                f"Original PDF missing: {path}. Do not substitute Wix content "
                "without checking its Git blob ID first."
            )
        source = path.read_bytes()
        observed_sha = git_blob_sha(source)
        if observed_sha != item["git_blob_sha"]:
            raise ValueError(f"Source Git blob ID mismatch: {path}")
        if len(source) != item["git_object_bytes"]:
            raise ValueError(f"Source byte-size mismatch: {path}")

        doc = fitz.open(stream=source, filetype="pdf")
        if doc.needs_pass:
            raise ValueError(f"Encrypted PDF requires handling: {path}")

        info = {
            "path": item["path"],
            "source_git_blob_sha": observed_sha,
            "bytes": len(source),
            "pages": len(doc),
            "page_sizes_points": [],
            "extractable_chinese": [],
            "ocr_candidates_unconfirmed": [],
            "all_pages_text_scanned": False,
            "all_pages_rendered": False,
            "all_pages_ocr_scanned": False,
            "visual_review": "pending",
        }
        for number, page in enumerate(doc, start=1):
            info["page_sizes_points"].append(
                [round(page.rect.width, 2), round(page.rect.height, 2)]
            )
            for block in page.get_text("dict").get("blocks", []):
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        found = han_matches(span.get("text", ""))
                        if found:
                            info["extractable_chinese"].append({
                                "page_number": number,
                                "text": span["text"],
                                "chinese_runs": found,
                                "bbox_points": [round(v, 2) for v in span["bbox"]],
                                "translation": None,
                                "repair_method": None
                            })
            result["pages_text_scanned"] += 1

            if args.render_all or args.ocr:
                target = output / "pages" / f"{index:02d}" / f"page-{number:04d}.png"
                rendered_page(page, target, args.dpi)
                result["pages_rendered"] += 1
                if args.ocr:
                    found = ocr_suspects(target)
                    if found:
                        info["ocr_candidates_unconfirmed"].append({
                            "page_number": number,
                            "suggested_chinese_runs": found,
                            "requires_visual_confirmation": True
                        })
                    result["pages_ocr_scanned"] += 1

        info["all_pages_text_scanned"] = True
        info["all_pages_rendered"] = bool(args.render_all or args.ocr)
        info["all_pages_ocr_scanned"] = bool(args.ocr)
        result["files"].append(info)
        result["pdfs_rehashed"] += 1
        print(f"[{index:02d}/45] {item['path']} ({len(doc)} pages)", flush=True)
        doc.close()

    (output / "inspection-results.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    print(
        f"Checked {result['pdfs_rehashed']} original hashes, "
        f"{result['pages_text_scanned']} pages of extractable text; "
        "visual confirmation STILL REQUIRED."
    )

if __name__ == "__main__":
    main()
