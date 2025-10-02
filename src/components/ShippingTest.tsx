'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateShipping, ShippingAddress } from '@/lib/shipping-api';

export default function ShippingTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    rates?: any[];
  } | null>(null);

  const testAddress: ShippingAddress = {
    street: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'US'
  };

  const runShippingTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing shipping calculation...');
      const result = await calculateShipping(testAddress, 1.5, 25.00);
      
      setTestResult({
        success: true,
        message: `✅ ¡Cálculo de envío exitoso! Se encontraron ${result.rates.length} opciones.`,
        rates: result.rates
      });
      
      console.log('✅ Shipping test successful:', result);
    } catch (error) {
      console.error('❌ Shipping test failed:', error);
      setTestResult({
        success: false,
        message: `❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-blue-600" />
          Prueba de Sistema de Envíos
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">🧪 Test de Configuración</h4>
          <p className="text-sm text-blue-800 mb-3">
            Esta prueba verifica que las credenciales de USPS estén configuradas correctamente.
          </p>
          <div className="text-sm text-blue-700">
            <strong>Dirección de prueba:</strong><br />
            {testAddress.street}, {testAddress.city}, {testAddress.state} {testAddress.zipCode}
          </div>
        </div>

        <Button
          onClick={runShippingTest}
          disabled={isTesting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isTesting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Probando Envío...
            </>
          ) : (
            <>
              <Truck className="h-4 w-4 mr-2" />
              Ejecutar Prueba
            </>
          )}
        </Button>

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
            <div className="flex items-center gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="font-semibold">
                {testResult.success ? 'Prueba Exitosa' : 'Error en la Prueba'}
              </span>
            </div>
            <p className="text-sm">{testResult.message}</p>
            
            {testResult.success && testResult.rates && (
              <div className="mt-3 space-y-2">
                <h5 className="font-medium text-green-900">Opciones de Envío Encontradas:</h5>
                {testResult.rates.map((rate, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-green-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{rate.carrier}</span>
                        <span className="text-gray-600 ml-2">- {rate.service}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${rate.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{rate.estimatedDays} días</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{rate.description}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-900 mb-2">💡 Consejos:</h5>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Asegúrate de haber configurado las credenciales de USPS</li>
            <li>• Verifica que la API key de Karrio esté configurada</li>
            <li>• Si hay errores, revisa la consola del navegador</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
