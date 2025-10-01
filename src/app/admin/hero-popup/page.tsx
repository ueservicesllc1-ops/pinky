'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Save, Eye, Upload, Settings, Clock, Sparkles } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { UploadResult } from '@/lib/firebase-storage';
import { useHeroPopupConfig } from '@/hooks/useHeroPopupConfig';

interface HeroPopupConfig {
  id: string;
  isActive: boolean;
  title: string;
  subtitle: string;
  offerTitle: string;
  offerDescription: string;
  discount: number;
  imageUrl: string;
  autoCloseSeconds: number;
  showDelay: number;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminHeroPopupPage() {
  // Usar el hook de Firebase para la configuración
  const { config, saveConfig, isLoading, error } = useHeroPopupConfig();
  
  const [saveMessage, setSaveMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: keyof HeroPopupConfig, value: string | number | boolean) => {
    // Actualizar el campo específico usando el hook
    saveConfig({ [field]: value });
  };

  const handleImageUpload = (result: UploadResult) => {
    handleInputChange('imageUrl', result.url);
  };

  const handleSave = async () => {
    setSaveMessage('');
    
    try {
      const success = await saveConfig(config);
      
      if (success) {
        setSaveMessage('Configuración del popup guardada exitosamente!');
      } else {
        setSaveMessage('Error al guardar la configuración. Inténtalo de nuevo.');
      }
    } catch (err) {
      setSaveMessage('Error al guardar la configuración. Inténtalo de nuevo.');
    }
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
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
              Configurar Popup del Hero
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Personaliza el popup que aparece al inicio de tu sitio web
          </p>
        </motion.div>

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 border rounded-xl ${
              saveMessage.includes('exitosamente') 
                ? 'bg-green-100 border-green-300 text-green-700'
                : 'bg-red-100 border-red-300 text-red-700'
            }`}
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl"
          >
            Error: {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de Configuración */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Estado del Popup */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-purple-600" />
                Configuración General
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={config.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Popup activo (mostrar a los visitantes)
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiempo de Auto-cierre (segundos)
                    </label>
                    <input
                      type="number"
                      value={config.autoCloseSeconds}
                      onChange={(e) => handleInputChange('autoCloseSeconds', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="5"
                      max="60"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Retraso de Aparición (ms)
                    </label>
                    <input
                      type="number"
                      value={config.showDelay}
                      onChange={(e) => handleInputChange('showDelay', parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      max="10000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contenido del Popup */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                Contenido del Popup
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ilumina tus momentos especiales"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={config.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Descripción del producto o servicio..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de la Oferta
                    </label>
                    <input
                      type="text"
                      value={config.offerTitle}
                      onChange={(e) => handleInputChange('offerTitle', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="¡Descuento del 20%!"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción de la Oferta
                    </label>
                    <input
                      type="text"
                      value={config.offerDescription}
                      onChange={(e) => handleInputChange('offerDescription', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="En tu primera compra"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Porcentaje de Descuento
                  </label>
                  <input
                    type="number"
                    value={config.discount}
                    onChange={(e) => handleInputChange('discount', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="0"
                    max="100"
                    placeholder="20"
                  />
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6">
                Botones de Acción
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Botón Principal</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={config.ctaButton1Text}
                      onChange={(e) => handleInputChange('ctaButton1Text', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Explorar Catálogo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enlace
                    </label>
                    <input
                      type="text"
                      value={config.ctaButton1Link}
                      onChange={(e) => handleInputChange('ctaButton1Link', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="/catalogo"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-gray-700">Botón Secundario</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={config.ctaButton2Text}
                      onChange={(e) => handleInputChange('ctaButton2Text', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Personalizar Ahora"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enlace
                    </label>
                    <input
                      type="text"
                      value={config.ctaButton2Link}
                      onChange={(e) => handleInputChange('ctaButton2Link', e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="/personalizadas"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen del Popup */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                <Upload className="h-5 w-5 mr-2 text-purple-600" />
                Imagen del Popup
              </h2>
              
              <ImageUpload
                folder="hero-popup"
                onUpload={handleImageUpload}
                currentImage={config.imageUrl}
                maxFiles={1}
                className="mb-4"
              />
              <p className="text-xs text-gray-500">
                Recomendado: 600x600px o similar para mejor calidad
              </p>
            </div>
          </motion.div>

          {/* Panel de Vista Previa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">
              <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                Vista Previa
              </h2>
              
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
                  <div className="text-center mb-3">
                    <div className="flex items-center justify-center mb-2">
                      <Sparkles className="h-4 w-4 text-pink-500 mr-1" />
                      <span className="text-pink-600 font-semibold text-xs">¡Oferta Especial!</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">
                      {config.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {config.subtitle}
                    </p>
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-lg mb-3">
                      <p className="text-xs font-semibold">🎉 {config.offerTitle}</p>
                      <p className="text-xs opacity-90">{config.offerDescription}</p>
                    </div>
                  </div>
                  
                  {config.imageUrl && (
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={config.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs py-2 px-3 rounded-lg">
                      {config.ctaButton1Text}
                    </button>
                    <button className="flex-1 border border-pink-300 text-pink-600 text-xs py-2 px-3 rounded-lg">
                      {config.ctaButton2Text}
                    </button>
                  </div>
                </div>
              </div>

              {/* Información de Tiempo */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-xs text-gray-600 mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Configuración de Tiempo</span>
                </div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div>Auto-cierre: {config.autoCloseSeconds}s</div>
                  <div>Retraso: {config.showDelay}ms</div>
                  <div>Estado: {config.isActive ? 'Activo' : 'Inactivo'}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Guardar Configuración
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
