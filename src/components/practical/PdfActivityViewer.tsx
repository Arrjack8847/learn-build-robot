import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { PDFDocumentProxy, PDFDocumentLoadingTask } from "pdfjs-dist";
import { useProgress } from "@/context/ProgressContext";
import { BuildingStudioHeader, BuildingStepDrawer, BuildingFloatingDock, BuildingStudioCompletion } from "./BuildingStudio";
import { Minus, Plus, Maximize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PdfActivityManual } from "@/data/pdfActivityManuals";
import { PdfManualPage, type PdfFit, type PdfViewportSize } from "./PdfManualPage";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** One document, one rendered page, and no reauthored assembly content. */
export function PdfActivityViewer({ manual }: { manual: PdfActivityManual }) {
  const { toggleStepCompleted } = useProgress();
  const [stepsOpen, setStepsOpen] = useState(false);
  const [dockExpanded, setDockExpanded] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
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
        task = pdfjs.getDocument({ url: manual.url });
        loaded = await task.promise;
        if (disposed) return;
        if (loaded.numPages < 1) throw new Error("The official PDF has no pages.");
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
  }, [reloadKey, manual.url]);

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
    setPage(Math.max(1, Math.min(pdfDocument?.numPages ?? 1, next)));
    setDockExpanded(false);
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

  const totalPages = pdfDocument?.numPages ?? 0;
  const pageItems = Array.from({ length: totalPages }, (_, index) => ({
    id: "page-" + (index + 1), label: "Page " + (index + 1),
  }));

  function finishCurrentPage() {
    if (!ready || !pdfDocument) return;
    if (page === pdfDocument.numPages) {
      toggleStepCompleted(manual.completionStepId, true);
      setFinished(true);
    } else {
      openPage(page + 1);
    }
  }

  if (finished) {
    return <BuildingStudioCompletion title={manual.title} onReview={() => { setFinished(false); openPage(1); }} />;
  }

  return (
    <div className="flex h-[100dvh] min-h-[420px] flex-col overflow-hidden bg-[#f3faff] text-slate-800">
      <BuildingStudioHeader title={manual.title} step={page} total={totalPages}
        positionLabel={totalPages ? "Page " + page + " of " + totalPages : "Loading manual"}
        onOpenSteps={() => setStepsOpen(true)}/>
      <BuildingStepDrawer open={stepsOpen} onOpenChange={setStepsOpen}
        title={manual.title} activeIndex={page - 1} items={pageItems}
        onSelect={index => openPage(index + 1)}/>
      <main className="relative min-h-0 flex-1 overflow-hidden bg-[#f3faff] p-2 sm:p-4" aria-label={manual.title + " building studio"}>
        <section aria-label="Official PDF building illustration"
          className="absolute inset-x-2 top-2 overflow-hidden rounded-[24px] border border-sky-100 bg-[#e8f3fc] shadow-sm sm:inset-x-4 sm:top-4"
          style={{bottom: dockExpanded ? "222px" : "145px"}}>
          <div className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-2xl border border-sky-100 bg-white/95 p-1 shadow-sm sm:right-3 sm:top-3">
            <Button type="button" variant="ghost" onClick={() => zoomBy(1 / 1.25)}
              disabled={zoom <= 0.5} aria-label="Zoom out" className="size-11 rounded-xl p-0"><Minus className="size-4"/></Button>
            <span className="hidden min-w-10 text-center text-xs font-bold text-slate-600 sm:block">{Math.round(zoom * 100)}%</span>
            <Button type="button" variant="ghost" onClick={() => zoomBy(1.25)}
              disabled={zoom >= 4} aria-label="Zoom in" className="size-11 rounded-xl p-0"><Plus className="size-4"/></Button>
            <Button type="button" variant="ghost" onClick={() => fitTo("page")}
              aria-label="Fit whole manual page" title="Fit page" className="size-11 rounded-xl p-0"><Maximize2 className="size-4"/></Button>
          </div>
          <div ref={viewportRef}
            className="absolute inset-0 overflow-auto p-3 pt-14 [touch-action:none] cursor-grab active:cursor-grabbing sm:p-5 sm:pt-16"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}
            aria-label="Official PDF page. Drag to pan or pinch with two fingers to zoom.">
            <div className="flex min-h-full w-max min-w-full items-start justify-center">
              {pdfDocument && ready ? (
                <PdfManualPage pdfDocument={pdfDocument} pageNumber={page} fit={fit}
                  zoom={zoom} viewport={dimensions} pageLabel={"Original PDF page " + page}/>
              ) : pdfError ? (
                <div className="m-auto flex max-w-md flex-col items-center gap-3 p-6 text-center" role="alert">
                  <AlertCircle className="size-7 text-rose-600"/>
                  <p className="text-sm font-bold">Could not load the official manual</p>
                  <p className="text-xs text-rose-700">{pdfError}</p>
                  <Button type="button" variant="outline" onClick={() => setReloadKey(n => n + 1)}>Retry PDF</Button>
                </div>
              ) : (
                <div className="m-auto text-center text-sm font-semibold text-slate-600" role="status">
                  Loading official {manual.title} manual…
                </div>
              )}
            </div>
          </div>
        </section>
        <BuildingFloatingDock label={"Page " + page}
          instruction="Follow the original PDF illustrations and instructions."
          expanded={dockExpanded} onExpandedChange={setDockExpanded}
          onPrevious={() => openPage(page - 1)} previousDisabled={page === 1}
          onNext={finishCurrentPage} nextDisabled={!ready || Boolean(pdfError)}
          nextLabel={totalPages && page === totalPages ? "Finish Building" : "Next Page"}
          details={<p className="mt-1 text-xs text-slate-500">Original PDF page {page} of {totalPages || "…"}. Zoom or drag the page to inspect details.</p>}
        />
      </main>
    </div>
  );
}
