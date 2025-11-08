'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

const DIGITAL_ROUTE_FRAGMENT = '/digital';

export default function FooterSwitcher() {
  const pathname = usePathname();

  if (pathname?.includes(DIGITAL_ROUTE_FRAGMENT)) {
    return null;
  }

  return <Footer />;
}

