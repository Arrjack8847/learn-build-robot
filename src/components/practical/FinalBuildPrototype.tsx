import { useEffect, useRef, useState } from "react";
import type { PDFDocumentLoadingTask, RenderTask } from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export type PrototypeClip = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export type PrototypeStatus = "loading" | "ready" | "error";

type Props = {
  filename: string;
  url: string;
  pageNumber: number;
  crop: PrototypeClip;
  title: string;
  onStatusChange: (filename: string, status: PrototypeStatus) => void;
};

/**
 * Displays ONLY a specified image region from ONE original Building PDF page.
 *
 * Unlike the Building Studio this has no page navigation, document iframe,
 * full-page fallback, or manual download link. All crop rectangles are
 * provisional until the original model art has been reviewed and approved.
 */
export function FinalBuildPrototype({
  filename, url, pageNumber, crop, title, onStatusChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<PrototypeStatus>("loading");
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let disposed = false;
    let loadingTask: PDFDocumentLoadingTask | null = null;
    let renderTask: RenderTask | null = null;
    let timedOut = false;

    setStatus("loading");
    setError("");
    onStatusChange(filename, "loading");

    const timeout = window.setTimeout(() => {
      if (disposed) return;
      timedOut = true;
      renderTask?.cancel();
      void loadingTask?.destroy();
      setError("This prototype took too long to load. Please retry.");
      setStatus("error");
      onStatusChange(filename, "error");
    }, 45000);

    const start = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        if (disposed || timedOut) return;
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

        loadingTask = pdfjs.getDocument({
          url,
          ...(url.includes(".usrfiles.com/") ? { rangeChunkSize: 256 * 1024 } : {}),
        });
        const document = await loadingTask.promise;
        if (disposed || timedOut) return;
        if (pageNumber < 1 || pageNumber > document.numPages) {
          throw new Error("Prototype page is missing from the original manual.");
        }

        const page = await document.getPage(pageNumber);
        if (disposed || timedOut) return;
        const native = page.getViewport({ scale: 1 });

        // Only the specified crop is rasterized into a visible canvas. The
        // source PDF is never inserted as an iframe or opened as a full page.
        const scale = Math.min(2.5, 680 / Math.max(1, native.width * crop.width));
        const viewport = page.getViewport({ scale });
        const clipWidth = viewport.width * crop.width;
        const clipHeight = viewport.height * crop.height;
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        const memoryBudgetScale = Math.sqrt(2_200_000 / (clipWidth * clipHeight));
        const rasterScale = Math.min(dpr, Math.max(0.1, memoryBudgetScale));

        const canvas = canvasRef.current;
        if (!canvas) throw new Error("Canvas unavailable for the prototype picture.");
        canvas.width = Math.max(1, Math.ceil(clipWidth * rasterScale));
        canvas.height = Math.max(1, Math.ceil(clipHeight * rasterScale));
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) throw new Error("Unable to draw the original prototype picture.");

        renderTask = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
          background: "#FFFFFF",
          transform: [
            rasterScale, 0, 0, rasterScale,
            -viewport.width * crop.x * rasterScale,
            -viewport.height * crop.y * rasterScale,
          ],
        });
        await renderTask.promise;
        if (disposed || timedOut) return;
        setStatus("ready");
        onStatusChange(filename, "ready");
      } catch (reason) {
        if (disposed || timedOut) return;
        setError(reason instanceof Error ? reason.message : "Could not open the original prototype.");
        setStatus("error");
        onStatusChange(filename, "error");
      } finally {
        window.clearTimeout(timeout);
      }
    };
    void start();

    return () => {
      disposed = true;
      window.clearTimeout(timeout);
      renderTask?.cancel();
      void loadingTask?.destroy();
    };
  }, [url, filename, pageNumber, crop.x, crop.y, crop.width, crop.height, attempt, onStatusChange]);

  return (
    <div className="relative flex min-h-44 flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-2 sm:p-3">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Original completed-model candidate of ${title}`}
        className={`mx-auto block h-auto max-h-[38dvh] max-w-full object-contain ${status === "ready" ? "" : "invisible"}`}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-4" role="status">
          <p className="text-sm font-bold text-[#7252a2]">Loading original robot slide…</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white p-4 text-center" role="alert">
          <p className="text-sm font-bold text-rose-700">Prototype could not be displayed</p>
          <p className="max-w-sm text-xs text-slate-600">{error}</p>
          <button type="button" onClick={() => setAttempt(value => value + 1)}
            className="min-h-11 rounded-xl bg-[#7045bd] px-5 font-bold text-white">Retry model</button>
        </div>
      )}
    </div>
  );
}
