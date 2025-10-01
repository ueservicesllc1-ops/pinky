'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Move, ZoomIn, ZoomOut, RotateCw, Crop, Check } from 'lucide-react';
import { uploadImage, UploadResult } from '@/lib/firebase-storage';

interface ImageUploadWithPreviewProps {
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup';
  onUpload: (result: UploadResult) => void;
  currentImage?: string;
  recommendedSize?: { width: number; height: number };
  className?: string;
}

interface ImageTransform {
  scale: number;
  translateX: number;
  translateY: number;
  rotate: number;
}

export default function ImageUploadWithPreview({
  folder,
  onUpload,
  currentImage,
  recommendedSize = { width: 600, height: 600 },
  className = ''
}: ImageUploadWithPreviewProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(currentImage || null);

  // Debug: Log previewImage changes
  React.useEffect(() => {
    console.log('previewImage changed:', previewImage ? 'Has image' : 'No image');
  }, [previewImage]);

  // Debug: Log component initialization
  React.useEffect(() => {
    console.log('ImageUploadWithPreview initialized with:', {
      currentImage,
      previewImage,
      showEditor
    });
  }, []);

  // Actualizar previewImage cuando cambie currentImage
  React.useEffect(() => {
    console.log('currentImage prop changed:', currentImage);
    if (currentImage && currentImage !== previewImage) {
      setPreviewImage(currentImage);
      setUploadedImageUrl(currentImage);
      // Resetear transformaciones para la nueva imagen
      setTransform({
        scale: 1,
        translateX: 0,
        translateY: 0,
        rotate: 0
      });
      // Si hay una imagen, abrir automáticamente el editor
      setShowEditor(true);
      console.log('Updated previewImage to:', currentImage, 'and opened editor');
    }
  }, [currentImage, previewImage]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [transform, setTransform] = useState<ImageTransform>({
    scale: 0.6,
    translateX: 0,
    translateY: 0,
    rotate: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    console.log('File selected:', file.name, file.type, file.size);
    
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    setSelectedFile(file);
    
    // Crear preview de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      console.log('FileReader result:', result ? 'Image loaded' : 'No image data');
      setPreviewImage(result);
      setShowEditor(true);
      // Reset transform
      setTransform({
        scale: 1,
        translateX: 0,
        translateY: 0,
        rotate: 0
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleTransformChange = useCallback((newTransform: Partial<ImageTransform>) => {
    setTransform(prev => ({ ...prev, ...newTransform }));
  }, []);

  const cropAndUploadImage = async () => {
    if (!selectedFile || !previewImage) return;

    setIsUploading(true);
    try {
      // Crear canvas para recortar la imagen
      const canvas = canvasRef.current;
      const image = imageRef.current;
      
      if (!canvas || !image) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Configurar canvas con el tamaño recomendado
      canvas.width = recommendedSize.width;
      canvas.height = recommendedSize.height;

      // Limpiar el canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Centrar la imagen en el canvas
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();
      
      // Aplicar transformaciones desde el centro
      ctx.translate(centerX, centerY);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      
      // Aplicar el escalado y posición
      ctx.scale(transform.scale, transform.scale);
      ctx.translate(transform.translateX / transform.scale, transform.translateY / transform.scale);
      
      // Dibujar la imagen centrada (sin escalar manualmente, el ctx.scale ya lo hace)
      ctx.drawImage(
        image,
        -image.naturalWidth / 2,
        -image.naturalHeight / 2,
        image.naturalWidth,
        image.naturalHeight
      );
      
      ctx.restore();

      // Convertir canvas a blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Crear archivo desde blob
        const croppedFile = new File([blob], selectedFile.name, {
          type: selectedFile.type
        });

        console.log('Uploading cropped image to Firebase Storage...', {
        canvasSize: { width: canvas.width, height: canvas.height },
        transform: transform,
        imageSize: { width: image.naturalWidth, height: image.naturalHeight }
      });
        
        // Subir a Firebase Storage
        const result = await uploadImage(croppedFile, folder);
        console.log('Image uploaded successfully:', result);
        
        onUpload(result);
        
        setShowEditor(false);
        setPreviewImage(result.url);
        setUploadedImageUrl(result.url);
        setSelectedFile(null);
        setIsUploading(false);
      }, selectedFile.type, 0.9);

    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error al procesar la imagen');
      setIsUploading(false);
    }
  };

  const resetTransform = () => {
    setTransform({
      scale: 1,
      translateX: 0,
      translateY: 0,
      rotate: 0
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {!showEditor && (
        <div
          className={`
            relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
            ${dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            console.log('File input changed:', e.target.files);
            handleFileSelect(e.target.files);
          }}
          className="hidden"
        />

          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2"></div>
              <p className="text-sm text-gray-600">Procesando imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {dragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
              </p>
              <p className="text-xs text-gray-500">
                Tamaño recomendado: {recommendedSize.width}x{recommendedSize.height}px
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG hasta 10MB
              </p>
            </div>
          )}
        </div>
      )}

      {/* Image Editor */}
      {showEditor && previewImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-xl p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ajustar Imagen</h3>
            <button
              onClick={() => setShowEditor(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Preview Area */}
            <div className="lg:col-span-2 max-w-sm mx-auto">
              <div className="relative bg-gray-50 rounded-lg overflow-hidden" style={{ aspectRatio: `${recommendedSize.width}/${recommendedSize.height}`, maxWidth: '200px' }}>
                {/* Mask Overlay - Solo borde punteado, sin overlay sólido */}
                <div className="absolute inset-0 border-2 border-purple-500 border-dashed rounded-lg pointer-events-none z-10">
                </div>
                
                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden rounded-lg z-0">
                  {previewImage ? (
                    <img
                      ref={imageRef}
                      src={previewImage}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain z-0"
                      style={{
                        transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px) rotate(${transform.rotate}deg)`,
                        transformOrigin: 'center center'
                      }}
                      onLoad={() => {
                        console.log('Image loaded in preview');
                        // Set initial zoom to 60% (40% reduction from 100%)
                        // This ensures the image starts at a more reasonable size
                        setTransform(prev => ({ 
                          ...prev, 
                          scale: 0.6,
                          translateX: 0,
                          translateY: 0
                        }));
                      }}
                      onError={(e) => {
                        console.error('Error loading image:', e);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <p className="text-gray-500 text-sm">No hay imagen seleccionada</p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-500">
                    La imagen debe encajar en el área punteada ({recommendedSize.width}x{recommendedSize.height}px)
                  </p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-2 space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Controles</h4>
                
                {/* Zoom */}
                <div className="space-y-1 mb-3">
                  <label className="text-xs text-gray-600">Zoom</label>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleTransformChange({ scale: Math.max(0.1, transform.scale - 0.1) })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <ZoomOut className="h-3 w-3" />
                    </button>
                    <span className="text-xs text-gray-600 min-w-[2.5rem] text-center">
                      {Math.round(transform.scale * 100)}%
                    </span>
                    <button
                      onClick={() => handleTransformChange({ scale: Math.min(3, transform.scale + 0.1) })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                      <ZoomIn className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Position */}
                <div className="space-y-1 mb-3">
                  <label className="text-xs text-gray-600">Posición</label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => handleTransformChange({ translateX: transform.translateX - 10 })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs"
                    >
                      ← Izq
                    </button>
                    <button
                      onClick={() => handleTransformChange({ translateX: transform.translateX + 10 })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs"
                    >
                      Der →
                    </button>
                    <button
                      onClick={() => handleTransformChange({ translateY: transform.translateY - 10 })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs"
                    >
                      ↑ Arr
                    </button>
                    <button
                      onClick={() => handleTransformChange({ translateY: transform.translateY + 10 })}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition-colors text-xs"
                    >
                      ↓ Abj
                    </button>
                  </div>
                </div>

                {/* Rotation */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs text-gray-600">Rotación</label>
                  <button
                    onClick={() => handleTransformChange({ rotate: transform.rotate + 90 })}
                    className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RotateCw className="h-4 w-4" />
                    <span className="text-xs">Girar 90°</span>
                  </button>
                </div>

                {/* Reset */}
                <button
                  onClick={resetTransform}
                  className="w-full p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <Crop className="h-4 w-4" />
                  <span className="text-xs">Resetear</span>
                </button>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowEditor(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={cropAndUploadImage}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4" />
                        Confirmar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Current Image Display */}
      {uploadedImageUrl && !showEditor && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Imagen seleccionada</h4>
          <div className="relative inline-block">
            <div 
              className="bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
              style={{ 
                width: '200px', 
                height: `${200 * (recommendedSize.height / recommendedSize.width)}px`,
                aspectRatio: `${recommendedSize.width}/${recommendedSize.height}`
              }}
            >
              <img
                src={uploadedImageUrl}
                alt="Selected image"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => {
                setUploadedImageUrl(null);
                setPreviewImage(null);
                setSelectedFile(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-xs text-green-600">✅ Imagen guardada en Firebase Storage</p>
        </div>
      )}

      {/* Hidden Canvas for Processing */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </div>
  );
}
