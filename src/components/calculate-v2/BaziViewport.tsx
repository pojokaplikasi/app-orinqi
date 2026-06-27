"use client";

import React from "react";
import { TransformWrapper, TransformComponent, type ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

interface BaziViewportProps {
  children: React.ReactNode;
}

const CANVAS_W = 2410;
const CANVAS_H = 2603;

export default function BaziViewport({ children }: BaziViewportProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasContentRef = React.useRef<HTMLDivElement>(null);
  // Ref ke TransformWrapper agar FAB bisa memanggil zoomIn/zoomOut/resetTransform
  // dari luar TransformComponent (tidak ikut di-transform)
  const wrapperRef = React.useRef<ReactZoomPanPinchRef>(null);

  const [transform, setTransform] = React.useState<{
    scale: number;
    x: number;
    y: number;
  } | null>(null);
  const [currentScale, setCurrentScale] = React.useState<number>(1);
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    // Tunggu sampai container benar-benar punya dimensi dari CSS/Flexbox
    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const { clientWidth: vw, clientHeight: vh } = containerRef.current;
      if (vw === 0 || vh === 0) return;

      // Hitung scale agar canvas muat di viewport dengan sedikit padding
      const scaleX = (vw * 0.9) / CANVAS_W;
      const scaleY = (vh * 0.9) / CANVAS_H;
      const scale = Math.min(scaleX, scaleY, 1); // tidak lebih besar dari 1x

      // Hitung posisi agar canvas terpusat
      const x = (vw - CANVAS_W * scale) / 2;
      const y = (vh - CANVAS_H * scale) / 2;

      setTransform({ scale, x, y });
      setCurrentScale(scale);
    }, 80);

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (!canvasContentRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      // Dynamic import — only loads when user clicks download
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(canvasContentRef.current, {
        scale: 2, // 2x resolution for crisp output
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        width: CANVAS_W,
        height: CANVAS_H,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `bazi-chart-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download gagal. Pastikan html2canvas sudah terinstall:\nnpm install html2canvas");
    } finally {
      setIsDownloading(false);
    }
  };

  const isAtMinScale = transform ? currentScale <= transform.scale + 0.001 : true;

  return (
    // 1. The Master Viewport (Wrapper)
    // Takes full width and height, hides overflow to contain the zoom/pan area.
    <div ref={containerRef} className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-neutral-900/5">
      {transform ? (
        <>
          <TransformWrapper
            ref={wrapperRef}
            initialScale={transform.scale}
            initialPositionX={transform.x}
            initialPositionY={transform.y}
            minScale={transform.scale}
            maxScale={4}
            centerOnInit={false}
            wheel={{ step: 0.04 }}
            pinch={{ step: 1 }}
            panning={{ velocityDisabled: true }}
            onTransform={(_: ReactZoomPanPinchRef, state: { scale: number; positionX: number; positionY: number }) => setCurrentScale(state.scale)}
          >
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
              {/* 2. The Fixed Bazi Container */}
              {/* Strict fixed dimensions: CANVAS_W x CANVAS_H */}
              <div
                ref={canvasContentRef}
                className="relative bg-background p-8 shadow-2xl"
                style={{ width: `${CANVAS_W}px`, height: `${CANVAS_H}px` }}
              >
                {/* Decorative Background Grid for visual reference of panning */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <div className="relative z-10 h-full w-full">
                  {children}
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>

          {/* FAB Controls — di luar TransformComponent agar tidak ikut di-transform */}
          {/* position: absolute relatif ke containerRef (wrapper viewport) */}
          <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2">
            <button
              onClick={() => wrapperRef.current?.zoomIn()}
              title="Zoom In"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <button
              onClick={() => wrapperRef.current?.zoomOut()}
              disabled={isAtMinScale}
              title="Zoom Out"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </button>
            <button
              onClick={() => wrapperRef.current?.resetTransform()}
              title="Reset"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-lg hover:bg-muted active:scale-95 transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />
              </svg>
            </button>
            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              title="Download as Image"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-card border border-border text-muted-foreground shadow-lg hover:bg-muted hover:text-foreground active:scale-95 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isDownloading ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
            </button>
          </div>
        </>
      ) : (
        // Placeholder saat menghitung dimensi awal — tampilkan skeleton agar container punya tinggi
        <div className="h-full w-full animate-pulse rounded-2xl bg-muted/30" />
      )}
    </div>
  );
}
