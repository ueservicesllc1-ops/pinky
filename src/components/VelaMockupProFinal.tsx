"use client";

import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Text, Shape } from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import { Rnd } from "react-rnd";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import { useCustomFonts } from "@/hooks/useCustomFonts";
import { getProxyImageUrl } from "@/lib/image-proxy";
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Heart, Flower2 as Flower, Leaf, Star, Sparkles, Sun, Moon, Crown, Gift, Diamond, Zap, Image as ImageIcon } from "lucide-react";
import DraggableText from './DraggableText';
import DraggableImage from './DraggableImage';
import SimpleImageUploadModal from './SimpleImageUploadModal';
import CustomCandleOrderModal from './CustomCandleOrderModal';

interface VelaMockupProFinalProps {
  src?: string;
}

export default function VelaMockupProFinal({ src: initialSrc }: VelaMockupProFinalProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  
  // Hook para fuentes personalizadas
  const { customFonts, loading: fontsLoading } = useCustomFonts();
  
  // Estados de imagen
  const [currentImageSrc, setCurrentImageSrc] = useState(initialSrc || "/velas/vela-cilindrica-rosa.jpg");
  // Usar proxy para evitar problemas de CORS con Firebase Storage
  const proxyImageSrc = getProxyImageUrl(currentImageSrc);
  const [image] = useImage(proxyImageSrc, 'anonymous');
  
  // Estados para imágenes subidas por el usuario (solo URLs locales)
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    url: string;
    x: number;
    y: number;
    width: number;
    height: number;
    zIndex: number;
  }>>([]);
  const [uploadedImageObjects, setUploadedImageObjects] = useState<{[key: string]: HTMLImageElement}>({});
  
  // Estados de texto
  const [text, setText] = useState("Tu mensaje aquí");
  const [fontSize, setFontSize] = useState(28);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textY, setTextY] = useState(250);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 250 });
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [textZIndex, setTextZIndex] = useState(1000);
  const [nextZIndex, setNextZIndex] = useState(1001);
  
  // Función para manejar el cambio de posición del texto
  const handleTextPositionChange = (x: number, y: number) => {
    setTextPosition({ x, y });
    setTextY(y);
  };

  // Función para manejar la subida de imágenes (URLs locales)
  const handleImageUploaded = (imageFile: File) => {
    const imageUrl = URL.createObjectURL(imageFile);
    const imageId = `local_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newImage = {
      id: imageId,
      url: imageUrl,
      x: canvasWidth / 2 - 50, // Centrar inicialmente
      y: canvasHeight / 2 - 50,
      width: 100,
      height: 100,
      zIndex: nextZIndex
    };
    setUploadedImages(prev => [...prev, newImage]);
    setNextZIndex(prev => prev + 1);
  };


  // Función para actualizar la posición de una imagen
  const handleImagePositionChange = (imageId: string, x: number, y: number, width: number, height: number) => {
    setUploadedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, x, y, width, height } : img
    ));
  };

  // Función para eliminar una imagen
  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Funciones para controlar el orden de las capas
  const bringTextToFront = () => {
    // Calcular el z-index más alto de las imágenes y agregar 1
    const maxImageZIndex = uploadedImages.length > 0 
      ? Math.max(...uploadedImages.map(img => img.zIndex)) 
      : 0;
    const newTextZIndex = Math.max(maxImageZIndex + 1, 1000);
    setTextZIndex(newTextZIndex);
    setNextZIndex(newTextZIndex + 1);
  };

  const bringImageToFront = (imageId: string) => {
    setUploadedImages(prev => prev.map(img => 
      img.id === imageId ? { ...img, zIndex: nextZIndex } : img
    ));
    setNextZIndex(prev => prev + 1);
  };
  
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

  // Centrar el texto inicialmente cuando se carga el componente
  useEffect(() => {
    // Posicionar el texto exactamente en el centro del contenedor (donde está el punto negro)
    const centerX = canvasWidth / 2; // Centro exacto X
    const centerY = canvasHeight / 2; // Centro exacto Y
    setTextPosition({ x: centerX, y: centerY });
    setTextY(centerY);
  }, []);

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

  // Fuentes disponibles (sistema + personalizadas)
  const systemFonts = [
    "Arial", "Georgia", "Times New Roman", "Impact",
    "Brush Script MT", "Lucida Handwriting", "Comic Sans MS",
    "Papyrus", "Chalkduster", "Marker Felt", "Bradley Hand",
    "Snell Roundhand", "Apple Chancery", "Zapfino", "Optima",
    "Palatino", "Garamond", "Baskerville", "Didot",
    "Futura", "Century Gothic", "Tahoma", "Geneva"
  ];

  // Combinar fuentes del sistema con fuentes personalizadas
  const fonts = [
    ...systemFonts,
    ...customFonts.map(font => font.name)
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

  // Cargar fuentes personalizadas dinámicamente
  useEffect(() => {
    customFonts.forEach(font => {
      // Verificar si la fuente ya está cargada
      if (!document.querySelector(`link[href="${font.downloadURL}"]`)) {
        const fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = font.downloadURL;
        fontLink.type = 'font/woff2';
        document.head.appendChild(fontLink);

        // También crear @font-face CSS
        const style = document.createElement('style');
        style.textContent = `
          @font-face {
            font-family: '${font.name}';
            src: url('${font.downloadURL}');
            font-display: swap;
          }
        `;
        document.head.appendChild(style);
      }
    });
  }, [customFonts]);

  // Cargar imágenes blob como objetos HTMLImageElement
  useEffect(() => {
    uploadedImages.forEach(img => {
      if (img.url.startsWith('blob:') && !uploadedImageObjects[img.id]) {
        const imgElement = new Image();
        imgElement.onload = () => {
          setUploadedImageObjects(prev => ({
            ...prev,
            [img.id]: imgElement
          }));
        };
        imgElement.onerror = () => {
          console.error('Error loading uploaded image:', img.url);
        };
        imgElement.src = img.url;
      }
    });
  }, [uploadedImages]);

  const generateFinalImage = async (): Promise<string> => {
    if (!stageRef.current) return '';
    
    try {
      // Usar el canvas de Konva directamente que ya maneja las imágenes sin problemas de CORS
      const stage = stageRef.current;
      
      // Exportar usando el método nativo de Konva
      const dataURL = stage.toDataURL({
        pixelRatio: 3,
        quality: 1.0,
        mimeType: 'image/png'
      });
      
      console.log('✅ Imagen exportada exitosamente usando Konva');
      
      // Convertir dataURL a blob
      const response = await fetch(dataURL);
      const blob = await response.blob();
      
      // Crear nombre único para la imagen
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileName = `custom-candle-${timestamp}-${randomId}.png`;
      
      // Subir a Firebase Storage
      const storageRef = ref(storage, `custom-candles/${fileName}`);
      await uploadBytes(storageRef, blob);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      console.log('✅ Imagen guardada en Firebase Storage:', downloadURL);
      
      // Retornar la URL del proxy para evitar problemas de CORS
      return getProxyImageUrl(downloadURL);
      
    } catch (error) {
      console.error('Error al generar y guardar imagen:', error);
      return '';
    }
  };


  const handleSendOrder = async () => {
    const finalImage = await generateFinalImage();
    if (finalImage) {
      setGeneratedImage(finalImage);
      setShowOrderModal(true);
    } else {
      alert('Error al generar la imagen. Inténtalo de nuevo.');
    }
  };

  const handleOrderPlaced = () => {
    // Redirigir al carrito después del pedido
    window.location.href = '/es/carrito';
  };

  const handleExport = async () => {
    if (!stageRef.current) return;
    
    try {
      // Crear un canvas temporal limpio
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvasWidth * 3; // 3x resolución
      tempCanvas.height = canvasHeight * 3;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) return;
      
      // Dibujar fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      
      // Dibujar la imagen de la vela
      if (image) {
        const scale = Math.min(tempCanvas.width / image.width, tempCanvas.height / image.height);
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (tempCanvas.width - scaledWidth) / 2;
        const y = (tempCanvas.height - scaledHeight) / 2;
        
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
      }
      
      // Dibujar el texto
      if (text.trim() !== "Tu mensaje aquí" && text.trim() !== "") {
        ctx.font = `${fontSize * 3}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const textX = (textPosition.x * 3);
        const textY = (textPosition.y * 3);
        ctx.fillText(text, textX, textY);
      }
      
      // Dibujar imágenes subidas (si las hay)
      for (const img of uploadedImages) {
        try {
          const imgElement = new Image();
          
          await new Promise((resolve, reject) => {
            imgElement.onload = () => {
              const scale = Math.min(tempCanvas.width / canvasWidth, tempCanvas.height / canvasHeight);
              const x = img.x * scale;
              const y = img.y * scale;
              const width = img.width * scale;
              const height = img.height * scale;
              
              ctx.drawImage(imgElement, x, y, width, height);
              resolve(true);
            };
            imgElement.onerror = reject;
            imgElement.src = img.url;
          });
        } catch (error) {
          console.warn('No se pudo incluir imagen en la exportación:', img.url);
        }
      }
      
      // Exportar el canvas temporal
      const dataURL = tempCanvas.toDataURL('image/png', 1.0);
      
      const link = document.createElement("a");
      link.download = `vela-mockup-profesional-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
      
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar la imagen. Inténtalo de nuevo.');
    }
  };

  // Renderizar texto simple y movible (ahora se maneja en el JSX con DraggableText)
  const renderSimpleText = () => {
    // Esta función ya no es necesaria, el texto se renderiza en el JSX
    // pero la mantenemos para compatibilidad con useEffect
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
          const radius = (this as any).radius ? (this as any).radius() : element.size / 2;
          if (box.x < 0) this.x(radius);
          if (box.x + box.width > canvasWidth) this.x(canvasWidth - radius);
          if (box.y < 0) this.y(radius);
          if (box.y + box.height > canvasHeight) this.y(canvasHeight - radius);
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                Texto Personalizado
              </label>
                <button
                  onClick={bringTextToFront}
                  className="bg-green-500 text-white text-xs py-1 px-2 rounded hover:bg-green-600 transition-colors"
                >
                  Traer al frente
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {/* Subir Imagen Personalizada */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen Personalizada
              </label>
              <button
                onClick={() => setShowImageUploadModal(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-pink-400 hover:bg-pink-50 transition-colors group"
              >
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2 group-hover:text-pink-500" />
                <p className="text-sm text-gray-600 group-hover:text-pink-600">
                  Subir tu propia imagen
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPG, PNG, GIF • Máximo 5MB
                </p>
                <p className="text-xs text-blue-600 mt-1 font-medium">
                  💡 Recomendado: 800x800px o más
                </p>
              </button>
              
              {/* Lista de imágenes subidas */}
              {uploadedImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2">
                    Imágenes subidas: {uploadedImages.length}
                  </p>
                  <div className="space-y-2">
                    {uploadedImages.map((img, index) => (
                      <div key={img.id} className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <img
                              src={img.url}
                              alt={`Imagen ${index + 1}`}
                              className="w-8 h-8 object-cover rounded"
                            />
                            <span className="text-xs text-gray-600">Imagen {index + 1}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveImage(img.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                        <button
                          onClick={() => bringImageToFront(img.id)}
                          className="w-full bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                        >
                          Traer al frente
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                style={{ fontFamily: fontFamily }}
              >
                {fonts.map((font) => (
                  <option key={font} value={font} style={{ fontFamily: font }}>
                    {font}
                  </option>
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
              <p className="text-sm text-blue-700 mb-2">
                💡 <strong>Tip:</strong> Haz clic directamente en el texto de la vista previa y arrástralo para posicionarlo donde quieras.
              </p>
              <div className="text-xs text-blue-600 space-y-1">
                <p>• <strong>Hover sobre el texto:</strong> El cursor cambia a "mover" y aparece un fondo</p>
                <p>• <strong>Arrastrar:</strong> El texto se agranda y el fondo se resalta</p>
                <p>• <strong>Soltar:</strong> El texto se posiciona automáticamente</p>
              </div>
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

            {/* Botones de Acción */}
            <div className="space-y-3">
              <button
                onClick={handleSendOrder}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
              >
                Enviar Imagen y Hacer Pedido
              </button>
              
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Descargar Imagen
            </button>
            </div>
          </div>

          {/* Canvas de Mockup */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-center">
                <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative">
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
                      
                      {/* Texto personalizado en Konva */}
                      {text.trim() !== "Tu mensaje aquí" && text.trim() !== "" && (
                        <Text
                          text={text}
                          x={textPosition.x - 100}
                          y={textPosition.y - 15}
                          fontSize={fontSize}
                          fontFamily={fontFamily}
                          fill={fontColor}
                          fontStyle="bold"
                          draggable={true}
                          onDragEnd={(e) => {
                            const newX = Math.max(0, Math.min(canvasWidth, e.target.x() + 100));
                            const newY = Math.max(0, Math.min(canvasHeight, e.target.y() + 15));
                            setTextPosition({ x: newX, y: newY });
                            setTextY(newY);
                          }}
                        />
                      )}
                      
                      {/* Imágenes subidas por el usuario en Konva */}
                      {uploadedImages.map((img) => {
                        if (img.url.startsWith('blob:') && uploadedImageObjects[img.id]) {
                          return (
                            <KonvaImage
                              key={img.id}
                              image={uploadedImageObjects[img.id]}
                              x={img.x}
                              y={img.y}
                              width={img.width}
                              height={img.height}
                              draggable={true}
                              onDragEnd={(e) => {
                                const newX = Math.max(0, Math.min(canvasWidth - img.width, e.target.x()));
                                const newY = Math.max(0, Math.min(canvasHeight - img.height, e.target.y()));
                                setUploadedImages(prev => prev.map(i => 
                                  i.id === img.id ? { ...i, x: newX, y: newY } : i
                                ));
                              }}
                              onMouseDown={(e) => {
                                // Traer al frente
                                const newZIndex = nextZIndex;
                                setUploadedImages(prev => prev.map(i => 
                                  i.id === img.id ? { ...i, zIndex: newZIndex } : i
                                ));
                                setNextZIndex(newZIndex + 1);
                              }}
                            />
                          );
                        }
                        return null;
                      })}
                        
                        
                    </Layer>
                  </Stage>
                    
                    
                    
                  </div>
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

      {/* Modal de subida de imágenes */}
      <SimpleImageUploadModal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        onImageUploaded={handleImageUploaded}
      />

      {/* Modal de pedido personalizado */}
      <CustomCandleOrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        onOrderPlaced={handleOrderPlaced}
        candleImage={generatedImage}
        templateName={templates.find(t => t.imageUrl === currentImageSrc)?.name || 'Vela Personalizada'}
        templatePrice={templates.find(t => t.imageUrl === currentImageSrc)?.price || 25}
      />
    </div>
  );
}
