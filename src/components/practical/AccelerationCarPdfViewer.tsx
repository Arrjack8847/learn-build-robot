import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from "pdfjs-dist";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft, BookOpen, ChevronLeft, ChevronRight, FileText,
  Maximize2, Minus, Plus, RotateCcw, AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACCELERATION_EXPECTED_PAGES,
  ACCELERATION_ILLUSTRATION_NOTE,
  ACCELERATION_MANUAL_URL,
  ACCELERATION_STEP_COUNT,
  pageForStep,
  stepForPage,
} from "@/data/accelerationCarManual";
import { PdfManualPage, type PdfFit, type PdfViewportSize } from "./PdfManualPage";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

const steps = Array.from({ length: ACCELERATION_STEP_COUNT }, (_, index) => index + 1);

function labelForPage(page: number) {
  const step = stepForPage(page);
  return step === null ? "Manual cover" : `Step ${step}`;
}

/** One document, one rendered page, and no reauthored assembly content. */
export function AccelerationCarPdfViewer() {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [page, setPage] = useState(2);
  const [fit, setFit] = useState<PdfFit>("page");
  const [zoom, setZoom] = useState(1);
  const [dimensions, setDimensions] = useState<PdfViewportSize>({ width: 760, height: 540 });
  const [ready, setReady] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let disposed = false;
    let task: PDFDocumentLoadingTask | undefined;
    let loaded: PDFDocumentProxy | null = null;
    setReady(false);
    setPdfDocument(null);
    setPdfError(null);

    void (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
        task = pdfjs.getDocument({ url: ACCELERATION_MANUAL_URL });
        loaded = await task.promise;
        if (disposed) return;
        if (loaded.numPages !== ACCELERATION_EXPECTED_PAGES) {
          throw new Error(`The source PDF has ${loaded.numPages} pages, expected ${ACCELERATION_EXPECTED_PAGES}. Check that the original manual is loaded.`);
        }
        setPdfDocument(loaded);
        setReady(true);
      } catch (cause) {
        if (!disposed) setPdfError(cause instanceof Error ? cause.message : "The official manual could not be loaded.");
      }
    })();

    return () => {
      disposed = true;
      void task?.destroy();
    };
  }, [reloadKey]);

  useEffect(() => {
    const target = viewportRef.current;
    if (!target) return;
    const update = () => setDimensions({
      width: Math.max(240, target.clientWidth),
      height: Math.max(240, target.clientHeight),
    });
    update();
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(target);
    return () => resizeObserver.disconnect();
  }, [ready]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollLeft = 0;
      viewportRef.current.scrollTop = 0;
    }
  }, [page]);

  useEffect(() => {
    const element = viewportRef.current;
    if (!element) return;
    const handleWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const multiplier = event.deltaY < 0 ? 1.1 : 1 / 1.1;
      setZoom((current) => Math.max(0.5, Math.min(4, Math.round(current * multiplier * 100) / 100)));
    };
    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => element.removeEventListener("wheel", handleWheel);
  }, []);

  function openPage(next: number) {
    setPage(Math.max(1, Math.min(ACCELERATION_EXPECTED_PAGES, next)));
  }

  function fitTo(mode: PdfFit) {
    setFit(mode);
    setZoom(1);
  }

  function zoomBy(multiplier: number) {
    setZoom((current) => Math.max(0.5, Math.min(4, Math.round(current * multiplier * 100) / 100)));
  }

  // Native scroll is replaced by pointer panning, so zoomed PDF pages pan on
  // both touch devices and desktops. Two active pointers adjust PDF scale.
  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());
      pinch.current = { distance: Math.hypot(a!.x - b!.x, a!.y - b!.y), zoom };
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    const next = { x: event.clientX, y: event.clientY };
    pointers.current.set(event.pointerId, next);
    const target = viewportRef.current;
    if (pointers.current.size >= 2) {
      const [a, b] = Array.from(pointers.current.values());
      if (pinch.current && a && b) {
        const ratio = Math.hypot(a.x - b.x, a.y - b.y) / Math.max(1, pinch.current.distance);
        const scale = Math.max(0.5, Math.min(4, Math.round(pinch.current.zoom * ratio * 100) / 100));
        setZoom((current) => current === scale ? current : scale);
      }
    } else if (target) {
      target.scrollLeft -= next.x - old.x;
      target.scrollTop -= next.y - old.y;
    }
  }

  function onPointerEnd(event: ReactPointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  const step = stepForPage(page);
  const percent = step === null ? 0 : Math.round(step / ACCELERATION_STEP_COUNT * 100);

  return (
    <div className="flex h-[100dvh] min-h-[420px] flex-col overflow-hidden bg-[#f5f8fc] text-[#132654]">
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2 sm:px-6">
        <Link to="/practical" aria-label="Return to robot selection"
          className="flex min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold hover:bg-slate-100 sm:text-sm">
          <ArrowLeft className="size-4" aria-hidden="true"/> <span className="hidden sm:inline">Choose robot</span>
          <span className="sm:hidden">Back</span>
        </Link>
        <div className="min-w-0 text-center">
          <p className="truncate text-sm font-extrabold sm:text-base">Acceleration Car</p>
          <p className="text-[11px] font-semibold text-[#168eea]">Official PDF · {labelForPage(page)}</p>
        </div>
        <div className="rounded-full bg-[#eaf5ff] px-3 py-1.5 text-xs font-bold text-[#116eaf]">
          {step === null ? "Cover" : `${step} / ${ACCELERATION_STEP_COUNT}`}
        </div>
      </header>
      <div className="h-1 shrink-0 bg-slate-200" aria-label={`Manual navigation ${percent}%`} role="progressbar"
        aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-[#168eea] transition-[width] duration-200" style={{width: `${percent}%`}}/>
      </div>

      <div className="flex min-h-0 flex-1 gap-3 p-2 sm:p-3 lg:p-4">
        <aside className="hidden w-36 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white lg:flex xl:w-44"
          aria-label="Manual step navigation">
          <p className="border-b px-3 py-3 text-xs font-extrabold">Manual steps</p>
          <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2" aria-label="Jump to a step">
            <button type="button" onClick={() => openPage(1)} aria-current={page === 1 ? "page" : undefined}
              className={`w-full rounded-lg px-3 py-2.5 text-left text-xs font-bold ${page === 1 ? "bg-[#eaf5ff] text-[#0877ca]" : "hover:bg-slate-100"}`}>Cover</button>
            {steps.map((n) => (
              <button type="button" key={n} onClick={() => openPage(pageForStep(n))}
                aria-current={step === n ? "step" : undefined}
                className={`min-h-10 w-full rounded-lg px-3 py-2.5 text-left text-xs font-bold ${step === n ? "bg-[#168eea] text-white" : "hover:bg-slate-100"}`}>
                Step {n}
              </button>
            ))}
          </nav>
        </aside>

        <section className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
          aria-label="Original PDF instruction viewer">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-[#168eea]" aria-hidden="true"/>
              <span className="text-xs font-bold">{labelForPage(page)} · PDF page {page}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <select aria-label="Jump to manual step" value={page} onChange={(e) => openPage(Number(e.target.value))}
                className="min-h-10 max-w-28 rounded-lg border border-slate-200 bg-white px-2 text-xs font-bold lg:hidden">
                <option value={1}>Cover</option>
                {steps.map((n) => <option key={n} value={pageForStep(n)}>Step {n}</option>)}
              </select>
              <Button type="button" size="sm" variant="outline" className="min-h-10 px-2 sm:px-3"
                onClick={() => fitTo("width")} aria-label="Fit PDF to width">
                <span className="text-xs">Fit width</span>
              </Button>
              <Button type="button" size="sm" variant="outline" className="min-h-10 px-2 sm:px-3"
                onClick={() => fitTo("page")} aria-label="Fit whole PDF page">
                <Maximize2 className="size-3.5"/><span className="hidden sm:inline text-xs">Fit page</span>
              </Button>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-center gap-2 border-b border-slate-100 px-2 py-1.5">
            <Button type="button" variant="outline" className="size-10 p-0" aria-label="Zoom out"
              onClick={() => zoomBy(1/1.25)} disabled={zoom <= 0.5}><Minus className="size-4"/></Button>
            <span className="min-w-16 text-center text-xs font-bold" aria-label="Zoom multiplier">
              {Math.round(zoom * 100)}%
            </span>
            <Button type="button" variant="outline" className="size-10 p-0" aria-label="Zoom in"
              onClick={() => zoomBy(1.25)} disabled={zoom >= 4}><Plus className="size-4"/></Button>
            <Button type="button" variant="ghost" className="min-h-10 gap-1 px-2 text-xs font-bold"
              onClick={() => fitTo("page")} aria-label="Reset zoom"><RotateCcw className="size-3.5"/> Reset</Button>
          </div>

          <div ref={viewportRef}
            className="relative min-h-0 flex-1 overflow-auto bg-[#e9eff6] p-3 [touch-action:none] cursor-grab active:cursor-grabbing"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
            aria-label="PDF page. Drag to pan and use two fingers to pinch to zoom.">
            <div className="flex min-h-full w-max min-w-full items-start justify-center">
              {pdfDocument && ready ? (
                <PdfManualPage pdfDocument={pdfDocument} pageNumber={page} fit={fit}
                  zoom={zoom} viewport={dimensions}/>
              ) : pdfError ? (
                <div className="m-auto flex max-w-md flex-col items-center gap-3 p-6 text-center" role="alert">
                  <AlertCircle className="size-7 text-rose-600"/>
                  <p className="text-sm font-bold">Could not load the official manual</p>
                  <p className="text-xs text-rose-700">{pdfError}</p>
                  <Button type="button" variant="outline" onClick={() => setReloadKey(n => n + 1)}>Retry PDF</Button>
                </div>
              ) : (
                <div className="m-auto text-center text-xs font-semibold text-slate-600" role="status">
                  Loading official Acceleration Car manual…
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="hidden w-48 shrink-0 flex-col gap-3 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 xl:flex"
          aria-label="Instruction details">
          <div className="flex items-center gap-2 text-xs font-extrabold">
            <BookOpen className="size-4 text-[#168eea]"/> Instructions
          </div>
          <p className="text-sm leading-6 text-slate-700">{ACCELERATION_ILLUSTRATION_NOTE}</p>
          <div className="border-t border-slate-100 pt-3 text-xs leading-5 text-slate-500">
            All diagrams are reproduced directly from the PDF. Use zoom to inspect the original illustration.
          </div>
        </aside>
      </div>

      <details className="mx-2 shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs xl:hidden">
        <summary className="cursor-pointer font-bold">Instruction details</summary>
        <p className="pb-1 pt-2 text-slate-700">{ACCELERATION_ILLUSTRATION_NOTE}</p>
      </details>

      <footer className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:px-6">
        <Button type="button" variant="outline" className="min-h-12 flex-1 gap-2 sm:flex-none"
          disabled={page === 1} onClick={() => openPage(page - 1)}>
          <ChevronLeft className="size-4"/> Previous
        </Button>
        <div className="hidden min-w-0 flex-1 flex-col items-center gap-1 sm:flex">
          <p className="text-xs font-bold">{step === null ? "Manual cover" : `Step ${step} of ${ACCELERATION_STEP_COUNT}`}</p>
          <p className="text-[11px] text-slate-500">Page {page} of {ACCELERATION_EXPECTED_PAGES}</p>
        </div>
        <Button type="button" variant="ghost" className="min-h-12 px-2 text-xs font-semibold"
          onClick={() => {openPage(2);fitTo("page");}} title="Restart from Step 1">
          <RotateCcw className="size-4"/><span className="hidden sm:inline">Restart</span>
        </Button>
        <Button type="button" className="min-h-12 flex-1 gap-2 bg-[#168eea] font-bold hover:bg-[#0e82dd] sm:flex-none"
          disabled={page === ACCELERATION_EXPECTED_PAGES} onClick={() => openPage(page + 1)}>
          Next <ChevronRight className="size-4"/>
        </Button>
      </footer>
    </div>
  );
}
