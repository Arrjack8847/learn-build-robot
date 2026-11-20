#!/usr/bin/env python3
"""Download original Level 5 Building PDFs from registered Wix links.

All binaries are checked against the Git blob SHA-1 and byte size in the
verified inventory. This script NEVER writes to tracked public/ files.
No Browser Use, GitHub Actions or Learning PDFs.

Run from repository root:
  python scripts/pdf/download_level5_building_originals.py
  python scripts/pdf/audit_level5_building_interiors.py --source-root build/level5-building-verified-originals --render-all

A complete binary inventory is not proof that every page is English-only.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

PREFIX = "Level 5/Building/"
MAPPING_RE = re.compile(r'"(Level 5/Building/[^"\n]+?\.pdf)"\s*:\s*"(https://[^"\n]+?\.pdf)"')


def blob_sha(data: bytes) -> str:
    return hashlib.sha1(
        b"blob " + str(len(data)).encode("ascii") + b"\x00" + data
    ).hexdigest()


def read_mapping(source: Path) -> dict[str, str]:
    pairs = MAPPING_RE.findall(source.read_text(encoding="utf-8"))
    mapping = dict(pairs)
    if len(pairs) != 45 or len(mapping) != 45:
        raise ValueError("Expected 45 unique Wix Building PDF links")
    for path, url in mapping.items():
        parsed = urlparse(url)
        if (".." in Path(path).parts or not path.startswith(PREFIX) or
                parsed.scheme != "https" or not parsed.netloc or
                not parsed.path.lower().endswith(".pdf")):
            raise ValueError(f"Invalid Level 5 Building mapping: {path}")
    return mapping


def read_manifest(source: Path) -> list[dict]:
    report = json.loads(source.read_text(encoding="utf-8"))
    files = report["files"]
    if len(files) != 45 or len({f["path"] for f in files}) != 45:
        raise ValueError("Expected exactly 45 unique Git Building PDF paths")
    return files


def download_verified(url: str, target: Path, sha: str, size: int,
                      timeout: int, max_bytes: int) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    partial = target.with_name(target.name + ".partial")
    partial.unlink(missing_ok=True)
    try:
        request = urllib.request.Request(
            url, headers={"User-Agent": "BE-STEM-READY-PDF-Audit/1.0"}
        )
        with urllib.request.urlopen(request, timeout=timeout) as response, \
                partial.open("wb") as handle:
            count = 0
            while True:
                data = response.read(256 * 1024)
                if not data:
                    break
                count += len(data)
                if count > max_bytes:
                    raise ValueError(f"File too large: {target}")
                handle.write(data)
        data = partial.read_bytes()
        observed = blob_sha(data)
        if len(data) != size or observed != sha:
            raise ValueError(
                f"Git original mismatch for {target}: expected {size}/{sha}, "
                f"received {len(data)}/{observed}"
            )
        if data[:5] != b"%PDF-":
            raise ValueError(f"Not a PDF: {target}")
        partial.replace(target)
    finally:
        partial.unlink(missing_ok=True)


def main() -> None:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--repo", type=Path, default=Path("."))
    p.add_argument("--output", type=Path,
                   default=Path("build/level5-building-verified-originals"))
    p.add_argument("--timeout", type=int, default=90)
    p.add_argument("--retries", type=int, default=2)
    p.add_argument("--max-file-mb", type=int, default=100)
    args = p.parse_args()
    root = args.repo.resolve()
    output = args.output if args.output.is_absolute() else root / args.output
    files = read_manifest(
        root / "reports/level5-building-english-audit-20261119.json"
    )
    mapping = read_mapping(root / "src/data/levelFiveWixPdfUrls.ts")
    if set(mapping) != {f["path"].removeprefix("public/") for f in files}:
        raise ValueError("Git inventory does not match the Wix link registry")
    results, errors = [], []
    for i, item in enumerate(files, start=1):
        relative = item["path"]
        if (".." in Path(relative).parts or
                not relative.startswith("public/" + PREFIX)):
            raise ValueError(f"Unsafe original path: {relative}")
        target = output / relative
        sha, size = item["git_blob_sha"], item["git_object_bytes"]
        try:
            if target.is_file():
                data = target.read_bytes()
                if len(data) == size and blob_sha(data) == sha:
                    results.append({"path": relative, "status": "verified_cached",
                                    "sha": sha, "bytes": size})
                    print(f"[{i:02d}/45] PASS cached {relative}", flush=True)
                    continue
                target.unlink()
            for attempt in range(args.retries + 1):
                try:
                    download_verified(mapping[relative.removeprefix("public/")],
                                      target, sha, size, args.timeout,
                                      args.max_file_mb * 1024 * 1024)
                    break
                except (OSError, ValueError, urllib.error.URLError):
                    if attempt >= args.retries:
                        raise
                    time.sleep(min(2 ** attempt, 8))
            results.append({"path": relative, "status": "verified_downloaded",
                            "sha": sha, "bytes": size})
            print(f"[{i:02d}/45] PASS downloaded {relative}", flush=True)
        except Exception as exc:
            errors.append({"path": relative, "error": str(exc)})
            print(f"[{i:02d}/45] FAIL {relative}: {exc}", flush=True)
    output.mkdir(parents=True, exist_ok=True)
    report = {
        "status": "PASS" if not errors and len(results) == 45 else "INCOMPLETE",
        "originals_expected": 45,
        "originals_verified": len(results),
        "files": results, "errors": errors,
        "note": "Verifies original bytes only, not page-level English content"
    }
    (output / "download-validation.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8"
    )
    if errors or len(results) != 45:
        raise SystemExit(f"STOP: {len(results)}/45 original binaries verified")
    print("PASS: all 45 originals match Git blob hashes and byte sizes")


if __name__ == "__main__":
    main()
