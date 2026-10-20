import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";

export type PdfFit = "width" | "page";
export type PdfViewportSize = { width: number; height: number };

export function PdfManualPage({
  document, pageNumber, fit, zoom, viewport,
}: {
  document: PDFDocumentProxy;
  pageNumber: number;
  fit: PdfFit;
  zoom: number;
  viewport: PdfViewportSize;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [displaySize, setDisplaySize] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let task: RenderTask | null = null;
    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const page = await document.getPage(pageNumber);
        if (disposed) return;

        const native = page.getViewport({ scale: 1 });
        const fitWidth = Math.max(0.1, (viewport.width - 24) / native.width);
        const fitPage = Math.max(0.1, Math.min(fitWidth, (viewport.height - 24) / native.height));
        const scale = (fit === "page" ? fitPage : fitWidth) * zoom;
        const actualViewport = page.getViewport({ scale });

        // Cap backing pixels on small devices without distorting CSS proportions.
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pixelBudget = 8_000_000;
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
        await task.promise;
        if (disposed) return;

        const visible = canvasRef.current;
        if (!visible) return;
        visible.width = scratch.width;
        visible.height = scratch.height;
        const target = visible.getContext("2d", { alpha: false });
        if (!target) throw new Error("Could not display the rendered PDF.");
        target.drawImage(scratch, 0, 0);
        setDisplaySize({ width: actualViewport.width, height: actualViewport.height });
        setLoading(false);
        page.cleanup();
      } catch (cause) {
        if (disposed || (cause instanceof Error && cause.name === "RenderingCancelledException")) return;
        setError(cause instanceof Error ? cause.message : "Unable to render this manual page.");
        setLoading(false);
      }
    }, 90);

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      task?.cancel();
    };
  }, [document, pageNumber, fit, zoom, viewport.height, viewport.width]);

  return (
    <div className="relative shrink-0 overflow-hidden rounded-lg bg-white shadow-[0_8px_30px_rgba(19,38,84,0.12)]"
      style={displaySize ? { width: displaySize.width, height: displaySize.height } : {
        width: Math.max(220, viewport.width - 24), minHeight: Math.max(240, viewport.height - 24),
      }}>
      <canvas
        ref={canvasRef}
        aria-label={pageNumber === 1 ? "Original manual cover" : `Original PDF illustration for assembly Step ${pageNumber - 1}`}
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
