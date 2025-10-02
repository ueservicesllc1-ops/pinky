'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CarritoPage() {
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <ShoppingCart className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              ¡Explora nuestra colección y encuentra la vela perfecta para ti!
            </p>
            <Link href="/catalogo">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Carrito de Compras
          </h1>
          <p className="text-lg text-gray-600">
            Revisa tus productos antes de proceder al checkout
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                            <div className="text-center text-gray-600">
                              <ShoppingCart className="h-8 w-8 mx-auto mb-1 opacity-50" />
                              <p className="text-xs">Imagen</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.product.description}
                        </p>
                        
                        {/* Customizations */}
                        {item.customizations && (
                          <div className="text-sm text-gray-500 mb-2">
                            {item.customizations.scent && (
                              <span className="mr-4">Fragancia: {item.customizations.scent}</span>
                            )}
                            {item.customizations.color && (
                              <span className="mr-4">Color: {item.customizations.color}</span>
                            )}
                            {item.customizations.size && (
                              <span>Tamaño: {item.customizations.size}</span>
                            )}
                          </div>
                        )}

                        <div className="text-xl font-bold text-gray-900">
                          ${item.product.price}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Clear Cart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-end"
            >
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Vaciar Carrito
              </Button>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Resumen del Pedido
                </h2>

                {/* Order Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'artículo' : 'artículos'})</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600">
                      {total >= 50 ? 'Gratis' : '$9.99'}
                    </span>
                  </div>
                  
                  {total < 50 && (
                    <div className="text-sm text-pink-600 bg-pink-50 p-3 rounded-lg">
                      💡 Agrega ${(50 - total).toFixed(2)} más para envío gratis
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${(total + (total >= 50 ? 0 : 9.99)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Policies Checkbox */}
                <div className="mb-6 pt-6 border-t">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptPolicies"
                      checked={acceptPolicies}
                      onChange={(e) => setAcceptPolicies(e.target.checked)}
                      className="mt-1 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="acceptPolicies" className="text-sm text-gray-700">
                      Acepto las{' '}
                      <Link 
                        href="/politicas-envio" 
                        target="_blank"
                        className="text-pink-600 hover:text-pink-700 underline inline-flex items-center gap-1"
                      >
                        políticas de envío
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      {' '}de Pinky Flame
                    </label>
                  </div>
                  {!acceptPolicies && (
                    <p className="text-xs text-red-600 mt-2">
                      Debes aceptar las políticas de envío para continuar
                    </p>
                  )}
                </div>

                {/* Checkout Button */}
                {acceptPolicies ? (
                  <Link href="/checkout" className="block">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 mb-4"
                    >
                      Proceder al Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed mb-4"
                  >
                    Proceder al Checkout
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                )}

                {/* Continue Shopping */}
                <Link href="/catalogo" className="block">
                  <Button variant="outline" size="lg" className="w-full">
                    Continuar Comprando
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center text-sm text-gray-500">
                    <p className="mb-2">🔒 Compra segura</p>
                    <p>✨ Envío gratis en pedidos +$50</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
