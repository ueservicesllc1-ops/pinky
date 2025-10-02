'use client';

import { useEffect, useRef } from "react";
import { fabric } from "fabric";

export default function TestFabric() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    let disposed = false;
    
    // Crear canvas de Fabric
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 300,
      backgroundColor: "#f0f0f0"
    });

    console.log('✅ Canvas de Fabric.js creado');

    if (!disposed) {
      // Dibujar un rectángulo
      const rect = new fabric.Rect({
        left: 50,
        top: 50,
        fill: "red",
        width: 100,
        height: 100,
      });
      canvas.add(rect);
      console.log('✅ Rectángulo agregado');

      // Crear texto
      const text = new fabric.Text('¡Hola Fabric.js!', {
        left: 50,
        top: 20,
        fontSize: 20,
        fill: 'blue'
      });
      canvas.add(text);
      console.log('✅ Texto agregado');
    }

    // 🔑 limpiar al desmontar
    return () => {
      disposed = true;
      canvas.dispose();
    };
  }, []);

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded">
      <div className="text-green-800 font-bold mb-2">
        ✅ Fabric.js funcionando en Next.js
      </div>
      <canvas ref={canvasRef} className="border border-gray-300" />
    </div>
  );
}