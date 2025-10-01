'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Eye, EyeOff, Calendar, Percent, Tag } from 'lucide-react';
import ImageUploadWithPreview from '@/components/ImageUploadWithPreview';
import { UploadResult } from '@/lib/firebase-storage';

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  imageUrl: string;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: '1',
      title: 'Descuento de Temporada',
      description: '¡Aprovecha nuestro descuento especial en velas personalizadas!',
      discount: 20,
      discountType: 'percentage',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=300&fit=crop',
      isActive: true,
      featured: true,
      createdAt: new Date()
    }
  ]);
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
    imageUrl: '',
    isActive: true,
    featured: false
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

    const newPromotion: Promotion = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      discount: formData.discount,
      discountType: formData.discountType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive,
      featured: formData.featured,
      createdAt: new Date()
    };

    setPromotions(prev => [...prev, newPromotion]);
    setFormData({
      title: '',
      description: '',
      discount: 0,
      discountType: 'percentage',
      startDate: '',
      endDate: '',
      imageUrl: '',
      isActive: true,
      featured: false
    });
    setShowUploadForm(false);
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(promotion => promotion.id !== id));
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev => prev.map(promotion => 
      promotion.id === id ? { ...promotion, isActive: !promotion.isActive } : promotion
    ));
  };

  const toggleFeatured = (id: string) => {
    setPromotions(prev => prev.map(promotion => 
      promotion.id === id ? { ...promotion, featured: !promotion.featured } : promotion
    ));
  };

  const isPromotionActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
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
              Gestión de Promociones
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Crea y administra promociones para atraer más clientes
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
              Crear Nueva Promoción
            </h2>
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showUploadForm ? 'Cancelar' : 'Nueva Promoción'}
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
                      Título de la Promoción *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Descuento de Temporada"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Descuento
                    </label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value as 'percentage' | 'fixed'})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Cantidad Fija ($)</option>
                    </select>
                  </div>
                </div>

                {/* Descripción y Descuento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={3}
                      placeholder="Describe los detalles de la promoción..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {formData.discountType === 'percentage' ? 'Descuento (%)' : 'Descuento ($)'} *
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value)})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step={formData.discountType === 'percentage' ? "1" : "0.01"}
                      required
                    />
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

                {/* Subida de Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de la Promoción *
                  </label>
              <ImageUploadWithPreview
                folder="promotions"
                onUpload={handleImageUpload}
                currentImage={formData.imageUrl}
                recommendedSize={{ width: 800, height: 400 }}
                className="mb-4"
              />
              <p className="text-xs text-gray-500">
                La imagen será recortada automáticamente al tamaño recomendado (800x400px)
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
                      Promoción activa
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
                      Destacar promoción
                    </label>
                  </div>
                </div>

                {/* Preview */}
                {formData.imageUrl && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Vista Previa:</h3>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="aspect-[2/1] bg-white rounded-lg overflow-hidden shadow-sm relative">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center p-6">
                          <div className="text-white">
                            <div className="flex items-center mb-2">
                              {formData.discountType === 'percentage' ? (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-2">
                                  {formData.discount}% OFF
                                </span>
                              ) : (
                                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold mr-2">
                                  ${formData.discount} OFF
                                </span>
                              )}
                              {formData.featured && (
                                <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                                  DESTACADO
                                </span>
                              )}
                            </div>
                            <h2 className="text-2xl font-bold mb-1">{formData.title}</h2>
                            <p className="text-sm opacity-90">{formData.description}</p>
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
                    Crear Promoción
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

        {/* Promotions Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6">
            Promociones Activas ({promotions.filter(p => p.isActive).length}/{promotions.length})
          </h2>
          
          {promotions.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                No hay promociones creadas aún
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Haz clic en "Nueva Promoción" para crear tu primera promoción
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {promotions.map((promotion) => {
                const isCurrentlyActive = isPromotionActive(promotion.startDate, promotion.endDate);
                
                return (
                  <motion.div
                    key={promotion.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      promotion.featured 
                        ? 'border-yellow-200 bg-yellow-50' 
                        : promotion.isActive 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isCurrentlyActive && promotion.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {isCurrentlyActive && promotion.isActive ? 'Activa' : 'Inactiva'}
                        </span>
                        
                        {promotion.featured && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Destacada
                          </span>
                        )}
                        
                        <span className="text-sm text-gray-500">
                          {promotion.discountType === 'percentage' 
                            ? `${promotion.discount}% OFF` 
                            : `$${promotion.discount} OFF`
                          }
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleFeatured(promotion.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            promotion.featured 
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={promotion.featured ? 'Quitar destacado' : 'Destacar promoción'}
                        >
                          <Tag className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => togglePromotionStatus(promotion.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            promotion.isActive 
                              ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                          title={promotion.isActive ? 'Desactivar' : 'Activar'}
                        >
                          {promotion.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {/* Edit functionality */}}
                          className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePromotion(promotion.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {promotion.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {promotion.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Inicio: {new Date(promotion.startDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Fin: {new Date(promotion.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={promotion.imageUrl}
                          alt={promotion.title}
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
