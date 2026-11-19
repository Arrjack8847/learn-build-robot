#!/usr/bin/env python3
"""Rebuild the approved English covers for 20 Level 2 BUILDING manuals.

This is intentionally NOT a Learning PDF cleaner. Use the originals in public/.
Requires: python -m pip install pymupdf pillow numpy opencv-python-headless

Default mode only writes review copies to a separate folder. No GitHub Actions.
To replace the 20 original Building PDFs locally after inspecting the review:
    python scripts/pdf/generate_level2_building_english_covers.py --write-public
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
from pathlib import Path

import cv2
import numpy as np
import pymupdf as fitz
from PIL import Image

# Coordinates are in PDF points. Locked after comparing original cover renders.
# The original project's English title beneath each Chinese heading is retained.
COVERS = [
    ("Rotating flying chair_Building.pdf", "ROTATING FLYING CHAIR", [(130, 99, 458, 149)]),
    ("Pirate ship_Building.pdf", "PIRATE SHIP", [(132, 100, 430, 154)]),
    ("Scaling ladder.pdf", "LIFT CAR", []),
    ("Mechanical dog.pdf", "MECHANICAL DOG", [(109, 111, 448, 180)]),
    ("Tower crane_Building.pdf", "CRANE TOWER", [(132, 243, 350, 290)]),
    ("Flashlight_Building.pdf", "MANUAL FLASHLIGHT", [(457, 165, 738, 215)]),
    ("Jumping machine_Building.pdf", "JUMPING MACHINE", [(161, 256, 402, 301)]),
    ("Bridge_Building.pdf", "TRUSS BRIDGE", [(331, 91, 515, 164), (405, 141, 546, 195)]),
    ("Door_Building.pdf", "DOOR", [(135, 137, 348, 181)]),
    ("Double beam crane_Building.pdf", "DOUBLE BEAM CRANE", [(341, 95, 710, 143)]),
    ("Hand crank_Building.pdf", "HAND CRANK", [(129, 192, 449, 241)]),
    ("Gearbox_Building.pdf", "GEARBOX", [(174, 112, 446, 161)]),
    ("Crane_.pdf", "CRANE", [(181, 140, 409, 191)]),
    ("Walking Robot.pdf", "ATLAS ROBOT", [(305, 334, 779, 391)]),
    ("Teeterboard.pdf", "SEESAW", [(233, 222, 511, 271)]),
    ("Harp_Building.pdf", "HARP", [(164, 158, 395, 207)]),
    ("Lifting door_Building.pdf", "LIFTING DOOR", [(175, 245, 452, 294)]),
    ("Balance.pdf", "SEESAW", [(195, 184, 431, 230)]),
    ("Pliers.pdf", "TONGS", [(437, 216, 669, 268)]),
    ("Balance_v2.pdf", "SEESAW", [(233, 222, 511, 271)]),
]
TEAL = (85 / 255, 198 / 255, 208 / 255)


def remove_chinese_from_cover_image(image: Image.Image, rects):
    pixels = np.asarray(image.convert("RGB")).copy()
    mask = np.zeros(pixels.shape[:2], np.uint8)
    height, width = mask.shape
    for x0, y0, x1, y1 in rects:
        left, top = max(0, round(x0 * 2)), max(0, round(y0 * 2))
        right, bottom = min(width, round(x1 * 2)), min(height, round(y1 * 2))
        assert left < right and top < bottom, "Bad redaction rectangle"
        mask[top:bottom, left:right] = 255
    return Image.fromarray(cv2.inpaint(pixels, mask, 7, cv2.INPAINT_TELEA))


def add_title(cover: fitz.Page, title: str, rect):
    x0, y0, x1, y1 = rect
    width, height = x1 - x0, y1 - y0
    portion = 0.63 if width > 380 else 0.61
    font_size = min(32, max(12, height * 0.56))
    font_size = min(font_size, (width - 6) * portion /
                    fitz.get_text_length(title, fontname="helv", fontsize=1))
    cover.insert_text((x0 + 2, y0 + height * 0.72), title,
                      fontname="helv", fontsize=font_size, color=TEAL)
    band_x = x0 + width * portion
    band_w = x1 - band_x - 2
    band_h = min(29, height * 0.66)
    band_y = y0 + (height - band_h) / 2
    cover.draw_rect(fitz.Rect(band_x, band_y, x1 - 1, band_y + band_h),
                    fill=TEAL, color=None)
    label = "BUILDING MANUAL"
    label_size = min(15, (band_w - 8) /
                     fitz.get_text_length(label, fontname="hebo", fontsize=1),
                     band_h * 0.51)
    label_w = fitz.get_text_length(label, fontname="hebo", fontsize=label_size)
    cover.insert_text((band_x + (band_w - label_w) / 2, band_y + band_h * 0.70),
                      label, fontname="hebo", fontsize=label_size, color=(1, 1, 1))


def edit_scaling_ladder(doc: fitz.Document):
    """Reproduce the separately approved Lift Car / Scaling Ladder cover."""
    page = doc[0]
    images = page.get_images(full=True)
    assert images and images[0][2:4] == (1636, 1212), "Unexpected Scaling Ladder source"
    xref = images[0][0]
    old_image = doc.extract_image(xref)["image"]
    array = np.asarray(Image.open(io.BytesIO(old_image)).convert("RGB")).copy()
    region = array[190:285, 680:961].astype(np.int16)
    red, green, blue = region[:, :, 0], region[:, :, 1], region[:, :, 2]
    turquoise = ((green - red > 5) & (blue - red > 6) &
                 (green > 85) & (blue > 90)).astype(np.uint8) * 255
    mask = np.zeros(array.shape[:2], np.uint8)
    mask[190:285, 680:961] = turquoise
    mask = cv2.dilate(mask, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    array = cv2.inpaint(array, mask, 6, cv2.INPAINT_TELEA)
    array[210:278, 963:1214] = [85, 198, 208]
    buf = io.BytesIO()
    Image.fromarray(array).save(buf, format="PNG", optimize=True)
    page.replace_image(xref, stream=buf.getvalue())
    page.insert_text((390, 170), "LIFT CAR", fontname="helv", fontsize=36, color=TEAL)
    bar_left = -45.14265823364258 + 963 * (1029.33095 / 1636)
    bar_right = -45.14265823364258 + 1214 * (1029.33095 / 1636)
    label_width = fitz.get_text_length("BUILDING MANUAL", fontname="hebo", fontsize=15)
    text_x = bar_left + (bar_right - bar_left - label_width) / 2
    page.insert_text((text_x, 164.5), "BUILDING MANUAL",
                     fontname="hebo", fontsize=15, color=(1, 1, 1))


def edit_other_cover(doc: fitz.Document, title: str, rects, filename: str):
    original = doc[0]
    original_width, original_height = original.rect.width, original.rect.height
    render = original.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
    pixels = Image.frombytes("RGB", (render.width, render.height), render.samples)
    cleaned = remove_chinese_from_cover_image(pixels, rects)
    stream = io.BytesIO()
    cleaned.save(stream, format="JPEG", quality=94, optimize=True, subsampling=0)

    # Replacing only the cover page preserves all subsequent PDF page objects.
    doc.delete_page(0)
    cover = doc.new_page(pno=0, width=original_width, height=original_height)
    cover.insert_image(cover.rect, stream=stream.getvalue())
    if filename == "Bridge_Building.pdf":
        # The original English BRIDGE and BUILDING MANUAL are already present.
        # Replace only the Chinese words in the two title blocks.
        x0, y0, x1, y1 = rects[0]
        cover.insert_text((x0 + 4, y0 + 33), "TRUSS",
                          fontname="helv", fontsize=24, color=TEAL)
        rx0, ry0, rx1, ry1 = rects[1]
        cover.draw_rect(fitz.Rect(rx0, ry0 + 7, rx1 - 2, ry1 - 6),
                        fill=TEAL, color=None)
        label = "BUILD GUIDE"
        size = min(12, (rx1 - rx0 - 9) /
                   fitz.get_text_length(label, fontname="hebo", fontsize=1))
        cover.insert_text((rx0 + 5, ry1 - 14), label,
                          fontname="hebo", fontsize=size, color=(1, 1, 1))
    else:
        add_title(cover, title, rects[0])


def validate(source: Path, output: Path, expected_pages: int):
    before = fitz.open(source)
    after = fitz.open(output)
    assert len(before) == len(after) == expected_pages
    for index in range(len(before)):
        a, b = before[index], after[index]
        assert a.rect == b.rect, f"{source.name}: page size changed {index + 1}"
        if index == 0:
            continue
        assert a.get_text() == b.get_text(), f"{source.name}: text changed {index + 1}"
        a_pixels = a.get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False)
        b_pixels = b.get_pixmap(matrix=fitz.Matrix(1, 1), alpha=False)
        assert a_pixels.samples == b_pixels.samples, (
            f"{source.name}: illustration changed on page {index + 1}")
    before.close()
    after.close()


def git_blob_sha(path: Path) -> str:
    content = path.read_bytes()
    header = f"blob {len(content)}\0".encode()
    return hashlib.sha1(header + content).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", type=Path, default=Path("public"),
                        help="Location of untouched original Building PDFs")
    parser.add_argument("--output-dir", type=Path, default=Path("build/level2-building-english"),
                        help="Review-copy destination (separate from public/)")
    parser.add_argument("--only", help="Generate just one exact filename")
    parser.add_argument("--write-public", action="store_true",
                        help="Explicit opt-in: atomically replace source PDFs AFTER validation")
    args = parser.parse_args()

    selected = [entry for entry in COVERS if not args.only or entry[0] == args.only]
    if not selected:
        parser.error("Unknown --only filename")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for filename, title, rects in selected:
        source = args.source_dir / filename
        if not source.is_file():
            raise FileNotFoundError(f"Missing original Building PDF: {source}")
        original_sha = git_blob_sha(source)
        document = fitz.open(source)
        pages = len(document)
        if filename == "Scaling ladder.pdf":
            edit_scaling_ladder(document)
        else:
            edit_other_cover(document, title, rects, filename)
        out = args.output_dir / filename
        document.save(out, garbage=4, deflate=True)
        document.close()
        validate(source, out, pages)
        results.append({"file": filename, "pages": pages,
                        "original_git_blob": original_sha,
                        "cleaned_sha256": hashlib.sha256(out.read_bytes()).hexdigest()})
        if args.write_public:
            replacement = source.with_suffix(".pdf.tmp")
            replacement.write_bytes(out.read_bytes())
            os.replace(replacement, source)
        print(f"PASS: {filename}, {pages} pages, all non-cover pages preserved", flush=True)
    report = args.output_dir / "validation.json"
    report.write_text(json.dumps(results, indent=2) + "\n", encoding="utf-8")
    print(f"Validated {len(results)} Building PDF(s); report: {report}")


if __name__ == "__main__":
    main()

