#!/usr/bin/env python3
"""Level 3 Building PDFs only: regenerate both SHA-verified English restorations.

Outputs actual corrected PDFs to build/level3-complete-building-english by default.
Optionally write them to public/ only after local validations pass. This script
never modifies Learning PDFs or any other level. No CI or GitHub Actions.
"""
from __future__ import annotations

import argparse
import hashlib
import io
import json
import subprocess
import sys
from pathlib import Path

import cv2
import numpy as np
import pymupdf as fitz
from PIL import Image

SOURCES = {
    "Gyro transmitter_Building.pdf": ("82871820203830b6932c5b314ab7afa70183f215", 17),
    "Electronic scale.pdf": ("3afceb33862213ed99d10bfa0fb4d994c57a7184", 27),
}
TRANSLATION = ("Besides transmitting information, what other\n"
               "functions do the controller's ports serve?")


def blob_sha(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode() + b"\x00" + data).hexdigest()


def check_sources(source: Path) -> None:
    for name, (expected_sha, count) in SOURCES.items():
        data = (source / name).read_bytes()
        if blob_sha(data) != expected_sha:
            raise RuntimeError(f"Wrong source SHA for {name}")
        with fitz.open(stream=data, filetype="pdf") as pdf:
            if len(pdf) != count:
                raise RuntimeError(f"Wrong original page count for {name}")


def gyro_english(source: Path, output: Path) -> None:
    generator = Path(__file__).with_name("generate_level3_building_english_cover.py")
    subprocess.run([sys.executable, str(generator),
                    "--source-dir", str(source), "--output-dir", str(output)],
                   check=True, stdout=subprocess.DEVNULL)
    path = output / "Gyro transmitter_Building.pdf"
    pdf = fitz.open(path)
    page = pdf[0]
    scale = 2
    pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
    rgb = np.frombuffer(pix.samples, np.uint8).reshape(
        pix.height, pix.width, 3).copy()

    # The prior cover repair removed 陀螺发射器 / 搭建手册.
    # The remaining 中鸣机器人 is redundant with the retained roman ZMROBO.
    # Restore only the pale paper behind that Chinese subtitle.
    x0, y0, x1, y1 = [int(v * scale) for v in (390, 555, 484, 575)]
    patch = rgb[y0:y1, x0:x1]
    gray = cv2.cvtColor(patch, cv2.COLOR_RGB2GRAY)
    mask = cv2.dilate(np.uint8(gray < 225) * 255,
                      np.ones((3, 3), np.uint8), iterations=1)
    fixed = cv2.inpaint(patch, mask, 3, cv2.INPAINT_TELEA)
    buf = io.BytesIO()
    Image.fromarray(fixed).save(buf, format="PNG")
    page.insert_image(fitz.Rect(390, 555, 484, 575),
                      stream=buf.getvalue(), overlay=True)

    # All 16 instruction pages repeat the same image-embedded Chinese
    # manufacturer subtitle (中鸣机器人) beside the roman brand ZMROBO.
    # Remove only that Chinese footer; do not modify assembly diagrams.
    footer = fitz.Rect(410, 558, 515, 585)
    for index in range(1, len(pdf)):
        interior = pdf[index]
        rendered = interior.get_pixmap(
            matrix=fitz.Matrix(scale, scale), alpha=False)
        rgb = np.frombuffer(rendered.samples, np.uint8).reshape(
            rendered.height, rendered.width, 3)
        x0, y0, x1, y1 = (int(v * scale) for v in
                          [footer.x0, footer.y0, footer.x1, footer.y1])
        cropped = rgb[y0:y1, x0:x1].copy()
        grayscale = cv2.cvtColor(cropped, cv2.COLOR_RGB2GRAY)
        mask = cv2.dilate(np.uint8(grayscale < 228) * 255,
                          np.ones((3, 3), np.uint8), iterations=1)
        retouched = cv2.inpaint(cropped, mask, 3, cv2.INPAINT_TELEA)
        patch = io.BytesIO()
        Image.fromarray(retouched).save(patch, format="PNG")
        interior.insert_image(footer, stream=patch.getvalue(), overlay=True)
    tmp = output / ".gyro-complete.tmp.pdf"
    pdf.save(tmp, garbage=4, deflate=True)
    pdf.close()
    tmp.replace(path)


