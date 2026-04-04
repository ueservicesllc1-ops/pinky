// ─────────────────────────────────────────────
//  Catalog / Magazine Flipbook — Type Definitions
// ─────────────────────────────────────────────

export interface CatalogPage {
  id: string;
  image: string;          // URL or base64 data-URL
  title?: string;
  alt?: string;
  pageNumber?: number;
}

export interface CatalogData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverImage?: string;
  pages: CatalogPage[];
  createdAt?: Date | string;
  pdfUrl?: string; // New: link to the original PDF in B2
  shareToken?: string;    // unique token for public share link
}

export type FlipDirection = 'FORWARD' | 'BACK';

export interface FlipState {
  currentPage: number;
  totalPages: number;
  isFlipping: boolean;
  direction: FlipDirection | null;
}
