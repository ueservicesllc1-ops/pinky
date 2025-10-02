'use client';

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Download, Palette, Type, RotateCcw, Image as ImageIcon, Zap, Eye, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import { useTextAreaDetection } from "@/hooks/useTextAreaDetection";
import FinalResultPreview from "@/components/FinalResultPreview";

export default function EditorVelasIA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [texto, setTexto] = useState("Tu mensaje aquí");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [textObject, setTextObject] = useState<fabric.Textbox | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  // Cargar plantillas desde Firebase
  const { templates, isLoading: templatesLoading } = useCandleTemplates();
  
  // Hook para detección de IA
  const { isDetecting, detectTextAreaFromCanvas } = useTextAreaDetection();

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#808080", "#A52A2A", "#008000", "#4682B4"
  ];

  useEffect(() => {
    console.log('🔄 Iniciando editor de velas con IA...');
    
    const initializeFabric = (attempt = 1) => {
      if (!canvasRef.current) {
        if (attempt < 50) { // Máximo 50 intentos (5 segundos)
          console.log(`❌ Canvas ref no disponible, reintentando... (${attempt}/50)`);
          setTimeout(() => initializeFabric(attempt + 1), 100);
          return;
        } else {
          console.error('❌ No se pudo inicializar el canvas después de 50 intentos');
          setIsLoading(false);
          return;
        }
      }

      console.log('✅ Canvas ref disponible, inicializando Fabric.js...');
      
      let disposed = false;
      
      try {
        // Crear canvas de Fabric
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
          width: 600,
          height: 800,
          backgroundColor: "#f8f9fa"
        });
        
        setCanvas(fabricCanvas);
        console.log('✅ Canvas inicializado');

        if (!disposed) {
          // Crear placeholder inicial
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
          console.log('✅ Placeholder creado');
        }

        setIsLoading(false);
        setCanvasReady(true);
        console.log('🎉 Editor inicializado');

        return () => {
          disposed = true;
          fabricCanvas.dispose();
        };
      } catch (error) {
        console.error('❌ Error en Fabric.js:', error);
        setIsLoading(false);
      }
    };

    // Iniciar con un pequeño delay para asegurar que el DOM esté listo
    setTimeout(initializeFabric, 100);
  }, []);

  // Forzar re-render del canvas si no está listo
  useEffect(() => {
    if (!canvasReady && !isLoading) {
      console.log('🔄 Forzando re-render del canvas...');
      setTimeout(() => {
        setCanvasReady(true);
      }, 500);
    }
  }, [canvasReady, isLoading]);

  // Cargar plantilla seleccionada
  const loadTemplate = async (templateId: string) => {
    if (!canvas) {
      console.log('❌ Canvas no disponible para cargar plantilla');
      return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      console.log('❌ Plantilla no encontrada');
      return;
    }

    console.log('🔄 Cargando plantilla:', template.name);
    setSelectedTemplate(templateId);
    
    try {
      // Limpiar canvas
      canvas.clear();
      console.log('✅ Canvas limpiado');
      
      // Cargar imagen de la plantilla
      console.log('🔄 Cargando imagen:', template.imageUrl);
      const img = await new Promise<fabric.Image>((resolve, reject) => {
        fabric.Image.fromURL(template.imageUrl, (img) => {
          if (img) {
            console.log('✅ Imagen cargada, escalando...');
            const scale = Math.min(500 / img.width!, 700 / img.height!);
            img.scale(scale);
            img.set({
              left: (600 - img.width! * scale) / 2,
              top: (800 - img.height! * scale) / 2,
              selectable: false,
              evented: false,
              name: 'template-image'
            });
            resolve(img);
          } else {
            reject(new Error('No se pudo cargar la imagen'));
          }
        }, { crossOrigin: 'anonymous' });
      });

      canvas.add(img);
      canvas.sendToBack(img);
      console.log('✅ Plantilla cargada en canvas');
      
      // Crear texto inicial
      console.log('🔄 Creando texto inicial...');
      const initialText = new fabric.Textbox(texto, {
        left: 300,
        top: 400,
        fontSize: fontSize,
        fill: color,
        fontFamily: fontFamily,
        editable: true,
        width: 200,
        textAlign: 'center',
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 2,
          offsetX: 1,
          offsetY: 1
        })
      });
      
      canvas.add(initialText);
      setTextObject(initialText);
      canvas.renderAll();
      console.log('✅ Texto inicial creado');
      
    } catch (error) {
      console.error('❌ Error cargando plantilla:', error);
    }
  };

  // Detectar área de texto con IA
  const detectTextArea = async () => {
    if (!canvas) {
      console.log('❌ Canvas no disponible para detección IA');
      return;
    }
    
    if (!selectedTemplate) {
      console.log('❌ No hay plantilla seleccionada');
      return;
    }
    
    if (!textObject) {
      console.log('❌ No hay objeto de texto para posicionar');
      return;
    }
    
    console.log('🤖 Detectando área de texto con IA...');
    
    try {
      // Simular detección de IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Encontrar la plantilla en el canvas
      const objects = canvas.getObjects();
      const templateImg = objects.find(obj => obj.name === 'template-image') as fabric.Image;
      
      if (templateImg && textObject) {
        // Simular detección de área blanca o espacio para texto
        const detectedArea = {
          x: templateImg.left! + 50,
          y: templateImg.top! + templateImg.height! * 0.3,
          width: templateImg.width! * 0.6,
          height: 100
        };
        
        // Posicionar texto en el área detectada
        textObject.set({
          left: detectedArea.x,
          top: detectedArea.y,
          width: detectedArea.width
        });
        
        canvas.renderAll();
        console.log('✅ Área de texto detectada y posicionada');
        console.log('📍 Posición detectada:', detectedArea);
      }
      
    } catch (error) {
      console.error('❌ Error en detección IA:', error);
    }
  };

  // Fusionar texto con vela
  const fuseTextWithCandle = async () => {
    if (!canvas) return;
    
    setIsFusing(true);
    console.log('✨ Fusionando texto con vela...');
    
    try {
      // Crear imagen final fusionada
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2
      });
      
      setFinalResult(dataURL);
      console.log('✅ Fusión completada');
      
    } catch (error) {
      console.error('❌ Error en fusión:', error);
    } finally {
      setIsFusing(false);
    }
  };

  // Actualizar texto en tiempo real
  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ text: texto });
      canvas.renderAll();
    }
  }, [texto, textObject, canvas]);

  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fill: color });
      canvas.renderAll();
    }
  }, [color, textObject, canvas]);

  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fontSize: fontSize });
      canvas.renderAll();
    }
  }, [fontSize, textObject, canvas]);

  useEffect(() => {
    if (textObject && canvas) {
      textObject.set({ fontFamily: fontFamily });
      canvas.renderAll();
    }
  }, [fontFamily, textObject, canvas]);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500" />
        <p className="ml-2 text-gray-600">Cargando editor...</p>
      </div>
    );
  }

  // Si el canvas no se puede inicializar, mostrar mensaje de error
  if (!canvasReady && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-500 text-center">
          <h3 className="text-lg font-semibold mb-2">❌ Error al cargar el editor</h3>
          <p className="text-sm">No se pudo inicializar el canvas. Recarga la página.</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
        >
          🔄 Recargar página
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-screen">
      {/* IZQUIERDA - Controles (3 columnas) */}
      <div className="col-span-3 bg-white p-4 border-r">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-pink-600 flex items-center gap-2">
              <Type className="h-5 w-5" />
              Editor de Texto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Campo de texto */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Mensaje
              </label>
              <Input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="w-full"
              />
            </div>

            {/* Selector de fuente */}
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

            {/* Tamaño de fuente */}
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

            {/* Color */}
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

            {/* Botones de IA */}
            <div className="space-y-2 pt-4 border-t">
              <Button
                onClick={detectTextArea}
                disabled={isDetecting || !selectedTemplate}
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isDetecting ? 'Detectando...' : '🎯 Detectar Área IA'}
              </Button>
              
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

      {/* CENTRO - Vista Previa (6 columnas) */}
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
              <FinalResultPreview 
                imageUrl={finalResult}
                onDownload={handleDownload}
                onReset={() => {
                  setFinalResult(null);
                  setSelectedTemplate(null);
                  if (canvas) {
                    canvas.clear();
                    // Restaurar placeholder
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
                    canvas.add(placeholder, placeholderText);
                    canvas.renderAll();
                  }
                }}
              />
            ) : (
              <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* DERECHA - Plantillas (3 columnas) */}
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
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
    </div>
  );
}