def scale_english(source: Path, output: Path) -> None:
    name = "Electronic scale.pdf"
    pdf = fitz.open(source / name)
    expected_chinese = "控制器上的接口除了传递信息还具有什么作用"
    for index in (24, 25):
        page = pdf[index]
        actual = "".join(c for c in page.get_text()
                         if 0x3400 <= ord(c) <= 0x9FFF)
        if actual != expected_chinese:
            raise RuntimeError(f"Unexpected Chinese on page {index + 1}")
        # The original Chinese lives behind assembly artwork and is not
        # visibly readable. Remove its embedded text without touching images,
        # then place the translation in the blank bottom content margin.
        page.add_redact_annot(fitz.Rect(242, 310, 558, 335),
                              fill=False, cross_out=False)
        page.apply_redactions(images=0, graphics=0, text=0)
        remaining = page.insert_textbox(
            fitz.Rect(176, 445, 562, 481), TRANSLATION,
            fontname="helv", fontsize=11.6, lineheight=1.14,
            color=(0, 0, 0), overlay=True)
        if remaining < 0:
            raise RuntimeError("English text clipped on Electronic Scale")
    pdf.save(output / name, garbage=4, deflate=True)
    pdf.close()


def validate(source: Path, output: Path) -> dict:
    results = []
    for name, (_, count) in SOURCES.items():
        original, edited = fitz.open(source / name), fitz.open(output / name)
        if len(original) != len(edited) or len(edited) != count:
            raise RuntimeError(f"Page count changed: {name}")
        unchanged = 0
        for i in range(count):
            p, q = original[i], edited[i]
            if p.rect != q.rect:
                raise RuntimeError(f"Page size changed: {name} {i+1}")
            matrix = fitz.Matrix(1, 1)
            src = p.get_pixmap(matrix=matrix, alpha=False)
            dst = q.get_pixmap(matrix=matrix, alpha=False)
            if name.startswith("Gyro") and i > 0:
                a = np.frombuffer(src.samples, np.uint8).reshape(
                    src.height, src.width, src.n)
                b = np.frombuffer(dst.samples, np.uint8).reshape(
                    dst.height, dst.width, dst.n)
                yy, xx = np.where(np.any(a != b, axis=2))
                # The source and restored interior page must be pixel-identical
                # everywhere outside the tiny Chinese footer.
                if not len(xx) or (xx.min() < 409 or xx.max() > 516 or
                                   yy.min() < 557 or yy.max() > 586):
                    raise RuntimeError(f"Unexpected Gyro interior edit on page {i+1}")
            elif name == "Electronic scale.pdf" and i not in (24, 25):
                if src.samples != dst.samples or p.get_text() != q.get_text():
                    raise RuntimeError(f"Unexpected Electronic Scale edit on {i+1}")
                unchanged += 1
            elif name == "Electronic scale.pdf":
                a = np.frombuffer(src.samples, np.uint8).reshape(src.height, src.width, src.n)
                b = np.frombuffer(dst.samples, np.uint8).reshape(dst.height, dst.width, dst.n)
                yy, xx = np.where(np.any(a != b, axis=2))
                if not len(xx) or (xx.min() < 174 or xx.max() > 565 or
                                   yy.min() < 439 or yy.max() > 485):
                    raise RuntimeError(f"Unexpected changed region on page {i+1}")
        if name == "Electronic scale.pdf":
            for i, page in enumerate(edited):
                if any(0x3400 <= ord(c) <= 0x9FFF for c in page.get_text()):
                    raise RuntimeError(f"Chinese text remains on page {i+1}")
        results.append({
            "file": f"public/{name}",
            "source_git_blob_sha": blob_sha((source / name).read_bytes()),
            "clean_git_blob_sha": blob_sha((output / name).read_bytes()),
            "pages": count,
            "untouched_pages_pixel_identical": unchanged,
            "targeted_gyro_footer_edits": 16 if name.startswith("Gyro") else 0,
            "outside_target_regions_pixel_identical": True,
            "status": "PASS",
        })
        original.close()
        edited.close()
    return {"scope": "Level 3 Building only", "results": results,
            "no_learning_pdf_changes": True, "local_validation": "PASS"}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", default="public")
    parser.add_argument("--output-dir", default="build/level3-complete-building-english")
    parser.add_argument("--write-public", action="store_true")
    args = parser.parse_args()
    source, output = Path(args.source_dir), Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    check_sources(source)
    gyro_english(source, output)
    scale_english(source, output)
    report = validate(source, output)
    (output / "validation.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if args.write_public:
        for name in SOURCES:
            (source / name).write_bytes((output / name).read_bytes())
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
