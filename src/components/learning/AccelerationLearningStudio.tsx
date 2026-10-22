import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from "pdfjs-dist";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Expand, List, Minimize, Minus, Plus, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PdfManualPage, type PdfViewportSize } from "@/components/practical/PdfManualPage";
import { accelerationGroups, createAccelerationQuiz } from "@/data/accelerationLearning";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import sourceUrl from "../../../Acceleration car_Powerpoint.pdf?url";

const STORAGE = "bsr.acceleration-learning.v1";
type Saved = { page:number; viewed:number[]; best:number; passed:boolean; previousIds:string[] };
const initial: Saved = {page:1,viewed:[],best:0,passed:false,previousIds:[]};
function readSaved():Saved {
  if(typeof window==="undefined")return initial;
  try {const v=JSON.parse(localStorage.getItem(STORAGE)||"null");
    if(!v||typeof v!=="object")return initial;
    return {page:Number.isInteger(v.page)?Math.max(1,v.page):1,viewed:Array.isArray(v.viewed)?v.viewed.filter((n:unknown)=>Number.isInteger(n)):[],best:Math.min(5,Math.max(0,Number(v.best)||0)),passed:v.passed===true,previousIds:Array.isArray(v.previousIds)?v.previousIds.filter((n:unknown)=>typeof n==="string"):[]};
  } catch{return initial;}
}
export function AccelerationLearningStudio({
  initialView = "slides",
  onBackToProject,
}: {
  initialView?: "slides" | "quiz";
  onBackToProject?: () => void;
} = {}){
  const [saved,setSaved]=useState<Saved>(readSaved);
  const [pdf,setPdf]=useState<PDFDocumentProxy|null>(null);
  const [error,setError]=useState("");
  const [reload,setReload]=useState(0);
  const [size,setSize]=useState<PdfViewportSize>({width:900,height:520});
  const viewport=useRef<HTMLDivElement>(null);
  const fullscreen=useRef<HTMLDivElement>(null);
  const [isFullscreen,setFullscreen]=useState(false);
  const [zoom,setZoom]=useState(1);
  const [outline,setOutline]=useState(false);
  const [dockOpen,setDockOpen]=useState(false);
  const [mode,setMode]=useState<"slides"|"quiz"|"result">(initialView);
  const [reviewingAnswer,setReviewingAnswer]=useState(false);
  const [questions,setQuestions]=useState(()=>createAccelerationQuiz());
  const [index,setIndex]=useState(0);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [lastScore,setLastScore]=useState(0);
  const pages=pdf?.numPages??17;
  const page=Math.min(pages,saved.page);
  const viewed=new Set(saved.viewed);
  const visited=viewed.size;
  useEffect(()=>{try{localStorage.setItem(STORAGE,JSON.stringify(saved));}catch{}},[saved]);
  useEffect(()=>{
    let cancelled=false;let task:PDFDocumentLoadingTask|undefined;
    setError("");setPdf(null);
    void(async()=>{try{
      const pdfjs=await import("pdfjs-dist");
      if(cancelled)return;
      pdfjs.GlobalWorkerOptions.workerSrc=workerUrl;
      task=pdfjs.getDocument({url:sourceUrl});
      const doc=await task.promise;
      if(!cancelled)setPdf(doc);
    }catch(e){if(!cancelled)setError(e instanceof Error?e.message:"Unable to open lecture PDF.");}})();
    return()=>{cancelled=true;void task?.destroy();};
  },[reload]);
  useEffect(()=>{
    if(mode!=="slides"||!pdf)return;
    const node=viewport.current;if(!node)return;
    const update=()=>setSize({width:Math.max(240,node.clientWidth-24),height:Math.max(220,node.clientHeight-24)});
    update();const observer=new ResizeObserver(update);observer.observe(node);return()=>observer.disconnect();
  },[mode,pdf]);
  useEffect(()=>{if(pdf)setSaved(v=>({...v,page:Math.min(pdf.numPages,v.page),viewed:v.viewed.includes(page)?v.viewed:[...v.viewed,page]}));},[pdf,page]);
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{if(mode!=="slides"||e.target instanceof HTMLInputElement||e.target instanceof HTMLButtonElement)return;
      if(e.key==="ArrowRight")go(page+1);if(e.key==="ArrowLeft")go(page-1);
    };
    window.addEventListener("keydown",handler);return()=>window.removeEventListener("keydown",handler);
  },[mode,page,pages]);
  useEffect(()=>{
    const listener=()=>setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange",listener);return()=>document.removeEventListener("fullscreenchange",listener);
  },[]);
  function go(n:number){const p=Math.min(pages,Math.max(1,n));setSaved(v=>({...v,page:p,viewed:v.viewed.includes(p)?v.viewed:[...v.viewed,p]}));setZoom(1);}
  function beginQuiz(){
    setReviewingAnswer(false);
    setQuestions(createAccelerationQuiz(saved.previousIds));
    setIndex(0);
    setAnswers({});
    setMode("quiz");
  }
  function reviewReferenceSlide(referencePage: number){
    if (!Number.isInteger(referencePage) || referencePage < 1 || referencePage > pages) return;
    go(referencePage);
    setReviewingAnswer(true);
    setDockOpen(false);
    setOutline(false);
    setMode("slides");
  }
  function returnToResults(){
    setReviewingAnswer(false);
    setMode("result");
  }
  function submit(){
    if(questions.some(q=>!answers[q.id]))return;
    const score=questions.filter(q=>answers[q.id]===q.correct).length;
    setLastScore(score);
    setSaved(v=>({...v,best:Math.max(v.best,score),passed:v.passed||score>=4,previousIds:questions.map(q=>q.id)}));
    setMode("result");
  }
  const question=questions[index];
  return <div ref={fullscreen} className="flex h-[100dvh] min-h-[440px] flex-col overflow-hidden bg-[#f3faff] text-[#132654]">
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-sky-100 bg-white px-3 sm:px-6">
      {onBackToProject ? (
        <button type="button" onClick={onBackToProject}
          className="grid size-11 place-items-center rounded-2xl border border-sky-100"
          aria-label="Back to Acceleration Car project">
          <ArrowLeft/>
        </button>
      ) : (
        <Link to="/projects/acceleration-car"
          className="grid size-11 place-items-center rounded-2xl border border-sky-100"
          aria-label="Back to Acceleration Car project">
          <ArrowLeft/>
        </Link>
      )}
      <div className="min-w-0 text-center"><h1 className="truncate text-sm font-black sm:text-lg">Acceleration Car · Learning Studio</h1><p className="text-xs text-slate-500">Level 1 · {mode==="slides"?(reviewingAnswer?"Review Source Slide":"Lecture"):mode==="quiz"?"Quick Quiz":"Quiz Results"}</p></div>
      <span className="rounded-xl bg-sky-50 px-3 py-2 text-xs font-extrabold text-[#168eea]">{saved.passed?"✓ Passed":`Best ${saved.best}/5`}</span>
    </header>
    {mode==="slides"?<>
      <main className="relative min-h-0 flex-1 p-2 pb-32 sm:p-4 sm:pb-36">
        <section className="relative h-full overflow-hidden rounded-[24px] border border-sky-100 bg-[#e7f3fe]" aria-label="Original Acceleration Car lecture slide">
          {reviewingAnswer && (
            <Button type="button" variant="outline" onClick={returnToResults}
              className="absolute left-2 top-2 z-20 max-w-[55%] rounded-xl bg-white shadow sm:left-3 sm:top-3">
              <ArrowLeft className="size-4 shrink-0"/>
              <span className="truncate">Back to Quiz Results</span>
            </Button>
          )}
          <div className="absolute right-2 top-2 z-10 flex gap-1 rounded-2xl bg-white/95 p-1 shadow">
            <Button size="icon" variant="ghost" aria-label="Zoom out" onClick={()=>setZoom(z=>Math.max(.5,z/1.25))}><Minus className="size-4"/></Button>
            <Button size="icon" variant="ghost" aria-label="Zoom in" onClick={()=>setZoom(z=>Math.min(3,z*1.25))}><Plus className="size-4"/></Button>
            <Button size="icon" variant="ghost" aria-label="Toggle fullscreen" onClick={()=>isFullscreen?document.exitFullscreen():fullscreen.current?.requestFullscreen()}>{isFullscreen?<Minimize className="size-4"/>:<Expand className="size-4"/>}</Button>
          </div>
          <div ref={viewport} className="absolute inset-0 overflow-auto p-3 pt-14 sm:p-5 sm:pt-16">
            <div className="flex min-h-full min-w-full w-max items-start justify-center">
              {pdf?<PdfManualPage pdfDocument={pdf} pageNumber={page} fit="page" zoom={zoom} viewport={size} pageLabel={`Acceleration Car lecture slide ${page}`}/>:<div className="m-auto max-w-md p-4 text-center text-sm font-semibold text-slate-600">{error?<><p role="alert">{error}</p><Button variant="outline" onClick={()=>setReload(n=>n+1)}>Retry PDF</Button></>:"Loading original lecture PDF…"}</div>}
            </div>
          </div>
        </section>
      </main>
      <footer className="absolute bottom-3 left-1/2 z-20 w-[min(94vw,660px)] -translate-x-1/2 rounded-[24px] border border-sky-100 bg-white/95 p-3 shadow-[0_12px_40px_rgba(19,38,84,.18)] backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <Button disabled={page<=1} variant="outline" onClick={()=>go(page-1)}><ChevronLeft className="size-4"/> <span className="hidden sm:inline">Previous</span></Button>
          <button type="button" onClick={()=>setDockOpen(v=>!v)} className="min-h-11 rounded-xl px-2 text-center text-sm font-black" aria-expanded={dockOpen}>Slide {page} / {pages}<span className="block text-[10px] font-medium text-slate-500">{visited}/{pages} viewed · {dockOpen?"Hide":"More"} ▴</span></button>
          <Button disabled={!pdf||page===pages} onClick={()=>go(page+1)}><span className="hidden sm:inline">Next</span><ChevronRight className="size-4"/></Button>
        </div>
        {dockOpen&&<div className="mt-3 border-t pt-3">
          <button type="button" className="mb-2 flex items-center gap-2 text-xs font-bold" onClick={()=>setOutline(v=>!v)}><List className="size-4"/> {outline?"Hide slide list":"Browse slides"}</button>
          {outline&&<div className="mb-3 grid max-h-28 grid-cols-6 gap-1 overflow-y-auto sm:grid-cols-9">{Array.from({length:pages},(_,i)=><button className={`rounded-lg p-2 text-xs font-bold ${page===i+1?"bg-[#168eea] text-white":"bg-sky-50"}`} onClick={()=>go(i+1)} key={i}>{i+1}</button>)}</div>}
          <Button className="w-full" onClick={beginQuiz}><BookOpen className="size-4"/> Start Quick Quiz</Button>
          <p className="mt-1 text-center text-[10px] text-slate-500">Study all slides before attempting the quiz. You can take it anytime.</p>
        </div>}
        {!dockOpen&&page===pages&&<Button className="mt-2 w-full" onClick={beginQuiz}>Start Quick Quiz <ArrowRight className="size-4"/></Button>}
      </footer>
    </>:mode==="quiz"&&question?<main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center overflow-y-auto p-4 sm:p-8">
      <div className="rounded-[28px] border border-sky-100 bg-white p-5 shadow-lg sm:p-8">
        <p className="text-xs font-black uppercase tracking-wider text-[#168eea]">Question {index+1} of 5 · {accelerationGroups.includes(question.group as typeof accelerationGroups[number])?question.group:"Learning"}</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-sky-100"><div className="h-full bg-[#168eea]" style={{width:`${((index+1)/5)*100}%`}}/></div>
        <h2 className="mt-6 text-lg font-black leading-7 sm:text-2xl">{question.prompt}</h2>
        <div className="mt-5 grid gap-3">{question.options.map((option,i)=><button key={option} type="button" onClick={()=>setAnswers(a=>({...a,[question.id]:option}))} aria-pressed={answers[question.id]===option} className={`min-h-14 rounded-2xl border p-3 text-left text-sm font-semibold transition ${answers[question.id]===option?"border-[#168eea] bg-sky-100":"border-slate-200 hover:bg-sky-50"}`}><span className="mr-3 font-black text-[#168eea]">{String.fromCharCode(65+i)}.</span>{option}</button>)}</div>
        <div className="mt-6 flex justify-between gap-3"><Button variant="outline" disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ChevronLeft className="size-4"/> Back</Button>{index===4?<Button disabled={!questions.every(q=>answers[q.id])} onClick={submit}>Submit Answers</Button>:<Button disabled={!answers[question.id]} onClick={()=>setIndex(i=>i+1)}>Next <ChevronRight className="size-4"/></Button>}</div>
        <button type="button" className="mt-4 text-xs font-semibold text-slate-500 underline" onClick={()=>setMode("slides")}>Return to lecture (unsent answers will be lost)</button>
      </div>
    </main>:<main className="mx-auto w-full max-w-2xl flex-1 overflow-y-auto p-4 sm:p-8">
      <div className="rounded-[28px] bg-white p-6 text-center shadow-lg"><Trophy className="mx-auto size-14 text-amber-500"/><h2 className="mt-3 text-2xl font-black">{lastScore>=4?"Learning Completed!":"Keep Practising!"}</h2><p className="mt-2 text-4xl font-black text-[#168eea]">{lastScore} / 5</p><p className="mt-2 text-sm text-slate-600">80% (4/5) required · Best {saved.best}/5 {saved.passed?"· Passed":""}</p><div className="mt-5 flex flex-wrap justify-center gap-2"><Button onClick={beginQuiz}><RotateCcw className="size-4"/> Try Another Quiz</Button><Button variant="outline" onClick={()=>reviewReferenceSlide(page)}>Review Lecture</Button>{onBackToProject ? (
        <Button variant="outline" onClick={onBackToProject}>Back to Project</Button>
      ) : (
        <Button variant="outline" asChild>
          <Link to="/projects/acceleration-car">Back to Project</Link>
        </Button>
      )}</div></div>
      <h3 className="mt-5 font-black">Review Your Answers</h3><div className="mt-3 space-y-3">{questions.map((q,i)=>{const right=answers[q.id]===q.correct;return <article key={q.id} className="rounded-2xl border bg-white p-4"><div className="flex items-start gap-2">{right?<CheckCircle2 className="mt-1 size-5 shrink-0 text-green-600"/>:<RotateCcw className="mt-1 size-5 shrink-0 text-amber-600"/>}<div><p className="font-bold">{i+1}. {q.prompt}</p><p className="mt-2 text-sm">Your answer: {answers[q.id]}</p><p className="text-sm font-semibold text-green-700">Correct answer: {q.correct}</p><p className="mt-2 text-xs text-slate-600">{q.explanation}</p>
          <p className="mt-3 text-xs text-slate-600"><strong className="text-[#132654]">Lecture reference:</strong> {q.referenceNote}</p>
          <div className="mt-3 flex flex-wrap gap-2" aria-label={`Lecture references for question ${i+1}`}>
            {q.referenceSlides.map((slide)=>(
              <Button key={slide} type="button" variant="outline" size="sm"
                className="min-h-10 rounded-xl border-sky-200 text-[#168eea]"
                onClick={()=>reviewReferenceSlide(slide)}>
                <BookOpen className="size-4"/> Review Slide {slide}
              </Button>
            ))}
          </div></div></div></article>})}</div>
    </main>}
  </div>;
}
