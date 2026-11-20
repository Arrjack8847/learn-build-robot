#!/usr/bin/env python3
"""Stage original Level 5 Building PDFs from one downloaded Wix media ZIP.

The archive is an untrusted container. PDF names inside it are ignored;
contents must match one of the 45 immutable Git blob SHA-1 values and sizes.
Only exact matches are written to build/level5-building-verified-originals/.
No tracked PDFs or Learning PDFs are ever modified.

Usage (from repo root):
  python scripts/pdf/stage_level5_building_from_wix_zip.py /path/to/wix-archive.zip
  python scripts/pdf/audit_level5_building_interiors.py \
    --source-root build/level5-building-verified-originals --render-all --ocr
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import tempfile
import zipfile
from pathlib import Path

MANIFEST = Path('reports/level5-building-english-audit-20261119.json')
DEFAULT_OUT = Path('build/level5-building-verified-originals')
MAX_PDF_BYTES = 100 * 1024 * 1024


def git_sha_stream(stream, size: int, destination: Path) -> tuple[str, int]:
    sha = hashlib.sha1(b'blob ' + str(size).encode('ascii') + b'\0')
    count = 0
    with destination.open('wb') as f:
        while True:
            chunk = stream.read(1024 * 1024)
            if not chunk:
                break
            count += len(chunk)
            if count > MAX_PDF_BYTES or count > size:
                raise ValueError('ZIP entry expanded beyond declared size or safety limit')
            sha.update(chunk)
            f.write(chunk)
    if count != size:
        raise ValueError('ZIP entry size does not match actual extracted bytes')
    return sha.hexdigest(), count


def load_manifest(path: Path) -> dict[str, dict]:
    files = json.loads(path.read_text(encoding='utf-8'))['files']
    if len(files) != 45 or len({f['path'] for f in files}) != 45:
        raise ValueError('Expected exactly 45 unique Level 5 Building source paths')
    by_sha = {}
    for entry in files:
        path = entry['path']
        sha = entry['git_blob_sha']
        if not path.startswith('public/Level 5/Building/') or not path.lower().endswith('.pdf'):
            raise ValueError(f'Out-of-scope source path in manifest: {path}')
        if '..' in Path(path).parts or Path(path).is_absolute():
            raise ValueError(f'Unsafe source path: {path}')
        if len(sha) != 40 or not all(c in '0123456789abcdef' for c in sha):
            raise ValueError(f'Invalid Git blob SHA: {sha}')
        if sha in by_sha:
            raise ValueError('Duplicate Git blobs in the canonical inventory')
        by_sha[sha] = entry
    return by_sha


def stage_archive(archive: Path, manifest: Path, output: Path) -> dict:
    by_sha = load_manifest(manifest)
    resolved_out = output.resolve()
    resolved_out.mkdir(parents=True, exist_ok=True)
    seen, unrecognized, failures = {}, [], []
    with zipfile.ZipFile(archive) as z:
        for member in z.infolist():
            if member.is_dir() or not member.filename.lower().endswith('.pdf'):
                continue
            if member.flag_bits & 1:
                failures.append({'zip_member': member.filename, 'reason': 'encrypted ZIP entry'})
                continue
            if member.file_size <= 0 or member.file_size > MAX_PDF_BYTES:
                failures.append({'zip_member': member.filename, 'reason': 'invalid/oversized PDF'})
                continue
            temp_name = None
            try:
                with tempfile.NamedTemporaryFile(prefix='l5-pdf-', suffix='.partial',
                                                 dir=resolved_out, delete=False) as tmp:
                    temp_name = Path(tmp.name)
                with z.open(member) as stream:
                    sha, size = git_sha_stream(stream, member.file_size, temp_name)
                entry = by_sha.get(sha)
                if entry is None or size != entry['git_object_bytes']:
                    unrecognized.append({'zip_member': member.filename,
                                         'bytes': size, 'git_blob_sha': sha})
                    continue
                if sha in seen:
                    failures.append({'zip_member': member.filename,
                                     'reason': 'duplicate original PDF blob'})
                    continue
                target = (resolved_out / entry['path']).resolve()
                if not target.is_relative_to(resolved_out):
                    raise ValueError('Resolved destination escaped staging directory')
                target.parent.mkdir(parents=True, exist_ok=True)
                os.replace(temp_name, target)
                temp_name = None
                seen[sha] = {'path': entry['path'], 'sha': sha, 'bytes': size}
            except (OSError, ValueError, zipfile.BadZipFile, RuntimeError) as e:
                failures.append({'zip_member': member.filename, 'reason': str(e)})
            finally:
                if temp_name is not None:
                    temp_name.unlink(missing_ok=True)
    missing = [e['path'] for sha, e in by_sha.items() if sha not in seen]
    report = {
        'status': 'PASS' if not (missing or unrecognized or failures) else 'INCOMPLETE',
        'expected': len(by_sha), 'verified': len(seen),
        'verified_pdf_bytes': sum(x['bytes'] for x in seen.values()),
        'matched': list(seen.values()), 'missing': missing,
        'unrecognized_pdf_members': unrecognized, 'failed_members': failures,
        'warning': 'Git hashes establish original binary identity only, not English-only content.'
    }
    (resolved_out / 'zip-stage-validation.json').write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    return report


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('zip_file', type=Path)
    ap.add_argument('--repo', type=Path, default=Path('.'))
    ap.add_argument('--output', type=Path, default=DEFAULT_OUT)
    args = ap.parse_args()
    root = args.repo.resolve()
    manifest = root / MANIFEST
    output = args.output if args.output.is_absolute() else root / args.output
    zip_path = args.zip_file.resolve()
    result = stage_archive(zip_path, manifest, output)
    print(f"{result['status']}: {result['verified']}/{result['expected']} PDFs matched actual Git hashes")
    if result['status'] != 'PASS':
        print('Missing:', len(result['missing']),
              'unrecognized:', len(result['unrecognized_pdf_members']),
              'failed:', len(result['failed_members']))
        raise SystemExit(1)


if __name__ == '__main__':
    main()
