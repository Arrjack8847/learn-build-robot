import { useEffect, useState } from "react";
import { FinalBuildPrototype, type PrototypeClip, type PrototypeStatus } from "./FinalBuildPrototype";

type Props = {
  filename: string;
  title: string;
  url: string;
  expectedWidth: number;
  expectedHeight: number;
  pdfUrl: string;
  pdfPage: number;
  crop: PrototypeClip;
  onStatusChange: (filename: string, status: PrototypeStatus) => void;
};

/** Approved source-extracted artwork with a verified PDF crop as fallback. */
export function LevelOneVerifiedWebp({
  filename, title, url, expectedWidth, expectedHeight, pdfUrl, pdfPage, crop, onStatusChange,
}: Props) {
  const [fallback, setFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setFallback(false);
    setLoaded(false);
    onStatusChange(filename, "loading");
  }, [filename, url, expectedWidth, expectedHeight, onStatusChange]);

  if (fallback) {
    return <FinalBuildPrototype filename={filename} title={title} url={pdfUrl}
      pageNumber={pdfPage} crop={crop} onStatusChange={onStatusChange} />;
  }

  return (
    <div className="relative flex min-h-44 flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-2 sm:p-3">
      <img
        src={url}
        alt={`Original completed-model reference of ${title}`}
        className={`mx-auto block h-auto max-h-[38dvh] max-w-full object-contain ${loaded ? "" : "invisible"}`}
        onLoad={event => {
          const picture = event.currentTarget;
          if (picture.naturalWidth !== expectedWidth || picture.naturalHeight !== expectedHeight) {
            setFallback(true);
            return;
          }
          setLoaded(true);
          onStatusChange(filename, "ready");
        }}
        onError={() => setFallback(true)}
      />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/95 p-4" role="status">
          <p className="text-sm font-bold text-[#7252a2]">Loading original robot reference…</p>
        </div>
      )}
    </div>
  );
}
