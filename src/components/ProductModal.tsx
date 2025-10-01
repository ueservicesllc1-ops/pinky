'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingCart, Plus, Minus, Palette, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CartItem } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface ProductModalProps {
  product: CartItem['product'] | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedScent, setSelectedScent] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  
  const { addItem } = useCart();

  if (!product) return null;

  const handleAddToCart = () => {
    addItem({
      product,
      quantity,
      customizations: {
        scent: selectedScent || undefined,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        message: customMessage || undefined,
      }
    });
    onClose();
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Left Side - Product Image */}
                <div className="relative bg-gradient-to-br from-pink-100 to-purple-100 min-h-[400px] flex items-center justify-center">
                  <div className="text-center text-gray-600 p-8">
                    <Heart className="h-32 w-32 mx-auto mb-4 opacity-80" />
                    <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-lg opacity-80">Imagen de alta calidad</p>
                  </div>
                  
                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 w-16 h-16 bg-pink-400/60 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-8 left-8 w-12 h-12 bg-purple-400/60 rounded-full"
                  />
                </div>

                {/* Right Side - Product Details */}
                <div className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-pink-500" />
                    <span className="text-pink-600 font-semibold text-sm">
                      {product.isCustomizable ? 'Personalizable' : 'Producto Premium'}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {product.name}
                  </h1>

                  <p className="text-gray-600 mb-6 text-lg">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-gray-500 ml-2">(4.8) - 156 reseñas</span>
                  </div>

                  {/* Price */}
                  <div className="text-3xl font-bold text-gray-900 mb-6">
                    ${product.price}
                  </div>

                  {/* Customizations */}
                  {product.isCustomizable && product.customizationOptions && (
                    <div className="space-y-4 mb-6">
                      {/* Scents */}
                      {product.customizationOptions.scents && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Fragancia
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.customizationOptions.scents.map((scent) => (
                              <button
                                key={scent}
                                onClick={() => setSelectedScent(scent)}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedScent === scent
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {scent}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Colors */}
                      {product.customizationOptions.colors && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Color
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.customizationOptions.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedColor === color
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Sizes */}
                      {product.customizationOptions.sizes && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tamaño
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.customizationOptions.sizes.map((size) => (
                              <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-3 py-1 rounded-full text-sm transition-all ${
                                  selectedSize === size
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Custom Message */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mensaje Personalizado (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Escribe un mensaje especial..."
                          value={customMessage}
                          onChange={(e) => setCustomMessage(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cantidad
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={increaseQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 text-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Agregar al Carrito - ${(product.price * quantity).toFixed(2)}
                  </Button>

                  {/* Features */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        <span>Hecho con amor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-purple-500" />
                        <span>100% Natural</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
