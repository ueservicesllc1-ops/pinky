'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import CartNotification from './CartNotification';

export default function CartNotificationProvider() {
  const { showNotification, lastAddedProduct, hideNotification } = useCart();

  return (
    <CartNotification
      isVisible={showNotification}
      onClose={hideNotification}
      productName={lastAddedProduct}
      onContinueShopping={() => {
        // Scroll to top to continue shopping
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    />
  );
}
