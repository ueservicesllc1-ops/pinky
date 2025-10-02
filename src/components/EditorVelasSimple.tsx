'use client';

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Download, Type, Eye, Image as ImageIcon, Wand2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import { useRealTextDetection } from "@/hooks/useRealTextDetection";
import CanvasEditor from "./CanvasEditor";

export default function EditorVelasSimple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textLines, setTextLines] = useState<string[]>([""]);
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textObjects, setTextObjects] = useState<fabric.Textbox[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFusing, setIsFusing] = useState(false);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  
  // Cargar plantillas desde Firebase
  const { templates, isLoading: templatesLoading } = useCandleTemplates();
  
  // Hook para detección real de texto
  const { isDetecting: isRealDetecting, detectTextAreas } = useRealTextDetection();

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#808080", "#A52A2A", "#008000", "#4682B4"
  ];

  // Inicializar canvas de forma más simple
  useEffect(() => {
    const initCanvas = () => {
      if (!canvasRef.current) {
        console.log('Canvas ref no disponible, reintentando...');
        setTimeout(initCanvas, 200);
        return;
      }

      try {
        console.log('Inicializando canvas...');
        
        // Limpiar canvas existente si hay uno
        if (canvas) {
          try {
            canvas.dispose();
          } catch (e) {
            console.log('Error al limpiar canvas anterior:', e);
          }
        }
        
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 600,
          height: 700,
          backgroundColor: "#f8f9fa",
          preserveObjectStacking: true,
          renderOnAddRemove: false
        });
        
        setCanvas(fabricCanvas);
        
        // Crear placeholder
        const placeholder = new fabric.Rect({
          left: 200,
          top: 300,
          width: 200,
          height: 200,
          fill: '#f0f0f0',
          stroke: '#ddd',
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false
        });

        const placeholderText = new fabric.Text('Selecciona una plantilla', {
          left: 250,
          top: 400,
          fontSize: 16,
          fill: '#999',
          selectable: false,
          evented: false
        });

        fabricCanvas.add(placeholder, placeholderText);
        fabricCanvas.renderAll();
        console.log('Canvas inicializado correctamente');
        
      } catch (error) {
        console.error('Error inicializando canvas:', error);
      }
    };

    // Esperar un poco más para que el DOM esté listo
    setTimeout(initCanvas, 500);
  }, []);

  // Cargar plantilla
  const loadTemplate = async (templateId: string) => {
    if (!canvas) {
      console.log('❌ Canvas no disponible');
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.log('❌ Plantilla no encontrada');
      return;
    }

    console.log('🔄 Cargando plantilla:', template.name);
    console.log('🔄 URL de imagen:', template.imageUrl);
    setSelectedTemplate(templateId);
    
    try {
      // Limpiar canvas de forma segura
      try {
        canvas.clear();
        console.log('✅ Canvas limpiado');
      } catch (clearError) {
        console.log('⚠️ Error al limpiar canvas:', clearError);
        // Continuar aunque haya error
      }
      
      // Crear placeholder mientras carga
      const loadingText = new fabric.Text('Cargando imagen...', {
        left: 300,
        top: 400,
        fontSize: 16,
        fill: '#666',
        selectable: false,
        evented: false
      });
      canvas.add(loadingText);
      canvas.renderAll();
      
      // Cargar imagen usando proxy de Next.js para evitar CORS
      console.log('🔄 Cargando imagen usando proxy...');
      
      // Crear URL del proxy
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(template.imageUrl)}`;
      console.log('🔄 URL del proxy:', proxyUrl);
      
      // Cargar imagen desde el proxy
      const img = await new Promise<fabric.Image>((resolve, reject) => {
        fabric.Image.fromURL(proxyUrl, (img) => {
          if (img) {
            console.log('✅ Imagen cargada desde proxy, dimensiones:', img.width, 'x', img.height);
            
            // Mantener proporciones originales
            const maxWidth = 600;
            const maxHeight = 700;
            const scaleX = maxWidth / img.width!;
            const scaleY = maxHeight / img.height!;
            const scale = Math.min(scaleX, scaleY); // Usar el menor para mantener proporciones
            
            console.log('🔄 Escalando imagen, factor:', scale);
            console.log('📐 Dimensiones originales:', img.width, 'x', img.height);
            console.log('📐 Dimensiones escaladas:', img.width! * scale, 'x', img.height! * scale);
            
            img.scale(scale);
            img.set({
              left: (600 - img.width! * scale) / 2,
              top: (700 - img.height! * scale) / 2,
              selectable: false,
              evented: false,
              name: 'template-image'
            });
            console.log('✅ Imagen configurada, posición:', img.left, img.top);
            resolve(img);
          } else {
            reject(new Error('No se pudo cargar imagen desde proxy'));
          }
        });
      });

      // Remover texto de carga
      canvas.remove(loadingText);
      
      // Agregar imagen al canvas
      canvas.add(img);
      canvas.sendToBack(img);
      console.log('✅ Imagen agregada al canvas');
      
      // Crear objetos de texto para cada línea
      console.log('🔄 Creando objetos de texto...');
      const newTextObjects: fabric.Textbox[] = [];
      
      textLines.forEach((line, index) => {
        const textObj = new fabric.Textbox(line, {
          left: 300,
          top: 400 + (index * 60), // Espaciado vertical entre líneas
          fontSize: fontSize,
          fill: line.trim() === '' ? '#999999' : color, // Gris si está vacío
          fontFamily: fontFamily,
          editable: true,
          selectable: true, // Permitir selección
          moveable: true, // Permitir movimiento
          width: 200,
          textAlign: 'center',
          placeholder: 'Escribe aquí...',
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.1)',
            blur: 1,
            offsetX: 1,
            offsetY: 1
          })
        });
        
        canvas.add(textObj);
        newTextObjects.push(textObj);
      });
      
      setTextObjects(newTextObjects);
      canvas.renderAll();
      console.log('✅ Objetos de texto creados:', newTextObjects.length);
      console.log('🎉 Plantilla cargada completamente');
      
    } catch (error) {
      console.error('❌ Error cargando plantilla:', error);
      
      // Mostrar error en canvas
      canvas.clear();
      const errorText = new fabric.Text('Error cargando imagen', {
        left: 250,
        top: 400,
        fontSize: 16,
        fill: '#ff0000',
        selectable: false,
        evented: false
      });
      canvas.add(errorText);
      canvas.renderAll();
    }
  };


  // Agregar nueva línea de texto
  const addTextLine = () => {
    if (!canvas || !selectedTemplate) return;
    
    console.log('➕ Agregando nueva línea de texto...');
    
    const newLine = ""; // Campo vacío
    setTextLines([...textLines, newLine]);
    
    const objects = canvas.getObjects();
    const templateImg = objects.find(obj => obj.name === 'template-image') as fabric.Image;
    
    if (templateImg) {
      const newText = new fabric.Textbox("", {
        left: 300,
        top: 400 + (textLines.length * 60),
        fontSize: fontSize,
        fill: '#999999', // Color gris para placeholder
        fontFamily: fontFamily,
        editable: true,
        selectable: true, // Permitir selección
        moveable: true, // Permitir movimiento
        width: 200,
        textAlign: 'center',
        placeholder: 'Escribe aquí...', // Placeholder en gris
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.1)',
          blur: 1,
          offsetX: 1,
          offsetY: 1
        })
      });
      
      canvas.add(newText);
      setTextObjects([...textObjects, newText]);
      canvas.renderAll();
      console.log('✅ Nueva línea agregada');
    }
  };

  // Actualizar línea de texto específica
  const updateTextLine = (index: number, newText: string) => {
    const updatedLines = [...textLines];
    updatedLines[index] = newText;
    setTextLines(updatedLines);
    
    if (textObjects[index]) {
      textObjects[index].set({ 
        text: newText,
        fill: newText.trim() === '' ? '#999999' : color // Gris si está vacío, color normal si tiene texto
      });
      canvas?.renderAll();
    }
  };

  // Eliminar línea de texto
  const removeTextLine = (index: number) => {
    if (textLines.length <= 1) return; // No eliminar si solo queda una
    
    const updatedLines = textLines.filter((_, i) => i !== index);
    setTextLines(updatedLines);
    
    if (textObjects[index]) {
      canvas?.remove(textObjects[index]);
      const updatedObjects = textObjects.filter((_, i) => i !== index);
      setTextObjects(updatedObjects);
      canvas?.renderAll();
    }
  };

  // Fusionar
  const fuseTextWithCandle = async () => {
    if (!canvas) return;
    
    setIsFusing(true);
    console.log('Fusionando...');
    
    try {
      // Usar un timeout para evitar conflictos con React
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Generar imagen directamente del canvas sin manipular DOM
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2
      });
      
      setFinalResult(dataURL);
      console.log('Fusión completada');
      
    } catch (error) {
      console.error('Error en fusión:', error);
      
      // Fallback: usar HTML5 Canvas nativo
      try {
        const canvasElement = canvasRef.current;
        if (canvasElement) {
          const dataURL = canvasElement.toDataURL('image/png');
          setFinalResult(dataURL);
          console.log('Fusión completada con HTML5 Canvas');
        }
      } catch (fallbackError) {
        console.error('Error en fallback HTML5:', fallbackError);
      }
    } finally {
      setIsFusing(false);
    }
  };

  // Actualizar propiedades de todos los objetos de texto
  useEffect(() => {
    if (textObjects.length > 0 && canvas) {
      textObjects.forEach(textObj => {
        textObj.set({ fill: color });
      });
      canvas.renderAll();
    }
  }, [color, textObjects, canvas]);

  useEffect(() => {
    if (textObjects.length > 0 && canvas) {
      textObjects.forEach(textObj => {
        textObj.set({ fontSize: fontSize });
      });
      canvas.renderAll();
    }
  }, [fontSize, textObjects, canvas]);

  useEffect(() => {
    if (textObjects.length > 0 && canvas) {
      textObjects.forEach(textObj => {
        textObj.set({ fontFamily: fontFamily });
      });
      canvas.renderAll();
    }
  }, [fontFamily, textObjects, canvas]);

  // Limpiar canvas al desmontar
  useEffect(() => {
    return () => {
      if (canvas) {
        try {
          // Limpiar todos los objetos primero
          canvas.clear();
          // Luego disponer del canvas
          canvas.dispose();
        } catch (error) {
          console.log('Error al limpiar canvas:', error);
        }
      }
    };
  }, [canvas]);

  const handleDownload = () => {
    if (finalResult) {
      const link = document.createElement("a");
      link.href = finalResult;
      link.download = "vela-personalizada.png";
      link.click();
    } else if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "vela-personalizada.png";
      link.click();
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 h-screen">
      {/* IZQUIERDA - Controles */}
      <div className="col-span-3 bg-white p-4 border-r">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-pink-600 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Editor de Texto
            </CardTitle>
            <p className="text-xs text-gray-500 mt-2">
              💡 Arrastra el texto en el canvas para posicionarlo donde quieras
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Líneas de Texto
              </label>
              <div className="space-y-2">
                {textLines.map((line, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={line}
                      onChange={(e) => updateTextLine(index, e.target.value)}
                      placeholder={`Línea ${index + 1}...`}
                      className="flex-1"
                    />
                    {textLines.length > 1 && (
                      <button
                        onClick={() => removeTextLine(index)}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addTextLine}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                >
                  <span className="text-lg">+</span>
                  Agregar Línea
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={fuseTextWithCandle}
                disabled={!selectedTemplate || isFusing}
                className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-pink-600 text-white rounded hover:bg-pink-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFusing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Fusionando...
                  </>
                ) : (
                  <>
                    <span className="text-lg">✨</span>
                    Fusionar Vela
                  </>
                )}
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Fuente
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {fonts.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tamaño: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Color
              </label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <div className="flex flex-wrap gap-1">
                  {predefinedColors.map((c) => (
                    <button
                      key={c}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full border-2 ${
                        c === color ? 'border-black' : 'border-gray-300'
                      }`}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <Button
                onClick={fuseTextWithCandle}
                disabled={isFusing || !selectedTemplate}
                className="w-full bg-purple-500 hover:bg-purple-600"
              >
                <Zap className="mr-2 h-4 w-4" />
                {isFusing ? 'Fusionando...' : '✨ Fusionar'}
              </Button>
              
              <Button
                onClick={handleDownload}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                <Download className="mr-2 h-4 w-4" />
                📥 Descargar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CENTRO - Vista Previa */}
      <div className="col-span-6 bg-gray-50 p-4">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {finalResult ? (
              <div className="text-center">
                <img 
                  src={finalResult} 
                  alt="Vela personalizada" 
                  className="max-w-full max-h-96 border rounded-lg shadow-lg"
                />
                <p className="text-sm text-gray-600 mt-2">Resultado Final</p>
                <Button
                  onClick={() => setFinalResult(null)}
                  variant="outline"
                  className="mt-2"
                >
                  Nueva Vela
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <canvas 
                  ref={canvasRef} 
                  className="border border-gray-300 rounded-lg shadow-lg"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '700px',
                    width: 'auto',
                    height: 'auto'
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* DERECHA - Plantillas */}
      <div className="col-span-3 bg-white p-4 border-l">
        <Card className="h-full">
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
              <div className="space-y-2 max-h-192 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      selectedTemplate === template.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    onClick={() => loadTemplate(template.id)}
                  >
                    <div className="p-1">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-1" style={{ transform: 'scale(0.7)' }}>
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-xs text-gray-900 truncate">
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
    </div>
  );
}
