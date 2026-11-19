import hashlib
import json
import tempfile
import unittest
import zipfile
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / 'scripts' / 'pdf'))
from stage_level5_building_from_wix_zip import stage_archive


def sha(data):
    return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()


class StageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.manifest = self.root / 'manifest.json'
        self.out = self.root / 'out'
        self.originals = {
            f'public/Level 5/Building/Demo/{i:03d}/file.pdf':
            b'%PDF-1.7\n' + str(i).encode() * 100
            for i in range(45)
        }
        self.manifest.write_text(json.dumps({'files':[
            {'path': path,'git_blob_sha': sha(data),'git_object_bytes': len(data)}
            for path,data in self.originals.items()
        ]}))
        self.zip = self.root / 'originals.zip'
        with zipfile.ZipFile(self.zip, 'w') as z:
            for i,(name,data) in enumerate(self.originals.items()):
                z.writestr(f'confusing-file-name-{i}.pdf',data)

    def test_stage_ignores_names_and_verifies_all_sha(self):
        result=stage_archive(self.zip,self.manifest,self.out)
        self.assertEqual(result['status'],'PASS')
        self.assertEqual(result['verified'],45)
        self.assertEqual((self.out / next(iter(self.originals))).read_bytes(),next(iter(self.originals.values())))

    def test_rejects_wrong_content_and_avoids_untrusted_path(self):
        with zipfile.ZipFile(self.zip,'a') as z:
            z.writestr('../../evil.pdf',b'%PDF-1.7 evil')
        result=stage_archive(self.zip,self.manifest,self.out)
        self.assertEqual(result['status'],'INCOMPLETE')
        self.assertEqual(len(result['unrecognized_pdf_members']),1)
        self.assertFalse((self.root/'evil.pdf').exists())

    def test_rejects_duplicate_original(self):
        with zipfile.ZipFile(self.zip,'a') as z:
            z.writestr('dupe.pdf',next(iter(self.originals.values())))
        result=stage_archive(self.zip,self.manifest,self.out)
        self.assertEqual(result['status'],'INCOMPLETE')
        self.assertEqual(len(result['failed_members']),1)

    def test_reports_missing(self):
        with zipfile.ZipFile(self.zip,'w') as z:
            for k,v in list(self.originals.items())[:-1]:
                z.writestr(k.split('/')[-2]+'.pdf',v)
        result=stage_archive(self.zip,self.manifest,self.out)
        self.assertEqual(result['status'],'INCOMPLETE')
        self.assertEqual(len(result['missing']),1)


if __name__ == '__main__':
    unittest.main()
