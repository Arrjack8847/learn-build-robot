#!/usr/bin/env python3
"""Render official Level 6 Learning PDFs as human-inspectable per-slide JPEGs.

This is a read-only evidence producer, NOT a quiz/question generator.
First run: node scripts/report-level6-coverage.mjs --write\nUse with scripts/extract-quiz-slides.mjs. Image results must be checked
by a reviewer before approving source-dependent questions.

Examples:
  python src/data/quizBanks/level6/render-slide-evidence.py
  python src/data/quizBanks/level6/render-slide-evidence.py --start 5 --count 5

Requires: PyMuPDF (pip install pymupdf).
"""
import argparse
import hashlib
import json
import os
from pathlib import Path

try:
    import fitz
except ImportError as error:
    raise SystemExit("Missing PyMuPDF. Install with: python -m pip install pymupdf") from error

ROOT = Path(__file__).resolve().parents[4]
MANIFEST = ROOT / "scripts" / "quiz-learning-source-manifest.json"
OUTPUT = ROOT / "quiz-research" / "visual-review" / "level6"
COVERAGE = ROOT / "quiz-research" / "level6-coverage.json"


def safe_source(relative_path):
    relative = Path(relative_path)
    if relative.is_absolute() or relative.suffix.lower() != ".pdf" or ".." in relative.parts:
        raise ValueError("Invalid manifest Learning PDF path: " + relative_path)
    source = (ROOT / relative).resolve()
    if not source.is_relative_to(ROOT / "public" / "Level 6" / "Learning"):
        raise ValueError("PDF is outside registered Level 6 Learning sources: " + relative_path)
    return source


def render_project(entry, dpi, quality):
    pdf_path = safe_source(entry["sourcePath"])
    if not pdf_path.is_file():
        return {"projectId": entry["projectId"], "status": "blocked", "reason": "Registered local PDF absent"}
    if pdf_path.stat().st_size > 50 * 1024 * 1024:
        return {"projectId": entry["projectId"], "status": "blocked", "reason": "PDF exceeds 50 MiB safety limit"}
    pdf_bytes = pdf_path.read_bytes()
    if not pdf_bytes.startswith(b"%PDF-"):
        return {"projectId": entry["projectId"], "status": "blocked", "reason": "File is not a PDF"}
    sha256 = hashlib.sha256(pdf_bytes).hexdigest()
    out_folder = OUTPUT / entry["projectId"]
    out_folder.mkdir(parents=True, exist_ok=True)
    pages = []
    with fitz.open(stream=pdf_bytes, filetype="pdf") as document:
        for i in range(len(document)):
            page = document[i]
            slide = i + 1
            image = out_folder / f"slide-{slide:03}.jpg"
            pix = page.get_pixmap(matrix=fitz.Matrix(dpi / 72, dpi / 72), alpha=False)
            pix.save(str(image), jpg_quality=quality)
            page_text = page.get_text("text")
            image_count = len(page.get_images(full=False))
            drawings_count = len(page.get_drawings())
            pages.append({
                "learningSlide": slide,
                "imagePath": str(image.relative_to(ROOT)),
                "imageBytes": image.stat().st_size,
                "imageSha256": hashlib.sha256(image.read_bytes()).hexdigest(),
                "extractedTextLength": len(page_text.strip()),
                "embeddedImageCount": image_count,
                "vectorDrawingCount": drawings_count,
                "visualReviewComplete": False,
            })
    report = {
        "projectId": entry["projectId"],
        "sourcePdfPath": entry["sourcePath"],
        "sourceSha256": sha256,
        "sourcePageCount": len(pages),
        "slides": pages,
        "sourceVerified": False,
        "note": "These previews must be visually inspected. Generating images does not verify lesson objectives or quiz answers.",
    }
    (out_folder / "index.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    return {"projectId": entry["projectId"], "status": "rendered-unreviewed", "sourcePageCount": len(pages),
            "previewPages": len(pages), "sourceSha256": sha256}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", type=int, default=0, help="0-based position in missing-bank queue")
    parser.add_argument("--count", type=int, default=5, help="number of projects, max 5 per batch")
    parser.add_argument("--dpi", type=int, default=100)
    parser.add_argument("--quality", type=int, default=62)
    args = parser.parse_args()
    if args.start < 0 or not 1 <= args.count <= 5 or not 72 <= args.dpi <= 150 or not 30 <= args.quality <= 85:
        parser.error("Require start >=0; count 1..5; dpi 72..150; quality 30..85")
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    if not COVERAGE.is_file():
        raise SystemExit("Missing current registry coverage. Run: node scripts/report-level6-coverage.mjs --write")
    coverage = json.loads(COVERAGE.read_text(encoding="utf-8"))
    registered = [entry for entry in manifest["sources"] if entry["level"] == 6]
    by_id = {entry["projectId"]: entry for entry in registered}
    published_ids = coverage.get("publishedProjects", [])
    pending_ids = coverage.get("pendingProjects", [])
    if (coverage.get("registered") != len(registered)
            or len(by_id) != len(registered)
            or len(set(published_ids + pending_ids)) != len(registered)
            or set(published_ids + pending_ids) != set(by_id)):
        raise SystemExit("Level 6 coverage is stale; regenerate it with report-level6-coverage.mjs --write")
    pending = [by_id[project_id] for project_id in pending_ids]
    selected = pending[args.start:args.start + args.count]
    if not selected:
        parser.error("No matching pending projects in requested batch")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    results = []
    for entry in selected:
        try:
            result = render_project(entry, args.dpi, args.quality)
        except Exception as error:
            result = {"projectId": entry["projectId"], "status": "blocked", "reason": str(error)}
        results.append(result)
        print(entry["projectId"] + ": " + result["status"])
    (OUTPUT / f"batch-summary-{args.start:02d}.json").write_text(json.dumps({
        "start": args.start, "count": len(selected), "results": results,
        "quizBanksPublished": len(published_ids),
        "newBanksPublishedByRenderer": 0,
        "educationalReviewComplete": False,
    }, indent=2) + "\n", encoding="utf-8")
    if any(item["status"] == "blocked" for item in results):
        raise SystemExit(1)


if __name__ == "__main__":
    main()
