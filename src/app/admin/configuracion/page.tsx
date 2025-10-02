'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Save, MapPin, Phone, Mail, Clock, Globe, Facebook, Instagram, Twitter } from 'lucide-react';

interface BusinessInfo {
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  shippingInfo: {
    freeShippingThreshold: number;
    estimatedDelivery: string;
  };
}

export default function AdminConfigPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: 'Pinky Flame',
    businessDescription: 'Somos una empresa creada en New Jersey, dedicada a hacer velas aromáticas, decorativas y personalizadas para cada cliente, cada momento y cada ocasión especial.',
    email: 'info@pinkyflame.com',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'Newark',
    state: 'New Jersey',
    zipCode: '07102',
    country: 'Estados Unidos',
    businessHours: 'Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 10:00 AM - 4:00 PM',
    website: 'https://pinkyflame.com',
    socialMedia: {
      facebook: 'https://facebook.com/pinkyflame',
      instagram: 'https://instagram.com/pinkyflame',
      twitter: 'https://twitter.com/pinkyflame'
    },
    shippingInfo: {
      freeShippingThreshold: 50,
      estimatedDelivery: '5-7 días hábiles'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos guardados al montar el componente
  useEffect(() => {
    const savedConfig = localStorage.getItem('pinky-flame-business-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setBusinessInfo(parsedConfig);
        console.log('✅ Loaded saved business config:', parsedConfig);
      } catch (error) {
        console.error('❌ Error loading saved config:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBusinessInfo(prev => ({
        ...prev,
        [parent]: {
          ...((prev as unknown) as Record<string, unknown>)[parent] as Record<string, unknown>,
          [child]: value
        }
      }));
    } else {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Guardar en localStorage primero
      localStorage.setItem('pinky-flame-business-config', JSON.stringify(businessInfo));
      
      // Simular guardado en Firebase (en producción, aquí harías la llamada real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Información guardada exitosamente!');
      console.log('✅ Business config saved:', businessInfo);
    } catch (error) {
      console.error('❌ Error saving business config:', error);
      setSaveMessage('Error al guardar la información');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
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
              Configuración de la Empresa
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Gestiona la información de contacto y datos de tu negocio
          </p>
        </motion.div>

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl"
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            Información de la Empresa
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Empresa *
              </label>
              <input
                type="text"
                value={businessInfo.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción de la Empresa
              </label>
              <textarea
                value={businessInfo.businessDescription}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                placeholder="Describe tu negocio..."
              />
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
            <Phone className="h-5 w-5 mr-2 text-purple-600" />
            Información de Contacto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="h-4 w-4 inline mr-1" />
                Email Principal *
              </label>
              <input
                type="email"
                value={businessInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-1" />
                Teléfono Principal *
              </label>
              <input
                type="tel"
                value={businessInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={businessInfo.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="h-4 w-4 inline mr-1" />
                Sitio Web
              </label>
              <input
                type="url"
                value={businessInfo.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://tu-sitio.com"
              />
            </div>
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-600" />
            Dirección y Ubicación
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                value={businessInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad *
              </label>
              <input
                type="text"
                value={businessInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado/Provincia *
              </label>
              <input
                type="text"
                value={businessInfo.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código Postal *
              </label>
              <input
                type="text"
                value={businessInfo.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                País *
              </label>
              <input
                type="text"
                value={businessInfo.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>
        </motion.div>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Horarios de Atención
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horarios de Atención
            </label>
            <textarea
              value={businessInfo.businessHours}
              onChange={(e) => handleInputChange('businessHours', e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={2}
              placeholder="Ej: Lunes a Viernes: 9:00 AM - 6:00 PM"
            />
          </div>
        </motion.div>

        {/* Social Media */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6 flex items-center">
            <Facebook className="h-5 w-5 mr-2 text-purple-600" />
            Redes Sociales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Facebook className="h-4 w-4 inline mr-1" />
                Facebook
              </label>
              <input
                type="url"
                value={businessInfo.socialMedia.facebook}
                onChange={(e) => handleInputChange('socialMedia.facebook', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://facebook.com/tu-pagina"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Instagram className="h-4 w-4 inline mr-1" />
                Instagram
              </label>
              <input
                type="url"
                value={businessInfo.socialMedia.instagram}
                onChange={(e) => handleInputChange('socialMedia.instagram', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Twitter className="h-4 w-4 inline mr-1" />
                Twitter
              </label>
              <input
                type="url"
                value={businessInfo.socialMedia.twitter}
                onChange={(e) => handleInputChange('socialMedia.twitter', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://twitter.com/tu-usuario"
              />
            </div>
          </div>
        </motion.div>

        {/* Shipping Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6">
            Información de Envíos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Envío Gratis (mínimo)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={businessInfo.shippingInfo.freeShippingThreshold}
                  onChange={(e) => handleInputChange('shippingInfo.freeShippingThreshold', parseFloat(e.target.value))}
                  className="w-full pl-8 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Los pedidos superiores a esta cantidad tendrán envío gratis
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Entrega Estimado
              </label>
              <input
                type="text"
                value={businessInfo.shippingInfo.estimatedDelivery}
                onChange={(e) => handleInputChange('shippingInfo.estimatedDelivery', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="5-7 días hábiles"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tiempo estimado de entrega para mostrar a los clientes
              </p>
            </div>
          </div>
          
          {/* API Information */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Cálculo de Envío Dinámico
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Los costos de envío se calculan automáticamente usando una API externa basada en la dirección de destino. 
                  Solo configura el umbral para envío gratis y el tiempo estimado de entrega.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-center"
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {isSaving ? (
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
