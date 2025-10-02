'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Truck, Clock, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateShipping, validateAddress, ShippingAddress, ShippingRate } from '@/lib/shipping-api';
import { SHIPPING_CONFIG } from '@/lib/shipping-config';

interface ShippingCalculatorProps {
  onShippingSelect: (rate: ShippingRate) => void;
  selectedRate?: ShippingRate;
  orderTotal: number;
}

export default function ShippingCalculator({ 
  onShippingSelect, 
  selectedRate, 
  orderTotal 
}: ShippingCalculatorProps) {
  const [address, setAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);

  // Verificar si califica para envío gratis
  const freeShippingEligible = orderTotal >= SHIPPING_CONFIG.freeShipping.threshold;
  const remainingForFreeShipping = SHIPPING_CONFIG.freeShipping.threshold - orderTotal;

  // Validar dirección cuando cambie
  useEffect(() => {
    const validateCurrentAddress = async () => {
      if (address.street && address.city && address.state && address.zipCode) {
        try {
          const validation = await validateAddress(address);
          setIsAddressValid(validation.valid);
          setError(validation.valid ? null : 'Dirección inválida');
        } catch (err) {
          setIsAddressValid(false);
          setError('Error validando dirección');
        }
      } else {
        setIsAddressValid(false);
        setError(null);
      }
    };

    validateCurrentAddress();
  }, [address]);

  const handleCalculateShipping = async () => {
    if (!isAddressValid) {
      setError('Por favor, ingresa una dirección válida');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const calculation = await calculateShipping(address, SHIPPING_CONFIG.package.defaultWeight, orderTotal);
      setRates(calculation.rates);
    } catch (err) {
      setError('Error calculando envío. Intenta nuevamente.');
      console.error('Shipping calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateSelect = (rate: ShippingRate) => {
    onShippingSelect(rate);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-pink-600" />
          Calculadora de Envío
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Free Shipping Banner */}
        {freeShippingEligible ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">¡Envío Gratis!</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Tu pedido califica para envío gratis
            </p>
          </motion.div>
        ) : (
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-pink-700">
              <DollarSign className="h-5 w-5" />
              <span className="font-semibold">Envío Gratis</span>
            </div>
            <p className="text-sm text-pink-600 mt-1">
              Agrega ${remainingForFreeShipping.toFixed(2)} más para envío gratis
            </p>
          </div>
        )}

        {/* Address Form */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="h-4 w-4" />
            Dirección de Envío
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Calle y número"
              value={address.street}
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            
            <input
              type="text"
              placeholder="Ciudad"
              value={address.city}
              onChange={(e) => setAddress({...address, city: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            
            <input
              type="text"
              placeholder="Estado"
              value={address.state}
              onChange={(e) => setAddress({...address, state: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            
            <input
              type="text"
              placeholder="Código Postal"
              value={address.zipCode}
              onChange={(e) => setAddress({...address, zipCode: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <Button
          onClick={handleCalculateShipping}
          disabled={!isAddressValid || isLoading}
          className="w-full bg-pink-600 hover:bg-pink-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Calculando...
            </>
          ) : (
            <>
              <Truck className="h-4 w-4 mr-2" />
              Calcular Envío
            </>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg p-3"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Shipping Rates */}
        {rates.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-gray-900">Opciones de Envío:</h4>
            {rates.map((rate, index) => (
              <motion.div
                key={`${rate.carrierId}-${rate.serviceId}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedRate?.carrierId === rate.carrierId && selectedRate?.serviceId === rate.serviceId
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
                onClick={() => handleRateSelect(rate)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{rate.carrier}</span>
                      <span className="text-sm text-gray-600">- {rate.service}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rate.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        {rate.estimatedDays} días
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ${rate.price.toFixed(2)}
                    </div>
                    {rate.price === 0 && (
                      <div className="text-xs text-green-600 font-medium">GRATIS</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}