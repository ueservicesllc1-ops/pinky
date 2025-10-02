"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";

interface CanvasEditorProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
  onImageLoad: (template: any) => void;
  textLines: string[];
  color: string;
  fontSize: number;
  fontFamily: string;
  selectedTemplate: any;
}

export default function CanvasEditor({ 
  onCanvasReady, 
  onImageLoad, 
  textLines, 
  color, 
  fontSize, 
  fontFamily, 
  selectedTemplate 
}: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  // Inicializar canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    try {
      console.log('Inicializando canvas...');
      
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 600,
        height: 700,
        backgroundColor: "#f8f9fa"
      });
      
      setCanvas(fabricCanvas);
      onCanvasReady(fabricCanvas);
      setCanvasReady(true);
      
      console.log('✅ Canvas inicializado');
      
    } catch (error) {
      console.error('Error inicializando canvas:', error);
    }

    // Cleanup
    return () => {
      if (canvas) {
        try {
          canvas.dispose();
        } catch (e) {
          console.log('Error al limpiar canvas:', e);
        }
      }
    };
  }, []);

  // Cargar plantilla
  useEffect(() => {
    if (!canvas || !selectedTemplate) return;

    const loadTemplate = async () => {
      try {
        console.log('🔄 Cargando plantilla:', selectedTemplate.name);
        
        // Limpiar canvas
        canvas.clear();
        
        // Crear URL proxy
        const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(selectedTemplate.imageUrl)}`;
        
        // Cargar imagen
        const img = await new Promise<fabric.Image>((resolve, reject) => {
          fabric.Image.fromURL(proxyUrl, (img) => {
            if (img) {
              console.log('✅ Imagen cargada, dimensiones:', img.width, 'x', img.height);
              
              // Escalar manteniendo proporciones
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
        
        // Crear textos con efectos realistas
        textLines.forEach((line, index) => {
          if (line.trim() === '') return; // Solo crear texto si no está vacío
          
          const textObj = new fabric.Textbox(line, {
            left: 300,
            top: 400 + (index * 60),
            fontSize: fontSize,
            fill: color,
            fontFamily: fontFamily,
            editable: true,
            selectable: true,
            moveable: true,
            width: 200,
            textAlign: 'center',
            // Efectos para que se vea más realista
            shadow: new fabric.Shadow({
              color: 'rgba(0,0,0,0.3)',
              blur: 3,
              offsetX: 2,
              offsetY: 2
            }),
            // Efecto de relieve para que se vea grabado
            stroke: 'rgba(0,0,0,0.2)',
            strokeWidth: 1
            // Removí globalCompositeOperation porque rompe la interactividad
          });
          
          canvas.add(textObj);
        });
        
        canvas.renderAll();
        console.log('✅ Plantilla cargada');
        
      } catch (error) {
        console.error('Error cargando plantilla:', error);
      }
    };

    loadTemplate();
  }, [canvas, selectedTemplate, textLines, color, fontSize, fontFamily]);

  return (
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
  );
}
