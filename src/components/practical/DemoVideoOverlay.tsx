import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { AdvancedDemoVideo } from "@/data/levelFiveSixContent";

/** Video stays separate from the PDF canvas; dismissing it never resets PDF state. */
export function DemoVideoOverlay({
  title, videos, open, onOpenChange,
}: {
  title: string;
  videos: readonly AdvancedDemoVideo[];
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const [selected, setSelected] = useState(0);
  const playerRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) {
      playerRef.current?.pause();
      setSelected(0);
    }
  }, [open]);

  if (!videos.length) return null;
  const active = videos[selected] ?? videos[0];
  if (!active) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[94dvh] w-[min(96vw,960px)] max-w-none overflow-y-auto rounded-2xl bg-white p-4 sm:p-6">
        <DialogHeader className="pr-8 text-left">
          <DialogTitle className="text-lg font-extrabold text-[#132654]">{title} · Demo Video</DialogTitle>
          <DialogDescription className="text-xs text-slate-600">
            Watch the robot in action, then close this window to return to your current manual page.
          </DialogDescription>
        </DialogHeader>
        <video key={active.url} ref={playerRef}
          controls playsInline preload="metadata"
          className="aspect-video max-h-[68dvh] w-full rounded-xl bg-black object-contain"
          aria-label={active.fileName}>
          <source src={active.url} type="video/mp4" />
          Your browser does not support video playback.
        </video>
        {videos.length > 1 ? (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose demonstration video">
            {videos.map((video, index) => (
              <button key={video.url} type="button" onClick={() => {
                playerRef.current?.pause();
                setSelected(index);
              }} aria-pressed={index === selected}
                className={index === selected
                  ? "min-h-11 rounded-xl bg-[#168eea] px-4 text-xs font-bold text-white"
                  : "min-h-11 rounded-xl border border-sky-200 bg-white px-4 text-xs font-bold text-[#168eea]"}>
                Demo {index + 1}
              </button>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
