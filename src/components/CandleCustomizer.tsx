'use client';

import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Type, 
  Download, 
  Save, 
  RotateCcw, 
  Layers, 
  Move,
  Zap,
  Sparkles,
  Heart,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';

interface CandleTemplate {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
  variants?: Array<{
    id: string;
    name: string;
    image: string;
  }>;
}

const candleTemplates: CandleTemplate[] = [
  {
    id: 'cylindrical',
    name: 'Vela Cilíndrica',
    image: '/velas/vela-cilindrica-rosa.svg',
    width: 200,
    height: 300,
    variants: [
      { id: 'cylindrical-1', name: 'Cilíndrica Rosa', image: '/velas/vela-cilindrica-rosa.svg' },
      { id: 'cylindrical-2', name: 'Cilíndrica Blanca', image: '/velas/vela-cilindrica-blanca.svg' },
      { id: 'cylindrical-3', name: 'Cilíndrica Púrpura', image: '/velas/vela-cilindrica-purple.svg' },
      { id: 'cylindrical-4', name: 'Cilíndrica Dorada', image: '/velas/vela-cilindrica-gold.svg' }
    ]
  },
  {
    id: 'tapered',
    name: 'Vela Cónica',
    image: '/velas/vela-conica-blanca.svg',
    width: 150,
    height: 350,
    variants: [
      { id: 'tapered-1', name: 'Cónica Blanca', image: '/velas/vela-conica-blanca.svg' },
      { id: 'tapered-2', name: 'Cónica Rosa', image: '/velas/vela-conica-rosa.svg' },
      { id: 'tapered-3', name: 'Cónica Azul', image: '/velas/vela-conica-azul.svg' },
      { id: 'tapered-4', name: 'Cónica Verde', image: '/velas/vela-conica-verde.svg' }
    ]
  },
  {
    id: 'pillar',
    name: 'Vela Columna',
    image: '/velas/vela-columna-purple.svg',
    width: 250,
    height: 200,
    variants: [
      { id: 'pillar-1', name: 'Columna Púrpura', image: '/velas/vela-columna-purple.svg' },
      { id: 'pillar-2', name: 'Columna Roja', image: '/velas/vela-columna-roja.svg' },
      { id: 'pillar-3', name: 'Columna Negra', image: '/velas/vela-columna-negra.svg' },
      { id: 'pillar-4', name: 'Columna Dorada', image: '/velas/vela-columna-dorada.svg' }
    ]
  },
  {
    id: 'jar',
    name: 'Vela en Frasco',
    image: '/velas/vela-frasco-crema.svg',
    width: 180,
    height: 220,
    variants: [
      { id: 'jar-1', name: 'Frasco Crema', image: '/velas/vela-frasco-crema.svg' },
      { id: 'jar-2', name: 'Frasco Transparente', image: '/velas/vela-frasco-transparente.svg' },
      { id: 'jar-3', name: 'Frasco Azul', image: '/velas/vela-frasco-azul.svg' },
      { id: 'jar-4', name: 'Frasco Verde', image: '/velas/vela-frasco-verde.svg' }
    ]
  }
];

const candleColors = [
  { name: 'Rosa', value: '#f472b6' },
  { name: 'Púrpura', value: '#a855f7' },
  { name: 'Blanco', value: '#ffffff' },
  { name: 'Crema', value: '#fef3c7' },
  { name: 'Coral', value: '#fb7185' },
  { name: 'Lavanda', value: '#c084fc' },
  { name: 'Dorado', value: '#fbbf24' },
  { name: 'Negro', value: '#374151' }
];

const fonts = [
  { name: 'Elegante', family: 'Playfair Display' },
  { name: 'Moderno', family: 'Inter' },
  { name: 'Clásico', family: 'Times New Roman' },
  { name: 'Cursiva', family: 'Dancing Script' },
  { name: 'Bold', family: 'Montserrat' }
];

