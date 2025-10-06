'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageUploaded: (imageFile: File) => void;
}

interface UploadProgress {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export default function ImageUploadModal({ isOpen, onClose, onImageUploaded }: ImageUploadModalProps) {
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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadStatus({ uploading: true, progress: 0, error: null, success: false });

    try {
      // Generar ID único para la imagen
      const imageId = `user_image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Crear referencia en Firebase Storage
      const storageRef = ref(storage, `user-images/${imageId}`);
      
      // Subir archivo
      const uploadTask = uploadBytes(storageRef, selectedFile);
      
      // Simular progreso (Firebase no proporciona progreso real en uploadBytes)
      const progressInterval = setInterval(() => {
        setUploadStatus(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      const snapshot = await uploadTask;
      clearInterval(progressInterval);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Guardar metadatos en Firestore
      const metadata = {
        id: imageId,
        originalName: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        uploadedAt: new Date(),
        downloadURL: downloadURL,
        userId: 'anonymous', // En el futuro se puede asociar con usuario autenticado
        used: false
      };

      await setDoc(doc(db, 'userImages', imageId), metadata);

      setUploadStatus({
        uploading: false,
        progress: 100,
        error: null,
        success: true
      });

      // Llamar callback con la URL de la imagen
      onImageUploaded(downloadURL, imageId);

      // Cerrar modal después de 1.5 segundos
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadStatus({
        uploading: false,
        progress: 0,
        error: 'Error al subir la imagen. Inténtalo de nuevo.',
        success: false
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadStatus({ uploading: false, progress: 0, error: null, success: false });
    onClose();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <ImageIcon className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Subir Imagen</h2>
              <p className="text-sm text-gray-600">Agrega tu propia imagen a la vela</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={uploadStatus.uploading}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              selectedFile
                ? 'border-green-300 bg-green-50'
                : 'border-gray-300 hover:border-pink-400 hover:bg-pink-50'
            }`}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="mx-auto max-h-32 max-w-32 object-contain rounded-lg shadow-sm"
                />
                <p className="text-sm text-green-600 font-medium">
                  ✓ Imagen seleccionada: {selectedFile?.name}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <p className="text-gray-600 mb-2">
                    Arrastra una imagen aquí o haz clic para seleccionar
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                  >
                    Seleccionar Imagen
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, GIF • Máximo: 5MB
                </p>
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Progress */}
          {uploadStatus.uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subiendo imagen...</span>
                <span className="text-gray-600">{uploadStatus.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadStatus.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-medium">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{uploadStatus.error}</p>
            </div>
          )}

          {uploadStatus.success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-700 font-medium">¡Imagen subida exitosamente!</p>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Tu imagen está lista para usar en la vela.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={uploadStatus.uploading}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploadStatus.uploading}
              className="flex-1 bg-pink-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus.uploading ? 'Subiendo...' : 'Subir Imagen'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            Las imágenes se almacenan de forma segura y solo tú puedes usarlas.
          </p>
        </div>
      </div>
    </div>
  );
}
