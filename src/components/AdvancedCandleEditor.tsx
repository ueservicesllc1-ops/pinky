"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Download, Type, Eye, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import ThreeJSViewer from "./ThreeJSViewer";

export default function AdvancedCandleEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textLines, setTextLines] = useState<string[]>([""]);
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; imageUrl: string; type: string } | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  const [use3D, setUse3D] = useState(false);
  
  const { templates, isLoading: templatesLoading } = useCandleTemplates();

  // Agregar nueva línea de texto
  const addTextLine = () => {
    setTextLines([...textLines, ""]);
  };

  // Actualizar línea de texto específica
  const updateTextLine = (index: number, newText: string) => {
    const updatedLines = [...textLines];
    updatedLines[index] = newText;
    setTextLines(updatedLines);
  };

  // Eliminar línea de texto
  const removeTextLine = (index: number) => {
    if (textLines.length <= 1) return;
    const updatedLines = textLines.filter((_, i) => i !== index);
    setTextLines(updatedLines);
  };

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#808080", "#A52A2A", "#008000", "#4682B4"
  ];

  // Manejar captura de imagen 3D
  const handle3DRenderComplete = (dataURL: string) => {
    setFinalResult(dataURL);
    setIsFusing(false);
  };

  // Inicializar Fabric.js de forma segura
  useEffect(() => {
    if (!canvasRef.current || use3D) return;

    let disposed = false; // 🚨 flag para evitar dobles dispose

    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 600,
      height: 700,
      backgroundColor: "#f8f9fa",
      preserveObjectStacking: true,
      renderOnAddRemove: false
    });
    
    setCanvas(fabricCanvas);
    
    return () => {
      if (!disposed) {
        disposed = true;
        try {
          fabricCanvas.dispose(); // limpiar seguro
        } catch (e) {
          console.log('Error al limpiar canvas:', e);
        }
      }
    };
  }, [use3D]);


  // Cargar plantilla en Fabric.js
  const loadTemplate = async (template: { id: string; name: string; imageUrl: string; type: string }) => {
    if (!canvas || use3D) return;
    
    setSelectedTemplate(template);
    
    try {
      canvas.clear();
      
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(template.imageUrl)}`;
      
      const img = await new Promise<fabric.Image>((resolve, reject) => {
        fabric.Image.fromURL(proxyUrl, (img) => {
          if (img) {
            const maxWidth = 600;
            const maxHeight = 700;
            const scaleX = maxWidth / img.width!;
            const scaleY = maxHeight / img.height!;
            const scale = Math.min(scaleX, scaleY);
            
            img.scale(scale);
            img.set({
              left: (600 - img.width! * scale) / 2,
              top: (700 - img.height! * scale) / 2,
              selectable: false,
              evented: false,
              name: 'template-image'
            });
            
            resolve(img);
          } else {
            reject(new Error('No se pudo cargar imagen'));
          }
        });
      });
      
      canvas.add(img);
      
      // Agregar textos - SIEMPRE crear al menos uno
      textLines.forEach((line, index) => {
        const textObj = new fabric.Textbox(line || 'Escribe aquí...', {
          left: 300,
          top: 400 + (index * 60),
          fontSize: fontSize,
          fill: line.trim() === '' ? '#999999' : color,
          fontFamily: fontFamily,
          editable: true,
          selectable: true,
          moveable: true,
          width: 200,
          textAlign: 'center',
          placeholder: 'Escribe aquí...',
          // Efectos 3D realistas
          shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.4)',
            blur: 8,
            offsetX: 3,
            offsetY: 3
          }),
          stroke: 'rgba(0,0,0,0.3)',
          strokeWidth: 2,
          // Efecto de profundidad
          textBackgroundColor: 'rgba(255,255,255,0.1)'
        });
        
        canvas.add(textObj);
      });
      
      canvas.renderAll();
      
    } catch (error) {
      console.error('Error cargando plantilla:', error);
    }
  };

  // Fusionar de forma segura
  const fuseTextWithCandle = async () => {
    setIsFusing(true);
    
    try {
      if (use3D) {
        // Para modo 3D, el componente ThreeJSViewer manejará la captura
        console.log('Modo 3D activado - esperando renderizado...');
        return;
      } else if (canvas) {
        // Fabric.js - método seguro sin manipular DOM
        const dataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2
        });
        
        setFinalResult(dataURL);
        console.log('✅ Fusión completada');
      }
      
    } catch (error) {
      console.error('Error en fusión:', error);
    } finally {
      setIsFusing(false);
    }
  };

  const handleDownload = () => {
    if (finalResult) {
      const link = document.createElement("a");
      link.href = finalResult;
      link.download = "vela-personalizada-3d.png";
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
              Editor 3D Avanzado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={use3D}
                  onChange={(e) => setUse3D(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Modo 3D Real</span>
              </label>
              <p className="text-xs text-gray-500">
                {use3D ? "Renderizado 3D con Three.js" : "Efectos 3D simulados"}
              </p>
            </div>

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
                onClick={() => {
                  if (canvas && selectedTemplate) {
                    loadTemplate(selectedTemplate);
                  }
                }}
                disabled={!selectedTemplate}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm mb-2"
              >
                <span className="text-lg">🔄</span>
                Actualizar Texto
              </button>
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
                    Renderizando 3D...
                  </>
                ) : (
                  <>
                    <span className="text-lg">🎨</span>
                    Renderizar 3D
                  </>
                )}
              </button>
            </div>

            {/* Controles de estilo */}
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
                  className="w-12 h-10 p-1 border rounded"
                />
                <div className="grid grid-cols-4 gap-1">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      className={`w-6 h-6 rounded border ${
                        color === colorOption ? 'ring-2 ring-pink-500' : ''
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>
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
              Vista Previa {use3D ? "3D" : "2D"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {finalResult ? (
              <div className="text-center">
                <img 
                  src={finalResult} 
                  alt="Vela personalizada 3D" 
                  className="max-w-full max-h-96 border rounded-lg shadow-lg"
                />
                <p className="text-sm text-gray-600 mt-2">Renderizado 3D Final</p>
                <Button
                  onClick={handleDownload}
                  className="mt-2 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar 3D
                </Button>
                <Button
                  onClick={() => setFinalResult(null)}
                  variant="outline"
                  className="mt-2 ml-2"
                >
                  Nueva Vela
                </Button>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                {use3D ? (
                  <ThreeJSViewer
                    textLines={textLines}
                    color={color}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    onRenderComplete={handle3DRenderComplete}
                  />
                ) : (
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
                )}
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      selectedTemplate?.id === template.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    onClick={() => loadTemplate(template)}
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
