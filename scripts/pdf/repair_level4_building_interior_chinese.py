#!/usr/bin/env python3
"""Restore verified image-embedded Chinese in four Level 4 Building manuals.

Local use (no GitHub Actions):
    python -m pip install pymupdf pillow
    python scripts/pdf/repair_level4_building_interior_chinese.py
    python scripts/pdf/repair_level4_building_interior_chinese.py --in-place

By default the repaired PDFs are written under .level4-english-output, preserving
their public/Level 4/Building/... paths. --in-place explicitly replaces the
original tracked PDF binaries *after* complete local validation. No Learning
manuals or other levels are touched.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

import fitz
from PIL import Image, ImageChops, ImageDraw, ImageOps

RASTER_SCALE = 1.55
# All boxes and origins are measured on the 1.55x rendered originals.
EDIT_SPEC = {
    "19. Swimming Plesiosaur-Building Manual.pdf": [
        {
            "page": 4, "box": (943, 424, 1115, 506),
            "text": "Note: Use an off-center\nhole.",
            "font": 10.2, "color": (0, 0, 0),
            "left": 945, "baseline": 447, "line_spacing": 16,
        },
    ],
    "09.Telegraph -Building Manual.pdf": [
        {
            "page": 25, "box": (69, 662, 325, 818),
            "text": (
                "Clip the marker here.\n"
                "Fasten it with a rubber band.\n"
                "Adjust its height so the tip\n"
                "just touches the paper\n"
                "without blocking the feed."
            ),
            "font": 9.2, "color": (0, 0, 0),
            "left": 74, "baseline": 686, "line_spacing": 21,
        },
        {
            "page": 25, "box": (876, 731, 1126, 812),
            "text": (
                "Fit a rubber band around\n"
                "the pulley. Do not use the\n"
                "drive belt."
            ),
            "font": 9.6, "color": (0, 0, 0),
            "left": 885, "baseline": 753, "line_spacing": 18,
        },
    ],
    "28. Turbo Drop-Building Manual.pdf": [
        {
            "page": 33, "box": (878, 398, 1200, 457),
            "text": "Route the string between\nthe two large gears.",
            "font": 11.2, "color": (0.82, 0.06, 0.06),
            "left": 882, "baseline": 424, "line_spacing": 19,
        },
    ],
    "13.Lucky Cat-Building Manual.pdf": [
        {
            "page": 17, "box": (546, 357, 667, 397),
            "text": "Photoelectric\nsensor",
            "font": 9.2, "color": (0, 0, 0),
            "left": 550, "baseline": 372, "line_spacing": 14,
        },
    ],
}


def git_blob_sha(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("ascii")
    return hashlib.sha1(header + data).hexdigest()


def pixel_image(page: fitz.Page) -> Image.Image:
    pix = page.get_pixmap(
        matrix=fitz.Matrix(RASTER_SCALE, RASTER_SCALE),
        colorspace=fitz.csRGB, alpha=False
    )
    return Image.frombytes("RGB", (pix.width, pix.height), pix.samples)


def compare_pages(original: fitz.Document, repaired: fitz.Document, edits: list[dict]):
    if len(original) != len(repaired):
        raise AssertionError("Page count was changed")
    target_pages = {e["page"] for e in edits}
    pixel_reports = []
    for zero_index in range(len(original)):
        pnum = zero_index + 1
        before = pixel_image(original[zero_index])
        after = pixel_image(repaired[zero_index])
        diff = ImageChops.difference(before, after)
        if pnum not in target_pages:
            if diff.getbbox() is not None:
                raise AssertionError(f"Unmodified page {pnum} changed")
            continue
        allowed = Image.new("L", before.size, 0)
        painter = ImageDraw.Draw(allowed)
        for edit in edits:
            if edit["page"] != pnum:
                continue
            x0, y0, x1, y1 = edit["box"]
            painter.rectangle((x0 - 3, y0 - 3, x1 + 3, y1 + 3), fill=255)
        changed_outside = ImageChops.multiply(
            diff.convert("L"), ImageOps.invert(allowed)
        )
        if changed_outside.getbbox() is not None:
            raise AssertionError(f"Page {pnum} changed outside annotation boxes")
        pixel_reports.append({
            "page": pnum,
            "all_changed_pixels_inside_target_boxes": True,
            "changed_bbox": list(diff.getbbox()) if diff.getbbox() else None,
        })
    for edit in edits:
        first_word = edit["text"].split()[0]
        extracted = repaired[edit["page"] - 1].get_text("text")
        if first_word not in extracted:
            raise AssertionError(f"English text missing on page {edit['page']}")
    return pixel_reports


def run(repo: Path, out_dir: Path, in_place: bool):
    report = json.loads(
        (repo / "reports/level4-building-complete-interior-audit-20261119.json").read_text(
            encoding="utf-8"
        )
    )
    results = []
    for basename, edits in EDIT_SPEC.items():
        matches = [f for f in report["files"] if Path(f["path"]).name == basename]
        if len(matches) != 1:
            raise AssertionError(f"Expected exactly one Level 4 Building manual: {basename}")
        item = matches[0]
        src = repo / item["path"]
        data = src.read_bytes()
        if git_blob_sha(data) != item["source_git_blob_sha"]:
            raise AssertionError(f"Original Git SHA changed: {item['path']}")
        if len(data) != item["bytes"]:
            raise AssertionError(f"Original length changed: {item['path']}")

        # A temporary file allows validation before any in-place replacement.
        dst = (repo / item["path"]) if in_place else (out_dir / item["path"])
        dst.parent.mkdir(parents=True, exist_ok=True)
        tmp = dst.with_name(dst.name + ".level4-pending.pdf")
        doc = fitz.open(stream=data, filetype="pdf")
        if len(doc) != item["pages"]:
            raise AssertionError(f"Page count differs from audit: {basename}")
        for edit in edits:
            page = doc[edit["page"] - 1]
            box = fitz.Rect(*(v / RASTER_SCALE for v in edit["box"]))
            page.draw_rect(box, color=None, fill=(1, 1, 1), overlay=True)
            for k, line in enumerate(edit["text"].splitlines()):
                font_size = edit["font"]
                left = edit["left"] / RASTER_SCALE
                baseline = (edit["baseline"] + k * edit["line_spacing"]) / RASTER_SCALE
                if fitz.get_text_length(line, fontname="helv", fontsize=font_size) > box.x1 - left + 1:
                    raise AssertionError(f"English annotation too wide: {line}")
                if baseline > box.y1 + 1:
                    raise AssertionError(f"English annotation too low: {line}")
                page.insert_text(
                    (left, baseline), line, fontname="helv",
                    fontsize=font_size, color=edit["color"], overlay=True
                )
        doc.save(tmp, garbage=0, deflate=False)
        doc.close()
        original = fitz.open(stream=data, filetype="pdf")
        repaired = fitz.open(tmp)
        try:
            changes = compare_pages(original, repaired, edits)
        finally:
            original.close()
            repaired.close()
        tmp.replace(dst)
        result = {
            "pdf_path": item["path"],
            "output_path": str(dst),
            "pages": item["pages"],
            "changed_pages": changes,
            "output_sha1_git_blob": git_blob_sha(dst.read_bytes()),
            "unmodified_pages_pixel_identical": True,
            "all_modified_pixels_within_annotation_boxes": True,
            "english_extractable": True,
        }
        results.append(result)
        print(f"PASS {basename}: {item['pages']} pages; {len(changes)} changed page(s)")
    summary_path = (repo / "reports") if in_place else out_dir
    summary_path.mkdir(parents=True, exist_ok=True)
    summary = summary_path / "level4-building-local-repair-validation.json"
    summary.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"Validation report: {summary}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", type=Path, default=Path(__file__).resolve().parents[2])
    parser.add_argument("--output-dir", type=Path, default=None)
    parser.add_argument("--in-place", action="store_true", help="Overwrite four original Building PDF binaries after local validation")
    args = parser.parse_args()
    root = args.repo_root.resolve()
    output = (args.output_dir or root / ".level4-english-output").resolve()
    if args.in_place and args.output_dir is not None:
        parser.error("--in-place cannot be combined with --output-dir")
    run(root, output, args.in_place)


if __name__ == "__main__":
    main()
