import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export type PdfFit = "width" | "page";
export type PdfViewportSize = { width: number; height: number };


type CachedPage = {
  canvas: HTMLCanvasElement;
  displayWidth: number;
  displayHeight: number;
};

// Keep only a few rasterized pages per open document; never cache the whole PDF.
const pageCaches = new WeakMap<PDFDocumentProxy, Map<string, CachedPage>>();
const MAX_PAGES = 3;
const MAX_CACHE_BYTES = 40 * 1024 * 1024;

function getCache(document: PDFDocumentProxy): Map<string, CachedPage> {
  let cache = pageCaches.get(document);
  if (!cache) {
    cache = new Map();
    pageCaches.set(document, cache);
  }
  return cache;
}

function getCachedPage(document: PDFDocumentProxy, key: string): CachedPage | undefined {
  const cache = getCache(document);
  const value = cache.get(key);
  if (value) {
    // Refresh recency so the page just viewed is not evicted first.
    cache.delete(key);
    cache.set(key, value);
  }
  return value;
}

function rememberPage(document: PDFDocumentProxy, key: string, result: CachedPage) {
  const cache = getCache(document);
  const bytes = result.canvas.width * result.canvas.height * 4;
  if (bytes > MAX_CACHE_BYTES) return;
  cache.delete(key);
  cache.set(key, result);

  let totalBytes = Array.from(cache.values()).reduce(
    (sum, entry) => sum + entry.canvas.width * entry.canvas.height * 4, 0,
  );
  while (cache.size > MAX_PAGES || totalBytes > MAX_CACHE_BYTES) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    const victim = cache.get(oldest);
    cache.delete(oldest);
    if (victim) totalBytes -= victim.canvas.width * victim.canvas.height * 4;
  }
}

function renderKey(pageNumber: number, fit: PdfFit, zoom: number, viewport: PdfViewportSize) {
  // Page scale also depends on device pixel ratio and mobile memory budget.
  return [pageNumber, fit, zoom, Math.round(viewport.width), Math.round(viewport.height),
    window.devicePixelRatio || 1, window.matchMedia("(pointer: coarse)").matches ? "touch" : "desktop"].join(":");
}


/** Renders one page at a time. Background renders are intentionally disabled until
 * the foreground render lifecycle is verified across large Building manuals.
 */
export function PdfManualPage({
  pdfDocument, pageNumber, fit, zoom, viewport, pageLabel,
}: {
  pdfDocument: PDFDocumentProxy;
  pageNumber: number;
  fit: PdfFit;
  zoom: number;
  viewport: PdfViewportSize;
  pageLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let disposed = false;
    let timedOut = false;
    let task: RenderTask | null = null;

    setLoading(true);
    setError(null);
    const key = renderKey(pageNumber, fit, zoom, viewport);

    const paint = (image: CachedPage) => {
      const visible = canvasRef.current;
      if (disposed || !visible) return;
      visible.width = image.canvas.width;
      visible.height = image.canvas.height;
      const context = visible.getContext("2d", { alpha: false });
      if (!context) throw new Error("Could not display the PDF canvas.");
      context.drawImage(image.canvas, 0, 0);
      setDisplaySize({ width: image.displayWidth, height: image.displayHeight });
      setLoading(false);
    };

    const cached = getCachedPage(pdfDocument, key);
    if (cached) {
      try {
        paint(cached);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not display cached PDF page.");
        setLoading(false);
      }
      return () => { disposed = true; };
    }

    // An interrupted render must never leave the loading label spinning forever.
    // This covers both getPage() and the subsequent PDF.js canvas render.
    const timeout = window.setTimeout(() => {
      if (disposed) return;
      timedOut = true;
      task?.cancel();
      setError("This page took too long to render. Select Retry to try again.");
      setLoading(false);
    }, 30000);

    const start = async () => {
      try {
        const page = await pdfDocument.getPage(pageNumber);
        if (disposed || timedOut) return;

        const native = page.getViewport({ scale: 1 });
        const fitWidth = Math.max(0.1, (viewport.width - 24) / native.width);
        const fitPage = Math.max(0.1, Math.min(fitWidth, (viewport.height - 24) / native.height));
        const scale = (fit === "page" ? fitPage : fitWidth) * zoom;
        const actualViewport = page.getViewport({ scale });

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        const pixelBudget = zoom > 1.5 ? 8_000_000 : isTouch ? 3_500_000 : 5_000_000;
        const budgetScale = Math.min(1, Math.sqrt(pixelBudget /
          (actualViewport.width * actualViewport.height * dpr * dpr)));
        const rasterScale = dpr * budgetScale;

        const scratch = document.createElement("canvas");
        scratch.width = Math.max(1, Math.floor(actualViewport.width * rasterScale));
        scratch.height = Math.max(1, Math.floor(actualViewport.height * rasterScale));
        const context = scratch.getContext("2d", { alpha: false });
        if (!context) throw new Error("Your browser could not create the PDF canvas.");

        task = page.render({
          canvas: scratch,
          canvasContext: context,
          viewport: actualViewport,
          transform: [rasterScale, 0, 0, rasterScale, 0, 0],
        });
        if (disposed || timedOut) {
          task.cancel();
          return;
        }
        await task.promise;
        if (disposed || timedOut) return;

        const image: CachedPage = {
          canvas: scratch,
          displayWidth: actualViewport.width,
          displayHeight: actualViewport.height,
        };
        rememberPage(pdfDocument, key, image);
        paint(image);
      } catch (cause) {
        // Cancellation during page change is expected; a real cancellation on
        // the current page is surfaced rather than leaving an infinite spinner.
        if (disposed || timedOut) return;
        setError(cause instanceof Error ? cause.message : "Unable to render this PDF page.");
        setLoading(false);
      } finally {
        window.clearTimeout(timeout);
      }
    };
    void start();

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      task?.cancel();
    };
  }, [pdfDocument, pageNumber, fit, zoom, viewport.height, viewport.width, retry]);

  return (
    <div className="relative shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(19,38,84,0.12)]"
      style={displaySize ? { width: displaySize.width, height: displaySize.height } : {
        width: Math.max(220, viewport.width - 24), minHeight: Math.max(240, viewport.height - 24),
      }}>
      <canvas
        ref={canvasRef}
        aria-label={pageLabel ?? (pageNumber === 1 ? "Original manual cover" : `Original PDF illustration for assembly Step ${pageNumber - 1}`)}
        role="img"
        className="block h-full w-full"
      />
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/85 p-4 text-center text-sm font-semibold text-[#132654]"
          role="status" aria-live="polite">Rendering original PDF…</div>
      )}
      {error && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/95 p-6 text-center text-sm font-semibold text-rose-700" role="alert">
          <span>{error}</span>
          <button type="button" onClick={() => setRetry(value => value + 1)}
            className="min-h-11 rounded-xl bg-[#168eea] px-5 font-bold text-white">Retry page</button>
        </div>
      )}
    </div>
  );
}
