'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage, deleteImageByUrl, UploadResult } from '@/lib/firebase-storage';

interface ImageUploadProps {
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup';
  onUpload: (result: UploadResult) => void;
  onDelete?: (url: string) => void;
  currentImage?: string;
  maxFiles?: number;
  accept?: string;
  className?: string;
}

export default function ImageUpload({
  folder,
  onUpload,
  onDelete,
  currentImage,
  maxFiles = 1,
  accept = 'image/*',
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(currentImage ? [currentImage] : []);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Por favor selecciona solo archivos de imagen');
      return;
    }

    if (validFiles.length > maxFiles) {
      alert(`Solo puedes subir ${maxFiles} imagen${maxFiles > 1 ? 'es' : ''} a la vez`);
      return;
    }

    setIsUploading(true);

    try {
      for (const file of validFiles) {
        const result = await uploadImage(file, folder);
        setUploadedImages(prev => [...prev, result.url]);
        onUpload(result);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      alert('Error al subir la imagen. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    try {
      await deleteImageByUrl(imageUrl);
      setUploadedImages(prev => prev.filter(img => img !== imageUrl));
      onDelete?.(imageUrl);
    } catch (error) {
      console.error('Error deleting:', error);
      // Si es una URL externa (no de Firebase), simplemente removerla de la UI
      if (!imageUrl.includes('firebasestorage.googleapis.com')) {
        console.warn('Removiendo imagen externa de la UI:', imageUrl);
        setUploadedImages(prev => prev.filter(img => img !== imageUrl));
        onDelete?.(imageUrl);
      } else {
        alert('Error al eliminar la imagen de Firebase Storage');
      }
    }
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
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
          accept={accept}
          multiple={maxFiles > 1}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-2" />
            <p className="text-sm text-gray-600">Subiendo imagen...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {dragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG hasta 10MB
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Imágenes subidas ({uploadedImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((imageUrl, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group"
              >
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(imageUrl)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
                
                {/* Loading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview */}
      {currentImage && !uploadedImages.includes(currentImage) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Imagen actual</h4>
          <div className="relative inline-block">
            <div className="aspect-video w-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={currentImage}
                alt="Current image"
                className="w-full h-full object-cover"
              />
            </div>
            {onDelete && (
              <button
                onClick={() => handleDelete(currentImage)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
