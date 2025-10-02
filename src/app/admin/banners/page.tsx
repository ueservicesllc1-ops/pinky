'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Upload, Trash2, Edit, Eye, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { UploadResult } from '@/lib/firebase-storage';
import { useBanners, Banner } from '@/hooks/useBanners';


// Lista de páginas disponibles para el botón
const availablePages = [
  { value: '/personalizadas', label: 'Personalizadas' },
  { value: '/catalogo', label: 'Catálogo' },
  { value: '/nosotros', label: 'Nosotros' },
  { value: '/carrito', label: 'Carrito' },
  { value: '/ia-generator', label: 'Generador IA' },
  { value: '/politicas-envio', label: 'Políticas de Envío' },
  { value: '/terminos', label: 'Términos y Condiciones' }
];

export default function AdminBannersPage() {
  const { banners, addBanner, updateBanner, deleteBanner, isLoading } = useBanners();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    buttonText: 'Ver Más',
    buttonLink: '',
    imageUrl: '',
    isActive: true,
    order: 1,
    imageZoom: 1,
    imagePosition: { x: 0, y: 0 },
    showMemberDiscount: false,
    discountText: 'Solo para miembros registrados el 30% de descuentos'
  });

  const handleImageUpload = (result: UploadResult) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: result.url,
      imageZoom: 1,
      imagePosition: { x: 0, y: 0 }
    }));
    // Reset zoom and position when new image is uploaded
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(imageZoom + 0.2, 3); // Max zoom 3x
    setImageZoom(newZoom);
    setFormData(prev => ({ ...prev, imageZoom: newZoom }));
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(imageZoom - 0.2, 0.3); // Min zoom 0.3x
    setImageZoom(newZoom);
    setFormData(prev => ({ ...prev, imageZoom: newZoom }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    const newPosition = { x: newX, y: newY };
    setImagePosition(newPosition);
    setFormData(prev => ({ ...prev, imagePosition: newPosition }));
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    setSaveMessage('');
    setIsSubmitting(true);

    if (!formData.imageUrl.trim()) {
      setErrorMessage('Por favor sube una imagen');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Submitting banner data:', formData);
      
      let result;
      if (editingBanner) {
        // Actualizar banner existente
        result = await updateBanner(editingBanner, {
          title: formData.title,
          subtitle: formData.subtitle,
          buttonText: formData.buttonText,
          buttonLink: formData.buttonLink,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive,
          order: formData.order,
          imageZoom: formData.imageZoom,
          imagePosition: formData.imagePosition,
          showMemberDiscount: formData.showMemberDiscount,
          discountText: formData.discountText
        });
        console.log('Update banner result:', result);
      } else {
        // Crear nuevo banner
        result = await addBanner({
          title: formData.title,
          subtitle: formData.subtitle,
          buttonText: formData.buttonText,
          buttonLink: formData.buttonLink,
          imageUrl: formData.imageUrl,
          isActive: formData.isActive,
          order: formData.order,
          imageZoom: formData.imageZoom,
          imagePosition: formData.imagePosition,
          showMemberDiscount: formData.showMemberDiscount,
          discountText: formData.discountText
        });
        console.log('Add banner result:', result);
      }

      if (result.success) {
        setFormData({
          title: '',
          subtitle: '',
          buttonText: 'Ver Más',
          buttonLink: '',
          imageUrl: '',
          isActive: true,
          order: 1,
          imageZoom: 1,
          imagePosition: { x: 0, y: 0 },
          showMemberDiscount: false,
          discountText: 'Solo para miembros registrados el 30% de descuentos'
        });
        setEditingBanner(null);
        setShowUploadForm(false);
        setSaveMessage(editingBanner ? 'Banner actualizado exitosamente' : 'Banner agregado exitosamente');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setErrorMessage(result.error || (editingBanner ? 'Error al actualizar el banner' : 'Error al agregar el banner'));
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setErrorMessage('Error inesperado al agregar el banner');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este banner?')) {
      const result = await deleteBanner(id);
      if (result.success) {
        setSaveMessage('Banner eliminado exitosamente');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setErrorMessage('Error al eliminar el banner');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleEditBanner = (banner: Banner) => {
    const bannerData = {
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      imageUrl: banner.imageUrl,
      isActive: banner.isActive,
      order: banner.order,
      imageZoom: banner.imageZoom || 1,
      imagePosition: banner.imagePosition || { x: 0, y: 0 },
      showMemberDiscount: banner.showMemberDiscount || false,
      discountText: banner.discountText || 'Solo para miembros registrados el 30% de descuentos'
    };
    setFormData(bannerData);
    setImageZoom(bannerData.imageZoom);
    setImagePosition(bannerData.imagePosition);
    setEditingBanner(banner.id);
    setShowUploadForm(true);
    console.log('Editando banner:', banner);
  };

  const handleToggleBannerStatus = async (id: string, currentStatus: boolean) => {
    const result = await updateBanner(id, { isActive: !currentStatus });
    if (result.success) {
      setSaveMessage(`Banner ${!currentStatus ? 'activado' : 'desactivado'} exitosamente`);
      setTimeout(() => setSaveMessage(''), 3000);
    } else {
      setErrorMessage('Error al cambiar el estado del banner');
      setTimeout(() => setErrorMessage(''), 5000);
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
              Gestión de Banners
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Administra los banners del carrusel principal de tu tienda
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
              {editingBanner ? 'Editar Banner' : 'Agregar Nuevo Banner'}
            </h2>
            <button
              onClick={() => {
                setShowUploadForm(!showUploadForm);
                if (!showUploadForm) {
                  setEditingBanner(null);
                  setFormData({
                    title: '',
                    subtitle: '',
                    buttonText: 'Ver Más',
                    buttonLink: '',
                    imageUrl: '',
                    isActive: true,
                    order: 1
                  });
                }
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {showUploadForm ? 'Cancelar' : 'Nuevo Banner'}
            </button>
          </div>
          
          {showUploadForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-6"
            >
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Subida de Imagen */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagen del Banner *
                  </label>
                  <ImageUpload
                    folder="banners"
                    onUpload={handleImageUpload}
                    currentImage={formData.imageUrl}
                  />
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      📐 Dimensiones recomendadas:
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>1200 x 600 píxeles</strong> (formato horizontal 2:1)
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Esta proporción asegura que la imagen se vea completa en el carrusel
                    </p>
                  </div>
                </div>

                {/* Campos de Texto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título del Banner *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Personaliza tus velas"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto del Botón *
                    </label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ej: Crear ahora"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo del Banner *
                  </label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Ej: Crea velas únicas con tus propios diseños. Desde aromas personalizados hasta imágenes especiales."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Página de Destino *
                  </label>
                  <select
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Selecciona una página</option>
                    {availablePages.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Descuento para miembros */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <input
                      type="checkbox"
                      id="showMemberDiscount"
                      checked={formData.showMemberDiscount}
                      onChange={(e) => setFormData({...formData, showMemberDiscount: e.target.checked})}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showMemberDiscount" className="text-sm font-medium text-gray-700">
                      Mostrar descuento para miembros registrados
                    </label>
                  </div>
                  
                  {formData.showMemberDiscount && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto del descuento
                      </label>
                      <input
                        type="text"
                        value={formData.discountText}
                        onChange={(e) => setFormData({...formData, discountText: e.target.value})}
                        className="w-full p-3 border border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Solo para miembros registrados el 30% de descuentos"
                      />
                      <p className="text-xs text-yellow-700 mt-1">
                        💡 Este texto aparecerá como una etiqueta especial en el banner
                      </p>
                    </div>
                  )}
                </div>

                {/* Vista Previa del Banner */}
                {formData.imageUrl && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Vista Previa del Banner
                    </label>
                    
                    {/* Vista previa completa del banner */}
                    <div className="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                      {/* Sección de texto (35%) */}
                      <div className="absolute left-0 top-0 w-[35%] h-full bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col justify-center items-start px-4 text-white relative overflow-hidden">
                        {/* Elementos decorativos de fondo */}
                        <div className="absolute inset-0 opacity-10">
                          {/* Flores abstractas */}
                          <div className="absolute top-2 right-4 w-8 h-8">
                            <svg viewBox="0 0 32 32" className="w-full h-full text-white">
                              <path d="M16 4c-2 0-4 1-5 3-1-2-3-3-5-3s-4 1-5 3c-1-2-3-3-5-3v2c2 0 4 1 5 3-1 2-3 3-5 3s-4-1-5-3c1 2 3 3 5 3v2c-2 0-4-1-5-3 1-2 3-3 5-3s4 1 5 3c1-2 3-3 5-3s4 1 5 3c1-2 3-3 5-3v-2c-2 0-4 1-5 3 1 2 3 3 5 3s4-1 5-3c-1-2-3-3-5-3z" fill="currentColor"/>
                            </svg>
                          </div>
                          
                          {/* Mariposas */}
                          <div className="absolute top-6 right-2 w-6 h-6">
                            <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                              <path d="M12 2c-4 0-8 2-10 6 2 4 6 6 10 6s8-2 10-6c-2-4-6-6-10-6zm0 2c3 0 6 1 8 3-2 2-5 3-8 3s-6-1-8-3c2-2 5-3 8-3z" fill="currentColor"/>
                              <circle cx="10" cy="10" r="1" fill="currentColor"/>
                              <circle cx="14" cy="10" r="1" fill="currentColor"/>
                            </svg>
                          </div>
                          
                          {/* Corazones */}
                          <div className="absolute bottom-4 right-3 w-5 h-5">
                            <svg viewBox="0 0 20 20" className="w-full h-full text-white">
                              <path d="M10 18c-1-1-2-2-3-3-2-2-4-4-4-6 0-2 1-3 3-3 1 0 2 1 3 2 1-1 2-2 3-2 2 0 3 1 3 3 0 2-2 4-4 6-1 1-2 2-3 3z" fill="currentColor"/>
                            </svg>
                          </div>
                          
                          {/* Líneas elegantes */}
                          <div className="absolute top-1/3 left-2 w-10 h-0.5 bg-white/20 rounded-full"></div>
                          <div className="absolute top-1/2 left-3 w-8 h-0.5 bg-white/15 rounded-full"></div>
                          <div className="absolute bottom-1/3 left-4 w-6 h-0.5 bg-white/25 rounded-full"></div>
                          
                          {/* Círculos decorativos */}
                          <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-white/30 rounded-full"></div>
                          <div className="absolute top-8 left-2 w-1 h-1 bg-white/40 rounded-full"></div>
                          <div className="absolute bottom-6 left-5 w-2 h-2 bg-white/20 rounded-full"></div>
                          <div className="absolute bottom-3 left-1 w-1 h-1 bg-white/35 rounded-full"></div>
                        </div>
                        
                        {/* Contenido principal */}
                        <div className="max-w-xs relative z-10">
                          {/* Etiqueta de descuento */}
                          {formData.showMemberDiscount && (
                            <div className="mb-2">
                              <div className="inline-flex items-center px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-sm">
                                🎉 {formData.discountText}
                              </div>
                            </div>
                          )}
                          
                          <h3 className="text-lg font-bold mb-2 leading-tight">
                            {formData.title || 'Título del Banner'}
                          </h3>
                          <p className="text-sm mb-3 text-purple-100 leading-relaxed line-clamp-3">
                            {formData.subtitle || 'Subtítulo del banner...'}
                          </p>
                          <div className="text-xs bg-white/20 px-2 py-1 rounded">
                            {formData.buttonText || 'Botón'}
                          </div>
                        </div>
                      </div>

                      {/* Sección de imagen (65%) - Exactamente como en BannerCarousel */}
                      <div className="absolute right-0 top-0 w-[65%] h-full bg-gray-200 overflow-hidden">
                        {/* Imagen con los mismos estilos que BannerCarousel */}
                        <div 
                          className={`w-full h-full bg-no-repeat bg-center select-none transition-all duration-200 ${
                            isDragging ? 'cursor-grabbing' : 'cursor-grab'
                          }`}
                          style={{
                            backgroundImage: `url(${formData.imageUrl})`,
                            backgroundSize: `${100 * (formData.imageZoom || 1)}%`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            transform: `translate(${(formData.imagePosition?.x || 0)}px, ${(formData.imagePosition?.y || 0)}px)`
                          }}
                          onMouseDown={handleMouseDown}
                          onMouseMove={handleMouseMove}
                          onMouseUp={handleMouseUp}
                          onMouseLeave={handleMouseUp}
                        />
                        
                        {/* Overlay para mostrar el área visible */}
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="w-full h-full border-2 border-white/50 border-dashed"></div>
                          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            Área visible
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controles de zoom y posición */}
                    <div className="mt-4 space-y-4">
                      {/* Controles de zoom */}
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={handleZoomOut}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </button>
                          
                          <span className="text-sm text-gray-600 min-w-[60px] text-center">
                            {Math.round(imageZoom * 100)}%
                          </span>
                          
                          <button
                            type="button"
                            onClick={handleZoomIn}
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Zoom In"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Controles de posición - Mover la ventana de vista */}
                      <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newPosition = { x: imagePosition.x - 20, y: imagePosition.y };
                              setImagePosition(newPosition);
                              setFormData(prev => ({ ...prev, imagePosition: newPosition }));
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Mover ventana a la izquierda"
                          >
                            ←
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newPosition = { x: imagePosition.x, y: imagePosition.y - 20 };
                              setImagePosition(newPosition);
                              setFormData(prev => ({ ...prev, imagePosition: newPosition }));
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Mover ventana hacia arriba"
                          >
                            ↑
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newPosition = { x: imagePosition.x, y: imagePosition.y + 20 };
                              setImagePosition(newPosition);
                              setFormData(prev => ({ ...prev, imagePosition: newPosition }));
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Mover ventana hacia abajo"
                          >
                            ↓
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => {
                              const newPosition = { x: imagePosition.x + 20, y: imagePosition.y };
                              setImagePosition(newPosition);
                              setFormData(prev => ({ ...prev, imagePosition: newPosition }));
                            }}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Mover ventana a la derecha"
                          >
                            →
                          </button>
                        </div>
                      </div>

                      {/* Botón de reset */}
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            setImageZoom(1);
                            setImagePosition({ x: 0, y: 0 });
                            setFormData(prev => ({ 
                              ...prev, 
                              imageZoom: 1, 
                              imagePosition: { x: 0, y: 0 } 
                            }));
                          }}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Resetear posición
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>🎯 Vista previa exacta:</strong> Esta vista muestra exactamente cómo se verá el banner en el sitio web.
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        <strong>Zoom:</strong> {Math.round((formData.imageZoom || 1) * 100)}% • 
                        <strong>Posición:</strong> X: {formData.imagePosition?.x || 0}px, Y: {formData.imagePosition?.y || 0}px
                      </p>
                    </div>
                  </div>
                )}

                {/* Configuración */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orden de Visualización
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Banner activo (visible en el sitio)
                    </label>
                  </div>
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
                        {editingBanner ? 'Actualizando...' : 'Publicando...'}
                      </>
                    ) : (
                      editingBanner ? 'Actualizar Banner' : 'Publicar Banner'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      setEditingBanner(null);
                      setFormData({
                        title: '',
                        subtitle: '',
                        buttonText: 'Ver Más',
                        buttonLink: '',
                        imageUrl: '',
                        isActive: true,
                        order: 1
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

        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h2 className="text-xl font-light text-gray-900 mb-6">
            Banners Activos ({banners.filter(b => b.isActive).length}/{banners.length})
          </h2>
          
          {banners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg">
                No hay banners creados aún
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Haz clic en &quot;Nuevo Banner&quot; para agregar tu primer banner
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners
                .sort((a, b) => a.order - b.order)
                .map((banner) => (
                <motion.div
                  key={banner.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    banner.isActive 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-500">
                        Orden: {banner.order}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        banner.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {banner.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleBannerStatus(banner.id, banner.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          banner.isActive 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleEditBanner(banner)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Editar banner"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Eliminar banner"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {banner.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {banner.subtitle}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Botón: {banner.buttonText}</span>
                        <span>Enlace: {banner.buttonLink}</span>
                      </div>
                    </div>
                    
                    <div className="aspect-[2/1] bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
