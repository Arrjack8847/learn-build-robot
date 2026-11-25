import { useActivitySync } from "@/lib/use-activity-sync";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, AlertCircle, ChevronLeft, ChevronRight, Download, Expand, Shrink } from "lucide-react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from "pdfjs-dist";
import { PdfManualPage, type PdfViewportSize } from "./PdfManualPage";
import type { LevelOneLecture } from "@/data/levelOneLectures";
import { getLevelTwoProgrammingFiles } from "@/data/levelTwoProgrammingFiles";
import { getLevelFiveSixProgrammingFiles } from "@/data/levelFiveSixContent";
import { getLegacyProgrammingFiles } from "@/data/legacyProgrammingFiles";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** One PDF page per slide, separate from the Building Studio instruction dock. */
export function LevelOneLearningStudio({
  projectId, title, lecture, categoryId, level = 1,
}: {
  projectId: string;
  title: string;
  lecture: LevelOneLecture;
  categoryId?: string | undefined;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}) {
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<{ loaded: number; total: number } | null>(null);
  const [page, setPage] = useState(1);
  const [retry, setRetry] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewport, setViewport] = useState<PdfViewportSize>({ width: 900, height: 550 });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const total = document?.numPages ?? 0;
  const sync = useActivitySync(projectId, "learning", Boolean(document));
  const programmingFiles = level === 2 ? getLevelTwoProgrammingFiles(projectId) :
    level === 5 || level === 6 ? getLevelFiveSixProgrammingFiles(projectId) :
    getLegacyProgrammingFiles({ level, categoryId, title });

  useEffect(() => {
    let disposed = false;
    let task: PDFDocumentLoadingTask | undefined;
    setDocument(null);
    setError(null);
    setDownloadProgress(null);
    setPage(1);
    const startedAt = performance.now();
    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        task = pdfjs.getDocument({
          url: lecture.url,
          ...(lecture.url.includes(".usrfiles.com/") ? { rangeChunkSize: 256 * 1024 } : {}),
        });
        task.onProgress = ({ loaded: bytes, total }: { loaded: number; total: number }) => {
          if (!disposed) setDownloadProgress({ loaded: bytes, total });
        };
        const pdf = await task.promise;
        if (disposed) return;
        if (!pdf.numPages) throw new Error("No slides found in this PDF.");
        setDocument(pdf);
        // Quiz review links point to a 1-based source page. Clamp to the real PDF.
        const reviewSlide = Number(new URLSearchParams(window.location.search).get("slide"));
        if (Number.isInteger(reviewSlide) && reviewSlide >= 1) {
          setPage(Math.min(reviewSlide, pdf.numPages));
        }
        if (new URLSearchParams(window.location.search).has("pdfDebug")) {
          console.info("[BSR PDF] Learning metadata ready in", Math.round(performance.now() - startedAt), "ms", projectId);
        }
      } catch (cause) {
        if (!disposed) setError(cause instanceof Error ? cause.message : "Unable to load lecture PDF.");
      }
    })();
    return () => {
      disposed = true;
      void task?.destroy();
    };
  }, [lecture.url, retry]);

  useEffect(() => {
    const area = slideRef.current;
    if (!area) return;
    const measure = () => setViewport({
      width: Math.max(250, area.clientWidth - 32),
      height: Math.max(220, area.clientHeight - 32),
    });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onFullScreenChange = () => setIsFullscreen(window.document.fullscreenElement === workspaceRef.current);
    window.document.addEventListener("fullscreenchange", onFullScreenChange);
    return () => window.document.removeEventListener("fullscreenchange", onFullScreenChange);
  }, []);

  useEffect(() => {
    if (!total) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target;
      if (element instanceof HTMLElement &&
        (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(element.tagName))) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        setPage(current => Math.min(total, current + 1));
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        setPage(current => Math.max(1, current - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [total]);

  useEffect(() => {
    if (slideRef.current) {
      slideRef.current.scrollLeft = 0;
      slideRef.current.scrollTop = 0;
    }
  }, [page]);

  const changeFullscreen = async () => {
    const area = workspaceRef.current;
    if (!area) return;
    try {
      if (window.document.fullscreenElement === area) await window.document.exitFullscreen();
      else await area.requestFullscreen();
    } catch {
      // The browser may block full screen in embedded contexts.
    }
  };

  return (
    <div ref={workspaceRef} className="flex h-[100dvh] min-h-0 flex-col overflow-hidden bg-[#f3faff] text-[#132654]">
      <header className="flex shrink-0 items-center gap-2 border-b border-sky-100 bg-white px-3 py-2 sm:px-6">
        <Link to="/projects/$projectId" params={{ projectId }} aria-label="Back to project"
          className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-extrabold text-[#168eea] hover:bg-sky-50">
          <ArrowLeft className="size-4" aria-hidden="true"/> <span className="hidden sm:inline">Project</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#168eea]">Level {level} · Learning Studio</p>
          <h1 className="truncate text-sm font-black sm:text-lg">{title}</h1>
        </div>
        <button type="button" onClick={() => void changeFullscreen()}
          aria-label={isFullscreen ? "Exit full screen" : "Present full screen"}
          className="grid size-11 shrink-0 place-items-center rounded-xl border border-sky-100 hover:bg-sky-50">
          {isFullscreen ? <Shrink className="size-5"/> : <Expand className="size-5"/>}
        </button>
      </header>
      <main className="flex min-h-0 flex-1 p-2 sm:p-4" aria-label={title + " lecture slides"}>
        <div ref={slideRef}
          className="flex min-h-0 w-full items-center justify-center overflow-auto rounded-[22px] border border-sky-100 bg-[#e8f3fc] p-2 sm:p-4">
          {document ? (
            <PdfManualPage pdfDocument={document} pageNumber={page} fit="page" zoom={1}
              viewport={viewport} pageLabel={title + " slide " + page}/>
          ) : error ? (
            <div role="alert" className="max-w-md rounded-2xl bg-white p-6 text-center">
              <AlertCircle className="mx-auto size-8 text-rose-600"/>
              <p className="mt-2 font-extrabold">Could not load lecture slides</p>
              <p className="mt-2 break-words text-sm text-slate-600">{error}</p>
              <button type="button" onClick={() => setRetry(count => count + 1)}
                className="mt-4 min-h-11 rounded-xl bg-[#168eea] px-5 font-bold text-white">Retry</button>
            </div>
           ) : (
            <div role="status" className="text-center text-sm font-semibold text-slate-600">
              <p>Opening lecture slides…</p>
              {downloadProgress && downloadProgress.loaded > 0 ? (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Downloaded {(downloadProgress.loaded / (1024 * 1024)).toFixed(1)} MB
                  {downloadProgress.total > 0
                    ? ` of ${(downloadProgress.total / (1024 * 1024)).toFixed(1)} MB`
                    : ""}
                </p>
              ) : null}
              {lecture.url.includes(".usrfiles.com/") ? (
                <a href={lecture.url} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-bold text-[#168eea] underline underline-offset-2">
                  Open original PDF in a new tab
                </a>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <footer className="shrink-0 border-t border-sky-100 bg-white px-3 pb-[max(.65rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
        {sync.error && <p role="alert" className="pb-2 text-center text-xs font-bold text-rose-700">{sync.error} <a href="/auth/" className="underline">Account</a></p>}
        <nav className="mx-auto flex max-w-3xl items-center justify-between gap-2" aria-label="Slide controls">
          <button type="button" disabled={!document || page === 1}
            onClick={() => setPage(current => Math.max(1, current - 1))}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-sky-200 px-3 text-sm font-bold text-[#168eea] disabled:opacity-40">
            <ChevronLeft className="size-4"/> Previous
          </button>
          <label className="min-w-0 text-center">
            <span className="sr-only">Choose lecture slide</span>
            <select value={page} disabled={!document} onChange={event => setPage(Number(event.target.value))}
              className="max-w-full rounded-xl border border-sky-100 bg-sky-50 p-2 text-sm font-extrabold text-[#132654]">
              {total ? Array.from({ length: total }, (_, index) =>
                <option key={index + 1} value={index + 1}>Slide {index + 1} / {total}</option>)
                : <option value={1}>Loading…</option>}
            </select>
          </label>
          {document && page === total ? (
            <button type="button" disabled={sync.busy} onClick={async () => { if (await sync.complete()) window.location.assign("/projects/" + encodeURIComponent(projectId)); }}
              className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#168eea] px-3 text-sm font-bold text-white disabled:opacity-50">
              {sync.busy ? "Saving…" : "Finish"} <ChevronRight className="size-4"/>
            </button>
          ) : (
            <button type="button" disabled={!document} onClick={() => setPage(current => Math.min(total, current + 1))}
              className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-[#168eea] px-3 text-sm font-bold text-white disabled:opacity-40">
              Next <ChevronRight className="size-4"/>
            </button>
          )}
        </nav>
        {programmingFiles.length > 0 ? (
          <section className="mx-auto mt-2 flex max-w-3xl flex-col gap-2 rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-2 sm:flex-row sm:items-center sm:justify-between" aria-label="Programming File">
            <div className="min-w-0">
              <h2 className="text-xs font-black text-[#132654]">Programming File</h2>
              <p className="text-xs text-slate-600">Download the original Scratch program files for this project.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              {programmingFiles.map(file => (
                <a key={file.url} href={file.url} download={file.fileName}
                  aria-label={`Download ${file.fileName}`}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-white px-3 text-xs font-extrabold text-[#168eea] hover:bg-sky-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#168eea] sm:w-auto">
                  <Download className="size-4 shrink-0" aria-hidden="true" />
                  Download <span className="max-w-[12rem] truncate text-left" title={file.fileName}>{file.fileName}</span>
                </a>
              ))}
            </div>
          </section>
        ) : null}
        <div className="mx-auto mt-2 h-1.5 max-w-3xl overflow-hidden rounded-full bg-sky-100" aria-hidden="true">
          <div className="h-full rounded-full bg-[#168eea]" style={{ width: total ? (page / total * 100) + "%" : "0%" }}/>
        </div>
      </footer>
    </div>
  );
}
