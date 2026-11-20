#!/usr/bin/env node
/**
 * Evidence collector for the first five unpublished Level 6 Quiz Studio projects.
 *
 * Reads official PDFs registered in quiz-learning-source-manifest.json,
 * records SHA-256 digests and text from each 1-based page, and flags visual QA.
 * Does NOT write quizzes or modify shared Quiz Studio files.
 *
 * Run from repository root:
 *   node src/data/quizBanks/level6/extract-batch1.mjs
 *   node src/data/quizBanks/level6/extract-batch1.mjs --remote
 *
 * --remote fetches the registered HTTPS source if its local PDF is absent.
 * Output is only under src/data/quizBanks/level6/evidence/.
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const folder = dirname(fileURLToPath(import.meta.url));
const root = resolve(folder, '../../../..');
const evidenceDir = join(folder, 'evidence');
const manifestPath = join(root, 'scripts', 'quiz-learning-source-manifest.json');
const allowRemote = process.argv.includes('--remote');
const onlyIdAt = process.argv.indexOf('--project');
const onlyId = onlyIdAt === -1 ? null : process.argv[onlyIdAt + 1];
const batchIds = [
  'level-6-accurate-shooting',
  'level-6-autonomous-driving',
  'level-6-clown',
  'level-6-code-scanning-gate',
  'level-6-colorblind-assistant-robot',
];
if (onlyIdAt !== -1 && (!onlyId || !batchIds.includes(onlyId))) {
  throw new Error('The --project argument must be one of the five batch-1 project IDs.');
}
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const registered = new Map(manifest.sources.filter(item => item.level === 6)
  .map(item => [item.projectId, item]));
const results = [];
await mkdir(evidenceDir, { recursive: true });

for (const projectId of (onlyId ? [onlyId] : batchIds)) {
  const entry = registered.get(projectId);
  if (!entry) {
    results.push({ projectId, status: 'blocked', reason: 'Not found in the official source manifest' });
    continue;
  }
  const sourceFile = resolve(root, entry.sourcePath);
  let pdf = null;
  try {
    let bytes;
    let acquisition = 'local';
    try {
      bytes = await readFile(sourceFile);
    } catch (error) {
      if (!allowRemote) {
        throw new Error(`Local PDF not found: ${sourceFile}. Retry with --remote to use the registered URL.`);
      }
      if (!entry.url || !/^https:\/\//.test(entry.url)) {
        throw new Error('No trusted HTTPS teaching PDF is registered');
      }
      const response = await fetch(entry.url, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error(`Registered PDF HTTP ${response.status}`);
      const declaredLength = Number(response.headers.get('content-length') || 0);
      if (declaredLength > 50 * 1024 * 1024) throw new Error('PDF exceeds the 50 MiB source limit');
      bytes = Buffer.from(await response.arrayBuffer());
      acquisition = 'registered-remote';
    }
    if (bytes.byteLength > 50 * 1024 * 1024) throw new Error('PDF exceeds the 50 MiB source limit');
    if (bytes.subarray(0, 5).toString('latin1') !== '%PDF-') throw new Error('Downloaded file is not a PDF');

    const sha256 = createHash('sha256').update(bytes).digest('hex');
    pdf = await getDocument({ data: new Uint8Array(bytes), useSystemFonts: true, disableFontFace: true }).promise;
    const pages = [];
    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();
      const txt = content.items.map(item => 'str' in item ? String(item.str) : '')
        .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
      pages.push({
        slide: n,
        text: txt,
        textCharacterCount: txt.length,
        visualReviewRequired: true,
        littleText: txt.length < 70,
      });
      page.cleanup();
    }
    const evidence = {
      projectId,
      sourcePath: entry.sourcePath,
      registeredSourceUrl: entry.url,
      acquisition,
      sha256,
      sourcePageCount: pdf.numPages,
      slides: pages,
      visualReviewComplete: false,
      contentApprovedForQuestions: false,
      note: 'Page text and indexes are raw research, NOT fact-checked lesson objectives. Review each relevant rendered slide and every programming or mechanical illustration before authoring or approving a quiz.',
    };
    await writeFile(join(evidenceDir, `${projectId}.json`), JSON.stringify(evidence, null, 2) + '\n');
    const summary = { projectId, status: 'extracted-text-only', pageCount: pdf.numPages,
      lowTextPages: pages.filter(page => page.littleText).map(page => page.slide), sha256 };
    results.push(summary);
    console.log(`${projectId}: ${pdf.numPages} pages extracted; ${summary.lowTextPages.length} need priority visual review`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ projectId, status: 'blocked', reason: message });
    console.error(`${projectId}: BLOCKED - ${message}`);
  } finally {
    if (pdf) await pdf.destroy();
  }
}
const summaryFile = join(evidenceDir, 'batch1-summary.json');
await writeFile(summaryFile, JSON.stringify({
  batch: 1, sourceCount: results.length, results,
  quizzesPublished: 0,
  disclaimer: 'Visual inspection and correctness review are mandatory before authoring.',
}, null, 2) + '\n');
console.log(`Evidence written under ${evidenceDir}`);
if (results.some(item => item.status === 'blocked')) process.exitCode = 1;
