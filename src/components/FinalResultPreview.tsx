'use client';

import { useState } from 'react';
import { Download, Eye, RotateCcw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FinalResultPreviewProps {
  imageUrl: string;
  onDownload: () => void;
  onReset: () => void;
}

export default function FinalResultPreview({ 
  imageUrl, 
  onDownload, 
  onReset 
}: FinalResultPreviewProps) {
  const [showEffects, setShowEffects] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-pink-600 flex items-center justify-center gap-2">
          <Eye className="h-6 w-6" />
          Resultado Final
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Imagen con efectos */}
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Vela personalizada final" 
            className={`w-full max-h-96 object-contain border rounded-lg shadow-lg transition-all duration-500 ${
              showEffects ? 'scale-105 shadow-2xl' : ''
            }`}
            style={{
              filter: showEffects ? 'brightness(1.1) contrast(1.05)' : 'none'
            }}
          />
          
          {/* Overlay de efectos */}
          {showEffects && (
            <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent rounded-lg pointer-events-none" />
          )}
        </div>

        {/* Controles */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={() => setShowEffects(!showEffects)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showEffects ? 'Quitar Efectos' : 'Ver Efectos'}
          </Button>
          
          <Button
            onClick={onDownload}
            className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Descargar
          </Button>
          
          <Button
            onClick={onReset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Nueva Vela
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Compartir
          </Button>
        </div>

        {/* Información del resultado */}
        <div className="text-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p>✨ Tu vela personalizada está lista</p>
          <p className="text-xs mt-1">
            Resolución: 1200x1600px | Formato: PNG | Calidad: Alta
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
