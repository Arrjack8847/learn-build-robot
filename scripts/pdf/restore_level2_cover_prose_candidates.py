#!/usr/bin/env python3
"""Create three safe, review-only Level 2 cover-restoration candidates.

Inputs: independent local checkouts of main (original PDFs) and PR #75 (cleaned PDFs).
Outputs: isolated candidates; never overwrites either input or uploads to Wix.
The original first page is preserved verbatim because the prior cleaner paraphrased
educational prose that must not be rewritten. Retaining original branding on those
three covers is intentional until a precisely scoped branding-only fix is approved.
All other pages remain copied from the cleaned candidate (without further edits).

Usage:
  python scripts/pdf/restore_level2_cover_prose_candidates.py \
    --original-root /path/to/main-checkout \
    --cleaned-root /path/to/pr75-checkout \
    --output-root /path/to/level2-cover-review
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

import pymupdf

PROBLEM_PDFS = (
    "Action-Oriented/Rotating flying chair/Rotating flying chair_Powerpoint.pdf",
    "Characters & Structures/Tower crane/Tower crane_Powerpoint.pdf",
    "Interactive Mechanisms/Jumping machine/Jumping machine_Powerpoint.pdf",
)
PREFIX = Path("public/Level 2/Learning")
EXPECTED_INTRO = "Intelligence Storm is a building block programming robot"


def english_text(page: pymupdf.Page) -> str:
    import re

    text = page.get_text()
    text = re.sub(r"[\u3400-\u9fff\uf900-\ufaff]", "", text)
    return re.sub(r"\s+", " ", text).strip()


def safe_outdir(root: Path, source: Path, cleaned: Path) -> Path:
    out = root.resolve()
    if out == source or out == cleaned:
        raise ValueError("The output directory cannot overwrite a checkout")
    if out.is_relative_to(source) or out.is_relative_to(cleaned):
        raise ValueError("Keep output outside source checkouts")
    return out


def run(original_root: Path, cleaned_root: Path, output_root: Path) -> dict:
    original_root = original_root.resolve()
    cleaned_root = cleaned_root.resolve()
    output_root = safe_outdir(output_root, original_root, cleaned_root)
    output_root.mkdir(parents=True, exist_ok=True)
    results = []
    for relative in PROBLEM_PDFS:
        source_path = original_root / PREFIX / relative
        cleaned_path = cleaned_root / PREFIX / relative
        if not source_path.is_file() or not cleaned_path.is_file():
            raise FileNotFoundError(f"Missing PDF pair: {relative}")
        with pymupdf.open(source_path) as source, pymupdf.open(cleaned_path) as cleaned:
            if len(source) != len(cleaned):
                raise ValueError(f"Page count mismatch: {relative}")
            if EXPECTED_INTRO not in source[0].get_text():
                raise ValueError(f"Known original intro not found: {relative}")
            if EXPECTED_INTRO in cleaned[0].get_text():
                raise ValueError(f"Cleaned intro is no longer the known regression: {relative}")
            # Copy original cover as a PDF page: text, fonts, vectors, images and positions stay intact.
            cleaned.delete_page(0)
            cleaned.insert_pdf(source, from_page=0, to_page=0, start_at=0)
            out_path = output_root / relative
            out_path.parent.mkdir(parents=True, exist_ok=True)
            cleaned.save(out_path, garbage=4, deflate=True)
            with pymupdf.open(out_path) as restored:
                if len(restored) != len(source):
                    raise RuntimeError(f"Saved page count mismatch: {relative}")
                if restored[0].get_text() != source[0].get_text():
                    raise RuntimeError(f"Restored cover does not preserve original exact text: {relative}")
                geometry_issues = [
                    i + 1 for i in range(len(source))
                    if abs(restored[i].rect.width - source[i].rect.width) > 0.01
                    or abs(restored[i].rect.height - source[i].rect.height) > 0.01
                ]
                original_english_diff_pages = [
                    i + 1 for i in range(len(source))
                    if english_text(source[i]) != english_text(restored[i])
                ]
                results.append({
                    "path": relative,
                    "pages": len(source),
                    "output": str(out_path),
                    "cover_intro_restored": True,
                    "other_english_difference_pages": original_english_diff_pages,
                    "page_geometry_issues": geometry_issues,
                    "branding_status": "original cover branding retained; not final cleaning approval",
                    "ready_for_release": False,
                })
    report = {
        "scope": "three Level 2 cover-prose candidate repairs only",
        "originals_modified": False,
        "cleaned_inputs_modified": False,
        "production_modified": False,
        "all_files_ready": False,
        "results": results,
    }
    (output_root / "level2-cover-candidate-report.json").write_text(
        json.dumps(report, indent=2) + "\n", encoding="utf-8"
    )
    return report


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--original-root", type=Path, required=True)
    parser.add_argument("--cleaned-root", type=Path, required=True)
    parser.add_argument("--output-root", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(run(args.original_root, args.cleaned_root, args.output_root), indent=2))
