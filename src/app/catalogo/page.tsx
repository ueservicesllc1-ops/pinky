'use client';

import React, { useState, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PdfUploader from '@/components/catalog/PdfUploader';
import { CatalogData } from '@/types/catalog';
import {
  DEFAULT_CATALOG,
} from '@/lib/catalogData';
import { saveCatalog, getCatalogByToken, getRecentCatalogs } from '@/lib/catalog-persistence';
import { BookOpen, Upload, Sparkles, Loader2, Clock, Share2 } from 'lucide-react';

// Dynamic import to avoid SSR
const MagazineViewer = dynamic(
  () => import('@/components/catalog/MagazineViewer'),
  { ssr: false, loading: () => <CatalogLoadingSkeleton /> }
);

function CatalogLoadingSkeleton() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-black"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
        <p className="text-white/40 text-sm animate-pulse">Cargando catálogo…</p>
      </div>
    </div>
  );
}

type ViewMode = 'viewer' | 'upload';

export default function CatalogoPage() {
  const [catalog, setCatalog] = useState<CatalogData>(DEFAULT_CATALOG);
  const [viewMode, setViewMode] = useState<ViewMode>('upload');
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState('');
  const [recentCatalogs, setRecentCatalogs] = useState<CatalogData[]>([]);
  const [isLoadingRecents, setIsLoadingRecents] = useState(true);

  // Cargar recientes al montar
  useEffect(() => {
    async function loadRecents() {
      setIsLoadingRecents(true);
      const recents = await getRecentCatalogs(6);
      setRecentCatalogs(recents);
      setIsLoadingRecents(false);
    }
    loadRecents();
  }, []);

  const handleSelectCatalog = (c: CatalogData) => {
    setCatalog(c);
    setViewMode('viewer');
  };

  const handlePagesExtracted = useCallback(
    async (images: string[], filename: string, pdfFile: File) => {
      setIsSaving(true);
      try {
        const token = await saveCatalog(
          pdfFile,
          filename || 'Mi Catálogo',
          images,
          (msg) => setSaveProgress(msg)
        );
        
        const fullCatalog = await getCatalogByToken(token);
        if (fullCatalog) {
          setCatalog(fullCatalog);
          setViewMode('viewer');
          // Update recents list
          setRecentCatalogs(prev => [fullCatalog, ...prev.slice(0, 5)]);
        }
      } catch (err) {
        console.error('Error saving catalog:', err);
        alert('Error al guardar el catálogo en la nube. Revisa tu conexión.');
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {viewMode === 'upload' ? (
        /* ───── Dashboard / Upload screen ───── */
        <div
          className="flex-1 flex flex-col items-center px-4 py-12"
          style={{
            background: 'radial-gradient(circle at top, #1a0030 0%, #000000 100%)',
          }}
        >
          {/* Ambient orbs */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
              style={{ background: 'radial-gradient(circle, #d946ef 0%, transparent 70%)' }}
            />
          </div>

          <div className="relative z-10 w-full max-w-5xl">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span className="text-pink-300 text-xs font-bold tracking-widest uppercase">Pinky Flame Studio</span>
              </div>

              <h1 className="text-white text-4xl sm:text-5xl font-black tracking-tight mb-4">
                Tus Catálogos
              </h1>
              <p className="text-white/40 text-lg max-w-2xl mx-auto">
                Gestiona tus revistas digitales y crea nuevas experiencias interactivas para tus clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left Side: Upload */}
              <div className="lg:col-span-1">
                <div className="sticky top-10">
                   <div className="p-1 rounded-3xl bg-gradient-to-br from-pink-500/20 to-purple-600/20 shadow-2xl">
                    <div className="bg-[#0d001a]/90 backdrop-blur-3xl rounded-[22px] p-8">
                       <h2 className="text-white text-xl font-bold mb-6 flex items-center gap-3">
                          <Upload className="text-pink-500" />
                          Nuevo Catálogo
                       </h2>
                       <PdfUploader onPagesExtracted={handlePagesExtracted} />
                       <p className="text-white/30 text-xs mt-6 leading-relaxed italic">
                          Formatos PDF soportados. Las páginas horizontales se dividirán automáticamente en cuadrados.
                       </p>
                    </div>
                   </div>
                </div>
              </div>

              {/* Right Side: Recent Catalogs */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white text-xl font-bold flex items-center gap-3">
                    <Clock className="text-purple-500" />
                    Subidos Recientemente
                  </h2>
                  <span className="text-white/20 text-xs font-mono">{recentCatalogs.length} Catálogos</span>
                </div>

                {isLoadingRecents ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="aspect-[1/1] rounded-2xl bg-white/5 animate-pulse" />
                    ))}
                  </div>
                ) : recentCatalogs.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {recentCatalogs.map((c) => (
                      <div 
                        key={c.shareToken}
                        onClick={() => handleSelectCatalog(c)}
                        className="group relative cursor-pointer"
                      >
                        <div className="aspect-[1/1] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group-hover:border-pink-500/50 transition-all duration-300 shadow-xl group-hover:shadow-pink-500/10">
                          <img 
                            src={c.pages[0]?.image} 
                            alt={c.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                          
                          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                             <p className="text-white font-bold text-sm truncate">{c.title}</p>
                             <p className="text-white/40 text-[10px] uppercase tracking-wider mt-1">
                                {c.pages.length} Págs · {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Reciente'}
                             </p>
                          </div>
                          
                          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-lg">
                                <BookOpen size={16} />
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 px-10 rounded-3xl border-2 border-dashed border-white/5 bg-white/3">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <BookOpen className="text-white/20" size={32} />
                    </div>
                    <p className="text-white/40 font-medium">Aún no tienes catálogos</p>
                    <p className="text-white/20 text-sm">Sube tu primer PDF para verlo aquí.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Saving Overlay */}
            {isSaving && (
              <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl p-6 text-center">
                <div className="w-24 h-24 relative mb-8">
                   <div className="absolute inset-0 bg-pink-500/30 blur-3xl rounded-full animate-pulse" />
                   <Loader2 className="w-full h-full text-pink-500 animate-spin relative" />
                </div>
                <h3 className="text-white text-2xl font-black tracking-tighter mb-3 uppercase">Procesando tu Magia</h3>
                <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">{saveProgress}</p>
                <div className="mt-10 w-full max-w-md bg-white/5 rounded-full h-1.5 overflow-hidden border border-white/5">
                   <div className="h-full bg-gradient-to-r from-pink-500 to-purple-600 animate-[shimmer_2s_infinite]" style={{ width: '100%' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ───── Magazine viewer ───── */
        <MagazineViewer
          catalog={catalog}
          showUploadButton={true}
          onRequestUpload={() => setViewMode('upload')}
        />
      )}
    </div>
  );
}
