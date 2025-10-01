'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Trash2, Edit, Settings } from 'lucide-react';
import ImageUploadWithPreview from '@/components/ImageUploadWithPreview';
import { UploadResult } from '@/lib/firebase-storage';
import { useCategories } from '@/hooks/useCategories';
import { useCandles, Candle } from '@/hooks/useCandles';
import { useInitializeData } from '@/hooks/useInitializeData';

interface CandleCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}


export default function AdminCandlesPage() {
  // Inicializar datos por defecto
  useInitializeData();
  
  // Hooks de Firestore
  const { categories, addCategory, deleteCategory, isLoading: categoriesLoading } = useCategories();
  const { candles, addCandle, updateCandle, deleteCandle, isLoading: candlesLoading } = useCandles();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingCandle, setEditingCandle] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    type: 'cylindrical' as const,
    isActive: true,
    imageUrl: ''
  });

  // Esta función ya no se usa, se reemplazó por handleImageUpload

  const handleEditCandle = (candle: Candle) => {
    console.log('Editando vela:', candle);
    setFormData({
      name: candle.name,
      description: candle.description,
      price: candle.price,
      category: candle.category,
      type: candle.type,
      isActive: candle.isActive,
      imageUrl: candle.imageUrl
    });
    setEditingCandle(candle.id);
    setShowUploadForm(true);
    console.log('Formulario abierto para edición');
  };

  const handleDeleteCandle = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta vela?')) {
      const result = await deleteCandle(id);
      if (result.success) {
        setSaveMessage('Vela eliminada exitosamente');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setErrorMessage('Error al eliminar la vela');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) return;
    
    const result = await addCategory({
      name: newCategory.name,
      description: newCategory.description
    });
    
    if (result.success) {
      setNewCategory({ name: '', description: '' });
      setShowCategoryModal(false);
      setSaveMessage('Categoría creada exitosamente');
      setErrorMessage('');
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setErrorMessage(result.error || 'Error al crear la categoría');
      setSaveMessage('');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      const result = await deleteCategory(id);
      if (result.success) {
        setSaveMessage('Categoría eliminada exitosamente');
        setErrorMessage('');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setErrorMessage('Error al eliminar la categoría: ' + (result.error || 'Error desconocido'));
        setSaveMessage('');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleImageUpload = (result: UploadResult) => {
    console.log('Image uploaded successfully:', result);
    setFormData(prev => ({
      ...prev,
      imageUrl: result.url
    }));
    setSaveMessage('Imagen subida correctamente');
    setTimeout(() => setSaveMessage(''), 2000);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSaveMessage('');
    setIsSubmitting(true);
    
    if (!formData.name.trim() || !formData.category || !formData.imageUrl) {
      setErrorMessage('Por favor completa todos los campos obligatorios');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting form data:', formData);
      
      let result;
      if (editingCandle) {
        // Actualizar vela existente
        result = await updateCandle(editingCandle, {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          type: formData.type,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive
        });
        console.log('Update candle result:', result);
      } else {
        // Crear nueva vela
        result = await addCandle({
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          type: formData.type,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive
        });
        console.log('Add candle result:', result);
      }

      if (result.success) {
        setFormData({
          name: '',
          description: '',
          price: 0,
          category: '',
          type: 'cylindrical',
          isActive: true,
          imageUrl: ''
        });
        setEditingCandle(null);
        setShowUploadForm(false);
        setSaveMessage(editingCandle ? 'Vela actualizada exitosamente' : 'Vela agregada exitosamente');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setErrorMessage(result.error || (editingCandle ? 'Error al actualizar la vela' : 'Error al agregar la vela'));
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrorMessage('Error inesperado al procesar la vela');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Link href="/admin" className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-4xl font-light text-gray-900">
              Galería de Velas
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Sube las fotos de tus velas reales para que los clientes puedan personalizarlas
          </p>
        </motion.div>

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-xl"
          >
            {saveMessage}
          </motion.div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-xl"
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-light text-gray-900">
              {editingCandle ? `Editar Vela (ID: ${editingCandle})` : 'Agregar Nueva Vela'}
            </h2>
            <button
              onClick={() => {
                setShowUploadForm(!showUploadForm);
                if (!showUploadForm) {
                  setEditingCandle(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    category: '',
                    type: 'cylindrical',
                    isActive: true,
                    imageUrl: ''
                  });
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showUploadForm ? 'Cancelar' : 'Nueva Vela'}
            </button>
          </div>
          
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-6"
            >
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Información Básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de la Vela *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Vela Cilíndrica Rosa"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="29.99"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={3}
                    placeholder="Describe las características de esta vela..."
                  />
                </div>

                {/* Categoría y Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      >
                        <option value="">Seleccionar categoría</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryModal(true)}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                        title="Administrar galerías"
                      >
                        <Settings className="h-4 w-4" />
                        Administrar Galerías
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Vela *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="cylindrical">Cilíndrica</option>
                      <option value="tapered">Cónica</option>
                      <option value="pillar">Columna</option>
                      <option value="jar">Frasco</option>
                    </select>
                  </div>
                </div>

                {/* Subida de Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen de la Vela *
                  </label>
                  <ImageUploadWithPreview
                    folder="candles"
                    onUpload={handleImageUpload}
                    currentImage={formData.imageUrl}
                    recommendedSize={{ width: 600, height: 600 }}
                    className="mb-4"
                  />
                  <p className="text-xs text-gray-500">
                    La imagen será recortada automáticamente al tamaño recomendado (600x600px)
                  </p>
                </div>

                {/* Estado */}
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Vela activa (visible para clientes)
                  </label>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingCandle ? 'Actualizando...' : 'Agregando...'}
                      </>
                    ) : (
                      editingCandle ? 'Actualizar Vela' : 'Agregar Vela'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setEditingCandle(null);
                      setFormData({
                        name: '',
                        description: '',
                        price: 0,
                        category: '',
                        type: 'cylindrical',
                        isActive: true,
                        imageUrl: ''
                      });
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 rounded-xl p-6 mb-8"
        >
          <h3 className="font-medium text-blue-900 mb-3">
            📸 Instrucciones para las fotos:
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Fondo blanco o neutro</strong> - Para mejor resultado con IA</li>
            <li>• <strong>Buena iluminación</strong> - Sin sombras fuertes</li>
            <li>• <strong>Vela centrada</strong> - Que ocupe el 70% de la imagen</li>
            <li>• <strong>Sin texto</strong> - La vela debe estar limpia, sin nombres</li>
            <li>• <strong>Alta resolución</strong> - Mínimo 800x800px</li>
          </ul>
        </motion.div>

        {/* Candle Photos Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-light text-gray-900 mb-6">
            Fotos de Velas ({candles.length})
          </h2>
          
          {candles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <div className="text-gray-400 mb-4">
                <Upload className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-gray-600 mb-2">No hay fotos de velas subidas</p>
              <p className="text-sm text-gray-500">Sube tus primeras fotos para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candles.map((candle) => (
                <motion.div
                  key={candle.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
                >
                  <div className="aspect-square relative">
                    <img
                      src={candle.imageUrl}
                      alt={candle.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button 
                        onClick={() => {
                          console.log('Botón editar clickeado para vela:', candle.id);
                          handleEditCandle(candle);
                        }}
                        className="p-1 bg-white/80 rounded-full hover:bg-white transition-colors"
                        title="Editar vela"
                      >
                        <Edit className="h-3 w-3 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCandle(candle.id)}
                        className="p-1 bg-red-500/80 rounded-full hover:bg-red-500 transition-colors"
                        title="Eliminar vela"
                      >
                        <Trash2 className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{candle.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{candle.type}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(candle.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Category Management Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowCategoryModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Administrar Galerías
                  </h2>
                  
                  {/* Existing Categories */}
                  <div className="space-y-4 mb-6">
                    <h3 className="text-lg font-semibold text-gray-700">Galerías Existentes</h3>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Category */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Crear Nueva Galería</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre de la Galería
                        </label>
                        <input
                          type="text"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Ej: Velas de Navidad"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descripción (opcional)
                        </label>
                        <textarea
                          value={newCategory.description}
                          onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                          rows={2}
                          placeholder="Describe el propósito de esta galería..."
                        />
                      </div>
                      <button
                        onClick={handleCreateCategory}
                        disabled={!newCategory.name.trim()}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Crear Galería
                      </button>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
