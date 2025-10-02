'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomizationConfig, CustomizationConfig } from '@/hooks/useCustomizationConfig';
import ImageUpload from '@/components/ImageUpload';

export default function PersonalizacionAdminPage() {
  const { config, isLoading, error, saveConfig } = useCustomizationConfig();
  const [formData, setFormData] = useState<CustomizationConfig>(config);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  React.useEffect(() => {
    setFormData(config);
  }, [config]);

  const handleInputChange = (field: keyof CustomizationConfig, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = {
      ...newFeatures[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [
        ...prev.features,
        {
          icon: "Star",
          title: "Nueva característica",
          description: "Descripción de la característica"
        }
      ]
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (result: { url: string }) => {
    handleInputChange('imageUrl', result.url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    const result = await saveConfig(formData);
    
    if (result.success) {
      setSaveMessage('✅ Configuración guardada exitosamente');
    } else {
      setSaveMessage('❌ Error al guardar la configuración');
    }
    
    setIsSaving(false);
    
    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuración de Personalización</h1>
              <p className="text-gray-600 mt-2">Edita la sección &quot;Crea la vela perfecta&quot;</p>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>

          {saveMessage && (
            <div className="mb-6 p-4 rounded-lg bg-white border-l-4 border-pink-500">
              <p className="text-sm font-medium">{saveMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="space-y-6">
              {/* Información General */}
              <Card>
                <CardHeader>
                  <CardTitle>Información General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <Input
                      value={formData.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      placeholder="Personalización Total"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título Principal
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Crea la vela perfecta"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="Descripción de la sección..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto del Botón
                      </label>
                      <Input
                        value={formData.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        placeholder="Personalizar Ahora"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enlace del Botón
                      </label>
                      <Input
                        value={formData.buttonLink}
                        onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                        placeholder="/es/personalizadas"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 flex items-center">
                      {formData.isActive ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                      Sección activa
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Imagen */}
              <Card>
                <CardHeader>
                  <CardTitle>Imagen de la Sección</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    folder="candles"
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={formData.imageUrl}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Características */}
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Características</CardTitle>
                    <Button
                      onClick={addFeature}
                      size="sm"
                      variant="outline"
                      className="border-pink-300 text-pink-600 hover:bg-pink-50"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">
                            Característica {index + 1}
                          </span>
                          <Button
                            onClick={() => removeFeature(index)}
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Icono (Lucide)
                            </label>
                            <Input
                              value={feature.icon}
                              onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                              placeholder="Palette, Heart, Sparkles, etc."
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Título
                            </label>
                            <Input
                              value={feature.title}
                              onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                              placeholder="Título de la característica"
                              className="text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Descripción
                            </label>
                            <textarea
                              value={feature.description}
                              onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                              placeholder="Descripción de la característica"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
