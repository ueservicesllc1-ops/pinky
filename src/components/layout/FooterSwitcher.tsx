'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const DIGITAL_ROUTE_FRAGMENT = '/digital';

export default function FooterSwitcher() {
  const pathname = usePathname();

  const isCatalog = pathname?.includes('/catalogo');
  const isDigital = pathname?.includes(DIGITAL_ROUTE_FRAGMENT);

  if (isCatalog || isDigital) {
    return null;
  }

  return <Footer />;
}

