'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, X, Download } from 'lucide-react';

interface ShareModalProps {
  catalogTitle: string;
  shareToken: string;
  onClose: () => void;
}

export default function ShareModal({ catalogTitle, shareToken, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // Build share URL — works both locally and in production
  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const shareUrl = `${baseUrl}/catalogo/ver/${shareToken}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: catalogTitle,
          text: `Mira este catálogo: ${catalogTitle}`,
          url: shareUrl,
        });
      } catch {
        // User cancelled — no-op
      }
    }
  };

  const downloadQR = () => {
    const svg = document.querySelector('#catalog-qr-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qr-${catalogTitle.toLowerCase().replace(/\s+/g, '-')}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            'linear-gradient(135deg, rgba(30,10,40,0.98) 0%, rgba(15,5,30,0.98) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.2)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">Compartir Catálogo</h3>
              <p className="text-white/40 text-xs">{catalogTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        {/* QR Code */}
        <div className="flex flex-col items-center py-6 gap-4">
          <div className="p-4 bg-white rounded-2xl shadow-lg shadow-pink-500/10">
            <QRCodeSVG
              id="catalog-qr-svg"
              value={shareUrl}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a0025"
              level="H"
              includeMargin={false}
            />
          </div>
          <p className="text-white/40 text-xs text-center">
            Escanea el código QR para ver el catálogo
          </p>

          <button
            onClick={downloadQR}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/60 hover:text-white/80 text-sm transition-all"
          >
            <Download size={14} />
            Descargar QR
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6" />

        {/* URL Copy */}
        <div className="px-6 py-5">
          <p className="text-white/50 text-xs mb-3 uppercase tracking-wider font-medium">
            Link de acceso
          </p>
          <div className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
            <span className="flex-1 px-3 py-2 text-white/60 text-sm truncate font-mono">
              {shareUrl}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${copied
                  ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                  : 'bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30'
                }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native share button (mobile) */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <div className="px-6 pb-6">
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40"
            >
              Compartir desde el dispositivo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
