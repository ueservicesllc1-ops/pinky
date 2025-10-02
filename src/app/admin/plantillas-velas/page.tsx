'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Edit, Eye, Plus, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ImageUpload from '@/components/ImageUpload';
import { UploadResult } from '@/lib/firebase-storage';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CandleTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminPlantillasVelasPage() {
  const [templates, setTemplates] = useState<CandleTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CandleTemplate | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Cilíndrica',
    isActive: true
  });

  const categories = [
    'Cilíndrica',
    'Columna', 
    'Cónica',
    'Frasco',
    'Especial'
  ];

  // Cargar plantillas
  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      const templatesRef = collection(db, 'candle-templates');
      const snapshot = await getDocs(templatesRef);
      
      const templatesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as CandleTemplate[];

      setTemplates(templatesData);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  // Manejar subida de imagen
  const handleImageUpload = async (result: UploadResult) => {
    console.log('Resultado de subida:', result);
    
    if (!result.url) {
      console.error('No se recibió URL de la imagen:', result);
      alert('Error al subir la imagen - no se recibió URL');
      return;
    }

    try {
      setIsUploading(true);
      
      const templateData = {
        ...formData,
        imageUrl: result.url,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Guardando plantilla:', templateData);
      
      const docRef = await addDoc(collection(db, 'candle-templates'), templateData);
      console.log('Plantilla guardada con ID:', docRef.id);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Cilíndrica',
        isActive: true
      });
      setShowUploadForm(false);
      
      // Reload templates
      await loadTemplates();
      
      alert('Plantilla agregada exitosamente');
    } catch (error) {
      console.error('Error saving template:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error details:', errorMessage);
      alert(`Error al guardar la plantilla: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Eliminar plantilla
  const handleDelete = async (templateId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta plantilla?')) return;

    try {
      await deleteDoc(doc(db, 'candle-templates', templateId));
      await loadTemplates();
      alert('Plantilla eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Error al eliminar la plantilla');
    }
  };

  // Toggle activo/inactivo
  const handleToggleActive = async (template: CandleTemplate) => {
    try {
      await updateDoc(doc(db, 'candle-templates', template.id), {
        isActive: !template.isActive,
        updatedAt: new Date()
      });
      await loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      alert('Error al actualizar la plantilla');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plantillas de Velas</h1>
          <p className="text-gray-600 mt-2">
            Gestiona las plantillas de velas que los usuarios pueden personalizar
          </p>
        </div>
        <Button
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Agregar Nueva Plantilla</h2>
              <Button
                variant="ghost"
                onClick={() => setShowUploadForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Plantilla
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Vela Cilíndrica Rosa"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción de la plantilla"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de la Vela
                </label>
                <ImageUpload
                  onUpload={handleImageUpload}
                  folder="candle-templates"
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  disabled={isUploading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Sube una imagen PNG transparente o JPG de alta calidad de la vela
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowUploadForm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{template.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(template)}
                      className={template.isActive ? 'text-green-600' : 'text-gray-400'}
                    >
                      {template.isActive ? '✓' : '○'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(template.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {template.imageUrl ? (
                    <img
                      src={template.imageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {template.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {template.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                  <span>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay plantillas disponibles
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primera plantilla de vela
          </p>
          <Button
            onClick={() => setShowUploadForm(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primera Plantilla
          </Button>
        </div>
      )}
    </div>
  );
}
