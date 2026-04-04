// ─────────────────────────────────────────────
//  Demo Catalog Data — Replace with real pages later
// ─────────────────────────────────────────────
import { CatalogPage, CatalogData } from "@/types/catalog";

// Gradient-based placeholder pages so the demo looks beautiful
// Replace each `image` with your real page URLs or base64 strings
const PLACEHOLDER_PAGES: CatalogPage[] = [
  {
    id: "cover",
    image: "/catalog/page-cover.jpg",
    title: "Pinky Flame — Colección 2024",
    alt: "Portada del catálogo Pinky Flame",
    pageNumber: 0,
  },
  {
    id: "page-1",
    image: "/catalog/page-01.jpg",
    title: "Velas Aromáticas",
    alt: "Colección de velas aromáticas",
    pageNumber: 1,
  },
  {
    id: "page-2",
    image: "/catalog/page-02.jpg",
    title: "Edición Especial",
    alt: "Edición especial de velas",
    pageNumber: 2,
  },
  {
    id: "page-3",
    image: "/catalog/page-03.jpg",
    title: "Velas Decorativas",
    alt: "Velas decorativas artesanales",
    pageNumber: 3,
  },
  {
    id: "page-4",
    image: "/catalog/page-04.jpg",
    title: "Regalos Personalizados",
    alt: "Sets de regalo personalizados",
    pageNumber: 4,
  },
  {
    id: "page-5",
    image: "/catalog/page-05.jpg",
    title: "Colección Navidad",
    alt: "Colección especial de Navidad",
    pageNumber: 5,
  },
  {
    id: "page-6",
    image: "/catalog/page-06.jpg",
    title: "Aromas Premium",
    alt: "Selección de aromas premium",
    pageNumber: 6,
  },
  {
    id: "back-cover",
    image: "/catalog/page-back.jpg",
    title: "Contraportada",
    alt: "Contraportada del catálogo",
    pageNumber: 7,
  },
];

export const DEFAULT_CATALOG: CatalogData = {
  id: "pinky-flame-2024",
  title: "Pinky Flame",
  subtitle: "Colección Premium 2024",
  description: "Descubre nuestra exclusiva colección de velas artesanales",
  coverImage: "/catalog/page-cover.jpg",
  pages: PLACEHOLDER_PAGES,
  createdAt: new Date(),
};

// ── Utility: build a CatalogData from an array of image data-URLs
export function buildCatalogFromImages(
  images: string[],
  title = "Mi Catálogo",
  subtitle = ""
): CatalogData {
  const pages: CatalogPage[] = images.map((img, i) => ({
    id: `page-${i}`,
    image: img,
    alt: `Página ${i + 1}`,
    pageNumber: i,
  }));

  return {
    id: `catalog-${Date.now()}`,
    title,
    subtitle,
    pages,
    createdAt: new Date(),
    shareToken: generateShareToken(),
  };
}

export function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 10) +
    Math.random().toString(36).substring(2, 10);
}
