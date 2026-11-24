#!/usr/bin/env python3
"""Guard against content regressions when cleaning Level 2 Learning PDF covers.

Run from repo root: python -m unittest discover -s scripts/pdf -p 'test_level2_english_protection.py'
This is a synthetic smoke test, NOT final sign-off for the 43 real PDFs.
"""
import importlib.util
import unittest
from pathlib import Path
import fitz

ROOT = Path(__file__).resolve().parent


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, ROOT / filename)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


cleaner = load("safe_cleaner", "clean_level2_learning_once.py")
validator = load("strict_validator", "validate_level2_cleaned.py")

INTRO = (
    "Intelligence Storm is a building block programming robot "
    "research and development by Joinmax."
)
BAD_INTRO = (
    "This robotics kit is a building block programming robot "
    "research and development by Joinmax."
)


class EnglishProtectionTests(unittest.TestCase):
    def test_only_standalone_labels_qualify(self):
        self.assertTrue(cleaner.BRAND_ONLY.fullmatch("Intelligence Storm - Series"))
        self.assertTrue(cleaner.BRAND_ONLY.fullmatch("Intelligence Storm (-) Series"))
        self.assertTrue(cleaner.BRAND_ONLY.fullmatch("Intelligence Storm"))
        self.assertFalse(cleaner.BRAND_ONLY.fullmatch(INTRO))
        self.assertFalse(cleaner.BRAND_ONLY.fullmatch("Joinmax"))
        self.assertEqual(cleaner.new_text(INTRO, "intro"), INTRO)

    def test_exact_english_qa_rejects_known_regressions(self):
        self.assertNotEqual(
            validator.canonical_instructional_english(INTRO),
            validator.canonical_instructional_english(BAD_INTRO)
        )
        original = "Intelligence Storm - Series\n" + INTRO
        safe = "Learning Series\n" + INTRO
        bad = "Learning Series\n" + BAD_INTRO
        self.assertEqual(
            validator.canonical_instructional_english(original),
            validator.canonical_instructional_english(safe)
        )
        self.assertNotEqual(
            validator.canonical_instructional_english(original),
            validator.canonical_instructional_english(bad)
        )

    def test_cover_cleanup_preserves_english_body(self):
        doc = fitz.open()
        page = doc.new_page(width=960, height=540)
        page.insert_text((35, 85), "Intelligence Storm - Series", fontsize=24)
        page.insert_text((35, 310), INTRO, fontsize=11)
        events = cleaner.cover_and_brand(page, page_num=1, total=12)
        result = page.get_text()
        self.assertIn("Learning Series", result)
        self.assertIn(INTRO, result)
        self.assertNotIn(BAD_INTRO, result)
        self.assertEqual(events, [(1, "heading")])
        doc.close()

    def test_visual_qa_mask_excludes_embedded_brand_in_english_prose(self):
        doc = fitz.open()
        page = doc.new_page(width=960, height=540)
        page.insert_text((35, 85), "Intelligence Storm - Series", fontsize=24)
        page.insert_text((35, 310), INTRO, fontsize=11)
        regions = validator.allowed_rectangles(page)
        editable_text_regions = [rect for rect, kind in regions if kind == "text"]
        self.assertEqual(len(editable_text_regions), 1)
        self.assertLess(editable_text_regions[0].y1, 220)
        doc.close()

    def test_split_font_span_inside_sentence_is_not_redacted(self):
        doc = fitz.open()
        page = doc.new_page(width=960, height=540)
        first = "Intelligence Storm"
        tail = " is a building block programming robot by Joinmax."
        page.insert_text((35, 120), first, fontsize=12, fontname="helv")
        x = 35 + fitz.get_text_length(first, fontname="helv", fontsize=12)
        page.insert_text((x, 120), tail, fontsize=12, fontname="hebo")
        before = page.get_text()
        events = cleaner.cover_and_brand(page, page_num=1, total=12)
        after = page.get_text()
        self.assertFalse(events)
        self.assertEqual(before, after)
        doc.close()


if __name__ == "__main__":
    unittest.main()
