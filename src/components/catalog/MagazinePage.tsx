'use client';

import React, { forwardRef } from 'react';
import Image from 'next/image';
import { CatalogPage } from '@/types/catalog';

interface MagazinePageProps {
  page: CatalogPage;
  isLoading?: boolean;
}

// react-pageflip requires forwardRef on each page component
const MagazinePage = forwardRef<HTMLDivElement, MagazinePageProps>(
  ({ page, isLoading = false }, ref) => {
    return (
      <div
        ref={ref}
        className="magazine-page"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          userSelect: 'none',
          boxSizing: 'border-box',
        }}
      >
        {/* Paper gloss overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(0,0,0,0.04) 100%)',
          }}
        />

        {isLoading ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid #f9a8d4',
                borderTopColor: '#ec4899',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        ) : (
          <Image
            src={page.image}
            alt={page.alt || page.title || `Página ${(page.pageNumber ?? 0) + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            // object-cover: fills the entire square container completely
            className="object-cover"
            priority={(page.pageNumber ?? 99) < 4}
            draggable={false}
          />
        )}

        {/* Page number badge */}
        {page.pageNumber !== undefined && (
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              padding: '2px 10px',
              borderRadius: 999,
              background: 'rgba(0,0,0,0.18)',
              backdropFilter: 'blur(4px)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: '0.12em',
              whiteSpace: 'nowrap',
            }}
          >
            {page.pageNumber + 1}
          </div>
        )}
      </div>
    );
  }
);

MagazinePage.displayName = 'MagazinePage';
export default MagazinePage;
