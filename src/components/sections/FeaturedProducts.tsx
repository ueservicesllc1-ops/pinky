'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useCandles } from '@/hooks/useCandles';
import ProductModal from '@/components/ProductModal';
import { CartItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';


export default function FeaturedProducts() {
  const { addItem } = useCart();
  const { candles, isLoading } = useCandles();
  const [selectedProduct, setSelectedProduct] = React.useState<CartItem['product'] | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const { language, t } = useLanguage();
  const localePrefix = language === 'en' ? '/en' : '/es';

  // Convertir velas de Firebase al formato esperado por el carrito
  const featuredProducts = candles
    .filter((candle) => candle.isActive)
    .slice(0, 4)
    .map((candle) => {
      const localizedName = candle.translations?.name?.[language] || candle.name;
      const localizedDescription =
        candle.translations?.description?.[language] || candle.description;

      return {
        id: candle.id,
        name: localizedName,
        description: localizedDescription,
        price: candle.price,
        images: [candle.imageUrl],
        category: candle.translations?.category?.[language] || candle.category,
        stock: 10,
        isCustomizable: true,
        customizationOptions: {
          scents: ['Personalizado'],
          sizes: ['Único'],
          colors: ['Personalizable'],
        },
        createdAt: candle.uploadedAt,
        updatedAt: candle.uploadedAt,
      };
    });

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

  // Mostrar loading si está cargando
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t('products.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay velas, mostrar mensaje
  if (featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {t('products.featured')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('products.comingSoon')}
            </p>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
              onClick={() => window.location.href = `${localePrefix}/catalogo`}
            >
              {t('products.viewAllProducts')}
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
              {t('products.featured')}
            </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            {t('products.featuredDescription')}
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
              <Card 
                className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
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
                          // Si falla la imagen, mostrar placeholder
                          e.currentTarget.style.display = 'none';
                          const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                          if (nextElement) {
                            nextElement.style.display = 'flex';
                          }
                        }}
                      />
                    ) : null}
                    
                    {/* Fallback cuando no hay imagen o falla */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ display: product.images && product.images[0] ? 'none' : 'flex' }}>
                      <div className="text-center text-gray-600">
                        <Heart className="h-16 w-16 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">
                          {`${t('products.imagePlaceholder')} ${product.name}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="bg-white text-gray-900 hover:bg-gray-100"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                        {t('products.addToCart')}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-white text-white hover:bg-white hover:text-gray-900"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Badge */}
                    {product.isCustomizable && (
                      <div className="absolute top-3 left-3 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                        {t('products.customizable')}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t('products.buy')}
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
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
            onClick={() => window.location.href = `${localePrefix}/catalogo`}
          >
            {t('products.viewAllProducts')}
          </Button>
        </motion.div>
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}
