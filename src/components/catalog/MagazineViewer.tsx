'use client';

import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import dynamic from 'next/dynamic';
import MagazinePage from './MagazinePage';
import MagazineControls from './MagazineControls';
import { useParams } from 'next/navigation';
import ShareModal from './ShareModal';
import { CatalogData } from '@/types/catalog';
import { 
  RotateCw, 
  Maximize2, 
  ShieldAlert, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

const HTMLFlipBook = dynamic(
  () => import('react-pageflip').then((m) => m.default ?? m),
  { ssr: false }
) as React.ComponentType<any>;

interface MagazineViewerProps {
  catalog: CatalogData;
  showUploadButton?: boolean;
  onRequestUpload?: () => void;
}

// Magazine page ratio: square = 1:1
const PAGE_RATIO = 1.0; // height / width

const HEADER_HEIGHT  = 180; // px — brand + title + upload button
const CONTROLS_HEIGHT = 100; // px — controls bar + hint
const PADDING_V      = 48;  // px — top/bottom padding in stage area

const ZOOM_STEP = 0.15;
const MIN_ZOOM  = 0.5;
const MAX_ZOOM  = 2.0;

function calcBookDims(
  vw: number,
  vh: number,
  isFullscreen: boolean,
  ratio: number = 1.0
): { width: number; height: number; isSinglePage: boolean } {
  const isLandscape = vw > vh;
  
  // Adaptive margins to maximize use of screen
  const marginV = isLandscape ? 24 : 48;
  const marginH = isLandscape ? 24 : 16;

  const availH = vh - marginV;
  const availW = vw - marginH;

  // Single page on Phone Portrait
  if (!isLandscape && vw < 600) {
    const w = Math.min(availW, 580);
    const h = Math.round(w * ratio);
    return { width: w, height: h, isSinglePage: true };
  }

  // Single page on Tablet Portrait
  if (!isLandscape && vw >= 600) {
    const w = Math.min(availW, 1000);
    const h = Math.round(w * ratio);
    return { width: w, height: h, isSinglePage: true };
  }

  // Tablet/Desktop/Phone Landscape (Spread)
  const pageHbyH = availH;
  const pageWbyH = Math.round(pageHbyH / PAGE_RATIO);
  const pageWbyW = Math.floor(availW / 2);

  const pageW = Math.min(pageWbyH, pageWbyW);
  const pageH = Math.round(pageW * PAGE_RATIO);

  return { width: pageW, height: pageH, isSinglePage: false };
}

export default function MagazineViewer({
  catalog,
  showUploadButton = false,
  onRequestUpload,
}: MagazineViewerProps) {
  const flipBookRef  = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom]               = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showShare, setShowShare]     = useState(false);
  const [isFlipping, setIsFlipping]   = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [dims, setDims]             = useState<{
    width: number; height: number; isSinglePage: boolean;
  }>({ width: 380, height: 537, isSinglePage: false });

  useEffect(() => { setMounted(true); }, []);

  // ── Orientation Detection (for the shared view)
  useEffect(() => {
    const check = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
      setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ── Responsive dimension calculation
  useEffect(() => {
    const update = () => {
      const d = calcBookDims(window.innerWidth, window.innerHeight, isFullscreen);
      setDims(d);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isFullscreen]);

  // ── Page flip
  const handleFlipNext = useCallback(() => {
    if (!isFlipping) flipBookRef.current?.pageFlip?.().flipNext();
  }, [isFlipping]);

  const handleFlipPrev = useCallback(() => {
    if (!isFlipping) flipBookRef.current?.pageFlip?.().flipPrev();
  }, [isFlipping]);

  const handleFlip      = useCallback((e: { data: number }) => setCurrentPage(e.data), []);
  const handleFlipStart = useCallback(() => setIsFlipping(true), []);
  const handleFlipEnd   = useCallback(() => setIsFlipping(false), []);

  // ── Zoom
  const handleZoomIn  = () => setZoom(z => Math.min(z + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoom(z => Math.max(z - ZOOM_STEP, MIN_ZOOM));

  // ── Fullscreen
  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onchange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onchange);
    return () => document.removeEventListener('fullscreenchange', onchange);
  }, []);

  // ── Keyboard
  useEffect(() => {
    const onkey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') handleFlipNext();
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   handleFlipPrev();
    };
    window.addEventListener('keydown', onkey);
    return () => window.removeEventListener('keydown', onkey);
  }, [handleFlipNext, handleFlipPrev]);

  const shareToken = catalog.shareToken || catalog.id;
  const skeletonW  = dims.isSinglePage ? dims.width : dims.width * 2;

  return (
    <>
      <div
        ref={containerRef}
        className="fixed inset-0 w-screen h-[100dvh] z-[9999] overflow-hidden flex flex-col bg-black"
        style={{
          background: 'radial-gradient(circle at center, #1a0030 0%, #0d0020 60%, #000000 100%)',
        }}
      >
        {/* ── Orientation Prompt ── */}
        {mounted && isMobile && isPortrait && !isFullscreen && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d0020]/95 backdrop-blur-2xl p-10 text-center">
            <div className="relative mb-10 scale-125">
              <div className="absolute inset-0 bg-pink-500/25 blur-3xl rounded-full animate-pulse" />
              <RotateCw className="w-16 h-16 text-pink-500 relative animate-[spin_4s_linear_infinite]" />
            </div>
            <h2 className="text-white text-2xl font-bold mb-4 tracking-tight">Experiencia Inmersiva</h2>
            <p className="text-white/60 mb-10 max-w-xs text-sm font-medium">
              Gira tu dispositivo para ver el catálogo en pantalla completa horizontal.
            </p>
            <button
              onClick={() => {
                handleToggleFullscreen();
                const screenAny = window.screen as any;
                if (screenAny?.orientation?.lock) {
                  screenAny.orientation.lock('landscape').catch(() => {});
                }
              }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold text-lg shadow-2xl shadow-pink-500/30 active:scale-95 transition-all"
            >
              Ver en Horizontal
            </button>
          </div>
        )}

        {/* ── Immersive Floating UI (Always, for independent feel) ── */}
        {mounted && (
          <>
            {/* 9-dot grid menu (Top Right) */}
            <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-50">
              <button
                onClick={() => setShowShare(true)}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all shadow-2xl active:scale-90"
              >
                <LayoutGrid size={28} />
              </button>
            </div>

            {/* Floating Nav Arrows (Sides) */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-6 z-40 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handleFlipPrev(); }}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-black/60 shadow-lg backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white pointer-events-auto transition-all active:scale-95 ${currentPage === 0 ? 'opacity-0 scale-50' : 'opacity-100'}`}
              >
                <ChevronLeft size={32} />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-6 z-40 pointer-events-none">
              <button
                onClick={(e) => { e.stopPropagation(); handleFlipNext(); }}
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/40 hover:bg-black/60 shadow-lg backdrop-blur-md flex items-center justify-center text-white/60 hover:text-white pointer-events-auto transition-all active:scale-95 ${currentPage === catalog.pages.length - 1 ? 'opacity-0 scale-50' : 'opacity-100'}`}
              >
                <ChevronRight size={32} />
              </button>
            </div>

            {/* Page Counter (Bottom Center) - Modern Pill Style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
               <div className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-white/60 text-[10px] font-black font-mono tracking-[0.3em] uppercase flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${isFlipping ? 'animate-pulse' : ''}`} />
                  PAG {currentPage + 1} / {catalog.pages.length}
               </div>
            </div>
          </>
        )}

        {/* ── Flipbook Stage ── */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-0 py-0 overflow-hidden">
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
              width: dims.isSinglePage ? dims.width : dims.width * 2,
              height: dims.height,
            }}
          >
            <div
              className="relative shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
            >
              {!mounted ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 border-2 border-pink-500/20 border-t-pink-500 rounded-full animate-spin" />
                </div>
              ) : (
                <HTMLFlipBook
                  ref={flipBookRef}
                  width={dims.width}
                  height={dims.height}
                  size="fixed"
                  minWidth={150}
                  maxWidth={1200}
                  minHeight={200}
                  maxHeight={1400}
                  showCover={true}
                  mobileScrollSupport={true}
                  swipeDistance={40}
                  useMouseEvents={true}
                  clickEventForward={true}
                  flippingTime={800}
                  usePortrait={dims.isSinglePage}
                  startPage={0}
                  drawShadow={true}
                  maxShadowOpacity={0.7}
                  showPageCorners={false}
                  disableFlipByClick={false}
                  className="magazine-flipbook"
                  onFlip={handleFlip}
                  onFlipStart={handleFlipStart}
                  onFlipEnd={handleFlipEnd}
                  startZIndex={1}
                  autoSize={false}
                >
                  {catalog.pages.map((page) => (
                    <MagazinePage key={page.id} page={page} />
                  ))}
                </HTMLFlipBook>
              )}
            </div>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareModal
          catalogTitle={catalog.title}
          shareToken={catalog.shareToken || ''}
          onClose={() => setShowShare(false)}
        />
      )}
    </>
  );
}
