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

  useEffect(() => {
    let disposed = false;
    let activeTask: RenderTask | null = null;
    let prefetchTask: RenderTask | null = null;
    let idleId: number | null = null;
    let timerId: number | null = null;

    const currentKey = renderKey(pageNumber, fit, zoom, viewport);
    setLoading(true);
    setError(null);

    function paint(result: CachedPage) {
      const canvas = canvasRef.current;
      if (!canvas || disposed) return;
      // Copying a ready canvas is substantially cheaper than re-parsing PDF drawing commands.
      canvas.width = result.canvas.width;
      canvas.height = result.canvas.height;
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Could not display the rendered PDF.");
      context.drawImage(result.canvas, 0, 0);
      setDisplaySize({ width: result.displayWidth, height: result.displayHeight });
      setLoading(false);
    }

    async function renderPage(number: number, background: boolean): Promise<CachedPage | null> {
      const key = renderKey(number, fit, zoom, viewport);
      const cached = getCachedPage(pdfDocument, key);
      if (cached) return cached;

      const page = await pdfDocument.getPage(number);
      if (disposed) return null;

      const native = page.getViewport({ scale: 1 });
      const fitWidth = Math.max(0.1, (viewport.width - 24) / native.width);
      const fitPage = Math.max(0.1, Math.min(fitWidth, (viewport.height - 24) / native.height));
      const scale = (fit === "page" ? fitPage : fitWidth) * zoom;
      const actualViewport = page.getViewport({ scale });

      // Keep text sharp, but avoid enormous mobile canvas allocations.
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

      const task = page.render({
        canvas: scratch,
        canvasContext: context,
        viewport: actualViewport,
        transform: [rasterScale, 0, 0, rasterScale, 0, 0],
      });
      if (background) prefetchTask = task;
      else activeTask = task;
      if (disposed) task.cancel();

      try {
        await task.promise;
        if (disposed) return null;
        const result = {
          canvas: scratch,
          displayWidth: actualViewport.width,
          displayHeight: actualViewport.height,
        };
        rememberPage(pdfDocument, key, result);
        return result;
      } finally {
        if (background && prefetchTask === task) prefetchTask = null;
        if (!background && activeTask === task) activeTask = null;
        page.cleanup();
      }
    }

    function scheduleNextPage() {
      const next = pageNumber + 1;
      if (disposed || next > pdfDocument.numPages) return;
      if (getCache(pdfDocument).has(renderKey(next, fit, zoom, viewport))) return;

      const prepare = () => {
        if (!disposed) {
          // The foreground render always wins; a failed prefetch is non-fatal.
          void renderPage(next, true).catch(() => {});
        }
      };
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(prepare, { timeout: 1200 });
      } else {
        timerId = window.setTimeout(prepare, 180);
      }
    }

    const show = async () => {
      try {
        const cached = getCachedPage(pdfDocument, currentKey);
        if (cached) {
          paint(cached);
          scheduleNextPage();
          return;
        }

        // Don't leave the previous page visible behind the loading indicator.
        setDisplaySize(null);
        if (canvasRef.current) {
          canvasRef.current.width = 1;
          canvasRef.current.height = 1;
        }
        const result = await renderPage(pageNumber, false);
        if (!result || disposed) return;
        paint(result);
        scheduleNextPage();
      } catch (cause) {
        if (disposed || (cause instanceof Error && cause.name === "RenderingCancelledException")) return;
        setError(cause instanceof Error ? cause.message : "Unable to render this manual page.");
        setLoading(false);
      }
    };
    void show();

    return () => {
      disposed = true;
      if (idleId !== null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== null) window.clearTimeout(timerId);
      activeTask?.cancel();
      prefetchTask?.cancel();
    };
  }, [pdfDocument, pageNumber, fit, zoom, viewport.height, viewport.width]);

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
        <div className="absolute right-3 top-3 rounded-full border border-sky-100 bg-white/95 px-3 py-1 text-xs font-semibold text-[#132654] shadow"
          role="status" aria-live="polite">Rendering original PDF…</div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-6 text-center text-sm font-semibold text-rose-700" role="alert">
          {error}. Try selecting the page again or resetting zoom.
        </div>
      )}
    </div>
  );
}
