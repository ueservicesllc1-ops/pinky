import { useState } from 'react';
import { createWorker } from 'tesseract.js';

interface TextArea {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  text: string;
}

interface DetectionResult {
  textAreas: TextArea[];
  bestArea: TextArea | null;
  processingTime: number;
}

export function useRealTextDetection() {
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [worker, setWorker] = useState<Tesseract.Worker | null>(null);

  // Inicializar worker de Tesseract
  const initializeWorker = async () => {
    if (!worker) {
      console.log('🔄 Inicializando Tesseract.js...');
      const newWorker = await createWorker('eng', 1, {
        logger: m => console.log('Tesseract:', m)
      });
      setWorker(newWorker);
      console.log('✅ Tesseract.js inicializado');
    }
    return worker;
  };

  // Detectar texto real en imagen
  const detectTextInImage = async (imageUrl: string): Promise<DetectionResult> => {
    setIsDetecting(true);
    console.log('🤖 Iniciando detección real de texto...');
    
    try {
      const startTime = Date.now();
      const tesseractWorker = await initializeWorker();
      
      console.log('🔄 Analizando imagen con Tesseract...');
      const { data: { words } } = await tesseractWorker.recognize(imageUrl);
      
      console.log('✅ Análisis completado, palabras encontradas:', words.length);
      
      // Procesar palabras detectadas
      const textAreas: TextArea[] = words
        .filter((word: Tesseract.Word) => word.confidence > 30) // Filtrar por confianza
        .map((word: Tesseract.Word) => ({
          x: word.bbox.x0,
          y: word.bbox.y0,
          width: word.bbox.x1 - word.bbox.x0,
          height: word.bbox.y1 - word.bbox.y0,
          confidence: word.confidence,
          text: word.text
        }));

      // Encontrar el área con más texto (mejor candidato)
      const bestArea = textAreas.reduce((best, current) => {
        return current.confidence > best.confidence ? current : best;
      }, textAreas[0] || null);

      const processingTime = Date.now() - startTime;
      
      const result: DetectionResult = {
        textAreas,
        bestArea,
        processingTime
      };
      
      setResult(result);
      console.log('🎯 Detección completada:', result);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en detección real:', error);
      throw error;
    } finally {
      setIsDetecting(false);
    }
  };

  // Detectar desde canvas
  const detectTextFromCanvas = async (canvas: HTMLCanvasElement): Promise<DetectionResult> => {
    const imageData = canvas.toDataURL('image/png');
    return detectTextInImage(imageData);
  };

  // Detectar áreas de texto (espacios en blanco)
  const detectTextAreas = async (imageUrl: string): Promise<DetectionResult> => {
    setIsDetecting(true);
    console.log('🤖 Detectando áreas de texto...');
    
    try {
      const startTime = Date.now();
      
      // Usar proxy de Next.js para evitar CORS
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
      console.log('🔄 Usando proxy para análisis:', proxyUrl);
      
      // Crear imagen para análisis usando proxy
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = proxyUrl;
      });
      
      // Crear canvas temporal para análisis
      const tempCanvas = document.createElement('canvas');
      const ctx = tempCanvas.getContext('2d');
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;
      
      if (!ctx) throw new Error('No se pudo obtener contexto del canvas');
      
      // Dibujar imagen en canvas
      ctx.drawImage(img, 0, 0);
      
      // Obtener datos de píxeles
      const imageData = ctx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      const data = imageData.data;
      
      // Analizar píxeles para encontrar áreas blancas/claras
      const textAreas: TextArea[] = [];
      const step = 20; // Analizar cada 20 píxeles
      
      for (let y = 0; y < tempCanvas.height - 50; y += step) {
        for (let x = 0; x < tempCanvas.width - 100; x += step) {
          // Analizar área de 100x50 píxeles
          let whitePixels = 0;
          let totalPixels = 0;
          
          for (let dy = 0; dy < 50; dy += 5) {
            for (let dx = 0; dx < 100; dx += 5) {
              const pixelIndex = ((y + dy) * tempCanvas.width + (x + dx)) * 4;
              const r = data[pixelIndex];
              const g = data[pixelIndex + 1];
              const b = data[pixelIndex + 2];
              
              // Considerar píxel "blanco" si es muy claro
              if (r > 200 && g > 200 && b > 200) {
                whitePixels++;
              }
              totalPixels++;
            }
          }
          
          const whiteRatio = whitePixels / totalPixels;
          
          // Si más del 60% es blanco, es un área candidata para texto
          if (whiteRatio > 0.6) {
            textAreas.push({
              x: x,
              y: y,
              width: 100,
              height: 50,
              confidence: whiteRatio * 100,
              text: 'Área de texto detectada'
            });
          }
        }
      }
      
      // Encontrar el área más grande y centrada
      const bestArea = textAreas.reduce((best, current) => {
        if (!best) return current;
        
        // Preferir áreas más centradas
        const currentCenterX = current.x + current.width / 2;
        const currentCenterY = current.y + current.height / 2;
        const bestCenterX = best.x + best.width / 2;
        const bestCenterY = best.y + best.height / 2;
        
        const imageCenterX = tempCanvas.width / 2;
        const imageCenterY = tempCanvas.height / 2;
        
        const currentDistance = Math.sqrt(
          Math.pow(currentCenterX - imageCenterX, 2) + 
          Math.pow(currentCenterY - imageCenterY, 2)
        );
        const bestDistance = Math.sqrt(
          Math.pow(bestCenterX - imageCenterX, 2) + 
          Math.pow(bestCenterY - imageCenterY, 2)
        );
        
        return currentDistance < bestDistance ? current : best;
      }, textAreas[0] || null);
      
      const processingTime = Date.now() - startTime;
      
      const result: DetectionResult = {
        textAreas,
        bestArea,
        processingTime
      };
      
      setResult(result);
      console.log('🎯 Áreas detectadas:', textAreas.length);
      console.log('🎯 Mejor área:', bestArea);
      
      return result;
      
    } catch (error) {
      console.error('❌ Error en detección de áreas:', error);
      throw error;
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    isDetecting,
    result,
    detectTextInImage,
    detectTextFromCanvas,
    detectTextAreas
  };
}
