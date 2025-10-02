'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, User, MapPin, Eye, EyeOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { migrateTestimonials } from '@/lib/migrate-testimonials';
import TestimonialsTest from '@/components/TestimonialsTest';
import TestimonialsStatus from '@/components/TestimonialsStatus';

export default function TestimonialsAdminPage() {
  const { testimonials, isLoading, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    text: '',
    avatar: '',
    isActive: true,
    order: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let result;
    if (editingTestimonial) {
      result = await updateTestimonial(editingTestimonial.id, formData);
    } else {
      result = await addTestimonial(formData);
    }

    if (result.success) {
      setFormData({
        name: '',
        location: '',
        rating: 5,
        text: '',
        avatar: '',
        isActive: true,
        order: 1
      });
      setEditingTestimonial(null);
      setShowForm(false);
      setSaveMessage(editingTestimonial ? 'Testimonio actualizado exitosamente' : 'Testimonio agregado exitosamente');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      location: testimonial.location,
      rating: testimonial.rating,
      text: testimonial.text,
      avatar: testimonial.avatar,
      isActive: testimonial.isActive,
      order: testimonial.order
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este testimonio?')) {
      const result = await deleteTestimonial(id);
      if (result.success) {
        setSaveMessage('Testimonio eliminado exitosamente');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    }
  };

  const toggleActive = async (testimonial: Testimonial) => {
    await updateTestimonial(testimonial.id, { isActive: !testimonial.isActive });
  };

  // Generar avatar automáticamente basado en el nombre
  const generateAvatar = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      avatar: generateAvatar(name)
    }));
  };

  const handleMigration = async () => {
    // Verificar si ya existen testimonios
    if (testimonials.length > 0) {
      const confirmMigrate = confirm(`Ya existen ${testimonials.length} testimonios. ¿Deseas agregar los testimonios originales de todos modos?`);
      if (!confirmMigrate) {
        return;
      }
    }

    if (confirm('¿Estás seguro de que quieres migrar los testimonios originales? Esto agregará 6 testimonios de ejemplo.')) {
      setIsMigrating(true);
      setSaveMessage('🔄 Migrando testimonios...');
      
      try {
        const result = await migrateTestimonials();
        
        if (result.success) {
          setSaveMessage(`✅ Migración completada: ${result.count} testimonios agregados`);
          console.log('✅ Migration completed:', result);
          // Recargar la página después de un breve delay para ver los cambios
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          setSaveMessage(`❌ Error en migración: ${result.error}`);
        }
      } catch (error) {
        console.error('❌ Migration error:', error);
        setSaveMessage('❌ Error inesperado durante la migración');
      } finally {
        setTimeout(() => setSaveMessage(''), 5000);
        setIsMigrating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonios de Clientes</h1>
          <p className="text-gray-600 mt-2">
            Gestiona los testimonios que aparecen en la página principal
          </p>
        </div>
        
        <div className="flex space-x-3">
          {testimonials.length === 0 && (
            <Button
              onClick={handleMigration}
              disabled={isMigrating}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isMigrating ? 'Migrando...' : 'Migrar Datos'}
            </Button>
          )}
          
          <Button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) {
                setEditingTestimonial(null);
                setFormData({
                  name: '',
                  location: '',
                  rating: 5,
                  text: '',
                  avatar: '',
                  isActive: true,
                  order: testimonials.length + 1
                });
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? 'Cancelar' : 'Nuevo Testimonio'}
          </Button>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg"
        >
          {saveMessage}
        </motion.div>
      )}

      {/* Formulario */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                {editingTestimonial ? 'Editar Testimonio' : 'Agregar Nuevo Testimonio'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Cliente *
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ej: María González"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ej: Madrid, España"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calificación
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>
                          {rating} estrella{rating !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Avatar (Auto-generado)
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {formData.avatar || 'XX'}
                      </div>
                      <Input
                        type="text"
                        value={formData.avatar}
                        onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                        placeholder="Ej: MG"
                        maxLength={3}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden de Aparición
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
                      min="1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Testimonio activo
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonio *
                  </label>
                  <Textarea
                    value={formData.text}
                    onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Escribe aquí el testimonio del cliente..."
                    rows={4}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingTestimonial(null);
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                    {editingTestimonial ? 'Actualizar' : 'Agregar'} Testimonio
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Lista de testimonios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`h-full ${!testimonial.isActive ? 'opacity-60' : ''}`}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      {testimonial.location && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {testimonial.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleActive(testimonial)}
                      className="p-1"
                    >
                      {testimonial.isActive ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(testimonial)}
                      className="p-1"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < testimonial.rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    ({testimonial.rating}/5)
                  </span>
                </div>

                {/* Testimonio */}
                <p className="text-gray-700 text-sm italic mb-4 line-clamp-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Metadata */}
                <div className="text-xs text-gray-500 border-t pt-3">
                  <div>Orden: {testimonial.order}</div>
                  <div>Creado: {testimonial.createdAt.toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Estado vacío */}
      {testimonials.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay testimonios
          </h3>
          <p className="text-gray-600 mb-6">
            Agrega el primer testimonio de cliente para empezar
          </p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Testimonio
          </Button>
        </motion.div>
      )}

      {/* Estado de Firebase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-12"
      >
        <TestimonialsStatus />
      </motion.div>

      {/* Test Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="mt-8"
      >
        <TestimonialsTest />
      </motion.div>
    </div>
  );
}
