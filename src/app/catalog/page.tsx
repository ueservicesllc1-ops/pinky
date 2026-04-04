import { redirect } from 'next/navigation';

// /catalog (English) → /catalogo (Spanish)
export default function CatalogRedirectPage() {
  redirect('/catalogo');
}
