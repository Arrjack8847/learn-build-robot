#!/usr/bin/env python3
"""Fail-closed Level 5 official Building-PDF visual recovery.

Usage:
  python scripts/level5_recover_official_webps.py --pdf-dir /path/to/official-pdfs
  python scripts/level5_recover_official_webps.py --pdf-dir /path/to/official-pdfs --crops reviewed-crops.json

Prerequisites: pip install pymupdf pillow
The script does not approve images, questions, or Wix records. Candidate crops need
independent source-identity and finished-model review before student use.
"""
import argparse
import hashlib
import io
import json
import re
import sys
from pathlib import Path

import fitz
from PIL import Image, ImageDraw, ImageOps

ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "src/data/finalBuild/level-5-wix-candidates.json"


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def slug(value):
    return re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-")


def pdf_path(base, variant_id):
    return base / (slug(variant_id) + ".pdf")


def load_crops(path):
    if not path:
        return {}
    data = json.loads(path.read_text("utf-8"))
    if not isinstance(data, dict):
        raise ValueError("crop map must be an object keyed by exact variant ID")
    return data


def crop_bounds(values, page):
    if not isinstance(values, list) or len(values) != 4:
        raise ValueError("normalizedCrop must be [x,y,width,height]")
    x, y, w, h = values
    if not all(isinstance(n, (int, float)) and not isinstance(n, bool) for n in values):
        raise ValueError("normalized crop values must be numbers")
    if not (0 <= x < 1 and 0 <= y < 1 and 0 < w <= 1 and 0 < h <= 1):
        raise ValueError("normalizedCrop values out of range")
    if x + w > 1.0000001 or y + h > 1.0000001:
        raise ValueError("normalizedCrop exceeds page")
    r = page.rect
    return fitz.Rect(r.x0 + x * r.width, r.y0 + y * r.height,
                     r.x0 + (x + w) * r.width, r.y0 + (y + h) * r.height)


