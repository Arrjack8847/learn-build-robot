#!/usr/bin/env node
// Offline educational review of all 33 new Level 1 question banks.
// No publication, approval, or repository changes are performed.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const out = join(root, "quiz-research");
const status = JSON.parse(await readFile(join(root, "scripts/level1-quiz-status.json"), "utf8"));
const items = [
  ...status.pendingWithIndexedLearningPdf.map(v => ({ ...v, phase: 2 })),
  ...status.pendingWithoutIndexedLearningPdf.map(v => ({ ...v, phase: 3 })),
];
if (items.length !== 33 || new Set(items.map(x => x.projectId)).size !== 33)
  throw new Error("Expected 33 unique, unpublished project banks");
const camel = id => id.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
const safe = s => String(s ?? "").replace(/[&<>"']/g, ch =>
  ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[ch]);
const storyPattern = /\b(story|blackboard|which season|which country|which flower|grandfather|where|who|classroom|shop)\b/i;
const sources = [];
const banks = [];
for (const x of items) {
  const id = x.projectId;
  const file = await readFile(join(root, "src/data/quizBanks", camel(id) + ".ts"), "utf8");
  const match = file.match(/export const \w+: QuizBank = (\{[\s\S]*\});\s*$/);
  if (!match) throw new Error("Unparseable question bank: " + id);
  const bank = JSON.parse(match[1]);
  if (bank.projectId !== id || bank.questions.length !== 10) throw new Error("Invalid bank: " + id);
  let source = null;
  try {
    const folder = x.phase === 3 ? join(out, "phase3") : out;
    source = JSON.parse(await readFile(join(folder, id + ".json"), "utf8"));
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  const aligned = !!source && source.projectId === id &&
    source.sourcePath === bank.sourcePdfPath && source.pageCount === bank.sourcePageCount;
  const hintCounts = new Map();
  bank.questions.forEach(q => hintCounts.set(q.hint, (hintCounts.get(q.hint) || 0) + 1));
  const questions = bank.questions.map(q => {
    const page = aligned ? source.slides.find(p => p.slide === q.learningSlide) : null;
    const flags = [];
    if (!aligned) flags.push("Missing or mismatched source extract");
    else if (!page || page.needsVisualReview || (page.text || "").trim().length < 70)
      flags.push("Inspect PDF image; limited extractable text");
    if (storyPattern.test(q.prompt)) flags.push("Review STEM relevance: narrative/classroom recall");
    if (q.image) flags.push("Original concept illustration: verify against actual lesson diagram");
    if (hintCounts.get(q.hint) > 1) flags.push("Reused hint");
    if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3)
      flags.push("Invalid answer index");
    if (!Number.isInteger(q.learningSlide) || q.learningSlide < 1 ||
      q.learningSlide > bank.sourcePageCount) flags.push("Invalid PDF page");
    const url = "../" + bank.sourcePdfPath.split("/").map(encodeURIComponent).join("/") +
      "#page=" + q.learningSlide;
    return { ...q, flags, pdfUrl: url, text: aligned && page ? page.text : "" };
  });
  sources.push({ id, aligned, pageCount: bank.sourcePageCount, sourcePath: bank.sourcePdfPath });
  banks.push({ id, title: bank.title, phase: x.phase, questions });
}
const marked = banks.flatMap(b => b.questions.filter(q => q.flags.length));
const summary = {
  generatedAt: new Date().toISOString(), publicationApproved: false,
  banks: banks.length, questions: banks.reduce((n,b) => n+b.questions.length, 0),
  flaggedQuestions: marked.length, sources,
  issues: banks.flatMap(b => b.questions.filter(q => q.flags.length).map(q => ({
    bank: b.id, id: q.id, page: q.learningSlide, flags: q.flags,
  }))),
};
const render = (bank, q) => [
  '<article data-question="' + safe(q.id) + '">',
  '<div class="meta">' + safe(bank.id) + ' · question ' + safe(q.id) +
    ' · PDF page ' + q.learningSlide + ' · <a target="_blank" href="' + safe(q.pdfUrl) +
    '">Open original PDF page</a></div>',
  '<h3>' + safe(q.prompt) + '</h3>',
  q.image ? '<figure class="quiz-image"><img loading="lazy" src="' + safe("../public" + q.image.src) +
    '" alt="' + safe(q.image.alt) + '"/><figcaption>Original concept sketch; verify with official PDF.</figcaption></figure>' : '',
  '<ol type="A">',
  ...q.choices.map((opt,i) => '<li' + (i===q.correctIndex?' class="correct"':'') +
    '>' + safe(opt) + '</li>'),
  '</ol><p><b>Answer:</b> ' + safe(q.choices[q.correctIndex]) + '</p>',
  '<p><b>Hint:</b> ' + safe(q.hint) + '</p>',
  '<p><b>Explanation:</b> ' + safe(q.explanation) + '</p>',
  '<details><summary>Source page text (not the PDF diagram)</summary><p class="source">' +
    safe(q.text || "No text extracted. Open the original PDF.") + '</p></details>',
  q.flags.length ? '<p class="flags">' + q.flags.map(safe).join(" · ") + '</p>' : '',
  '<div class="review"><label>Teacher review <select data-status="' + safe(q.id) + '">' +
    '<option value="pending">Not reviewed</option>' +
    '<option value="checked">Answer and page checked</option>' +
    '<option value="revise">Needs revision</option></select></label>' +
    '<label>Notes <input type="text" data-note="' + safe(q.id) + '" placeholder="Comments..."></label></div>',
  '</article>',
].join("");
const html = [
'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
'<title>BE STEM READY - Level 1 Phase 4 Review</title>',
'<style>body{margin:0;background:#f3f8fe;color:#20314f;font:15px system-ui,sans-serif}',
'header{position:sticky;top:0;background:#fff;padding:14px 3%;border-bottom:1px solid #d5e4f6;z-index:2}',
'h1{font-size:19px;margin:0}header p{margin:5px 0;font-size:13px;color:#557}',
'button,select,input{font:inherit;padding:9px;border:1px solid #b6c9df;border-radius:8px}',
'button{background:#d9eeff;cursor:pointer}main{max-width:980px;margin:auto;padding:20px}',
'section{margin-bottom:45px}h2{margin:30px 0 6px}article{background:white;border:1px solid #d9e7f6;border-radius:14px;padding:20px;margin:14px 0}',
'h3{font-size:17px;line-height:1.5}.meta{font-size:12px;color:#60718b}a{color:#0871bd}',
'li{line-height:1.8}.correct{font-weight:bold;color:#127346}.source{padding:12px;background:#eff5fc;white-space:pre-wrap}',
'.flags{background:#fff2d9;color:#7a4c13;border-radius:8px;padding:10px;font-size:13px}',
'.review{display:flex;flex-wrap:wrap;gap:14px}.review label{flex:1;display:grid;gap:6px;min-width:180px}',
'.review input,.review select{width:100%;box-sizing:border-box}',
'.quiz-image{max-width:620px;padding:9px;margin:14px auto;background:#f2f8ff;border:1px solid #b9d7ee;border-radius:12px}',
'.quiz-image img{width:100%;height:auto;display:block}.quiz-image figcaption{text-align:center;font-size:12px;color:#557;margin-top:5px}',
'</style></head><body>',
'<header><h1>BE STEM READY · Level 1 content review</h1>',
'<p>33 UNPUBLISHED banks · 330 questions · '+marked.length+' items automatically flagged for review</p>',
'<p>Review decisions are LOCAL ONLY and never publish or approve a quiz in the application.</p>',
'<button id="export">Export teacher review JSON</button> <button id="unfinished">Show unreviewed</button> <button id="showall">Show all</button></header>',
'<main>',
...banks.map(b => '<section><h2>'+safe(b.title)+' — Phase '+b.phase+'</h2>' +
  '<p>'+safe(sources.find(x=>x.id===b.id).sourcePath)+'</p>' +
  b.questions.map(q=>render(b,q)).join("")+'</section>'),
'</main><script>',
'(function(){const key="bsr-phase4-local-review", all=Array.from(document.querySelectorAll("[data-status]"));',
'let data={};try{data=JSON.parse(localStorage.getItem(key)||"{}")}catch(e){}',
'const save=()=>{try{localStorage.setItem(key,JSON.stringify(data))}catch(e){}};',
'all.forEach(select=>{const id=select.dataset.status,note=document.querySelector("[data-note="+CSS.escape(id)+"]");',
'select.value=data[id]?.status||"pending";note.value=data[id]?.note||"";',
'const update=()=>{data[id]={status:select.value,note:note.value};save()};',
'select.addEventListener("change",update);note.addEventListener("change",update)});',
'document.getElementById("export").onclick=()=>{const blob=new Blob([JSON.stringify({schemaVersion:1,',
'releaseApproved:false,reviewerNotes:data},null,2)],{type:"application/json"});',
'const url=URL.createObjectURL(blob),a=document.createElement("a");',
'a.href=url;a.download="level1-phase4-teacher-review.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};',
'document.getElementById("unfinished").onclick=()=>{document.querySelectorAll("article").forEach(a=>',
'a.hidden=(data[a.dataset.question]?.status==="checked"))};',
'document.getElementById("showall").onclick=()=>{document.querySelectorAll("article").forEach(a=>a.hidden=false)};',
'})();',
'</script></body></html>',
].join("\n");
await mkdir(out,{recursive:true});
await writeFile(join(out,"level1-phase4-review.html"),html,"utf8");
await writeFile(join(out,"level1-phase4-audit.json"),JSON.stringify(summary,null,2)+"\n","utf8");
console.log("Created quiz-research/level1-phase4-review.html");
console.log("Created quiz-research/level1-phase4-audit.json");
console.log("Banks:",summary.banks,"questions:",summary.questions,"flagged:",summary.flaggedQuestions);
console.log("Teacher decisions remain local until the reviewer explicitly exports them.");