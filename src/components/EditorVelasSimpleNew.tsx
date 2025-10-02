"use client";

import { useState } from "react";
import { Download, Type, Eye, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCandleTemplates } from "@/hooks/useCandleTemplates";
import CanvasEditor from "./CanvasEditor";

export default function EditorVelasSimpleNew() {
  const [textLines, setTextLines] = useState<string[]>([""]);
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<{ id: string; name: string; imageUrl: string; type: string } | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [isFusing, setIsFusing] = useState(false);
  
  // Cargar plantillas desde Firebase
  const { templates, isLoading: templatesLoading } = useCandleTemplates();

  const fonts = [
    "Arial", "Helvetica", "Times New Roman", "Georgia", "Verdana",
    "Courier New", "Impact", "Comic Sans MS", "Trebuchet MS", "Arial Black"
  ];

  const predefinedColors = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
    "#FFC0CB", "#808080", "#A52A2A", "#008000", "#4682B4"
  ];

  // Manejar cuando el canvas esté listo
  const handleCanvasReady = (canvasInstance: fabric.Canvas) => {
    setCanvas(canvasInstance);
    console.log('✅ Canvas listo');
  };

  // Cargar plantilla
  const loadTemplate = (template: { id: string; name: string; imageUrl: string; type: string }) => {
    setSelectedTemplate(template);
    console.log('🔄 Cargando plantilla:', template.name);
  };

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

  // Fusionar con efectos realistas
  const fuseTextWithCandle = async () => {
    if (!canvas) return;
    
    setIsFusing(true);
    console.log('Fusionando con efectos realistas...');
    
    try {
      // Crear un canvas temporal para aplicar efectos
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) throw new Error('No se pudo crear contexto temporal');
      
      // Obtener imagen del canvas original
      const originalDataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 2
      });
      
      // Crear imagen desde el data URL
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = originalDataURL;
      });
      
      // Configurar canvas temporal
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      
      // Dibujar imagen base
      tempCtx.drawImage(img, 0, 0);
      
      // Aplicar efectos de fusión realista
      tempCtx.globalCompositeOperation = 'multiply';
      tempCtx.globalAlpha = 0.8;
      
      // Volver a dibujar para mezclar mejor
      tempCtx.drawImage(img, 0, 0);
      
      // Aplicar filtro de suavizado para que se vea más natural
      tempCtx.filter = 'blur(0.5px) contrast(1.1) brightness(0.95)';
      tempCtx.drawImage(img, 0, 0);
      
      // Generar imagen final
      const finalDataURL = tempCanvas.toDataURL('image/png', 1.0);
      
      setFinalResult(finalDataURL);
      console.log('✅ Fusión realista completada');
      
    } catch (error) {
      console.error('Error en fusión:', error);
      
      // Fallback: usar canvas original
      try {
        const dataURL = canvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2
        });
        setFinalResult(dataURL);
        console.log('Fusión completada con fallback');
      } catch (fallbackError) {
        console.error('Error en fallback:', fallbackError);
      }
    } finally {
      setIsFusing(false);
    }
  };

  const handleDownload = () => {
    if (finalResult) {
      const link = document.createElement("a");
      link.href = finalResult;
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
                  onClick={handleDownload}
                  className="mt-2 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
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
              <CanvasEditor
                onCanvasReady={handleCanvasReady}
                onImageLoad={loadTemplate}
                textLines={textLines}
                color={color}
                fontSize={fontSize}
                fontFamily={fontFamily}
                selectedTemplate={selectedTemplate}
              />
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
