'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types';

// Mock data para productos destacados
const featuredProducts: CartItem['product'][] = [
  {
    id: '1',
    name: 'Vela Rosa Premium',
    description: 'Vela aromática de cera de soja con fragancia de rosas frescas',
    price: 25.99,
    images: ['/placeholder-candle-1.jpg'],
    category: 'aromáticas',
    stock: 10,
    isCustomizable: true,
    customizationOptions: {
      scents: ['Rosa', 'Lavanda', 'Vainilla'],
      sizes: ['Pequeña', 'Mediana', 'Grande'],
      colors: ['Rosa', 'Blanco', 'Coral']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Vela Lavanda Relajante',
    description: 'Perfecta para crear un ambiente relajante y tranquilo',
    price: 22.99,
    images: ['/placeholder-candle-2.jpg'],
    category: 'aromáticas',
    stock: 15,
    isCustomizable: true,
    customizationOptions: {
      scents: ['Lavanda', 'Eucalipto', 'Manzanilla'],
      sizes: ['Pequeña', 'Mediana', 'Grande'],
      colors: ['Morado', 'Lila', 'Blanco']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Vela Vainilla Clásica',
    description: 'El clásico aroma de vainilla que nunca pasa de moda',
    price: 19.99,
    images: ['/placeholder-candle-3.jpg'],
    category: 'aromáticas',
    stock: 20,
    isCustomizable: true,
    customizationOptions: {
      scents: ['Vainilla', 'Canela', 'Caramelo'],
      sizes: ['Pequeña', 'Mediana', 'Grande'],
      colors: ['Crema', 'Beige', 'Dorado']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Vela Eucalipto Fresco',
    description: 'Fragancia refrescante y revitalizante para espacios amplios',
    price: 24.99,
    images: ['/placeholder-candle-4.jpg'],
    category: 'aromáticas',
    stock: 12,
    isCustomizable: true,
    customizationOptions: {
      scents: ['Eucalipto', 'Menta', 'Pino'],
      sizes: ['Pequeña', 'Mediana', 'Grande'],
      colors: ['Verde', 'Azul', 'Blanco']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function FeaturedProducts() {
  const { addItem } = useCart();

  const handleAddToCart = (product: CartItem['product']) => {
    addItem({
      product,
      quantity: 1
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Descubre nuestras velas más populares, creadas con los mejores ingredientes naturales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <Heart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Imagen de {product.name}</p>
                      </div>
                    </div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Agregar
                        </Button>
                        <Button size="sm" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badge */}
                    {product.isCustomizable && (
                      <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        Personalizable
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </div>
                      <Button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Comprar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50">
            Ver Todos los Productos
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
