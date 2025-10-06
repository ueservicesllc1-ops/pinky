'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface SimpleImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (imageFile: File) => void;
}

export default function SimpleImageUploadModal({ isOpen, onClose, onImageUploaded }: SimpleImageUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setSelectedFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    
    // Pasar el archivo directamente
    onImageUploaded(selectedFile);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Subir Imagen</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* File Input */}
        <div className="mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 hover:bg-pink-50 transition-colors cursor-pointer block"
          >
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {selectedFile ? 'Cambiar imagen' : 'Selecciona una imagen'}
            </p>
            <p className="text-sm text-gray-500">
              JPG, PNG, GIF • Máximo 5MB
            </p>
            <p className="text-xs text-blue-600 mt-2 font-medium">
              💡 Recomendado: 800x800px o más para mejor calidad
            </p>
          </label>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Vista previa:</h3>
            <div className="border rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="flex-1 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Usar Imagen
          </button>
        </div>
      </div>
    </div>
  );
}
