#!/usr/bin/env python3
"""Independent synthetic safety tests: do not delete unreviewed content."""
from pathlib import Path
from tempfile import TemporaryDirectory
import importlib.util
import unittest
from unittest.mock import patch
import fitz
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location('level2_guarded_cleaner', ROOT / 'clean_level2_learning_once.py')
cleaner = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cleaner)

class FailClosedTests(unittest.TestCase):
    def test_unclassified_educational_chinese_is_not_removed(self):
        with TemporaryDirectory() as td:
            src = Path(td)/'Chinese instructional label.pdf'
            d=fitz.open();p=d.new_page(width=612,height=792)
            p.insert_text((40,100),'电机顺时针转动',fontname='china-s',fontsize=16)
            p.insert_text((40,140),'Turn the motor clockwise - Joinmax',fontsize=12)
            d.save(src);d.close()
            with patch.object(cleaner,'WORK', Path(td)/'work'):
                with self.assertRaisesRegex(RuntimeError,'Unclassified Chinese content'):
                    cleaner.remove_chinese_font_content(src,Path('synthetic/Chinese instructional label.pdf'))
            d=fitz.open(src)
            self.assertIn('电机顺时针转动',d[0].get_text())
            self.assertIn('Turn the motor clockwise - Joinmax',d[0].get_text())
            d.close()

    def test_unapproved_logo_sized_diagram_is_not_deleted(self):
        with TemporaryDirectory() as td:
            root=Path(td);source=root/'source';source.mkdir()
            src=source/'Educational diagram.pdf'
            img=Image.new('RGB',(586,178),'white')
            draw=ImageDraw.Draw(img)
            draw.rectangle((12,12,574,166),outline='black',width=2)
            draw.text((50,50),'NOT A LOGO - EDUCATIONAL CONTENT',fill='black')
            image_path=root/'illustration.png';img.save(image_path)
            d=fitz.open();p=d.new_page(width=612,height=792)
            p.insert_image(fitz.Rect(20,200,606,378),filename=str(image_path))
            p.insert_text((35,120),'Observe the illustration',fontsize=12)
            d.save(src);d.close()
            with patch.object(cleaner,'ROOT',source),patch.object(cleaner,'OUT',root/'out'):
                with self.assertRaisesRegex(RuntimeError,'Unclassified logo-sized image'):
                    cleaner.process(src)
            self.assertFalse((root/'out'/'Educational diagram.pdf').exists())
            d=fitz.open(src)
            self.assertEqual((d[0].get_images(full=True)[0][2],d[0].get_images(full=True)[0][3]),(586,178))
            d.close()

if __name__=='__main__':
    unittest.main()
