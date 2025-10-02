'use client';

import React, { useState } from 'react';
import { useTestimonials } from '@/hooks/useTestimonials';
import { migrateTestimonials } from '@/lib/migrate-testimonials';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function TestimonialsStatus() {
  const { testimonials, isLoading } = useTestimonials();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState<string>('');

  const handleMigration = async () => {
    setIsMigrating(true);
    setMigrationResult('');
    
    try {
      const result = await migrateTestimonials();
      if (result.success) {
        setMigrationResult(`✅ Migración exitosa: ${result.count} testimonios migrados`);
      } else {
        setMigrationResult(`❌ Error en migración: ${result.error}`);
      }
    } catch (error) {
      setMigrationResult(`❌ Error inesperado: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsMigrating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Cargando testimonios...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeTestimonials = testimonials.filter(t => t.isActive);
  const inactiveTestimonials = testimonials.filter(t => !t.isActive);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Estado de Testimonios en Firebase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{testimonials.length}</div>
              <div className="text-sm text-blue-800">Total Testimonios</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{activeTestimonials.length}</div>
              <div className="text-sm text-green-800">Activos</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{inactiveTestimonials.length}</div>
              <div className="text-sm text-gray-800">Inactivos</div>
            </div>
          </div>

          {testimonials.length === 0 && (
            <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 mb-4">No hay testimonios en Firebase</p>
              <Button 
                onClick={handleMigration}
                disabled={isMigrating}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                {isMigrating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Migrando...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Migrar Testimonios a Firebase
                  </>
                )}
              </Button>
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-green-800">✅ Testimonios ya están en Firebase</p>
            </div>
          )}

          {migrationResult && (
            <div className={`p-4 rounded-lg ${
              migrationResult.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={migrationResult.includes('✅') ? 'text-green-800' : 'text-red-800'}>
                {migrationResult}
              </p>
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Testimonios Activos:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {activeTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
