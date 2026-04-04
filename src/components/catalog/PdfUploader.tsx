'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';

// ── The version must match what's in node_modules
// Run: node -e "console.log(require('pdfjs-dist/package.json').version)"
const PDFJS_VERSION = '5.6.205';

/**
 * Load pdfjs-dist entirely from CDN using webpackIgnore.
 * This bypasses Next.js/webpack bundling completely, avoiding
 * the "Object.defineProperty called on non-object" ESM conflict.
 */
async function loadPdfJs() {
  // Cache after first load
  const win = window as any;
  if (win.__pdfjs_instance) return win.__pdfjs_instance;

  const lib = await import(
    /* webpackIgnore: true */
    `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.mjs`
  ) as any;

  // Point worker to CDN too — no local worker bundle needed
  lib.GlobalWorkerOptions.workerSrc =
    `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

  win.__pdfjs_instance = lib;
  return lib;
}

interface PdfUploaderProps {
  onPagesExtracted: (images: string[], filename: string, pdfFile: File) => void;
}

export default function PdfUploader({ onPagesExtracted }: PdfUploaderProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const extractPages = useCallback(async (file: File) => {
    setStatus('loading');
    setProgress(0);
    setErrorMsg('');

    try {
      const pdfjsLib = await loadPdfJs();

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const images: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const scale = 2.0;
        const viewport = page.getViewport({ scale });

        // If it's a spread (approx 2:1 width-to-height)
        if (viewport.width > viewport.height * 1.2) {
          const fullCanvas = document.createElement('canvas');
          fullCanvas.width = viewport.width;
          fullCanvas.height = viewport.height;
          const fullCtx = fullCanvas.getContext('2d')!;
          await page.render({ canvasContext: fullCtx, viewport }).promise;

          const halfW = viewport.width / 2;

          // Split L/R
          for (let side = 0; side < 2; side++) {
            const sideCanvas = document.createElement('canvas');
            sideCanvas.width = halfW;
            sideCanvas.height = viewport.height;
            const sideCtx = sideCanvas.getContext('2d')!;
            sideCtx.drawImage(
              fullCanvas,
              side * halfW, 0, halfW, viewport.height, // source
              0, 0, halfW, viewport.height // dest
            );
            images.push(sideCanvas.toDataURL('image/jpeg', 0.92));
          }
        } else {
          // Single page
          const canvas = document.createElement('canvas');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext('2d')!;
          await page.render({ canvasContext: ctx, viewport }).promise;
          images.push(canvas.toDataURL('image/jpeg', 0.92));
        }

        setProgress(Math.round((i / pdf.numPages) * 100));
      }

      onPagesExtracted(images, file.name.replace(/\.pdf$/i, ''), file);
      setStatus('idle');
    } catch (err) {
      console.error('PDF extraction error:', err);
      setErrorMsg(
        'No se pudo procesar el PDF. Verifica que el archivo no esté protegido o corrupto.'
      );
      setStatus('error');
    }
  }, [onPagesExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50 MB
    onDropAccepted: ([file]) => extractPages(file),
    onDropRejected: (rejects) => {
      const code = rejects[0]?.errors[0]?.code;
      if (code === 'file-too-large') {
        setErrorMsg('El archivo es demasiado grande. Máximo 50 MB.');
      } else {
        setErrorMsg('Solo se aceptan archivos PDF.');
      }
      setStatus('error');
    },
    disabled: status === 'loading',
  });

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-pink-400 bg-pink-500/10 scale-[1.02]'
            : status === 'error'
            ? 'border-red-400/50 bg-red-500/5'
            : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
          }
          ${status === 'loading' ? 'cursor-wait pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />

        {status === 'loading' ? (
          <>
            <div className="relative w-16 h-16 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-pink-400 animate-spin" />
              <span className="absolute text-xs font-bold text-pink-300">{progress}%</span>
            </div>
            <div className="text-center">
              <p className="text-white/80 font-medium">Procesando PDF…</p>
              <p className="text-white/40 text-sm mt-1">Extrayendo páginas con alta resolución</p>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="w-12 h-12 text-red-400" />
            <div className="text-center">
              <p className="text-red-300 font-medium">Error al procesar</p>
              <p className="text-red-300/60 text-sm mt-1">{errorMsg}</p>
              <button
                onClick={(e) => { e.stopPropagation(); setStatus('idle'); setErrorMsg(''); }}
                className="mt-3 text-xs text-white/50 hover:text-white/80 underline transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragActive ? 'bg-pink-500/30 scale-110' : 'bg-white/10'}`}
            >
              {isDragActive ? (
                <FileText className="w-8 h-8 text-pink-300" />
              ) : (
                <Upload className="w-8 h-8 text-white/60" />
              )}
            </div>
            <div className="text-center">
              <p className="text-white/80 font-semibold text-lg">
                {isDragActive ? '¡Suelta el PDF aquí!' : 'Sube tu catálogo en PDF'}
              </p>
              <p className="text-white/40 text-sm mt-1">
                Arrastra y suelta, o haz clic para seleccionar
              </p>
              <p className="text-white/25 text-xs mt-2">PDF · Máximo 50 MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
