'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

const DIGITAL_ROUTE_FRAGMENT = '/digital';

export default function HeaderSwitcher() {
  const pathname = usePathname();

  if (pathname?.includes(DIGITAL_ROUTE_FRAGMENT)) {
    return null;
  }

  return <Header />;
}

