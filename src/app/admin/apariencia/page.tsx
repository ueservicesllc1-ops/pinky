'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, Monitor, Moon, Sun, Crown } from 'lucide-react';
import { useAppearanceConfig, ColorScheme } from '@/hooks/useAppearanceConfig';
import SuccessModal from '@/components/SuccessModal';

const modeIcons = {
  light: Sun,
  dark: Moon,
  elegant: Crown
};

const modeLabels = {
  light: 'Claro',
  dark: 'Oscuro',
  elegant: 'Elegante'
};

const modeDescriptions = {
  light: 'Colores vibrantes y brillantes',
  dark: 'Tema oscuro para reducir fatiga visual',
  elegant: 'Diseño sofisticado con colores premium'
};

export default function AparienciaPage() {
  const { config, colorSchemes, isLoading, saveConfig } = useAppearanceConfig();
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme | null>(config?.colorScheme || null);
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark' | 'elegant'>(config?.mode || 'light');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSave = async () => {
    if (!selectedScheme) return;
    
    setIsSaving(true);
    
    try {
      const newConfig = {
        colorScheme: selectedScheme,
        mode: selectedMode,
        customColors: config?.customColors
      };
      
      const result = await saveConfig(newConfig);
      
      if (result.success) {
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
      }
    } catch (error) {
      console.error('Error saving appearance config:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSchemeSelect = (scheme: ColorScheme) => {
    setSelectedScheme(scheme);
  };

  const handleModeSelect = (mode: 'light' | 'dark' | 'elegant') => {
    setSelectedMode(mode);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personalizar Apariencia</h1>
                <p className="text-gray-600 dark:text-gray-400">Configura los colores y el estilo de tu web</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Combinaciones de Colores */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Combinaciones de Colores
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {colorSchemes.map((scheme) => (
                <motion.div
                  key={scheme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSchemeSelect(scheme)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedScheme?.id === scheme.id
                      ? 'border-pink-500 ring-2 ring-pink-200 dark:ring-pink-800'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  {/* Preview Gradient */}
                  <div 
                    className="w-full h-20 rounded-md mb-3"
                    style={{ background: scheme.preview.gradient }}
                  />
                  
                  {/* Color Swatches */}
                  <div className="flex space-x-2 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: scheme.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: scheme.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600"
                      style={{ backgroundColor: scheme.accent }}
                    />
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {scheme.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {scheme.preview.description}
                  </p>
                  
                  {selectedScheme?.id === scheme.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Modos de Visualización */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Monitor className="h-5 w-5 mr-2" />
              Modo de Visualización
            </h2>
            
            <div className="space-y-4">
              {(['light', 'dark', 'elegant'] as const).map((mode) => {
                const Icon = modeIcons[mode];
                return (
                  <motion.div
                    key={mode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleModeSelect(mode)}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMode === mode
                        ? 'border-pink-500 ring-2 ring-pink-200 dark:ring-pink-800'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        mode === 'light' ? 'bg-yellow-100 text-yellow-600' :
                        mode === 'dark' ? 'bg-gray-700 text-gray-300' :
                        'bg-gradient-to-r from-gray-800 to-gray-900 text-yellow-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {modeLabels[mode]}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {modeDescriptions[mode]}
                        </p>
                      </div>
                      
                      {selectedMode === mode && (
                        <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Vista Previa */}
        {selectedScheme && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Vista Previa
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card Preview */}
              <div 
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: selectedScheme.surface,
                  borderColor: selectedScheme.border,
                  color: selectedScheme.text
                }}
              >
                <div 
                  className="w-full h-32 rounded-md mb-4"
                  style={{ background: selectedScheme.preview.gradient }}
                />
                <h3 
                  className="font-semibold mb-2"
                  style={{ color: selectedScheme.text }}
                >
                  Título de Ejemplo
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: selectedScheme.textSecondary }}
                >
                  Este es un texto de ejemplo para mostrar cómo se verá la combinación de colores.
                </p>
                <button 
                  className="mt-4 px-4 py-2 rounded-md text-white font-medium"
                  style={{ backgroundColor: selectedScheme.primary }}
                >
                  Botón Primario
                </button>
              </div>

              {/* Color Palette */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Paleta de Colores</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: selectedScheme.primary }}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Primario</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: selectedScheme.secondary }}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Secundario</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: selectedScheme.accent }}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Acento</p>
                  </div>
                  <div className="space-y-2">
                    <div 
                      className="w-full h-12 rounded-md border"
                      style={{ backgroundColor: selectedScheme.surface }}
                    />
                    <p className="text-xs text-gray-600 dark:text-gray-400">Superficie</p>
                  </div>
                </div>
              </div>

              {/* Mode Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Configuración Actual</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Esquema:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedScheme.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Modo:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {modeLabels[selectedMode]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isSaving || !selectedScheme}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSaving ? 'Guardando...' : 'Guardar Configuración'}
          </motion.button>
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="¡Apariencia actualizada exitosamente!"
        />
      </div>
    </div>
  );
}
