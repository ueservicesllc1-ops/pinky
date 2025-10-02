'use client';

import React from 'react';
import { useBusinessConfigFirebase } from '@/hooks/useBusinessConfigFirebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export default function BusinessConfigDebug() {
  const { businessInfo, isLoading, isSaving, lastUpdated } = useBusinessConfigFirebase();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Cargando configuración...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Estado de Configuración del Negocio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-800 mb-2">Estado de Conexión</div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-blue-700">Conectado a Firebase</span>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800 mb-2">Última Actualización</div>
              <div className="text-sm text-green-700">
                {lastUpdated ? lastUpdated.toLocaleString() : 'Nunca'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Información Actual:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre:</span>
                <span className="font-medium">{businessInfo.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Teléfono:</span>
                <span className="font-medium">{businessInfo.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{businessInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-medium">{businessInfo.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ciudad:</span>
                <span className="font-medium">{businessInfo.city}</span>
              </div>
            </div>
          </div>

          {isSaving && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-yellow-600" />
                <span className="text-yellow-800">Guardando cambios...</span>
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Debug Info:</h4>
            <pre className="text-xs text-gray-600 overflow-x-auto">
              {JSON.stringify(businessInfo, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