export default function CandleCustomizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('cylindrical');
  const [selectedVariant, setSelectedVariant] = useState<string>('cylindrical-1');
  const [showVariantPopup, setShowVariantPopup] = useState<boolean>(false);
  const [currentTemplate, setCurrentTemplate] = useState<CandleTemplate | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('#f472b6');
  const [textContent, setTextContent] = useState<string>('');
  const [selectedFont, setSelectedFont] = useState<string>('Dancing Script');
  const [fontSize, setFontSize] = useState<number>(24);
  const [textColor, setTextColor] = useState<string>('#000000');
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (canvasRef.current) {
      // Inicializar Fabric.js con TODO EL PODER
      fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
        width: 700,
        height: 700,
        backgroundColor: '#ffffff',
        selection: true,
        preserveObjectStacking: true
      });

      setIsCanvasReady(true);
      loadCandleTemplate(selectedTemplate);
    }

    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
      }
    };
  }, []);

  const loadCandleTemplate = (templateId: string) => {
    if (!fabricCanvasRef.current) return;

    const template = candleTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Limpiar canvas
    fabricCanvasRef.current.clear();

    // Cargar imagen real de la vela
    try {
      fabric.Image.fromURL(template.image, (img) => {
        if (!img || !fabricCanvasRef.current) return;

        // Calcular dimensiones para mantener proporción - MÁS GRANDE
        const maxWidth = 600;
        const maxHeight = 700;
        const scaleX = maxWidth / img.width!;
        const scaleY = maxHeight / img.height!;
        const scale = Math.min(scaleX, scaleY);

        // Configurar la imagen de la vela
        img.set({
          left: 350 - (img.width! * scale) / 2,
          top: 350 - (img.height! * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 15,
            offsetX: 8,
            offsetY: 8
          })
        });

        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.renderAll();
      });
    } catch (error) {
      // Si falla la carga de imagen, usar forma geométrica como fallback
      const candle = new fabric.Rect({
        left: 350 - template.width / 2,
        top: 350 - template.height / 2,
        width: template.width,
        height: template.height,
        fill: selectedColor,
        stroke: '#e5e7eb',
        strokeWidth: 2,
        rx: template.id === 'jar' ? 20 : 10,
        ry: template.id === 'jar' ? 20 : 10,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 10,
          offsetX: 5,
          offsetY: 5
        })
      });

      fabricCanvasRef.current.add(candle);
      fabricCanvasRef.current.renderAll();
    }
  };

  const addText = () => {
    if (!fabricCanvasRef.current || !textContent.trim()) return;

    const text = new fabric.Text(textContent, {
      left: 350,
      top: 350,
      fontFamily: selectedFont,
      fontSize: fontSize,
      fill: textColor,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.3)',
        blur: 5,
        offsetX: 2,
        offsetY: 2
      })
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
  };

  const updateCandleColor = (color: string) => {
    if (!fabricCanvasRef.current) return;
    
    setSelectedColor(color);
    const objects = fabricCanvasRef.current.getObjects();
    
    // Buscar overlay de color existente y removerlo
    const existingOverlay = objects.find(obj => 
      obj.type === 'rect' && 
      obj !== objects.find(o => o.type === 'image') &&
      obj !== objects.find(o => o.type === 'text')
    );
    
    if (existingOverlay) {
      fabricCanvasRef.current.remove(existingOverlay);
    }
    
    // Si hay una imagen de vela, crear overlay de color
    const candleImage = objects.find(obj => obj.type === 'image');
    if (candleImage) {
      // Crear overlay de color semi-transparente para simular cambio de color
      const colorOverlay = new fabric.Rect({
        left: candleImage.left,
        top: candleImage.top,
        width: candleImage.width! * candleImage.scaleX!,
        height: candleImage.height! * candleImage.scaleY!,
        fill: color,
        opacity: 0.4,
        selectable: false,
        evented: false,
        blendMode: 'multiply'
      });
      
      fabricCanvasRef.current.add(colorOverlay);
      fabricCanvasRef.current.renderAll();
    } else {
      // Si es forma geométrica, cambiar color directamente
      const candle = objects.find(obj => obj.type === 'rect' && obj !== objects.find(o => o.type === 'text'));
      if (candle) {
        candle.set('fill', color);
        fabricCanvasRef.current.renderAll();
      }
    }
  };

  const exportDesign = () => {
    if (!fabricCanvasRef.current) return;

    const dataURL = fabricCanvasRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });

    const link = document.createElement('a');
    link.download = `pinky-flame-custom-candle-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const resetDesign = () => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.clear();
    loadCandleTemplate(selectedTemplate);
    setTextContent('');
  };

  const handleVariantSelect = (variant: { id: string; name: string; image: string }) => {
    setSelectedVariant(variant.id);
    setSelectedTemplate(currentTemplate?.id || 'cylindrical');
    setShowVariantPopup(false);
    
    // Cargar la variante seleccionada
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.clear();
      fabric.Image.fromURL(variant.image, (img) => {
        if (!img || !fabricCanvasRef.current) return;

        const maxWidth = 600;
        const maxHeight = 700;
        const scaleX = maxWidth / img.width!;
        const scaleY = maxHeight / img.height!;
        const scale = Math.min(scaleX, scaleY);

        img.set({
          left: 350 - (img.width! * scale) / 2,
          top: 350 - (img.height! * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 15,
            offsetX: 8,
            offsetY: 8
          })
        });

        fabricCanvasRef.current.add(img);
        fabricCanvasRef.current.renderAll();
      });
    }
  };

  const addToCart = () => {
    const template = candleTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Crear producto personalizado
    const customProduct = {
      id: `custom-${Date.now()}`,
      name: `Vela Personalizada - ${template.name}`,
      description: `Vela personalizada con texto: "${textContent || 'Diseño personalizado'}"`,
      price: 29.99,
      images: ['/placeholder-custom-candle.jpg'],
      category: 'personalizadas',
      stock: 1,
      isCustomizable: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addItem({
      product: customProduct,
      quantity: 1,
      customizations: {
        candleType: template.name,
        candleColor: selectedColor,
        customText: textContent,
        font: selectedFont,
        fontSize: fontSize,
        textColor: textColor
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 pb-32">
      <div className="container mx-auto px-4">
        {/* Header Elegante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Personaliza tu vela
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Crea una vela única con tu mensaje personalizado. 
            Diseña, personaliza y haz realidad la vela perfecta para cada ocasión.
          </p>
        </motion.div>

        {/* Selector Visual de Velas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-light text-gray-900 mb-3">
              Selecciona tu vela
            </h3>
            <p className="text-sm text-gray-500 font-light">Elige el estilo que mejor se adapte a tu ocasión</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {candleTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 ${
                  selectedTemplate === template.id
                    ? 'shadow-2xl ring-2 ring-gray-900'
                    : 'shadow-lg hover:shadow-xl'
                }`}
                onClick={() => {
                  setCurrentTemplate(template);
                  setShowVariantPopup(true);
                }}
              >
                <div className="aspect-square bg-white flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className={`w-24 h-32 mx-auto mb-4 rounded-lg shadow-md ${
                      template.id === 'cylindrical' ? 'bg-gradient-to-b from-pink-200 to-pink-400' :
                      template.id === 'tapered' ? 'bg-gradient-to-b from-gray-200 to-gray-400' :
                      template.id === 'pillar' ? 'bg-gradient-to-b from-purple-200 to-purple-400' :
                      'bg-gradient-to-b from-amber-200 to-amber-400'
                    }`} />
                    <p className="text-sm font-medium text-gray-700 tracking-wide">{template.name}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Layout Principal: Controles + Canvas + Controles */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Controles Izquierda */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Vela Seleccionada */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide uppercase">
                  Vela Seleccionada
                </h3>
                <div className="text-center">
                  <div className={`w-16 h-20 mx-auto mb-3 rounded-lg ${
                    selectedTemplate === 'cylindrical' ? 'bg-gradient-to-b from-pink-200 to-pink-400' :
                    selectedTemplate === 'tapered' ? 'bg-gradient-to-b from-gray-200 to-gray-400' :
                    selectedTemplate === 'pillar' ? 'bg-gradient-to-b from-purple-200 to-purple-400' :
                    'bg-gradient-to-b from-amber-200 to-amber-400'
                  }`} />
                  <p className="text-sm font-medium text-gray-700">
                    {candleTemplates.find(t => t.id === selectedTemplate)?.name}
                  </p>
                </div>
              </div>

              {/* Colores */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide uppercase">
                  Color
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {candleColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => updateCandleColor(color.value)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                        selectedColor === color.value 
                          ? 'border-gray-900 shadow-lg' 
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Central - Más Sutil */}
            <div className="lg:col-span-6">
              <div className="bg-gray-50 rounded-xl p-4 sticky top-8">
                {/* Título pequeño en esquina */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                    Vista previa
                  </span>
                </div>
                
                {/* Canvas más grande y cuadrado */}
                <div className="flex justify-center pt-4">
                  <div className="aspect-square w-full max-w-2xl mx-auto">
                    <canvas
                      ref={canvasRef}
                      className="rounded-lg bg-white w-full h-full shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Controles Derecha */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Personalización de Texto */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide uppercase">
                  Personalización
                </h3>
                
                <div className="space-y-4">
                  <input
                    placeholder="Tu mensaje personalizado..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    {fonts.map((font) => (
                      <option key={font.family} value={font.family}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                  
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Tamaño</span>
                      <span>{fontSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  
                  <button
                    onClick={addText}
                    disabled={!textContent.trim()}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Agregar Texto
                  </button>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-4 tracking-wide uppercase">
                  Acciones
                </h3>
                
                <div className="space-y-3">
                  <button
                    onClick={resetDesign}
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-50"
                  >
                    Reiniciar Diseño
                  </button>
                  
                  <button
                    onClick={exportDesign}
                    className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-200"
                  >
                    Exportar Imagen
                  </button>
                  
                  <button
                    onClick={addToCart}
                    className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-800"
                  >
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup de Variantes */}
      {showVariantPopup && currentTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-light text-gray-900">
                  Elige tu {currentTemplate.name}
                </h3>
                <button
                  onClick={() => setShowVariantPopup(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-500 mt-2">Selecciona el estilo que prefieres</p>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentTemplate.variants?.map((variant: { id: string; name: string; image: string }) => (
                  <motion.div
                    key={variant.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 ${
                      selectedVariant === variant.id
                        ? 'ring-2 ring-gray-900 shadow-lg'
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleVariantSelect(variant)}
                  >
                    <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className={`w-20 h-24 mx-auto mb-3 rounded-lg shadow-sm ${
                          variant.id.includes('cylindrical') ? 'bg-gradient-to-b from-pink-200 to-pink-400' :
                          variant.id.includes('tapered') ? 'bg-gradient-to-b from-gray-200 to-gray-400' :
                          variant.id.includes('pillar') ? 'bg-gradient-to-b from-purple-200 to-purple-400' :
                          'bg-gradient-to-b from-amber-200 to-amber-400'
                        }`} />
                        <p className="text-xs font-medium text-gray-700">{variant.name}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowVariantPopup(false)}
                className="w-full py-3 px-4 bg-gray-900 text-white rounded-xl text-sm font-medium transition-all duration-300 hover:bg-gray-800"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
