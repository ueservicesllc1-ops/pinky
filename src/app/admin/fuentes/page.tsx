'use client';

import React, { useState } from 'react';
import { Upload, Trash2, Eye, Download } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, deleteDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase';
import SuccessModal from '@/components/SuccessModal';

interface CustomFont {
  id: string;
  name: string;
  fileName: string;
  downloadURL: string;
  uploadedAt: Date;
  category: string;
}

export default function FuentesAdminPage() {
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Cargar fuentes personalizadas
  React.useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'customFonts'), (snapshot) => {
      const fonts: CustomFont[] = [];
      snapshot.forEach((doc) => {
        fonts.push({ id: doc.id, ...doc.data() } as CustomFont);
      });
      setCustomFonts(fonts);
    });

    return () => unsubscribe();
  }, []);

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea un archivo de fuente
    const validExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      alert('Por favor selecciona un archivo de fuente válido (.ttf, .otf, .woff, .woff2)');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Generar ID único para la fuente
      const fontId = `custom_font_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Subir archivo a Firebase Storage
      const storageRef = ref(storage, `custom-fonts/${fontId}${fileExtension}`);
      
      // Simular progreso
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const uploadTask = await uploadBytes(storageRef, file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(uploadTask.ref);
      
      // Guardar metadatos en Firestore
      const fontData = {
        name: file.name.replace(fileExtension, ''),
        fileName: file.name,
        downloadURL: downloadURL,
        uploadedAt: new Date(),
        category: 'Personalizada'
      };

      await addDoc(collection(db, 'customFonts'), fontData);

      setShowSuccessModal(true);
      
      // Limpiar input
      e.target.value = '';

    } catch (error) {
      console.error('Error uploading font:', error);
      alert('Error al subir la fuente. Inténtalo de nuevo.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFont = async (fontId: string, fileName: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta fuente?')) return;

    try {
      // Eliminar de Firestore
      await deleteDoc(doc(db, 'customFonts', fontId));
      
      // Eliminar archivo de Storage
      const storageRef = ref(storage, `custom-fonts/${fileName}`);
      await deleteObject(storageRef);
      
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error deleting font:', error);
      alert('Error al eliminar la fuente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Upload className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestión de Fuentes</h1>
                <p className="text-gray-600">Sube y gestiona fuentes personalizadas para las velas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subir Nueva Fuente</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div>
              <p className="text-gray-600 mb-2">
                Arrastra un archivo de fuente aquí o haz clic para seleccionar
              </p>
              <input
                type="file"
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFontUpload}
                disabled={isUploading}
                className="hidden"
                id="font-upload"
              />
              <label
                htmlFor="font-upload"
                className={`inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors cursor-pointer ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Subiendo...' : 'Seleccionar Fuente'}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Formatos soportados: TTF, OTF, WOFF, WOFF2 • Máximo: 10MB
            </p>
            
            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">{uploadProgress}% completado</p>
              </div>
            )}
          </div>
        </div>

        {/* Fonts List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Fuentes Personalizadas</h2>
          
          {customFonts.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay fuentes personalizadas</h3>
              <p className="text-gray-500">Sube tu primera fuente para comenzar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customFonts.map((font) => (
                <div key={font.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 truncate">{font.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteFont(font.id, font.fileName)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        title="Eliminar fuente"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div 
                      className="text-lg font-medium text-gray-800"
                      style={{ fontFamily: font.name }}
                    >
                      ABC abc 123
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Archivo:</strong> {font.fileName}</p>
                    <p><strong>Subido:</strong> {new Date(font.uploadedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="Operación completada exitosamente"
        />
      </div>
    </div>
  );
}
