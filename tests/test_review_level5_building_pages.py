"""Read-only synthetic tests; does not require real PDFs or GitHub Actions."""
from __future__ import annotations
import sys
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "scripts" / "pdf"))
import review_level5_building_pages as review


class ReviewGateTests(unittest.TestCase):
    def setUp(self):
        files = [
            {"path": f"public/Level 5/Building/Section/Project{i:02d}/file{i:02d}.pdf",
             "git_blob_sha": f"{i:040x}", "git_object_bytes": 100+i}
            for i in range(45)
        ]
        self.manifest = {"source": {"commit": "fixture-commit"}, "files": files}
        self.inspection = {
            "source_commit": "fixture-commit", "pdfs_rehashed": 45,
            "pages_text_scanned": 45, "pages_rendered": 45,
            "files": [
                {"path": f["path"], "source_git_blob_sha": f["git_blob_sha"],
                 "bytes": f["git_object_bytes"], "pages": 1,
                 "page_sizes_points": [[842, 596]],
                 "all_pages_text_scanned": True, "all_pages_rendered": True,
                 "extractable_chinese": [], "ocr_candidates_unconfirmed": []}
                for f in files
            ]
        }

    def all_reviewed(self):
        ledger = review.prepare(self.manifest, self.inspection)
        for p in ledger["pages"]:
            p["visual_status"] = "reviewed"
            p["visible_chinese"] = False
            p["reviewer"] = "synthetic-reviewer"
        return ledger

    def test_unreviewed_pages_cannot_pass(self):
        ledger = review.prepare(self.manifest, self.inspection)
        result = review.verify(self.manifest, self.inspection, ledger)
        self.assertEqual(result["status"], "INCOMPLETE_VISUAL_REVIEW")
        self.assertFalse(result["certified_english_only"])

    def test_every_page_reviewed_clean_can_pass(self):
        result = review.verify(self.manifest, self.inspection, self.all_reviewed())
        self.assertTrue(result["certified_english_only"])
        self.assertEqual(result["pages_reviewed"], 45)

    def test_chinese_detection_blocks_pass(self):
        ledger = self.all_reviewed()
        ledger["pages"][0]["visible_chinese"] = True
        ledger["pages"][0]["chinese_occurrences"] = [{
            "original_text": "马达", "english_translation": "motor",
            "repair_method": "replace the Chinese label"
        }]
        result = review.verify(self.manifest, self.inspection, ledger)
        self.assertFalse(result["certified_english_only"])
        self.assertEqual(result["status"], "CHINESE_FOUND_REPAIR_REQUIRED")

    def test_chinese_occurrence_requires_translation(self):
        ledger = self.all_reviewed()
        ledger["pages"][0]["visible_chinese"] = True
        with self.assertRaises(ValueError):
            review.verify(self.manifest, self.inspection, ledger)

    def test_unrendered_pages_are_rejected(self):
        self.inspection["pages_rendered"] -= 1
        with self.assertRaises(ValueError):
            review.prepare(self.manifest, self.inspection)

    def test_git_blob_mismatch_is_rejected(self):
        self.inspection["files"][0]["source_git_blob_sha"] = "bad"
        with self.assertRaises(ValueError):
            review.prepare(self.manifest, self.inspection)


if __name__ == "__main__":
    unittest.main()
