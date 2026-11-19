#!/usr/bin/env python3
"""Level 3 Building ONLY: restore the Gyro Transmitter cover's English-only version.

The original PDF already says "Gyro transmitter BUILDING MANUAL" in English.
Its teal image-embedded Chinese title was removed in the approved local test,
using a nearby clean sample of the original diagonal paper texture.
No OCR, translation guesses, Learning files, or GitHub Actions are involved.

Usage:
    python -m pip install pymupdf pillow numpy opencv-python-headless
    python scripts/pdf/generate_level3_building_english_cover.py
    python scripts/pdf/generate_level3_building_english_cover.py --write-public

The default generates a review PDF only. --write-public is an explicit opt-in,
subject to SHA checking and pixel-identity validation of every interior page.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
from pathlib import Path

import numpy as np
import pymupdf as fitz
from PIL import Image

FILENAME = "Gyro transmitter_Building.pdf"
ORIGINAL_BLOB_SHA = "82871820203830b6932c5b314ab7afa70183f215"
ORIGINAL_PAGE_COUNT = 17
SOURCE_RECT_PT = (170, 30, 544, 94)
TARGET_RECT_PT = (170, 102, 544, 166)
SCALE = 2
CHECK_SCALE = 1.4


def git_blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\x00" + data).hexdigest()


def create_edited_cover(original: fitz.Document) -> bytes:
    cover = original[0]
    assert abs(cover.rect.width - 807.874) < .1
    assert abs(cover.rect.height - 595.276) < .1
    pix = cover.get_pixmap(matrix=fitz.Matrix(SCALE, SCALE), alpha=False)
    image = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, 3).copy()
    modified = image.copy()

    sx0, sy0, sx1, sy1 = (int(n * SCALE) for n in SOURCE_RECT_PT)
    dx0, dy0, dx1, dy1 = (int(n * SCALE) for n in TARGET_RECT_PT)
    assert (sx1 - sx0, sy1 - sy0) == (dx1 - dx0, dy1 - dy0)

    # Both rectangles were measured against the Level 3 original; not reused
    # from Level 2. The source contains only the original light striped paper.
    source = image[sy0:sy1, sx0:sx1].astype(np.float32)
    target = image[dy0:dy1, dx0:dx1].astype(np.float32)
    rows, cols = target.shape[:2]
    fade = 6 * SCALE
    yy = np.minimum(np.arange(rows), np.arange(rows)[::-1]).astype(np.float32)
    xx = np.minimum(np.arange(cols), np.arange(cols)[::-1]).astype(np.float32)
    alpha = (np.minimum(1, yy[:, None] / fade)
             * np.minimum(1, xx[None, :] / fade))[:, :, None]
    modified[dy0:dy1, dx0:dx1] = np.clip(
        target * (1 - alpha) + source * alpha, 0, 255
    ).astype(np.uint8)

    # No other part of the original first page may be edited. In particular,
    # the already-English title at >=166pt remains unchanged.
    assert np.array_equal(image[:dy0], modified[:dy0])
    assert np.array_equal(image[dy1:], modified[dy1:])
    assert np.array_equal(image[dy0:dy1, :dx0], modified[dy0:dy1, :dx0])
    assert np.array_equal(image[dy0:dy1, dx1:], modified[dy0:dy1, dx1:])
    assert not np.array_equal(image[dy0:dy1, dx0:dx1], modified[dy0:dy1, dx0:dx1])

    buffer = io.BytesIO()
    Image.fromarray(modified).save(buffer, format="PNG", optimize=True)
    return buffer.getvalue()


def validate(original_path: Path, cleaned_path: Path) -> dict:
    original = fitz.open(original_path)
    cleaned = fitz.open(cleaned_path)
    if len(original) != ORIGINAL_PAGE_COUNT or len(cleaned) != len(original):
        raise RuntimeError("Page count changed")
    for page_no in range(len(original)):
        if any(abs(a - b) > .05 for a, b in [
            (original[page_no].rect.width, cleaned[page_no].rect.width),
            (original[page_no].rect.height, cleaned[page_no].rect.height),
        ]):
            raise RuntimeError(f"Page dimensions changed at index {page_no}")
    exact = 0
    for page_no in range(1, len(original)):
        p0 = original[page_no].get_pixmap(
            matrix=fitz.Matrix(CHECK_SCALE, CHECK_SCALE), alpha=False
        )
        p1 = cleaned[page_no].get_pixmap(
            matrix=fitz.Matrix(CHECK_SCALE, CHECK_SCALE), alpha=False
        )
        if (p0.width, p0.height, p0.samples) != (p1.width, p1.height, p1.samples):
            raise RuntimeError(f"Interior page {page_no + 1} changed")
        exact += 1
    report = {
        "scope": "Level 3 Building only",
        "file": FILENAME,
        "original_git_blob_sha": ORIGINAL_BLOB_SHA,
        "cleaned_git_blob_sha": git_blob_sha(cleaned_path.read_bytes()),
        "page_count_before": len(original),
        "page_count_after": len(cleaned),
        "all_page_dimensions_unchanged": True,
        "interior_pages_pixel_identical": exact,
        "interior_pages_total": len(original) - 1,
        "existing_english_retained": "Gyro transmitter / BUILDING MANUAL",
        "chinese_cover_text_replaced_by_original_background": "陀螺发射器 / 搭建手册",
        "result": "PASS",
    }
    original.close()
    cleaned.close()
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", default="public")
    parser.add_argument("--output-dir", default="build/level3-building-english")
    parser.add_argument("--write-public", action="store_true")
    args = parser.parse_args()
    original_path = Path(args.source_dir) / FILENAME
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    if not original_path.is_file():
        raise FileNotFoundError(original_path)
    data = original_path.read_bytes()
    sha = git_blob_sha(data)
    if sha != ORIGINAL_BLOB_SHA:
        raise RuntimeError(f"Original blob SHA mismatch; expected {ORIGINAL_BLOB_SHA}, got {sha}")
    original = fitz.open(stream=data, filetype="pdf")
    if len(original) != ORIGINAL_PAGE_COUNT:
        raise RuntimeError("Unexpected page count; refusing to modify")
    size = original[0].rect
    image_data = create_edited_cover(original)
    original.delete_page(0)
    front = original.new_page(pno=0, width=size.width, height=size.height)
    front.insert_image(front.rect, stream=image_data, keep_proportion=False)
    cleaned_path = output_dir / FILENAME
    original.save(cleaned_path, garbage=4, deflate=True)
    original.close()
    result = validate(original_path, cleaned_path)
    report_path = output_dir / "validation.json"
    report_path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    if args.write_public:
        # Only after validation; replace exactly one Building PDF.
        tmp = original_path.with_suffix(".validated.tmp")
        try:
            tmp.write_bytes(cleaned_path.read_bytes())
            os.replace(tmp, original_path)
        finally:
            if tmp.exists():
                tmp.unlink()
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
