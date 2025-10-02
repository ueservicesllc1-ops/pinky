"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Shape } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import { Heart, Flower2 as Flower, Leaf, Star, Sparkles, Sun, Moon, Crown, Gift, Diamond, Zap } from "lucide-react";

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
  const [textY, setTextY] = useState(250);
  
  // Estados de elementos decorativos
  const [decorativeElements, setDecorativeElements] = useState<Array<{
    id: string;
    type: string;
    x: number;
    y: number;
    size: number;
    color: string;
    rotation: number;
  }>>([]);
  
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

  // Librería de elementos decorativos
  const decorativeLibrary = [
    { type: "heart", icon: Heart, name: "Corazón", category: "Amor" },
    { type: "flower", icon: Flower, name: "Flor", category: "Naturaleza" },
    { type: "leaf", icon: Leaf, name: "Hoja", category: "Naturaleza" },
    { type: "star", icon: Star, name: "Estrella", category: "Celestial" },
    { type: "sparkles", icon: Sparkles, name: "Brillos", category: "Mágico" },
    { type: "sun", icon: Sun, name: "Sol", category: "Celestial" },
    { type: "moon", icon: Moon, name: "Luna", category: "Celestial" },
    { type: "crown", icon: Crown, name: "Corona", category: "Elegante" },
    { type: "gift", icon: Gift, name: "Regalo", category: "Celebración" },
    { type: "diamond", icon: Diamond, name: "Diamante", category: "Elegante" },
    { type: "zap", icon: Zap, name: "Rayo", category: "Energía" },
  ];

  const decorativeCategories = ["Todos", "Amor", "Naturaleza", "Celestial", "Mágico", "Elegante", "Celebración", "Energía"];
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Seleccionar plantilla existente
  const handleTemplateSelect = (template: { imageUrl: string }) => {
    setCurrentImageSrc(template.imageUrl);
  };

  // Resetear a imagen por defecto
  const handleResetImage = () => {
    setCurrentImageSrc("/velas/vela-cilindrica-rosa.jpg");
  };

  // Agregar elemento decorativo
  const addDecorativeElement = (type: string) => {
    const newElement = {
      id: Date.now().toString(),
      type,
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      size: 30,
      color: predefinedColors[Math.floor(Math.random() * predefinedColors.length)],
      rotation: 0,
    };
    setDecorativeElements(prev => [...prev, newElement]);
  };

  // Eliminar elemento decorativo
  const removeDecorativeElement = (id: string) => {
    setDecorativeElements(prev => prev.filter(el => el.id !== id));
  };

  // Limpiar todos los elementos decorativos
  const clearDecorativeElements = () => {
    setDecorativeElements([]);
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

  // Renderizar texto simple y movible
  const renderSimpleText = () => {
    if (!layerRef.current || !text.trim()) return;

    // Limpiar textos anteriores
    const existingTexts = layerRef.current.find('.simple-text');
    existingTexts.forEach((node: Konva.Node) => node.destroy());

    // Crear texto simple y movible
    const textNode = new Konva.Text({
      x: canvasWidth / 2,
      y: textY,
      text: text,
      fontSize: fontSize,
      fontFamily: fontFamily,
      fill: fontColor,
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: fontSize / 2,
      name: 'simple-text',
      draggable: true, // Hacer el texto arrastrable
      width: canvasWidth - 40, // Ancho máximo con margen
    });

    // Centrar el texto horizontalmente
    textNode.offsetX(textNode.width() / 2);

    // Agregar eventos para mantener el texto dentro del canvas
    textNode.on('dragmove', function() {
      const box = this.getClientRect();
      
      // Limitar movimiento horizontal
      if (box.x < 0) {
        this.x(this.width() / 2);
      }
      if (box.x + box.width > canvasWidth) {
        this.x(canvasWidth - this.width() / 2);
      }
      
      // Limitar movimiento vertical
      if (box.y < 0) {
        this.y(this.height() / 2);
      }
      if (box.y + box.height > canvasHeight) {
        this.y(canvasHeight - this.height() / 2);
      }
    });

    // Cambiar cursor al pasar por encima
    textNode.on('mouseenter', function() {
      document.body.style.cursor = 'move';
    });

    textNode.on('mouseleave', function() {
      document.body.style.cursor = 'default';
    });

    layerRef.current?.add(textNode);
    layerRef.current?.batchDraw();
  };

  // Renderizar elementos decorativos
  const renderDecorativeElements = () => {
    if (!layerRef.current) return;

    // Limpiar elementos anteriores
    const existingElements = layerRef.current.find('.decorative-element');
    existingElements.forEach((node: Konva.Node) => node.destroy());

    // Crear elementos decorativos
    decorativeElements.forEach((element) => {
      // Crear formas simples usando Konva
      let shape;
      
      switch (element.type) {
        case 'heart':
          shape = new Konva.Path({
            x: element.x,
            y: element.y,
            data: 'M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z',
            fill: element.color,
            scaleX: element.size / 24,
            scaleY: element.size / 24,
            offsetX: 12,
            offsetY: 12,
            rotation: element.rotation,
            draggable: true,
            name: 'decorative-element',
          });
          break;
        case 'star':
          shape = new Konva.Star({
            x: element.x,
            y: element.y,
            numPoints: 5,
            innerRadius: element.size * 0.4,
            outerRadius: element.size,
            fill: element.color,
            rotation: element.rotation,
            draggable: true,
            name: 'decorative-element',
          });
          break;
        case 'flower':
          shape = new Konva.Circle({
            x: element.x,
            y: element.y,
            radius: element.size / 2,
            fill: element.color,
            rotation: element.rotation,
            draggable: true,
            name: 'decorative-element',
          });
          break;
        default:
          // Forma por defecto (círculo)
          shape = new Konva.Circle({
            x: element.x,
            y: element.y,
            radius: element.size / 2,
            fill: element.color,
            rotation: element.rotation,
            draggable: true,
            name: 'decorative-element',
          });
      }

      if (shape) {
        // Agregar eventos de interacción
        shape.on('dragmove', function() {
          const box = this.getClientRect();
          
          // Limitar movimiento dentro del canvas
          if (box.x < 0) this.x(this.radius ? this.radius() : element.size / 2);
          if (box.x + box.width > canvasWidth) this.x(canvasWidth - (this.radius ? this.radius() : element.size / 2));
          if (box.y < 0) this.y(this.radius ? this.radius() : element.size / 2);
          if (box.y + box.height > canvasHeight) this.y(canvasHeight - (this.radius ? this.radius() : element.size / 2));
        });

        shape.on('mouseenter', function() {
          document.body.style.cursor = 'move';
        });

        shape.on('mouseleave', function() {
          document.body.style.cursor = 'default';
        });

        // Doble click para eliminar
        shape.on('dblclick', function() {
          removeDecorativeElement(element.id);
        });

        layerRef.current?.add(shape);
      }
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
        renderSimpleText();
        renderDecorativeElements();
        addLightOverlay();
      }, 100);
    }
  }, [text, fontSize, fontColor, fontFamily, textY, image, decorativeElements]);

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


            {/* Elementos Decorativos - TEMPORALMENTE OCULTO */}
            {false && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Elementos Decorativos
                  </label>
                  {decorativeElements.length > 0 && (
                    <button
                      onClick={clearDecorativeElements}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Limpiar todo
                    </button>
                  )}
                </div>

                {/* Categorías */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {decorativeCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-2 py-1 text-xs rounded-full transition-colors ${
                        selectedCategory === category
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Librería de elementos */}
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {decorativeLibrary
                    .filter(item => selectedCategory === "Todos" || item.category === selectedCategory)
                    .map((item) => (
                      <button
                        key={item.type}
                        onClick={() => addDecorativeElement(item.type)}
                        className="p-2 border border-gray-200 rounded-lg hover:border-pink-300 hover:bg-pink-50 transition-colors group"
                        title={item.name}
                      >
                        <item.icon className="h-6 w-6 mx-auto text-gray-600 group-hover:text-pink-600" />
                        <p className="text-xs text-gray-500 mt-1">{item.name}</p>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Instrucciones */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                💡 <strong>Tip:</strong> Puedes arrastrar el texto directamente en la vista previa para posicionarlo donde quieras.
              </p>
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
                      fontColor === color ? 'border-pink-500 scale-110' : 'border-gray-300'
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
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
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
                      {image && (() => {
                        // Calcular escala para mantener proporción
                        const scale = Math.min(canvasWidth / image.width, canvasHeight / image.height);
                        const scaledWidth = image.width * scale;
                        const scaledHeight = image.height * scale;
                        
                        // Centrar la imagen
                        const x = (canvasWidth - scaledWidth) / 2;
                        const y = (canvasHeight - scaledHeight) / 2;
                        
                        return (
                          <KonvaImage
                            image={image}
                            x={x}
                            y={y}
                            width={scaledWidth}
                            height={scaledHeight}
                            listening={false}
                          />
                        );
                      })()}
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Cargando plantillas...</p>
                </div>
              ) : templates.length > 0 ? (
                templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageSrc === template.imageUrl
                        ? 'border-pink-500 scale-105'
                        : 'border-gray-200 hover:border-pink-300'
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
              className="w-full mt-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white px-3 py-2 rounded-md text-sm hover:from-pink-500 hover:to-purple-600 transition-colors"
            >
              Resetear Imagen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
