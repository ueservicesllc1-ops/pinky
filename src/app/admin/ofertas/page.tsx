'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Eye, EyeOff, Star, Gift, Clock } from 'lucide-react';
import ImageUploadWithPreview from '@/components/ImageUploadWithPreview';
import { UploadResult } from '@/lib/firebase-storage';

interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
  category: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  featured: boolean;
  limitedQuantity?: number;
  soldQuantity?: number;
  createdAt: Date;
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<SpecialOffer[]>([
    {
      id: '1',
      title: 'Pack de 3 Velas Personalizadas',
      description: '¡Oferta especial! Lleva 3 velas personalizadas y ahorra 25%',
      originalPrice: 89.97,
      offerPrice: 67.48,
      discount: 25,
      category: 'Pack Especial',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=400&fit=crop',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      isActive: true,
      featured: true,
      limitedQuantity: 50,
      soldQuantity: 12,
      createdAt: new Date()
    }
  ]);
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    originalPrice: 0,
    offerPrice: 0,
    discount: 0,
    category: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    isActive: true,
    featured: false,
    limitedQuantity: 0
  });

  const handleImageUpload = (result: UploadResult) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: result.url
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) return;

    const newOffer: SpecialOffer = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      originalPrice: formData.originalPrice,
      offerPrice: formData.offerPrice,
      discount: formData.discount,
      category: formData.category,
      imageUrl: formData.imageUrl,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive,
      featured: formData.featured,
      limitedQuantity: formData.limitedQuantity || undefined,
      soldQuantity: 0,
      createdAt: new Date()
    };

    setOffers(prev => [...prev, newOffer]);
    setFormData({
      title: '',
      description: '',
      originalPrice: 0,
      offerPrice: 0,
      discount: 0,
      category: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      isActive: true,
      featured: false,
      limitedQuantity: 0
    });
    setShowUploadForm(false);
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(offer => offer.id !== id));
  };

  const toggleOfferStatus = (id: string) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, isActive: !offer.isActive } : offer
    ));
  };

  const toggleFeatured = (id: string) => {
    setOffers(prev => prev.map(offer => 
      offer.id === id ? { ...offer, featured: !offer.featured } : offer
    ));
  };

  const isOfferActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const calculateDiscount = (original: number, offer: number) => {
    return Math.round(((original - offer) / original) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Link href="/admin" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-4xl font-light text-gray-900">
              Ofertas Especiales
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Crea ofertas especiales para aumentar las ventas
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light text-gray-900">
              Crear Nueva Oferta
            </h2>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showUploadForm ? 'Cancelar' : 'Nueva Oferta'}
            </button>
          </div>
          
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-6"
            >
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Oferta *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Pack de 3 Velas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Pack Especial"
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Describe los detalles de la oferta..."
                  />
                </div>

                {/* Precios */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Original ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.originalPrice}
                      onChange={(e) => {
                        const original = parseFloat(e.target.value);
                        const discount = calculateDiscount(original, formData.offerPrice);
                        setFormData({...formData, originalPrice: original, discount: discount});
                      }}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio de Oferta ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.offerPrice}
                      onChange={(e) => {
                        const offer = parseFloat(e.target.value);
                        const discount = calculateDiscount(formData.originalPrice, offer);
                        setFormData({...formData, offerPrice: offer, discount: discount});
                      }}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descuento (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                      readOnly
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automáticamente
                    </p>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                {/* Cantidad Limitada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad Limitada (opcional)
                  </label>
                  <input
                    type="number"
                    value={formData.limitedQuantity}
                    onChange={(e) => setFormData({...formData, limitedQuantity: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    placeholder="Dejar en 0 para oferta ilimitada"
                  />
                </div>

                {/* Subida de Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de la Oferta *
                  </label>
              <ImageUploadWithPreview
                folder="offers"
                onUpload={handleImageUpload}
                currentImage={formData.imageUrl}
                recommendedSize={{ width: 600, height: 400 }}
                className="mb-4"
              />
              <p className="text-xs text-gray-500">
                La imagen será recortada automáticamente al tamaño recomendado (600x400px)
              </p>
                </div>

                {/* Configuración */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Oferta activa
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                      Destacar oferta
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {formData.imageUrl && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa:</h3>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm relative">
                        <div className="aspect-[3/2] relative">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {formData.discount}% OFF
                            </span>
                          </div>
                          {formData.featured && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                                DESTACADO
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{formData.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{formData.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-red-600">${formData.offerPrice}</span>
                              <span className="text-sm text-gray-500 line-through">${formData.originalPrice}</span>
                            </div>
                            {formData.limitedQuantity > 0 && (
                              <span className="text-xs text-gray-500">
                                Solo {formData.limitedQuantity} disponibles
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    Crear Oferta
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadForm(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>

        {/* Offers Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6">
            Ofertas Activas ({offers.filter(o => o.isActive).length}/{offers.length})
          </h2>
          
          {offers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Gift className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                No hay ofertas creadas aún
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Haz clic en "Nueva Oferta" para crear tu primera oferta especial
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {offers.map((offer) => {
                const isCurrentlyActive = isOfferActive(offer.startDate, offer.endDate);
                const remainingQuantity = offer.limitedQuantity ? offer.limitedQuantity - (offer.soldQuantity || 0) : null;
                
                return (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      offer.featured 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : offer.isActive 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCurrentlyActive && offer.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isCurrentlyActive && offer.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                        
                        {offer.featured && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 inline mr-1" />
                            Destacada
                          </span>
                        )}
                        
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {offer.discount}% OFF
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(offer.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            offer.featured 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={offer.featured ? 'Quitar destacado' : 'Destacar oferta'}
                        >
                          <Star className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleOfferStatus(offer.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            offer.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={offer.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {offer.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {/* Edit functionality */}}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteOffer(offer.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="md:col-span-3">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {offer.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {offer.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-red-600">${offer.offerPrice}</span>
                            <span className="text-lg text-gray-500 line-through">${offer.originalPrice}</span>
                          </div>
                          
                          {remainingQuantity !== null && (
                            <span className="text-sm text-gray-500">
                              {remainingQuantity > 0 ? `${remainingQuantity} disponibles` : 'Agotado'}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Inicio: {new Date(offer.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Fin: {new Date(offer.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={offer.imageUrl}
                          alt={offer.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
