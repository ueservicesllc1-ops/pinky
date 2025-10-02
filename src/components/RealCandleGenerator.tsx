'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { addTextToCandle, CandleInpaintingParams } from '@/lib/candle-inpainting';
import { Loader2, Sparkles, Download, Upload } from 'lucide-react';

interface CandlePhoto {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
}

export default function RealCandleGenerator() {
  const [candlePhotos, setCandlePhotos] = useState<CandlePhoto[]>([]);
  const [selectedCandle, setSelectedCandle] = useState<CandlePhoto | null>(null);
  const [customText, setCustomText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [textStyle, setTextStyle] = useState<'elegant' | 'modern' | 'classic' | 'bold'>('elegant');

  // Cargar fotos de velas (en producción, esto vendría de Firebase)
  useEffect(() => {
    // Simular carga de fotos de velas
    const mockCandles: CandlePhoto[] = [
      {
        id: '1',
        name: 'Vela Cilíndrica Rosa',
        type: 'cylindrical',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center'
      },
      {
        id: '2',
        name: 'Vela Cónica Blanca',
        type: 'tapered',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop&crop=center'
      },
      {
        id: '3',
        name: 'Vela Columna Púrpura',
        type: 'pillar',
        imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop&crop=center'
      },
      {
        id: '4',
        name: 'Vela en Frasco',
        type: 'jar',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop&crop=center'
      }
    ];
    
    setCandlePhotos(mockCandles);
  }, []);

  const handleGenerate = async () => {
    if (!selectedCandle || !customText.trim()) {
      setError('Por favor selecciona una vela y escribe tu mensaje');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const params: CandleInpaintingParams = {
        candleImageUrl: selectedCandle.imageUrl,
        text: customText,
        fontStyle: textStyle,
        textPosition: 'center'
      };

      const result = await addTextToCandle(params);
      setGeneratedImage(result);
    } catch (err) {
      setError('Error personalizando la vela. Inténtalo de nuevo.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pinky-flame-personalizada-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Panel de Control */}
        <div className="space-y-6">
          
          {/* Selección de Vela */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              1. Selecciona tu vela
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {candlePhotos.map((candle) => (
                <motion.div
                  key={candle.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                    selectedCandle?.id === candle.id
                      ? 'ring-2 ring-purple-500 shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCandle(candle)}
                >
                  <div className="aspect-square relative">
                    <img
                      src={candle.imageUrl}
                      alt={candle.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedCandle?.id === candle.id && (
                      <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                        <div className="bg-purple-500 text-white rounded-full p-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-center py-2 font-medium text-gray-700">
                    {candle.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Personalización de Texto */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              2. Personaliza tu mensaje
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu mensaje personalizado
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Escribe tu mensaje especial..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo del texto
                </label>
                <select
                  value={textStyle}
                  onChange={(e) => setTextStyle(e.target.value as 'elegant' | 'modern' | 'classic' | 'playful')}
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="elegant">Elegante y Cursiva</option>
                  <option value="modern">Moderno y Limpio</option>
                  <option value="classic">Clásico y Tradicional</option>
                  <option value="bold">Bold y Impactante</option>
                </select>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedCandle || !customText.trim()}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Procesando con IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Personalizar con IA
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Vista Previa */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vista previa
          </h3>
          
          <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
            {generatedImage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full"
              >
                <img
                  src={generatedImage}
                  alt="Vela personalizada"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={downloadImage}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="h-4 w-4 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm font-medium bg-black/50 rounded-lg px-3 py-2">
                    ✨ Personalizada con IA
                  </p>
                </div>
              </motion.div>
            ) : selectedCandle ? (
              <div className="text-center">
                <img
                  src={selectedCandle.imageUrl}
                  alt={selectedCandle.name}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center">
                  <p className="text-white text-sm font-medium">
                    Tu vela aparecerá personalizada aquí
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Upload className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Selecciona una vela para comenzar</p>
              </div>
            )}
          </div>
          
          {selectedCandle && customText && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Vela:</strong> {selectedCandle.name}
              </p>
              <p className="text-sm text-purple-800">
                <strong>Mensaje:</strong> &quot;{customText}&quot;
              </p>
              <p className="text-sm text-purple-800">
                <strong>Estilo:</strong> {textStyle}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
