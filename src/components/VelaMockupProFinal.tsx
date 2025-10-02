"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";

interface VelaMockupProFinalProps {
  src?: string;
}

export default function VelaMockupProFinal({ src: initialSrc }: VelaMockupProFinalProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  
  // Estados de imagen
  const [currentImageSrc, setCurrentImageSrc] = useState(initialSrc || "/velas/vela-cilindrica-rosa.jpg");
  const [image] = useImage(currentImageSrc);
  
  // Estados de texto
  const [text, setText] = useState("Tu mensaje aquí");
  const [fontSize, setFontSize] = useState(35);
  const [fontColor, setFontColor] = useState("#d4af37");
  const [fontFamily, setFontFamily] = useState("Arial");
  const textCurve = 0.12; // Curvatura fija optimizada
  const [textY, setTextY] = useState(250);
  const [shadowIntensity, setShadowIntensity] = useState(0.7);
  
  // Cargar plantillas desde Firebase
  const { templates, isLoading: templatesLoading } = useCandleTemplates();

  const canvasWidth = 500;
  const canvasHeight = 600;

  // Colores predefinidos profesionales
  const predefinedColors = [
    "#d4af37", // Dorado elegante
    "#c0c0c0", // Plateado
    "#8b4513", // Marrón cálido
    "#000000", // Negro clásico
    "#ffffff", // Blanco puro
    "#8B0000", // Rojo oscuro
    "#2F4F4F", // Gris pizarra
    "#4B0082", // Índigo
  ];

  // Fuentes disponibles
  const fonts = [
    "Arial", "Georgia", "Times New Roman", "Helvetica", 
    "Verdana", "Trebuchet MS", "Impact", "Courier New"
  ];

  // Seleccionar plantilla existente
  const handleTemplateSelect = (template: any) => {
    setCurrentImageSrc(template.imageUrl);
  };

  // Resetear a imagen por defecto
  const handleResetImage = () => {
    setCurrentImageSrc("/velas/vela-cilindrica-rosa.jpg");
  };

  const handleExport = () => {
    if (!stageRef.current) return;
    
    // Exportar en alta calidad
    const dataURL = stageRef.current.toDataURL({ 
      pixelRatio: 3, // 3x resolución para calidad profesional
      quality: 1.0,
      mimeType: 'image/png'
    });
    
    const link = document.createElement("a");
    link.download = `vela-mockup-profesional-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  // Renderizar texto curvado con efectos profesionales
  const renderCurvedText = () => {
    if (!layerRef.current || !text.trim()) return;

    // Limpiar textos anteriores
    const existingTexts = layerRef.current.find('.curved-text');
    existingTexts.forEach((node: any) => node.destroy());

    const centerX = canvasWidth / 2;
    const centerY = textY;
    const radius = 120;
    const chars = text.split("");
    const totalAngle = chars.length * textCurve;
    const startAngle = -totalAngle / 2;

    chars.forEach((char, i) => {
      const angle = startAngle + (i * textCurve);
      const x = centerX + radius * Math.sin(angle);
      const y = centerY - radius * (1 - Math.cos(angle)) * 0.3;

      // Texto principal con efectos de relieve
      const textNode = new Konva.Text({
        x: x,
        y: y,
        text: char,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: fontColor,
        align: 'center',
        verticalAlign: 'middle',
        rotation: angle * (180 / Math.PI),
        offsetX: fontSize / 4,
        offsetY: fontSize / 2,
        name: 'curved-text',
        // Efectos de sombra para relieve
        shadowColor: 'rgba(0,0,0,' + shadowIntensity + ')',
        shadowBlur: 8,
        shadowOffset: { x: 2, y: 2 },
        shadowOpacity: 0.8,
      });

      // Efecto de relieve adicional (texto más claro detrás)
      const reliefText = new Konva.Text({
        x: x - 1,
        y: y - 1,
        text: char,
        fontSize: fontSize,
        fontFamily: fontFamily,
        fill: 'rgba(255,255,255,0.3)',
        align: 'center',
        verticalAlign: 'middle',
        rotation: angle * (180 / Math.PI),
        offsetX: fontSize / 4,
        offsetY: fontSize / 2,
        name: 'curved-text',
      });

      layerRef.current?.add(reliefText);
      layerRef.current?.add(textNode);
    });

    layerRef.current?.batchDraw();
  };

  // Agregar overlay de luz realista
  const addLightOverlay = () => {
    if (!layerRef.current) return;

    // Remover overlay anterior
    const existingOverlay = layerRef.current.findOne('.light-overlay');
    if (existingOverlay) existingOverlay.destroy();

    // Crear gradiente de luz
    const lightOverlay = new Konva.Ellipse({
      x: canvasWidth / 2,
      y: canvasHeight / 2 - 50,
      radiusX: canvasWidth / 2.5,
      radiusY: 40,
      fill: 'rgba(255,255,255,0.1)',
      name: 'light-overlay',
    });

    layerRef.current.add(lightOverlay);
    lightOverlay.moveToTop();
  };

  useEffect(() => {
    if (image && layerRef.current) {
      setTimeout(() => {
        renderCurvedText();
        addLightOverlay();
      }, 100);
    }
  }, [text, fontSize, fontColor, fontFamily, textCurve, textY, shadowIntensity, image]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Personaliza tu vela
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de Controles */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Controles</h2>

            {/* Texto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Personalizado
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {/* Fuente */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuente
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            {/* Tamaño */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {fontSize}px
              </label>
              <input
                type="range"
                min={20}
                max={80}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>


            {/* Posición Vertical */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición Vertical
              </label>
              <input
                type="range"
                min={150}
                max={450}
                value={textY}
                onChange={(e) => setTextY(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Intensidad de Sombra */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Relieve: {Math.round(shadowIntensity * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={1.0}
                step={0.1}
                value={shadowIntensity}
                onChange={(e) => setShadowIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Colores Predefinidos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colores Profesionales
              </label>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFontColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      fontColor === color ? 'border-blue-500 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Selector de Color Personalizado */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Personalizado
              </label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-full h-12 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Botón de Exportar */}
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
            >
              Descargar Imagen
            </button>
          </div>

          {/* Canvas de Mockup */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <Stage width={canvasWidth} height={canvasHeight} ref={stageRef}>
                    <Layer ref={layerRef}>
                      {image && (
                        <KonvaImage
                          image={image}
                          width={canvasWidth}
                          height={canvasHeight}
                          listening={false}
                        />
                      )}
                    </Layer>
                  </Stage>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de Plantillas */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Plantillas</h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {templatesLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando plantillas...</p>
                </div>
              ) : templates.length > 0 ? (
                templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageSrc === template.imageUrl
                        ? 'border-purple-500 scale-105'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs font-medium text-gray-700">
                        {template.name || 'Plantilla'}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No hay plantillas disponibles</p>
                </div>
              )}
            </div>

            <button
              onClick={handleResetImage}
              className="w-full mt-4 bg-gray-500 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors"
            >
              Resetear Imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
