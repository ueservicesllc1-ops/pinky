'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Facebook, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SocialMediaData {
  facebook: string;
  instagram: string;
  twitter: string;
}

interface SocialMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SocialMediaModal({ isOpen, onClose }: SocialMediaModalProps) {
  const [socialData, setSocialData] = useState<SocialMediaData>({
    facebook: '',
    instagram: '',
    twitter: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Cargar datos existentes
  useEffect(() => {
    if (isOpen) {
      loadSocialData();
    }
  }, [isOpen]);

  const loadSocialData = async () => {
    try {
      setIsLoading(true);
      const docRef = doc(db, 'business_config', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSocialData({
          facebook: data.socialMedia?.facebook || '',
          instagram: data.socialMedia?.instagram || '',
          twitter: data.socialMedia?.twitter || ''
        });
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      const docRef = doc(db, 'business_config', 'main');
      const docSnap = await getDoc(docRef);
      
      const existingData = docSnap.exists() ? docSnap.data() : {};
      
      await setDoc(docRef, {
        ...existingData,
        socialMedia: socialData,
        updatedAt: new Date()
      });
      
      setSaveMessage('✅ Redes sociales guardadas exitosamente!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving social data:', error);
      setSaveMessage('❌ Error al guardar las redes sociales');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (platform: keyof SocialMediaData, value: string) => {
    setSocialData(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const socialPlatforms = [
    {
      key: 'facebook' as keyof SocialMediaData,
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      placeholder: 'https://facebook.com/tu-pagina'
    },
    {
      key: 'instagram' as keyof SocialMediaData,
      label: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      placeholder: 'https://instagram.com/tu-perfil'
    },
    {
      key: 'twitter' as keyof SocialMediaData,
      label: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400',
      placeholder: 'https://twitter.com/tu-perfil'
    }
  ];

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
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Redes Sociales</h2>
                  <p className="text-gray-600 mt-1">Configura los enlaces de tus redes sociales</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando...</p>
                  </div>
                ) : (
                  <>
                    {/* Save Message */}
                    {saveMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-xl ${
                          saveMessage.includes('✅') 
                            ? 'bg-green-100 border border-green-300 text-green-700'
                            : 'bg-red-100 border border-red-300 text-red-700'
                        }`}
                      >
                        {saveMessage}
                      </motion.div>
                    )}

                    {/* Form */}
                    <div className="space-y-6">
                      {socialPlatforms.map((platform) => {
                        const IconComponent = platform.icon;
                        return (
                          <div key={platform.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <div className="flex items-center">
                                <IconComponent className={`h-4 w-4 ${platform.color} mr-2`} />
                                {platform.label}
                              </div>
                            </label>
                            <input
                              type="url"
                              value={socialData[platform.key]}
                              onChange={(e) => handleInputChange(platform.key, e.target.value)}
                              placeholder={platform.placeholder}
                              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {/* Preview */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Vista previa:</h4>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Redes sociales en el footer:</span>
                        <div className="flex items-center space-x-3">
                          {socialPlatforms.map((platform) => {
                            const IconComponent = platform.icon;
                            if (socialData[platform.key]) {
                              return (
                                <a
                                  key={platform.key}
                                  href={socialData[platform.key]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`${platform.color} hover:opacity-80 transition-opacity`}
                                >
                                  <IconComponent className="h-5 w-5" />
                                </a>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
