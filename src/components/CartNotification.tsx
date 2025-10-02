'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CartNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  productName: string;
  onContinueShopping: () => void;
}

export default function CartNotification({ 
  isVisible, 
  onClose, 
  productName, 
  onContinueShopping 
}: CartNotificationProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
            {/* Header con icono de éxito */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  ¡Agregado al carrito!
                </h3>
                <p className="text-sm text-gray-600">
                  {productName}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col space-y-3">
              <Link href="/es/carrito" onClick={onClose}>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Ver Carrito
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full border-pink-200 text-pink-600 hover:bg-pink-50"
                onClick={() => {
                  onContinueShopping();
                  onClose();
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Seguir Comprando
              </Button>
            </div>

            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
