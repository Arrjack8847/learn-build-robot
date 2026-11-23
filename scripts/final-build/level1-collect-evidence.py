#!/usr/bin/env python3
"""Download registered Level 1 Building PDFs and render source-backed review evidence.

This tool NEVER approves or uploads artwork. Outputs stay outside the repository by default.
Run locally: python scripts/final-build/level1-collect-evidence.py --output /tmp/level1-review
Requires PyMuPDF (fitz) and Pillow. No GitHub Actions or Browser Use.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import fitz
from PIL import Image


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def image_bytes(image: Image.Image, fmt: str, **kwargs: object) -> bytes:
    import io

    target = io.BytesIO()
    image.save(target, format=fmt, **kwargs)
    return target.getvalue()


def download_pdf(url: str) -> bytes:
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme != "https" or not parsed.hostname or not parsed.hostname.endswith(".usrfiles.com"):
        raise ValueError("Source must be an HTTPS Wix usrfiles Building PDF")
    with urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": "BE-STEM-READY-Level1-SourceAudit/1.0"}),
        timeout=75,
    ) as response:
        data = response.read(70 * 1024 * 1024 + 1)
    if len(data) > 70 * 1024 * 1024 or not data.startswith(b"%PDF-"):
        raise ValueError("Source is not a permitted, parseable-size PDF")
    return data


def extract(record: dict, root: Path) -> dict:
    name = record["filename"]
    candidate_page = record["proposedSourcePage"]
    c = record["proposedCrop"]
    ident = re.sub(r"[^a-z0-9-]+", "-", record["variantId"].lower()).strip("-")
    evidence = {
        "projectId": record["projectId"], "variantId": record["variantId"],
        "filename": name, "officialPdfUrl": record["officialPdfUrl"],
        "status": "provisional-evidence-only", "approved": False,
        "sourcePdfSha256": None, "sourcePage": candidate_page,
        "crop": c, "pageCount": None, "sourcePdfBytes": None,
        "fullPagePng": None, "provisionalCropPng": None,
        "provisionalCropWebp": None, "provisionalWebpSha256": None,
        "blockers": [
            "Independent full-page and crop visual signoff outstanding",
            "Source SHA-256 must be reviewed against the current official PDF",
            "Exactly five PDF-evidenced assessment questions not yet approved",
        ],
    }
    try:
        raw = download_pdf(record["officialPdfUrl"])
        evidence["sourcePdfSha256"] = sha256(raw)
        evidence["sourcePdfBytes"] = len(raw)
        with fitz.open(stream=raw, filetype="pdf") as document:
            evidence["pageCount"] = len(document)
            if not isinstance(candidate_page, int) or not 1 <= candidate_page <= len(document):
                raise ValueError("Candidate page outside current official PDF page range")
            if not all(isinstance(c[k], (int, float)) for k in ("x", "y", "width", "height")):
                raise ValueError("Invalid normalized crop coordinates")
            if min(c["x"], c["y"]) < 0 or min(c["width"], c["height"]) <= 0 or c["x"] + c["width"] > 1 or c["y"] + c["height"] > 1:
                raise ValueError("Crop outside PDF page bounds")
            page = document.load_page(candidate_page - 1)
            png = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False).tobytes("png")
            full = root / "page-evidence" / f"{ident}-page-{candidate_page}.png"
            full.write_bytes(png)
            evidence["fullPagePng"] = str(full)
            rect = page.rect
            clip = fitz.Rect(rect.x0 + c["x"] * rect.width,
                             rect.y0 + c["y"] * rect.height,
                             rect.x0 + (c["x"] + c["width"]) * rect.width,
                             rect.y0 + (c["y"] + c["height"]) * rect.height)
            cropped = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0), clip=clip, alpha=False)
            crop_png = root / "crop-evidence" / f"{ident}-unapproved.png"
            crop_png.write_bytes(cropped.tobytes("png"))
            evidence["provisionalCropPng"] = str(crop_png)
            pil = Image.frombytes("RGB", (cropped.width, cropped.height), cropped.samples)
            webp_bytes = image_bytes(pil, "WEBP", quality=93, method=6)
            webp = root / "provisional-webps-NOT-APPROVED" / f"{ident}-unapproved.webp"
            webp.write_bytes(webp_bytes)
            evidence["provisionalCropWebp"] = str(webp)
            evidence["provisionalWebpSha256"] = sha256(webp_bytes)
            evidence["provisionalWebpDimensions"] = [cropped.width, cropped.height]
    except Exception as exc:
        evidence["status"] = "source-recovery-failed"
        evidence["error"] = f"{type(exc).__name__}: {exc}"
    return evidence


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("/tmp/be-stem-ready-level1-source-evidence"))
    parser.add_argument("--only", help="Exact official source filename to review")
    parser.add_argument("--max", type=int, help="Optional batch limit for partial review")
    args = parser.parse_args()
    queue_path = Path(__file__).resolve().parents[2] / "src/data/finalBuild/level-1-review-queue.json"
    queue = json.loads(queue_path.read_text(encoding="utf-8"))
    records = queue["records"]
    if args.only:
        records = [r for r in records if r["filename"] == args.only]
        if not records:
            parser.error("Filename is not in Level 1 review queue")
    if args.max is not None:
        records = records[: max(0, args.max)]
    output = args.output.resolve()
    for directory in ("page-evidence", "crop-evidence", "provisional-webps-NOT-APPROVED"):
        (output / directory).mkdir(parents=True, exist_ok=True)
    results = []
    for index, entry in enumerate(records, 1):
        print(f"[{index}/{len(records)}] {entry['filename']}", flush=True)
        results.append(extract(entry, output))
        report = {
            "generatedAt": datetime.now(timezone.utc).isoformat(),
            "source": str(queue_path), "candidateCount": len(records),
            "approvedCount": 0, "results": results,
        }
        (output / "source-evidence-NOT-APPROVED.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Evidence records: {len(results)}; source failures: {sum(r['status'] == 'source-recovery-failed' for r in results)}; approved: 0")


if __name__ == "__main__":
    main()
