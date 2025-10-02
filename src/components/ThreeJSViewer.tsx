"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeJSViewerProps {
  textLines: string[];
  color: string;
  fontSize: number;
  fontFamily: string;
  onRenderComplete?: (dataURL: string) => void;
}

export default function ThreeJSViewer({ 
  textLines, 
  color, 
  fontSize, 
  fontFamily, 
  onRenderComplete 
}: ThreeJSViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Limpiar contenido anterior
    containerRef.current.innerHTML = '';

    try {
      // Crear escena
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8f9fa);
      
      // Crear cámara
      const camera = new THREE.PerspectiveCamera(75, 600 / 700, 0.1, 1000);
      camera.position.z = 5;
      
      // Crear renderer
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true
      });
      renderer.setSize(600, 700);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      
      // Agregar al contenedor
      containerRef.current.appendChild(renderer.domElement);
      
      // Guardar referencias
      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      
      // Crear geometría de vela cilíndrica
      const candleGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
      const candleMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xff6b6b,
        transparent: true,
        opacity: 0.9
      });
      const candle = new THREE.Mesh(candleGeometry, candleMaterial);
      candle.castShadow = true;
      candle.receiveShadow = true;
      scene.add(candle);
      
      // Crear texto 3D si hay texto
      const validTextLines = textLines.filter(line => line.trim() !== '');
      if (validTextLines.length > 0) {
        // Crear geometría de texto simple
        const textGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.1);
        const textMaterial = new THREE.MeshLambertMaterial({ 
          color: new THREE.Color(color)
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(0, 0, 1.1);
        scene.add(textMesh);
      }
      
      // Iluminación
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      directionalLight.castShadow = true;
      scene.add(directionalLight);
      
      // Función de renderizado
      const animate = () => {
        requestAnimationFrame(animate);
        candle.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
      
      setIsReady(true);
      
    } catch (error) {
      console.error('Error inicializando Three.js:', error);
    }

    // Cleanup
    return () => {
      try {
        if (rendererRef.current) {
          rendererRef.current.dispose();
        }
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      } catch (e) {
        console.log('Error en cleanup Three.js:', e);
      }
    };
  }, [textLines, color, fontSize, fontFamily]);

  // Función para capturar imagen
  const captureImage = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      const dataURL = rendererRef.current.domElement.toDataURL('image/png', 1.0);
      if (onRenderComplete) {
        onRenderComplete(dataURL);
      }
      return dataURL;
    }
    return null;
  };

  // Exponer función de captura
  useEffect(() => {
    if (isReady && onRenderComplete) {
      // Capturar después de un breve delay para asegurar que esté renderizado
      setTimeout(() => {
        captureImage();
      }, 500);
    }
  }, [isReady, onRenderComplete]);

  return (
    <div 
      ref={containerRef} 
      className="border border-gray-300 rounded-lg shadow-lg"
      style={{ width: '600px', height: '700px' }}
    />
  );
}
