'use client';

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Download, Palette, Type, RotateCcw, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";

export default function VelaPersonalizada() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texto, setTexto] = useState("Tu mensaje aquí");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textObject, setTextObject] = useState<fabric.Textbox | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Cargar plantillas desde Firebase
  const { templates, isLoading: templatesLoading } = useCandleTemplates();

  const fonts = [
    "Arial",
    "Helvetica", 
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Impact",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black"
  ];

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#808080", "#A52A2A", "#008000", "#4682B4"
  ];

  useEffect(() => {
    console.log('🔄 useEffect ejecutándose...');
    
    const initializeFabric = () => {
      console.log('Canvas ref:', canvasRef.current);
      
      if (!canvasRef.current) {
        console.log('❌ Canvas ref no disponible, reintentando...');
        return false;
      }

      let disposed = false;
      
      console.log('🔄 Iniciando canvas de Fabric.js...');
      
      try {
        // Crear canvas de Fabric
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 400,
          height: 600,
          backgroundColor: "#f8f9fa"
        });
        
        setCanvas(fabricCanvas);
        console.log('✅ Canvas inicializado');

        if (!disposed) {
          // Crear cuerpo de la vela (rectángulo rosa)
          const candleBody = new fabric.Rect({
            left: 100,
            top: 150,
            width: 200,
            height: 300,
            fill: '#FFC0CB', // Pink color
            selectable: false,
            evented: false,
            name: 'candle-part'
          });

          const candleBase = new fabric.Rect({
            left: 90,
            top: 450,
            width: 220,
            height: 20,
            fill: '#FFB6C1', // Lighter pink
            selectable: false,
            evented: false,
            name: 'candle-part'
          });

          const flame = new fabric.Circle({
            left: 190,
            top: 130,
            radius: 15,
            fill: '#FFD700', // Gold color
            selectable: false,
            evented: false,
            name: 'candle-part'
          });

          fabricCanvas.add(candleBody, candleBase, flame);
          fabricCanvas.sendToBack(candleBody);
          fabricCanvas.sendToBack(flame);
          fabricCanvas.sendToBack(candleBase);
          fabricCanvas.renderAll();
          console.log('✅ Vela placeholder creada');

          // Crear texto inicial
          const initialText = new fabric.Textbox(texto, {
            left: 100,
            top: 300,
            fontSize: fontSize,
            fill: color,
            fontFamily: fontFamily,
            editable: true,
            width: 200,
            textAlign: 'center'
          });
          fabricCanvas.add(initialText);
          setTextObject(initialText);
          console.log('✅ Texto agregado al canvas');
        }

        setIsLoading(false);
        console.log('🎉 Editor completamente inicializado');

        // 🔑 limpiar al desmontar
        return () => {
          disposed = true;
          fabricCanvas.dispose();
        };
      } catch (error) {
        console.error('❌ Error en Fabric.js:', error);
        setIsLoading(false);
        return false;
      }
    };

    // Intentar inicializar inmediatamente
    if (initializeFabric()) {
      return;
    }

    // Si no funciona, intentar después de un delay
    const timer = setTimeout(() => {
      console.log('🔄 Reintentando inicialización...');
      if (!initializeFabric()) {
        console.log('❌ No se pudo inicializar después del timeout');
        setIsLoading(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Update text in real-time
  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ text: texto });
      canvas.renderAll();
    }
  }, [texto, textObject, canvas]);

  // Update color in real-time
  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fill: color });
      canvas.renderAll();
    }
  }, [color, textObject, canvas]);

  // Update font size
  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fontSize: fontSize });
      canvas.renderAll();
    }
  }, [fontSize, textObject, canvas]);

  // Update font
  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fontFamily: fontFamily });
      canvas.renderAll();
    }
  }, [fontFamily, textObject, canvas]);

  const handleDownload = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2 // Export at 2x resolution
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "vela-personalizada.png";
      link.click();
    }
  };

  const handleReset = () => {
    setTexto("Tu mensaje aquí");
    setColor("#000000");
    setFontSize(24);
    setFontFamily("Arial");
    if (textObject && canvas) {
      textObject.set({
        left: 100,
        top: 300,
        fontSize: 24,
        fill: "#000000",
        fontFamily: "Arial",
        angle: 0,
        scaleX: 1,
        scaleY: 1
      });
      canvas.renderAll();
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    if (!canvas) return;
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.log('❌ Plantilla no encontrada:', templateId);
      return;
    }

    console.log('🔄 Cargando plantilla:', template.name, template.imageUrl);
    setSelectedTemplate(templateId);
    
    try {
      // Limpiar canvas
      canvas.clear();
      
      // Cargar imagen de la plantilla
      const img = await new Promise<fabric.Image>((resolve, reject) => {
        console.log('🔄 Cargando imagen desde URL:', template.imageUrl);
        
        fabric.Image.fromURL(template.imageUrl, (img) => {
          if (img) {
            console.log('✅ Imagen cargada, dimensiones:', img.width, img.height);
            
            // Escalar la imagen para que quepa en el canvas
            const scale = Math.min(400 / img.width!, 600 / img.height!);
            console.log('📏 Escala calculada:', scale);
            
            img.scale(scale);
            img.set({
              left: (400 - img.width! * scale) / 2,
              top: (600 - img.height! * scale) / 2,
              selectable: false,
              evented: false,
              name: 'template-image'
            });
            
            console.log('✅ Imagen configurada, posición:', img.left, img.top);
            resolve(img);
          } else {
            console.error('❌ No se pudo cargar la imagen');
            reject(new Error('No se pudo cargar la imagen'));
          }
        }, {
          crossOrigin: 'anonymous' // Para evitar problemas de CORS
        });
      });

      canvas.add(img);
      canvas.sendToBack(img);
      console.log('✅ Imagen agregada al canvas');
      
      // Agregar texto sobre la plantilla
      const initialText = new fabric.Textbox(texto, {
        left: 200,
        top: 300,
        fontSize: fontSize,
        fill: color,
        fontFamily: fontFamily,
        editable: true,
        width: 200,
        textAlign: 'center'
      });
      canvas.add(initialText);
      setTextObject(initialText);
      console.log('✅ Texto agregado al canvas');
      
      canvas.renderAll();
      console.log('✅ Plantilla cargada exitosamente:', template.name);
    } catch (error) {
      console.error('❌ Error cargando plantilla:', error);
      alert(`Error cargando plantilla: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        <p className="ml-2 text-gray-600">Cargando editor...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Controles de personalización */}
      <Card className="w-full xl:w-1/4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Personaliza tu Vela
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entrada de Texto */}
          <div className="space-y-2">
            <label htmlFor="text-input" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Type className="h-4 w-4" />
              Mensaje en la Vela
            </label>
            <Input
              id="text-input"
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu mensaje"
              className="w-full"
            />
          </div>

          {/* Selector de Fuente */}
          <div className="space-y-2">
            <label htmlFor="font-select" className="text-sm font-medium text-gray-700">
              Fuente
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Tamaño de Fuente */}
          <div className="space-y-2">
            <label htmlFor="font-size-slider" className="text-sm font-medium text-gray-700">
              Tamaño de Fuente: {fontSize}px
            </label>
            <input
              id="font-size-slider"
              type="range"
              min="12"
              max="72"
              step="1"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Selector de Color */}
          <div className="space-y-2">
            <label htmlFor="color-picker" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Color del Texto
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="color-picker"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded-md"
              />
              <div className="flex flex-wrap gap-1">
                {predefinedColors.map((c) => (
                  <Button
                    key={c}
                    style={{ backgroundColor: c, borderColor: c === color ? 'black' : 'transparent', borderWidth: '2px' }}
                    className="w-8 h-8 p-0 rounded-full border-2 hover:scale-105 transition-transform"
                    onClick={() => setColor(c)}
                    aria-label={`Seleccionar color ${c}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleDownload} className="w-full bg-pink-500 hover:bg-pink-600 text-white">
              <Download className="mr-2 h-4 w-4" /> Descargar Mockup
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Área de Canvas */}
      <Card className="w-full xl:w-1/2 shadow-lg flex items-center justify-center bg-white">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Vista Previa</h3>
            <p className="text-sm text-gray-600">Arrastra el texto para posicionarlo</p>
          </div>
          <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md" />
        </CardContent>
      </Card>

      {/* Panel de Plantillas */}
      <Card className="w-full xl:w-1/4 shadow-lg">
        <CardHeader>
          <CardTitle className="text-pink-600 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Plantillas de Velas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {templatesLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No hay plantillas disponibles</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <div className="p-3">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 truncate">
                      {template.name}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">
                      {template.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}