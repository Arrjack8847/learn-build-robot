#!/usr/bin/env python3
"""Extract authentic embedded artwork streams from two Level 6 Building PDFs.

These are unapproved candidates, never student-facing. Does not invent robot
geometry or promote questions. Requires PyMuPDF and Pillow.

python scripts/final-build/recover-level-6-embedded-images.py \
  --optimized /path/to/optimized.pdf --rock /path/to/english.pdf \
  --out /tmp/level6-recovery
"""
from __future__ import annotations
import argparse
import hashlib
import json
from io import BytesIO
from pathlib import Path
import fitz
from PIL import Image

SOURCES = {
    "super-scorpion-optimized": {
        "sha256": "e0c7b137eb0ce340cb334a7a36e4ea90172ae65337d8ffba8937b2839d368600",
        "pages": 3,
        "variantId": "level-6-super-scorpion:optimized",
    },
    "rock-paper-scissors-robot": {
        "sha256": "1009562c300be9ec9bb86ea5c9420d8117d4399e848dbb1d1705f2b02db107fd",
        "pages": 14,
        "variantId": "level-6-rock-paper-scissors-robot",
    },
    "rock-paper-scissors-original-building": {
        "gitBlobSha1": "af9423f2a5191ca8577b18cd3fa827da09fd829b",
        "pages": 14,
        "variantId": "level-6-rock-paper-scissors-robot",
    },
}

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def git_blob_sha1(data: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(data)).encode("ascii") + b"\0" + data).hexdigest()

def matches_expected_hash(data: bytes, profile: dict) -> bool:
    return ("sha256" in profile and sha(data) == profile["sha256"]) or (
        "gitBlobSha1" in profile and git_blob_sha1(data) == profile["gitBlobSha1"]
    )

def inspect(pdf: Path, output: Path, name: str, profile: dict, max_per_page: int) -> dict:
    data = pdf.read_bytes()
    if not matches_expected_hash(data, profile):
        raise ValueError(f"{name}: source PDF hash mismatch; refuse extraction")
    document = fitz.open(stream=data, filetype="pdf")
    if document.page_count != profile["pages"]:
        raise ValueError(f"{name}: expected {profile['pages']} pages, got {document.page_count}")
    folder = output / name
    folder.mkdir(parents=True, exist_ok=True)
    candidates = []
    pages = []
    for i in range(document.page_count):
        page = document.load_page(i)
        preview = folder / f"page-{i+1:02}.png"
        page.get_pixmap(matrix=fitz.Matrix(1.5, 1.5), alpha=False, annots=False).save(str(preview))
        found = []
        seen = set()
        for image_info in page.get_images(full=True):
            xref = image_info[0]
            if xref in seen:
                continue
            seen.add(xref)
            try:
                extracted = document.extract_image(xref)
                if not extracted or not extracted.get("image"):
                    continue
                decoded = Image.open(BytesIO(extracted["image"]))
                decoded.load()
                width, height = decoded.size
                if min(width, height) < 128:
                    continue
                rects = page.get_image_rects(xref)
                if not rects:
                    continue
                area = max(rect.get_area() for rect in rects)
                if area <= 0:
                    continue
                found.append((area, width * height, xref, rects, extracted, decoded))
            except Exception:
                continue
        found.sort(key=lambda item: (item[0], item[1]), reverse=True)
        for rank, (_, _, xref, placements, extracted, decoded) in enumerate(found[:max_per_page], 1):
            ext = extracted.get("ext", "bin")
            raw_path = folder / f"page-{i+1:02}-image-{rank:02}-xref-{xref}.{ext}"
            raw_path.write_bytes(extracted["image"])
            webp_path = folder / f"page-{i+1:02}-image-{rank:02}-xref-{xref}.webp"
            decoded.convert("RGBA").save(webp_path, "WEBP", lossless=True, method=6)
            with Image.open(webp_path) as check:
                check.load()
                if check.size != decoded.size:
                    raise ValueError("Converted WebP dimensions differ from embedded source")
            positions = [
                [round(r.x0 / page.rect.width, 6),
                 round(r.y0 / page.rect.height, 6),
                 round(r.x1 / page.rect.width, 6),
                 round(r.y1 / page.rect.height, 6)]
                for r in placements
            ]
            candidates.append({
                "variantId": profile["variantId"],
                "status": "candidate-unapproved",
                "pdfPage": i + 1,
                "xref": xref,
                "originalEmbeddedImage": str(raw_path.relative_to(output)),
                "originalEmbeddedImageSha256": sha(extracted["image"]),
                "width": decoded.width,
                "height": decoded.height,
                "normalizedPlacements": positions,
                "candidateWebp": str(webp_path.relative_to(output)),
                "candidateWebpSha256": sha(webp_path.read_bytes()),
                "reviewRequired": "Validate complete finished-model identity and all essential mechanical details against official PDF construction pages",
            })
        pages.append({"page": i + 1, "preview": str(preview.relative_to(output)),
                      "imageObjectsSeen": len(seen), "exportedCandidates": min(len(found), max_per_page)})
    document.close()
    return {
        "variantId": profile["variantId"], "sourceSha256": sha(data),
        "sourceGitBlobSha1": git_blob_sha1(data), "sourcePdf": pdf.name, "sourceProfile": name,
        "pages": pages, "candidateCount": len(candidates), "candidates": candidates,
        "approved": False, "verifiedQuestions": 0,
        "note": "Embedded image streams omit separately overlaid PDF text/vector marks. No model completeness or optimized identity is inferred.",
    }

def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--optimized", type=Path, required=True)
    ap.add_argument("--rock", type=Path, required=True)
    ap.add_argument("--rock-original", type=Path, help="Optional exact historical official Building PDF with 14 pages, verified against its original Git blob SHA-1")
    ap.add_argument("--out", type=Path, required=True)
    ap.add_argument("--max-per-page", type=int, default=6)
    args = ap.parse_args()
    if not 1 <= args.max_per_page <= 30:
        ap.error("--max-per-page must be between 1 and 30")
    sources = [("super-scorpion-optimized", args.optimized),
               ("rock-paper-scissors-robot", args.rock)]
    if args.rock_original:
        sources.append(("rock-paper-scissors-original-building", args.rock_original))
    for name, path in sources:
        if not path.is_file():
            ap.error(f"Missing source PDF: {path}")
        if not matches_expected_hash(path.read_bytes(), SOURCES[name]):
            ap.error(f"{name}: source hash mismatch")
    args.out.mkdir(parents=True, exist_ok=True)
    reports = [inspect(path, args.out, name, SOURCES[name], args.max_per_page)
               for name, path in sources]
    manifest = args.out / "recovery-candidates.json"
    manifest.write_text(json.dumps({
        "schemaVersion": 1, "automatedApprovals": 0, "variants": reports,
    }, indent=2) + "\n")
    print(json.dumps({
        "manifest": str(manifest),
        "candidateCounts": {item["sourceProfile"]: item["candidateCount"] for item in reports},
        "approved": False,
    }, indent=2))

if __name__ == "__main__":
    main()