def render_pages(doc, directory):
    directory.mkdir(parents=True, exist_ok=True)
    thumbs = []
    for i in range(len(doc)):
        page = doc.load_page(i)
        scale = min(2.0, 1050 / max(1, page.rect.width))
        pix = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
        image.save(directory / ("page-%03d.png" % (i + 1)), optimize=True)
        thumb = ImageOps.contain(image, (240, 310), Image.Resampling.LANCZOS)
        tile = Image.new("RGB", (260, 345), "white")
        tile.paste(thumb, ((260 - thumb.width) // 2, 7))
        ImageDraw.Draw(tile).text((12, 320), "Official PDF page %d" % (i + 1), fill="black")
        thumbs.append(tile)
    cols = 4
    rows = (len(thumbs) + cols - 1) // cols
    board = Image.new("RGB", (cols * 260, rows * 345), "#eeeeee")
    for n, thumb in enumerate(thumbs):
        board.paste(thumb, ((n % cols) * 260, (n // cols) * 345))
    board.save(directory / "all-pages-contact-sheet.jpg", quality=90)
    return len(thumbs)


def extract_candidate(doc, variant, proposed, outdir, pdf_digest):
    if proposed.get("sourcePdfSha256") != pdf_digest:
        raise ValueError("crop entry must specify exact verified official PDF SHA-256")
    page_number = proposed.get("page")
    if not isinstance(page_number, int) or not (1 <= page_number <= len(doc)):
        raise ValueError("crop page must be a valid 1-based PDF page")
    box = proposed.get("normalizedCrop")
    page = doc.load_page(page_number - 1)
    clip = crop_bounds(box, page)
    px = page.get_pixmap(matrix=fitz.Matrix(3, 3), clip=clip, alpha=False)
    image = Image.frombytes("RGB", (px.width, px.height), px.samples)
    target_width = min(550, image.width)
    target_height = max(1, round(image.height * target_width / image.width))
    if image.width != target_width:
        image = image.resize((target_width, target_height), Image.Resampling.LANCZOS)
    outdir.mkdir(parents=True, exist_ok=True)
    filename = variant["requiredFilename"]
    file_path = outdir / filename
    if file_path.exists():
        raise FileExistsError("Refusing to overwrite existing candidate: " + str(file_path))
    image.save(file_path, "WEBP", quality=92, method=6, exact=True)
    saved = file_path.read_bytes()
    with Image.open(io.BytesIO(saved)) as reopened:
        reopened.load()
        if reopened.format != "WEBP" or reopened.size != image.size:
            raise ValueError("WebP decode/size QA failed")
    return {
        "path": str(file_path), "filename": filename,
        "sourcePage": page_number, "normalizedCrop": box,
        "pdfSha256": pdf_digest, "webpSha256": sha256(saved),
        "dimensions": [image.width, image.height], "mimeType": "image/webp",
        "sourceRasterCropFromOfficialPdf": True,
        "finishedModelIndependentlyApproved": False,
        "checklistIndependentlyApproved": False,
        "studentSelectable": False,
        "wixUploadStatus": "NOT_UPLOADED",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pdf-dir", type=Path, required=True,
                        help="Local authentic official PDFs named <variant-id-slug>.pdf")
    parser.add_argument("--crops", type=Path, default=None,
                        help="Reviewed exact-ID crop map, not an approval certificate")
    parser.add_argument("--out", type=Path, default=Path("level5-six-recovery-output"))
    args = parser.parse_args()
    ledger = json.loads(REGISTRY.read_text("utf-8"))
    crops = load_crops(args.crops)
    expected_ids = {x["variantId"] for x in ledger["candidates"]}
    if len(expected_ids) != 6 or len(ledger["candidates"]) != 6:
        raise ValueError("Exactly six blocked variants are required")
    if set(crops) - expected_ids:
        raise ValueError("Unknown crop-map variant ID")
    args.out.mkdir(parents=True, exist_ok=True)
    summary = {
        "sourceRegistry": str(REGISTRY),
        "previousAuditHashNotARecheck": True,
        "pdfValidated": 0, "pageContactSheetsMade": 0,
        "webpCandidatesExtracted": 0, "approved": 0,
        "wixUploaded": 0, "results": [],
    }
    seen_output_hashes = {}
    for entry in ledger["candidates"]:
        ident = entry["variantId"]
        pdf = pdf_path(args.pdf_dir, ident)
        row = {"variantId": ident, "sourcePath": str(pdf), "status": "blocked"}
        try:
            if not pdf.is_file():
                raise FileNotFoundError("No official PDF at " + str(pdf))
            data = pdf.read_bytes()
            digest = sha256(data)
            if digest != entry["previouslyRecordedPdfSha256"]:
                raise ValueError("OFFICIAL PDF SHA-256 MISMATCH")
            doc = fitz.open(stream=data, filetype="pdf")
            if doc.is_encrypted or len(doc) != entry["previousPdfPageCount"]:
                raise ValueError("Encrypted or page-count mismatch")
            summary["pdfValidated"] += 1
            row.update({"pdfSha256": digest, "pageCount": len(doc)})
            per_robot = args.out / slug(ident)
            render_pages(doc, per_robot / "all-official-pages")
            summary["pageContactSheetsMade"] += 1
            if ident in crops:
                candidate = extract_candidate(doc, entry, crops[ident],
                                              per_robot / "unapproved-webps", digest)
                if candidate["webpSha256"] in seen_output_hashes:
                    raise ValueError("DUPLICATE IMAGE HASH matches " +
                                     seen_output_hashes[candidate["webpSha256"]])
                seen_output_hashes[candidate["webpSha256"]] = ident
                row["candidate"] = candidate
                row["status"] = "unapproved-candidate"
                summary["webpCandidatesExtracted"] += 1
            else:
                row["reason"] = "Full pages rendered; no independently chosen complete-model crop"
            doc.close()
        except Exception as exc:
            row["error"] = str(exc)
        summary["results"].append(row)
    (args.out / "recovery-results.json").write_text(
        json.dumps(summary, indent=2) + "\n", "utf-8")
    print(json.dumps({k: v for k, v in summary.items() if k != "results"}, indent=2))
    for r in summary["results"]:
        print(r["variantId"], r["status"], r.get("error", r.get("reason", "")))
    return 0 if summary["pdfValidated"] == 6 else 2


if __name__ == "__main__":
    sys.exit(main())
