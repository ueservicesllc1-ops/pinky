'use client';

import { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable';

interface DraggableImageProps {
  imageUrl: string;
  imageId: string;
  canvasWidth: number;
  canvasHeight: number;
  onPositionChange: (x: number, y: number, width: number, height: number) => void;
  onRemove: () => void;
  initialX?: number;
  initialY?: number;
  initialWidth?: number;
  initialHeight?: number;
}

export default function DraggableImage({
  imageUrl,
  imageId,
  canvasWidth,
  canvasHeight,
  onPositionChange,
  onRemove,
  initialX = 0,
  initialY = 0,
  initialWidth = 100,
  initialHeight = 100
}: DraggableImageProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calcular posición inicial centrada si no se especifica
  useEffect(() => {
    if (initialX === 0 && initialY === 0) {
      const centerX = (canvasWidth - initialWidth) / 2;
      const centerY = (canvasHeight - initialHeight) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [canvasWidth, canvasHeight, initialX, initialY, initialWidth, initialHeight]);

  const handleDrag = (e: any, data: any) => {
    // Limitar el movimiento dentro del canvas
    const maxX = canvasWidth - size.width;
    const maxY = canvasHeight - size.height;
    
    const newX = Math.max(0, Math.min(maxX, data.x));
    const newY = Math.max(0, Math.min(maxY, data.y));
    
    setPosition({ x: newX, y: newY });
    onPositionChange(newX, newY, size.width, size.height);
  };

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;
    const startPos = { ...position };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startPos.x;
      let newY = startPos.y;

      // Calcular nuevo tamaño basado en la dirección
      switch (direction) {
        case 'se': // Esquina inferior derecha
          newWidth = Math.max(50, Math.min(300, startWidth + deltaX));
          newHeight = Math.max(50, Math.min(300, startHeight + deltaY));
          break;
        case 'sw': // Esquina inferior izquierda
          newWidth = Math.max(50, Math.min(300, startWidth - deltaX));
          newHeight = Math.max(50, Math.min(300, startHeight + deltaY));
          newX = startPos.x + (startWidth - newWidth);
          break;
        case 'ne': // Esquina superior derecha
          newWidth = Math.max(50, Math.min(300, startWidth + deltaX));
          newHeight = Math.max(50, Math.min(300, startHeight - deltaY));
          newY = startPos.y + (startHeight - newHeight);
          break;
        case 'nw': // Esquina superior izquierda
          newWidth = Math.max(50, Math.min(300, startWidth - deltaX));
          newHeight = Math.max(50, Math.min(300, startHeight - deltaY));
          newX = startPos.x + (startWidth - newWidth);
          newY = startPos.y + (startHeight - newHeight);
          break;
      }

      // Asegurar que no se salga del canvas
      if (newX < 0) {
        newWidth += newX;
        newX = 0;
      }
      if (newY < 0) {
        newHeight += newY;
        newY = 0;
      }
      if (newX + newWidth > canvasWidth) {
        newWidth = canvasWidth - newX;
      }
      if (newY + newHeight > canvasHeight) {
        newHeight = canvasHeight - newY;
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
      onPositionChange(newX, newY, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleStart = () => {
    setIsDragging(true);
  };

  const handleStop = () => {
    setIsDragging(false);
  };

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
          right: canvasWidth - size.width,
          bottom: canvasHeight - size.height
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
          {/* Contenedor de imagen */}
          <div
            className="draggable-handle relative"
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              cursor: isDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              // Fondo sutil al hover/arrastrar
              backgroundColor: isDragging 
                ? 'rgba(255, 255, 255, 0.1)' 
                : isHovered 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'transparent',
              borderRadius: '8px',
              boxShadow: isDragging 
                ? '0 4px 15px rgba(0, 0, 0, 0.2)' 
                : isHovered 
                  ? '0 2px 8px rgba(0, 0, 0, 0.1)' 
                  : '0 1px 4px rgba(0, 0, 0, 0.05)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Imagen */}
            <img
              src={imageUrl}
              alt="User uploaded"
              className="w-full h-full object-contain rounded-lg"
              style={{
                filter: isDragging ? 'brightness(1.05)' : 'none'
              }}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Botón de eliminar */}
            {(isHovered || isDragging) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors"
                style={{ pointerEvents: 'auto' }}
              >
                ×
              </button>
            )}

            {/* Handles de redimensionado */}
            {(isHovered || isDragging || isResizing) && (
              <>
                {/* Esquina inferior derecha */}
                <div
                  className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-70 hover:opacity-100"
                  style={{
                    borderBottomRightRadius: '8px',
                    pointerEvents: 'auto'
                  }}
                  onMouseDown={(e) => handleResize(e, 'se')}
                />
                
                {/* Esquina inferior izquierda */}
                <div
                  className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 cursor-sw-resize opacity-70 hover:opacity-100"
                  style={{
                    borderBottomLeftRadius: '8px',
                    pointerEvents: 'auto'
                  }}
                  onMouseDown={(e) => handleResize(e, 'sw')}
                />
                
                {/* Esquina superior derecha */}
                <div
                  className="absolute top-0 right-0 w-4 h-4 bg-blue-500 cursor-ne-resize opacity-70 hover:opacity-100"
                  style={{
                    borderTopRightRadius: '8px',
                    pointerEvents: 'auto'
                  }}
                  onMouseDown={(e) => handleResize(e, 'ne')}
                />
                
                {/* Esquina superior izquierda */}
                <div
                  className="absolute top-0 left-0 w-4 h-4 bg-blue-500 cursor-nw-resize opacity-70 hover:opacity-100"
                  style={{
                    borderTopLeftRadius: '8px',
                    pointerEvents: 'auto'
                  }}
                  onMouseDown={(e) => handleResize(e, 'nw')}
                />
              </>
            )}
          </div>
          
          {/* Indicador de interacción */}
          <div
            className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-200 ${
              isHovered || isDragging || isResizing ? 'opacity-80' : 'opacity-0'
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
            {isResizing ? 'Redimensionando...' : isDragging ? 'Moviendo...' : 'Mover y redimensionar'}
          </div>
        </div>
      </Draggable>
    </div>
  );
}
