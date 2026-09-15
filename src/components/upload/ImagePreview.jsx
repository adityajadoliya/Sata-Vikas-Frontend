import { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Maximize2,
  Minimize2,
  RefreshCw,
  Move,
  ArrowUpToLine,
  Scan,
  Maximize
} from 'lucide-react';

export default function ImagePreview({ imageUrl }) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [fitMode, setFitMode] = useState('width'); // 'width' | 'page' | 'free'
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef(null);

  // Scroll to the very top whenever the image loads, mode changes, or rotation changes
  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
      containerRef.current.scrollLeft = 0;
    }
  }, []);

  useEffect(() => {
    scrollToTop();
  }, [imageUrl, fitMode, rotation, scrollToTop]);

  const handleZoomIn = () => {
    setFitMode('free');
    setZoom(z => Math.min(Math.round((z + 0.2) * 10) / 10, 3.5));
  };

  const handleZoomOut = () => {
    setFitMode('free');
    setZoom(z => Math.max(Math.round((z - 0.2) * 10) / 10, 0.3));
  };

  const handleFitWidth = () => {
    setFitMode('width');
    setZoom(1);
    scrollToTop();
  };

  const handleFitPage = () => {
    setFitMode('page');
    setZoom(1);
    scrollToTop();
  };

  const handleRotateCW = () => {
    setRotation(r => (r + 90) % 360);
    scrollToTop();
  };

  const handleRotateCCW = () => {
    setRotation(r => (r - 90 + 360) % 360);
    scrollToTop();
  };

  const handleReset = () => {
    setFitMode('width');
    setZoom(1);
    setRotation(0);
    scrollToTop();
  };

  // Mouse Drag to Pan
  const handleMouseDown = (e) => {
    if (!containerRef.current) return;
    // Don't drag if clicking buttons
    if (e.target.closest('button')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      scrollLeft: containerRef.current.scrollLeft,
      scrollTop: containerRef.current.scrollTop,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    containerRef.current.scrollLeft = dragStart.scrollLeft - dx;
    containerRef.current.scrollTop = dragStart.scrollTop - dy;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom (Ctrl + Wheel)
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        handleZoomIn();
      } else {
        handleZoomOut();
      }
    }
  };

  const isSideways = rotation === 90 || rotation === 270;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 select-none overflow-hidden rounded-xl border border-slate-800 shadow-inner">
      {/* ── Top Floating Toolbar ────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 px-3 py-2 bg-slate-900/95 border-b border-slate-800 backdrop-blur shrink-0 z-10">
        {/* Left: View Mode Quick Toggles */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 gap-0.5">
          <button
            type="button"
            onClick={handleFitWidth}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              fitMode === 'width'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Fit Width (Standard document view starting from top header)"
          >
            <Maximize size={12} />
            <span>Fit Width</span>
          </button>

          <button
            type="button"
            onClick={handleFitPage}
            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
              fitMode === 'page'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
            title="Fit Page (Scale entire form to fit screen)"
          >
            <Minimize2 size={12} />
            <span>Fit Page</span>
          </button>
        </div>

        {/* Center: Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          
          <span className="text-[11px] text-slate-300 font-mono w-12 text-center">
            {fitMode === 'width' ? 'Width' : fitMode === 'page' ? 'Fit' : `${Math.round(zoom * 100)}%`}
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* Right: Rotation, Scroll-to-Top, and Reset Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Scroll to Top of Form"
          >
            <ArrowUpToLine size={14} />
          </button>

          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 gap-0.5">
            <button
              type="button"
              onClick={handleRotateCCW}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rotate Counter-Clockwise (90°)"
            >
              <RotateCcw size={14} />
            </button>
            <button
              type="button"
              onClick={handleRotateCW}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rotate Clockwise (90°)"
            >
              <RotateCw size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Reset to Default"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ── Main Scrollable Image Viewport ──────────────────────────────── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`flex-1 overflow-auto bg-slate-950 p-4 sm:p-6 relative focus:outline-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Helper Top Bar Indicator */}
        <div className="sticky top-0 z-10 flex justify-center mb-3 pointer-events-none">
          <div className="bg-slate-900/90 text-slate-400 text-[10px] px-3 py-0.5 rounded-full border border-slate-700/60 backdrop-blur shadow-sm flex items-center gap-1.5">
            <ArrowUpToLine size={11} className="text-indigo-400" />
            <span>Top of Form · Scroll down to view full sheet · Drag to pan</span>
          </div>
        </div>

        {/* Top-Anchored Image Container (align-items: flex-start ensures top is NEVER clipped) */}
        <div className="min-w-full min-h-full flex items-start justify-center">
          <div
            className="transition-all duration-200 ease-out origin-top flex items-center justify-center"
            style={{
              transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
              transformOrigin: 'top center',
              width: fitMode === 'width' ? (isSideways ? 'auto' : '100%') : fitMode === 'free' ? `${Math.round(zoom * 100)}%` : 'auto',
              maxWidth: fitMode === 'page' ? '100%' : 'none',
              maxHeight: fitMode === 'page' ? 'calc(100vh - 280px)' : 'none',
            }}
          >
            <img
              src={imageUrl}
              alt="Uploaded Form Preview"
              onLoad={() => {
                setImageLoaded(true);
                scrollToTop();
              }}
              draggable={false}
              className={`rounded-lg shadow-2xl border border-slate-700/80 bg-white object-contain transition-all ${
                fitMode === 'width'
                  ? 'w-full h-auto'
                  : fitMode === 'page'
                  ? 'max-h-[calc(100vh-300px)] max-w-full w-auto h-auto'
                  : 'w-full h-auto'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
