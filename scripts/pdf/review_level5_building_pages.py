#!/usr/bin/env python3
"""Prepare/verify a page-by-page Level 5 Building PDF visual-review ledger.

After downloading verified originals and running audit_level5_building_interiors.py
with --render-all, create a review ledger:
    python scripts/pdf/review_level5_building_pages.py prepare
Then inspect EVERY rendered PNG, entering an explicit decision for each page.
Never mark a page reviewed based only on extractable-text or OCR results.
After the visual inspection:
    python scripts/pdf/review_level5_building_pages.py verify

The verify command FAILS if a page is unreviewed or any Chinese is present.
If Chinese is confirmed, repair it separately and re-audit the replacement.
This program is read-only with respect to repository PDFs.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT_REPORT = Path("reports/level5-building-english-audit-20261119.json")
AUDIT = Path("build/level5-building-english-audit/inspection-results.json")
LEDGER = Path("build/level5-building-english-audit/visual-review-ledger.json")
OUTPUT = Path("build/level5-building-english-audit/verification-gate.json")


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def atomic_write(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_suffix(path.suffix + ".tmp")
    temp.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    temp.replace(path)


def validate_sources(manifest: dict, inspection: dict) -> tuple[dict, dict, int]:
    originals = manifest["files"]
    inspected = inspection["files"]
    expected = {f["path"]: f for f in originals}
    actual = {f["path"]: f for f in inspected}
    if len(originals) != 45 or len(expected) != 45:
        raise ValueError("Manifest must list 45 unique originals")
    if len(inspected) != 45 or set(actual) != set(expected):
        raise ValueError("Inspected PDF set differs from the 45 original Git paths")
    if inspection.get("source_commit") != manifest["source"]["commit"]:
        raise ValueError("Inspected source commit differs from manifest")
    if inspection.get("pdfs_rehashed") != 45:
        raise ValueError("Original PDF content not yet verified against Git hashes")
    total = 0
    for path, f in actual.items():
        if f.get("source_git_blob_sha") != expected[path]["git_blob_sha"]:
            raise ValueError("Original Git blob mismatch: " + path)
        if f.get("bytes") != expected[path]["git_object_bytes"]:
            raise ValueError("Original PDF size mismatch: " + path)
        pages = f.get("pages")
        if not isinstance(pages, int) or pages <= 0:
            raise ValueError("Invalid page count: " + path)
        if len(f.get("page_sizes_points", [])) != pages:
            raise ValueError("Page dimensions missing: " + path)
        if not f.get("all_pages_text_scanned") or not f.get("all_pages_rendered"):
            raise ValueError("Every page must have been scanned and rendered: " + path)
        for found in f.get("extractable_chinese", []) + f.get("ocr_candidates_unconfirmed", []):
            page = found.get("page_number")
            if not isinstance(page, int) or not (1 <= page <= pages):
                raise ValueError("Out-of-range detection: " + path)
        total += pages
    if inspection.get("pages_text_scanned") != total or inspection.get("pages_rendered") != total:
        raise ValueError("Page-level scan/render coverage is incomplete")
    return expected, actual, total


def prepare(manifest: dict, inspection: dict, previous: dict | None = None) -> dict:
    expected, actual, total = validate_sources(manifest, inspection)
    prev_by_key = {}
    if previous is not None:
        if previous.get("source_commit") != inspection["source_commit"]:
            raise ValueError("Cannot preserve reviews from a different Git revision")
        for p in previous.get("pages", []):
            key = (p["path"], p["page_number"])
            if key in prev_by_key:
                raise ValueError("Duplicate review record")
            prev_by_key[key] = p
    pages = []
    sorted_paths = sorted(actual)
    for path_idx, path in enumerate(sorted_paths, start=1):
        f = actual[path]
        for number in range(1, f["pages"] + 1):
            key = (path, number)
            prior = prev_by_key.get(key)
            if prior and prior.get("source_git_blob_sha") != f["source_git_blob_sha"]:
                raise ValueError("Previous review SHA changed: " + path)
            pages.append({
                "path": path,
                "source_git_blob_sha": f["source_git_blob_sha"],
                "page_number": number,
                "rendered_png": f"pages/{path_idx:02d}/page-{number:04d}.png",
                "extractable_chinese_suspects": [
                    s for s in f.get("extractable_chinese", [])
                    if s["page_number"] == number
                ],
                "ocr_suspects_unconfirmed": [
                    s for s in f.get("ocr_candidates_unconfirmed", [])
                    if s["page_number"] == number
                ],
                "visual_status": prior.get("visual_status", "pending") if prior else "pending",
                "visible_chinese": prior.get("visible_chinese") if prior else None,
                "review_notes": prior.get("review_notes", "") if prior else "",
                "reviewer": prior.get("reviewer", "") if prior else "",
                "chinese_occurrences": prior.get("chinese_occurrences", []) if prior else [],
            })
    return {
        "scope": "Level 5 Building PDFs only; source originals",
        "source_commit": inspection["source_commit"],
        "originals_verified": 45,
        "all_original_pages_rendered": total,
        "pages": pages,
        "warning": "OCR alone cannot establish English-only status. Inspect every rendered PNG."
    }


def verify(manifest: dict, inspection: dict, ledger: dict) -> dict:
    expected, actual, total = validate_sources(manifest, inspection)
    if ledger.get("source_commit") != inspection["source_commit"]:
        raise ValueError("Review ledger source revision mismatch")
    reviewed = {}
    for p in ledger.get("pages", []):
        key = (p.get("path"), p.get("page_number"))
        if key in reviewed:
            raise ValueError(f"Duplicate visual review: {key}")
        reviewed[key] = p
    expected_keys = {
        (path, i) for path, f in actual.items()
        for i in range(1, f["pages"] + 1)
    }
    if set(reviewed) != expected_keys or len(reviewed) != total:
        raise ValueError("Visual review ledger does not cover every original page")
    missing, confirmed = [], []
    for key in sorted(expected_keys):
        p = reviewed[key]
        path, num = key
        if p.get("source_git_blob_sha") != expected[path]["git_blob_sha"]:
            raise ValueError("Review SHA mismatch")
        if (p.get("visual_status") != "reviewed"
                or not isinstance(p.get("visible_chinese"), bool)
                or not p.get("reviewer", "").strip()):
            missing.append(key)
            continue
        if p["visible_chinese"]:
            items = p.get("chinese_occurrences")
            if not isinstance(items, list) or not items:
                raise ValueError(f"Confirmed Chinese must be documented: {key}")
            for item in items:
                if not all(
                    isinstance(item.get(field), str) and item[field].strip()
                    for field in ("original_text", "english_translation", "repair_method")
                ):
                    raise ValueError(f"Confirmed Chinese lacks accurate translation/repair: {key}")
            confirmed.append({"path": path, "page_number": num, "occurrences": items})
    status = (
        "INCOMPLETE_VISUAL_REVIEW" if missing else
        "CHINESE_FOUND_REPAIR_REQUIRED" if confirmed else
        "ORIGINALS_VISUALLY_ENGLISH_ONLY"
    )
    return {
        "status": status,
        "pdfs_rehashed": 45,
        "pages_required": total,
        "pages_reviewed": total - len(missing),
        "pending_page_count": len(missing),
        "pending_page_examples": [
            {"path": k[0], "page_number": k[1]} for k in missing[:20]
        ],
        "confirmed_chinese_pages": confirmed,
        "certified_english_only": status == "ORIGINALS_VISUALLY_ENGLISH_ONLY",
        "note": "Repaired PDFs require separate validation and Git integration verification."
    }


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("action", choices=("prepare", "verify"))
    ap.add_argument("--repo", type=Path, default=Path("."))
    args = ap.parse_args()
    root = args.repo.resolve()
    manifest = read_json(root / ROOT_REPORT)
    inspection = read_json(root / AUDIT)
    if args.action == "prepare":
        path = root / LEDGER
        existing = read_json(path) if path.exists() else None
        ledger = prepare(manifest, inspection, existing)
        atomic_write(path, ledger)
        print(f"PREPARED {len(ledger['pages'])} pages; review each PNG first")
        return
    ledger = read_json(root / LEDGER)
    result = verify(manifest, inspection, ledger)
    atomic_write(root / OUTPUT, result)
    print(f"{result['status']}: {result['pages_reviewed']}/{result['pages_required']} reviewed")
    if not result["certified_english_only"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
