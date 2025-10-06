'use client';

import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

interface DraggableTextProps {
  text: string;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  canvasWidth: number;
  canvasHeight: number;
  onPositionChange: (x: number, y: number) => void;
  initialX?: number;
  initialY?: number;
}

export default function DraggableText({
  text,
  fontSize,
  fontFamily,
  fontColor,
  canvasWidth,
  canvasHeight,
  onPositionChange,
  initialX = 0,
  initialY = 0
}: DraggableTextProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);

  // Calcular posición inicial centrada si no se especifica
  useEffect(() => {
    if (initialX === 0 && initialY === 0) {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [canvasWidth, canvasHeight, initialX, initialY]);

  const handleDrag = (e: any, data: any) => {
    // Limitar el movimiento dentro del canvas
    const maxX = canvasWidth - 50; // Margen de 50px
    const maxY = canvasHeight - 30; // Margen de 30px
    
    const newX = Math.max(0, Math.min(maxX, data.x));
    const newY = Math.max(0, Math.min(maxY, data.y));
    
    setPosition({ x: newX, y: newY });
    onPositionChange(newX, newY);
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
  };

  if (!text.trim()) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onDrag={handleDrag}
        onStart={handleStart}
        onStop={handleStop}
        bounds={{
          left: 0,
          top: 0,
          right: canvasWidth - 50,
          bottom: canvasHeight - 30
        }}
        handle=".draggable-handle"
      >
        <div
          ref={nodeRef}
          className="absolute pointer-events-auto"
          style={{
            left: 0,
            top: 0,
            transform: 'translate(0, 0)'
          }}
        >
          {/* Texto sin marco, solo con efectos sutiles */}
          <div
            className="draggable-handle"
            style={{
              padding: '4px 8px',
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              // Solo un fondo muy sutil al hover/arrastrar
              backgroundColor: isDragging 
                ? 'rgba(255, 255, 255, 0.1)' 
                : isHovered 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'transparent',
              borderRadius: '4px',
              boxShadow: isDragging 
                ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                : 'none'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: fontFamily,
                color: fontColor,
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                lineHeight: 1.2,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '2px solid rgba(0, 0, 0, 0.3)',
                // Efecto de brillo sutil al arrastrar
                filter: isDragging ? 'brightness(1.1) drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))' : 'none'
              }}
            >
              {text}
            </div>
          </div>
          
          {/* Indicador de arrastre sutil */}
          <div
            className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 ${
              isHovered || isDragging ? 'opacity-80' : 'opacity-0'
            }`}
            style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '2px 6px',
              borderRadius: '3px',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              backdropFilter: 'blur(2px)',
              fontWeight: '500'
            }}
          >
            {isDragging ? 'Arrastrando...' : 'Mover texto'}
          </div>
        </div>
      </Draggable>
    </div>
  );
}
