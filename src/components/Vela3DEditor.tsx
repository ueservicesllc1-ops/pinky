"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text3D, Center, Environment, ContactShadows } from "@react-three/drei";
import { HexColorPicker } from "react-colorful";
import * as THREE from "three";
import { VelaModeloSimple } from "./VelaModeloSimple";

// Componente para el texto 3D con efectos realistas
function Texto3D({ 
  text, 
  fontSize, 
  fontColor, 
  position 
}: { 
  text: string; 
  fontSize: number; 
  fontColor: string; 
  position: [number, number, number];
}) {
  const textRef = useRef<THREE.Mesh>(null);

  // Animación sutil del texto
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <Center position={position}>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={fontSize}
        height={0.08}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={5}
        castShadow
        receiveShadow
      >
        {text}
        <meshStandardMaterial 
          color={fontColor} 
          metalness={0.4} 
          roughness={0.3}
          emissive={fontColor}
          emissiveIntensity={0.1}
        />
      </Text3D>
    </Center>
  );
}

// Componente principal del editor
export default function Vela3DEditor() {
  const [text, setText] = useState("Tu mensaje aquí");
  const [fontSize, setFontSize] = useState(0.15);
  const [fontColor, setFontColor] = useState("#d4af37");
  const [fontFamily, setFontFamily] = useState("helvetiker");
  const [textPosition, setTextPosition] = useState<[number, number, number]>([0, 0.5, 0.85]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lista de fuentes disponibles
  const fonts = [
    { name: "Helvetiker", value: "helvetiker" },
    { name: "Optimer", value: "optimer" },
    { name: "Gentilis", value: "gentilis" },
  ];

  // Colores predefinidos
  const predefinedColors = [
    "#d4af37", // Dorado
    "#c0c0c0", // Plateado
    "#8b4513", // Marrón
    "#000000", // Negro
    "#ffffff", // Blanco
    "#ff6b6b", // Rojo
    "#4ecdc4", // Turquesa
    "#45b7d1", // Azul
  ];

  // Exportar render como PNG de alta calidad
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Crear un canvas temporal con mayor resolución
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Configurar alta resolución
    const scale = 2; // 2x resolución
    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;
    tempCtx.scale(scale, scale);

    // Dibujar el canvas original en el temporal
    tempCtx.drawImage(canvas, 0, 0);

    // Descargar
    const dataURL = tempCanvas.toDataURL("image/png", 1.0);
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `vela-personalizada-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🕯️ Editor 3D Profesional de Velas
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de Controles */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-700">Controles</h2>
            
            {/* Texto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Texto Personalizado
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Escribe tu mensaje aquí..."
              />
            </div>

            {/* Tamaño */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño: {Math.round(fontSize * 100)}%
              </label>
              <input
                type="range"
                min={5}
                max={30}
                value={fontSize * 100}
                onChange={(e) => setFontSize(Number(e.target.value) / 100)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
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
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Colores Predefinidos */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Colores Rápidos
              </label>
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFontColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      fontColor === color ? 'border-blue-500' : 'border-gray-300'
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
              <div className="flex justify-center">
                <HexColorPicker color={fontColor} onChange={setFontColor} />
              </div>
            </div>

            {/* Posición del Texto */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición Vertical
              </label>
              <input
                type="range"
                min={-50}
                max={100}
                value={textPosition[1] * 100}
                onChange={(e) => setTextPosition([textPosition[0], Number(e.target.value) / 100, textPosition[2]])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Botón de Exportar */}
            <button
              onClick={handleExport}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              📸 Exportar PNG HD
            </button>
          </div>

          {/* Canvas 3D */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="w-full h-[700px] rounded-lg overflow-hidden">
                <Canvas
                  ref={canvasRef}
                  camera={{ position: [0, 2, 4], fov: 50 }}
                  shadows
                  gl={{ preserveDrawingBuffer: true, antialias: true }}
                >
                  {/* Iluminación profesional tipo estudio */}
                  <ambientLight intensity={0.3} />
                  <directionalLight 
                    position={[5, 5, 5]} 
                    intensity={1} 
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                  />
                  <directionalLight 
                    position={[-5, 3, -5]} 
                    intensity={0.5} 
                    color="#ffeaa7"
                  />
                  <pointLight position={[0, 5, 0]} intensity={0.3} color="#74b9ff" />

                  {/* Environment para reflejos realistas */}
                  <Environment preset="studio" />

                  {/* Modelo de la vela */}
                  <Suspense fallback={null}>
                    <VelaModeloSimple />
                  </Suspense>

                  {/* Texto 3D */}
                  {text.trim() && (
                    <Texto3D
                      text={text}
                      fontSize={fontSize}
                      fontColor={fontColor}
                      position={textPosition}
                    />
                  )}

                  {/* Sombras de contacto */}
                  <ContactShadows 
                    position={[0, -1.5, 0]} 
                    opacity={0.4} 
                    scale={10} 
                    blur={2} 
                    far={4} 
                  />

                  {/* Controles de cámara */}
                  <OrbitControls 
                    enablePan={true} 
                    enableZoom={true} 
                    enableRotate={true}
                    minDistance={2}
                    maxDistance={8}
                    maxPolarAngle={Math.PI / 2}
                  />
                </Canvas>
              </div>
              
              {/* Instrucciones */}
              <div className="mt-4 text-center text-gray-600">
                <p className="text-sm">
                  🖱️ Arrastra para rotar • 🔍 Scroll para zoom • ⌨️ Shift + arrastra para mover
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
