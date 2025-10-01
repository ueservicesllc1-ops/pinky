'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateCandleWithText, CandleGenerationParams } from '@/lib/free-ai-generator';
import { Loader2, Sparkles, Download, RefreshCw } from 'lucide-react';

interface AIGeneratorProps {
  onImageGenerated: (imageUrl: string) => void;
}

export default function AIGenerator({ onImageGenerated }: AIGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationParams, setGenerationParams] = useState<CandleGenerationParams>({
    candleType: 'cylindrical',
    text: '',
    color: 'rosa',
    style: 'luxury, premium, elegant'
  });

  const handleGenerate = async () => {
    if (!generationParams.text.trim()) {
      setError('Por favor escribe un mensaje personalizado');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateCandleWithText(generationParams);
      setGeneratedImage(imageUrl);
      onImageGenerated(imageUrl);
    } catch (err) {
      setError('Error generando la vela. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVariants = async () => {
    if (!generationParams.text.trim()) {
      setError('Por favor escribe un mensaje personalizado');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generar con diferentes estilos
      const styles = [
        'luxury, premium, elegant',
        'modern, minimalist, clean',
        'romantic, soft, warm lighting'
      ];
      
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const params = { ...generationParams, style: randomStyle };
      
      const imageUrl = await generateCandleWithText(params);
      setGeneratedImage(imageUrl);
      onImageGenerated(imageUrl);
    } catch (err) {
      setError('Error generando las variantes. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pinky-flame-ai-candle-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center mb-6">
        <Sparkles className="h-6 w-6 text-purple-500 mr-3" />
        <div>
          <h3 className="text-xl font-light text-gray-900">
            Generador de Velas con IA
          </h3>
          <p className="text-sm text-green-600 font-medium">
            ✨ 100% GRATIS - Código Abierto
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Parámetros de generación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Vela
            </label>
            <select
              value={generationParams.candleType}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                candleType: e.target.value
              })}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="cylindrical">Vela Cilíndrica</option>
              <option value="tapered">Vela Cónica</option>
              <option value="pillar">Vela Columna</option>
              <option value="jar">Vela en Frasco</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <select
              value={generationParams.color}
              onChange={(e) => setGenerationParams({
                ...generationParams,
                color: e.target.value
              })}
              className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="rosa">Rosa</option>
              <option value="blanco">Blanco</option>
              <option value="púrpura">Púrpura</option>
              <option value="crema">Crema</option>
              <option value="negro">Negro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensaje Personalizado
          </label>
          <textarea
            value={generationParams.text}
            onChange={(e) => setGenerationParams({
              ...generationParams,
              text: e.target.value
            })}
            placeholder="Escribe tu mensaje especial..."
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estilo
          </label>
          <select
            value={generationParams.style}
            onChange={(e) => setGenerationParams({
              ...generationParams,
              style: e.target.value
            })}
            className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="luxury, premium, elegant">Lujo y Elegancia</option>
            <option value="modern, minimalist, clean">Moderno y Minimalista</option>
            <option value="romantic, soft, warm lighting">Romántico y Suave</option>
            <option value="dramatic, artistic, moody">Dramático y Artístico</option>
          </select>
        </div>

        {/* Botones de generación */}
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 py-3 px-4 bg-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando con IA...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generar Vela con IA
              </>
            )}
          </button>

          <button
            onClick={handleGenerateVariants}
            disabled={isGenerating}
            className="py-3 px-4 border border-purple-600 text-purple-600 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Variantes
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Imagen generada */}
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6"
          >
            <div className="relative">
              <img
                src={generatedImage}
                alt="Vela generada con IA"
                className="w-full rounded-xl shadow-lg"
              />
              <button
                onClick={downloadImage}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">
              ✨ Vela generada con IA - El texto se ve como si fuera grabado en la cera
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
