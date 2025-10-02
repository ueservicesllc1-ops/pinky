'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTestimonials } from '@/hooks/useTestimonials';

export default function TestimonialsTest() {
  const { testimonials, isLoading, addTestimonial } = useTestimonials();
  const [isAdding, setIsAdding] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleAddTestTestimonial = async () => {
    setIsAdding(true);
    setTestResult(null);

    try {
      const testData = {
        name: 'Test User',
        location: 'Test City',
        rating: 5,
        text: 'Este es un testimonio de prueba para verificar que Firebase funciona correctamente.',
        avatar: 'https://via.placeholder.com/150',
        isActive: true,
        order: testimonials.length + 1
      };

      console.log('🧪 Adding test testimonial...');
      const result = await addTestimonial(testData);
      
      if (result.success) {
        setTestResult({
          success: true,
          message: `✅ Testimonio agregado exitosamente! ID: ${result.id}`
        });
      } else {
        setTestResult({
          success: false,
          message: `❌ Error: ${result.error}`
        });
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      setTestResult({
        success: false,
        message: `❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Prueba de Sistema de Testimonios
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Test Button */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleAddTestTestimonial}
            disabled={isAdding}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Agregando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Testimonio de Prueba
              </>
            )}
          </Button>
          
          <div className="text-sm text-gray-600">
            Total testimonios: {testimonials.length}
          </div>
        </div>

        {/* Test Result */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border ${
              testResult.success 
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {testResult.success ? 'Prueba Exitosa' : 'Error en la Prueba'}
              </span>
            </div>
            <p className="text-sm mt-1">{testResult.message}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Cargando testimonios...</p>
          </div>
        )}

        {/* Testimonials List */}
        {!isLoading && testimonials.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Testimonios Actuales:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.slice(0, 4).map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3">{testimonial.text}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {testimonial.isActive ? '✅ Activo' : '❌ Inactivo'} • Orden: {testimonial.order}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && testimonials.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay testimonios disponibles</p>
            <p className="text-sm text-gray-500 mt-1">
              Agrega un testimonio de prueba para verificar que Firebase funciona
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Información del Sistema:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Los testimonios se sincronizan en tiempo real con Firebase</li>
            <li>• Los cambios aparecen inmediatamente en todos los navegadores</li>
            <li>• Los datos persisten entre sesiones y dispositivos</li>
            <li>• Verifica la consola del navegador para ver los logs</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
