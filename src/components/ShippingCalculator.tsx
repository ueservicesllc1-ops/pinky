'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, DollarSign, CheckCircle, Loader2 } from 'lucide-react';
import { 
  calculateShipping, 
  validateAddress, 
  getCheapestRate, 
  getFastestRate,
  ShippingAddress, 
  ShippingCalculation,
  ShippingRate 
} from '@/lib/shipping-api';
import AddressForm from './AddressForm';
import { AddressData } from '@/hooks/useAddress';

interface ShippingCalculatorProps {
  packageWeight?: number;
  packageValue: number;
  onShippingSelect: (rate: ShippingRate) => void;
  selectedRate?: ShippingRate;
  className?: string;
}

export default function ShippingCalculator({
  packageWeight = 1,
  packageValue,
  onShippingSelect,
  selectedRate,
  className = ''
}: ShippingCalculatorProps) {
  const [shippingData, setShippingData] = useState<ShippingCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressValid, setAddressValid] = useState<boolean | null>(null);
  const [destination, setDestination] = useState<ShippingAddress | null>(null);

  const handleAddressChange = (addressData: AddressData) => {
    const shippingAddress: ShippingAddress = {
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      zipCode: addressData.zipCode,
      country: addressData.countryCode
    };
    setDestination(shippingAddress);
  };

  useEffect(() => {
    if (destination && destination.street && destination.city && destination.state && destination.zipCode) {
      calculateShippingRates();
    }
  }, [destination, packageWeight, packageValue]);

  const calculateShippingRates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validar dirección primero
      if (!destination) {
        setError('Por favor, ingresa una dirección de envío.');
        setIsLoading(false);
        return;
      }
      const validation = await validateAddress(destination);
      setAddressValid(validation.valid);
      
      if (!validation.valid) {
        setError('Dirección de envío no válida. Por favor, verifica los datos.');
        setIsLoading(false);
        return;
      }
      
      // Calcular tarifas de envío
      const rates = await calculateShipping(
        destination, 
        packageWeight, 
        packageValue
      );
      
      setShippingData(rates);
      
      // Auto-seleccionar la tarifa más económica si no hay selección
      if (!selectedRate && rates.rates.length > 0) {
        const cheapest = getCheapestRate(rates.rates);
        if (cheapest) {
          onShippingSelect(cheapest);
        }
      }
      
    } catch (err) {
      setError('Error al calcular las tarifas de envío. Inténtalo de nuevo.');
      console.error('Shipping calculation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratis' : `$${price.toFixed(2)}`;
  };

  const getRateIcon = (rate: ShippingRate) => {
    if (rate.price === 0) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (rate.estimatedDays <= 3) return <Clock className="h-4 w-4 text-blue-600" />;
    return <Truck className="h-4 w-4 text-gray-600" />;
  };

  const getRateBadge = (rate: ShippingRate) => {
    if (rate.price === 0) return 'bg-green-100 text-green-800';
    if (rate.estimatedDays <= 2) return 'bg-blue-100 text-blue-800';
    if (rate.estimatedDays <= 5) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 text-purple-600 animate-spin mr-3" />
          <span className="text-gray-600">Calculando opciones de envío...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-xl border border-red-200 p-6 ${className}`}>
        <div className="flex items-center text-red-600">
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Error</span>
        </div>
        <p className="text-red-600 mt-2">{error}</p>
        <button
          onClick={calculateShippingRates}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!shippingData || shippingData.rates.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
        <p className="text-gray-500 text-center py-4">
          No se encontraron opciones de envío para esta dirección.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Formulario de Dirección */}
      <AddressForm
        title="Dirección de Destino"
        onAddressChange={handleAddressChange}
        showCountry={true}
      />

      {/* Calculadora de Envío */}
      {destination && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Truck className="h-5 w-5 mr-2 text-purple-600" />
              Opciones de Envío
            </h3>
            
            {shippingData?.freeShippingEligible && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                ¡Envío Gratis!
              </span>
            )}
          </div>

      {/* Free Shipping Notice */}
      {shippingData.freeShippingEligible && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 text-sm">
              Tu pedido califica para envío gratis por ser superior a ${shippingData.freeShippingThreshold}
            </span>
          </div>
        </div>
      )}

      {/* Shipping Options */}
      <div className="space-y-3">
        {shippingData.rates.map((rate, index) => (
          <motion.div
            key={`${rate.carrier}-${rate.service}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              border rounded-lg p-4 cursor-pointer transition-all
              ${selectedRate?.carrier === rate.carrier && selectedRate?.service === rate.service
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }
            `}
            onClick={() => onShippingSelect(rate)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getRateIcon(rate)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {rate.carrier} {rate.service}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRateBadge(rate)}`}>
                        {rate.estimatedDays} día{rate.estimatedDays !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {rate.description}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatPrice(rate.price)}
                </div>
                {rate.price > 0 && (
                  <div className="text-xs text-gray-500">
                    {rate.estimatedDays} día{rate.estimatedDays !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      {shippingData.rates.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Más económico: {formatPrice(getCheapestRate(shippingData.rates)?.price || 0)}
            </span>
            <span>
              Más rápido: {getFastestRate(shippingData.rates)?.estimatedDays || 0} días
            </span>
          </div>
        </div>
      )}

      {/* Address Validation Status */}
      {addressValid !== null && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs">
            {addressValid ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                <span className="text-green-600">Dirección validada</span>
              </>
            ) : (
              <>
                <svg className="h-4 w-4 text-red-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-600">Dirección no válida</span>
              </>
            )}
          </div>
        </div>
      )}
        </motion.div>
      )}
    </div>
  );
}
