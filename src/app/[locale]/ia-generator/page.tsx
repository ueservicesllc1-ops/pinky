'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import RealCandleGenerator from '@/components/RealCandleGenerator';

export default function IAGeneratorPage() {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Generador de Velas con IA
          </h1>
          
          <div className="mb-4">
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              ✨ 100% GRATIS - Código Abierto
            </span>
          </div>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Crea velas únicas con texto personalizado usando inteligencia artificial GRATIS. 
            El texto se verá como si fuera grabado naturalmente en la cera.
          </p>
        </motion.div>

        {/* Generador de Velas con IA */}
        <RealCandleGenerator />

        {/* Información sobre la IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-light text-gray-900 mb-6 text-center">
              ¿Cómo funciona la IA?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Describe tu vela</h3>
                <p className="text-sm text-gray-600">
                  Selecciona el tipo, color y escribe tu mensaje personalizado
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">IA genera la imagen</h3>
                <p className="text-sm text-gray-600">
                  Stable Diffusion crea una vela realista con texto grabado naturalmente
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Descarga y usa</h3>
                <p className="text-sm text-gray-600">
                  Obtén tu imagen única lista para usar en redes sociales o imprimir
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
