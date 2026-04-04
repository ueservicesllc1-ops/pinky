'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { CatalogData } from '@/types/catalog';
import { DEFAULT_CATALOG } from '@/lib/catalogData';
import { BookOpen } from 'lucide-react';

const MagazineViewer = dynamic(
  () => import('@/components/catalog/MagazineViewer'),
  { ssr: false }
);

import { getCatalogByToken } from '@/lib/catalog-persistence';

async function fetchCatalogByToken(token: string): Promise<CatalogData | null> {
  return await getCatalogByToken(token);
}

export default function SharedCatalogPage() {
  const params = useParams();
  const token = params?.token as string;

  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchCatalogByToken(token)
      .then((data) => {
        if (data) setCatalog(data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #1a0030 0%, #0d0020 40%, #000010 100%)' }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-pink-500/30 border-t-pink-500 animate-spin" />
          <p className="text-white/40 text-sm animate-pulse">Cargando catálogo…</p>
        </div>
      </div>
    );
  }

  if (notFound || !catalog) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: 'linear-gradient(160deg, #1a0030 0%, #0d0020 40%, #000010 100%)' }}
      >
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white/30" />
          </div>
          <h1 className="text-white text-2xl font-bold mb-2">Catálogo no encontrado</h1>
          <p className="text-white/40">Este enlace puede haber expirado o ser incorrecto.</p>
          <a
            href="/catalogo"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 hover:text-pink-200 text-sm font-medium transition-all"
          >
            Ir al catálogo
          </a>
        </div>
      </div>
    );
  }

  return <MagazineViewer catalog={catalog} />;
}
