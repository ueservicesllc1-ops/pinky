'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/types';
import ProductModal from '@/components/ProductModal';
import { useCategories } from '@/hooks/useCategories';
import { useCandles } from '@/hooks/useCandles';

// Mock data para el catálogo
const products: CartItem['product'][] = [
  {
    id: '1',
    name: 'Vela Rosa Premium',
    description: 'Vela aromática de cera de soja con fragancia de rosas frescas',
    price: 25.99,
    images: ['/placeholder-candle-1.jpg'],
    category: 'Velas Románticas',
    stock: 10,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Vela Lavanda Relajante',
    description: 'Perfecta para crear un ambiente relajante y tranquilo',
    price: 22.99,
    images: ['/placeholder-candle-2.jpg'],
    category: 'Velas Aromáticas',
    stock: 15,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Vela Vainilla Clásica',
    description: 'El clásico aroma de vainilla que nunca pasa de moda',
    price: 19.99,
    images: ['/placeholder-candle-3.jpg'],
    category: 'Velas Casuales',
    stock: 20,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Vela Eucalipto Fresco',
    description: 'Fragancia refrescante y revitalizante',
    price: 24.99,
    images: ['/placeholder-candle-4.jpg'],
    category: 'Velas Aromáticas',
    stock: 12,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Vela Canela Cálida',
    description: 'Aroma cálido y acogedor perfecto para el invierno',
    price: 21.99,
    images: ['/placeholder-candle-5.jpg'],
    category: 'Velas Elegantes',
    stock: 18,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'Vela Jazmín Exótico',
    description: 'Fragancia floral exótica y sofisticada',
    price: 28.99,
    images: ['/placeholder-candle-6.jpg'],
    category: 'Velas Decorativas',
    stock: 8,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'Vela Personalizada con Nombre',
    description: 'Vela completamente personalizable con tu nombre o mensaje',
    price: 32.99,
    images: ['/placeholder-candle-7.jpg'],
    category: 'Velas Personalizadas',
    stock: 25,
    isCustomizable: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'Pack de 3 Velas Románticas',
    description: 'Set especial para crear un ambiente romántico perfecto',
    price: 65.99,
    images: ['/placeholder-candle-8.jpg'],
    category: 'Velas Románticas',
    stock: 15,
    isCustomizable: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sortOptions = ['Precio: Menor a Mayor', 'Precio: Mayor a Menor', 'Más Populares', 'Más Recientes'];

export default function CatalogoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('Más Populares');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<CartItem['product'] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addItem } = useCart();
  const { categories } = useCategories();
  const { candles, isLoading: candlesLoading } = useCandles();

  // Crear array de categorías para los filtros
  const categoryFilters = ['Todas', ...categories.map(cat => cat.name)];

  const handleAddToCart = (product: CartItem['product']) => {
    addItem({
      product,
      quantity: 1
    });
  };

  const handleProductClick = (product: CartItem['product']) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Convertir velas de Firebase al formato del catálogo
  const convertedCandles = candles.map(candle => {
    console.log('Converting candle:', {
      id: candle.id,
      name: candle.name,
      imageUrl: candle.imageUrl,
      isActive: candle.isActive
    });
    
    return {
      id: candle.id,
      name: candle.name,
      description: candle.description,
      price: candle.price,
      images: [candle.imageUrl],
      category: candle.category,
      stock: candle.isActive ? 10 : 0, // Asumir stock si está activa
      isCustomizable: true,
      createdAt: candle.uploadedAt,
      updatedAt: candle.uploadedAt
    };
  });

  const filteredProducts = convertedCandles.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory && product.stock > 0; // Solo mostrar velas activas con stock
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Precio: Menor a Mayor':
        return a.price - b.price;
      case 'Precio: Mayor a Menor':
        return b.price - a.price;
      case 'Más Recientes':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Mostrar loading mientras se cargan las velas
  if (candlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando catálogo de velas...</p>
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
            Catálogo de Velas
          </h1>
          <p className="text-lg text-gray-600">
            Descubre nuestra colección completa de velas artesanales
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Buscar velas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categoryFilters.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-pink-500 hover:bg-pink-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? "bg-pink-500 hover:bg-pink-600" : ""}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? "bg-pink-500 hover:bg-pink-600" : ""}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {sortedProducts.length} de {products.length} productos
          </p>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' 
              : 'grid-cols-1'
          }`}
        >
          {sortedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 relative overflow-hidden">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading image:', product.images[0]);
                          // Si falla la imagen, mostrar placeholder
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback cuando no hay imagen o falla */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ display: product.images && product.images[0] ? 'none' : 'flex' }}>
                      <div className="text-center text-gray-600">
                        <Heart className="h-12 w-12 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">Imagen no disponible</p>
                      </div>
                    </div>
                    
                    {/* Badge */}
                    {product.isCustomizable && (
                      <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        Personalizable
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">(4.8)</span>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {sortedProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros o términos de búsqueda
            </p>
          </motion.div>
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
