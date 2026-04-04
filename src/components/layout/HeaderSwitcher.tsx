'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const DIGITAL_ROUTE_FRAGMENT = '/digital';

export default function HeaderSwitcher() {
  const pathname = usePathname();

  const isCatalog = pathname?.includes('/catalogo');
  const isDigital = pathname?.includes(DIGITAL_ROUTE_FRAGMENT);

  if (isCatalog || isDigital) {
    return null;
  }

  return <Header />;
}

