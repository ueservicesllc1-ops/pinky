'use client';

import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Share2,
  QrCode,
} from 'lucide-react';

interface MagazineControlsProps {
  currentPage: number;
  totalPages: number;
  isFullscreen: boolean;
  zoom: number;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onShare?: () => void;
  onShowQR?: () => void;
}

export default function MagazineControls({
  currentPage,
  totalPages,
  isFullscreen,
  zoom,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onShare,
  onShowQR,
}: MagazineControlsProps) {
  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  return (
    <div className="flex items-center justify-between w-full px-4 py-3 select-none">
      {/* Left: navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Página anterior"
          className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200
            ${canPrev
              ? 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40 text-white/90 hover:text-white hover:scale-105'
              : 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
            }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={onNext}
          disabled={!canNext}
          aria-label="Página siguiente"
          className={`group flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200
            ${canNext
              ? 'border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/40 text-white/90 hover:text-white hover:scale-105'
              : 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
            }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Center: page indicator */}
      <div className="flex items-center gap-3">
        {/* Dots */}
        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 12) }).map((_, i) => {
            const isActive = i === currentPage;
            return (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-4 h-2 bg-pink-400'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                }`}
              />
            );
          })}
          {totalPages > 12 && (
            <span className="text-white/40 text-xs ml-1">…</span>
          )}
        </div>

        {/* Counter */}
        <div className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white/80 text-sm font-medium tabular-nums">
          {currentPage + 1} / {totalPages}
        </div>
      </div>

      {/* Right: utility controls */}
      <div className="flex items-center gap-2">
        {/* Zoom out */}
        <button
          onClick={onZoomOut}
          disabled={zoom <= 0.6}
          aria-label="Alejar"
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200
            ${zoom > 0.6
              ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white hover:scale-105'
              : 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
            }`}
        >
          <ZoomOut size={16} />
        </button>

        {/* Zoom in */}
        <button
          onClick={onZoomIn}
          disabled={zoom >= 2}
          aria-label="Acercar"
          className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200
            ${zoom < 2
              ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white hover:scale-105'
              : 'border-white/5 bg-white/5 text-white/20 cursor-not-allowed'
            }`}
        >
          <ZoomIn size={16} />
        </button>

        {/* QR */}
        {onShowQR && (
          <button
            onClick={onShowQR}
            aria-label="Ver QR"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 hover:scale-105"
          >
            <QrCode size={16} />
          </button>
        )}

        {/* Share */}
        {onShare && (
          <button
            onClick={onShare}
            aria-label="Compartir catálogo"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-pink-400/40 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 hover:text-pink-200 transition-all duration-200 hover:scale-105"
          >
            <Share2 size={16} />
          </button>
        )}

        {/* Fullscreen */}
        <button
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all duration-200 hover:scale-105"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
    </div>
  );
}
