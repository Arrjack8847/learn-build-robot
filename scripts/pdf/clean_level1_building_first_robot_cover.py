#!/usr/bin/env python3
"""Level 1 Building PDF English cover repair: First Robot Model only.

Removes the Chinese-only THIRD title line from page 1. Existing English
'Your First Robot Model / BUILDING MANUAL' text, artwork, and all 14 build
pages must remain unchanged. No Learning PDFs are touched.

Run locally (no GitHub Actions):
    pip install pymupdf numpy
    python scripts/pdf/clean_level1_building_first_robot_cover.py
    python scripts/pdf/clean_level1_building_first_robot_cover.py --write-public

By default writes a QA review copy; --write-public replaces the existing
public/ PDF only after all source and render checks pass. Commit the resulting
PDF binary separately; a script-only PR does not deliver the repaired manual.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import pathlib
import re
import shutil
import tempfile

import numpy as np
import pymupdf as fitz

SOURCE_PATH = pathlib.Path("public/First Robot Model.pdf")
ORIGINAL_BLOB_SHA = "73c12dc37b41ed6a78b8786672ef1d19c3b8d781"
CHINESE_LINE = "您的第一个机器人模型"
EXPECTED_ENGLISH = ("Your First Robot Model", "BUILDING MANUAL")
EXPECTED_PAGES = 15


def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + bytes([0]) + data).hexdigest()


def render_rgb(page: fitz.Page, scale: float = 1.3) -> np.ndarray:
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False, colorspace=fitz.csRGB)
    return np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3).copy()


def repair(source: pathlib.Path, output: pathlib.Path) -> dict:
    original_bytes = source.read_bytes()
    assert original_bytes.startswith(b"%PDF-"), "Not a PDF"
    assert git_blob_sha(original_bytes) == ORIGINAL_BLOB_SHA, "Unexpected source PDF: abort"

    doc = fitz.open(stream=original_bytes, filetype="pdf")
    assert len(doc) == EXPECTED_PAGES, "Unexpected page count"
    page = doc[0]
    original_text = page.get_text()
    assert original_text.count(CHINESE_LINE) == 1, "Expected Chinese title not found exactly once"
    assert all(text in original_text for text in EXPECTED_ENGLISH), "Original English title missing"
    assert len(page.get_contents()) == 1, "Unexpected PDF content structure"

    xref = page.get_contents()[0]
    stream = doc.xref_stream(xref)
    text_objects = re.findall(rb"BT.*?ET", stream, flags=re.S)
    chinese_objects = [obj for obj in text_objects if b"/F11 " in obj and b"ActualText" in obj]
    assert len(text_objects) == 3 and len(chinese_objects) == 1, (
        "Cannot safely isolate the Chinese title text object"
    )

    # Delete only this existing text object. Do not redact or repaint the
    # original background, diagrams, English title, logo, or artwork.
    doc.update_stream(xref, stream.replace(chinese_objects[0], b"", 1))
    output.parent.mkdir(parents=True, exist_ok=True)
    doc.save(output, garbage=4, deflate=True)
    doc.close()

    before = fitz.open(source)
    after = fitz.open(output)
    assert len(before) == len(after) == EXPECTED_PAGES
    assert after[0].get_text().strip() == original_text.replace(CHINESE_LINE, "").strip(), (
        "English cover text was changed"
    )

    for i in range(EXPECTED_PAGES):
        assert before[i].rect == after[i].rect, f"Geometry changed on page {i+1}"
        if i:
            assert render_rgb(before[i], 1.0).tobytes() == render_rgb(after[i], 1.0).tobytes(), (
                f"Non-cover page {i+1} changed"
            )

    a, b = render_rgb(before[0]), render_rgb(after[0])
    changed = np.any(a != b, axis=2)
    yy, xx = np.where(changed)
    assert len(xx) > 0, "No visual cover change"
    bbox = [float(v) for v in (xx.min()/1.3, yy.min()/1.3, xx.max()/1.3, yy.max()/1.3)]
    assert 345 <= bbox[0] <= 370 and 275 <= bbox[1] <= 295
    assert bbox[2] <= 710 and bbox[3] <= 330, f"Unexpected changed region {bbox}"

    result = {
        "source": str(source), "output": str(output), "pages": EXPECTED_PAGES,
        "noncover_pages_raster_identical": EXPECTED_PAGES - 1,
        "first_page_changed_region_points": [round(v, 1) for v in bbox],
        "chinese_line_removed": True,
        "english_lines_preserved": list(EXPECTED_ENGLISH),
        "source_git_blob_sha": ORIGINAL_BLOB_SHA,
        "output_sha256": hashlib.sha256(output.read_bytes()).hexdigest(),
    }
    before.close()
    after.close()
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo", type=pathlib.Path, default=pathlib.Path("."))
    parser.add_argument("--write-public", action="store_true")
    parser.add_argument("--review-dir", type=pathlib.Path, default=pathlib.Path("review/building-english/level1"))
    args = parser.parse_args()
    source = args.repo / SOURCE_PATH
    destination = args.repo / args.review_dir / "First Robot Model - English Cover.pdf"

    # First create and validate a separate review copy.
    result = repair(source, destination)
    if args.write_public:
        # Deliver the binary at the exact existing path (after validation).
        shutil.copyfile(destination, source)
        result["public_binary_replaced"] = True
    else:
        result["public_binary_replaced"] = False
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
