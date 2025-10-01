'use client';

import { useState, useCallback } from 'react';

export interface AddressData {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  countryCode: string;
  formattedAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export function useAddress(initialAddress?: Partial<AddressData>) {
  const [address, setAddress] = useState<AddressData>({
    street: initialAddress?.street || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    zipCode: initialAddress?.zipCode || '',
    country: initialAddress?.country || 'Estados Unidos',
    countryCode: initialAddress?.countryCode || 'US',
    formattedAddress: initialAddress?.formattedAddress || '',
    coordinates: initialAddress?.coordinates
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateAddress = useCallback((newAddress: AddressData) => {
    setAddress(newAddress);
    setErrors({});
  }, []);

  const updateField = useCallback((field: keyof AddressData, value: string) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando se actualiza
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  }, [errors]);

  const validateAddress = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.street.trim()) {
      newErrors.street = 'La calle es requerida';
    }

    if (!address.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!address.state.trim()) {
      newErrors.state = 'El estado es requerido';
    }

    if (!address.zipCode.trim()) {
      newErrors.zipCode = 'El código postal es requerido';
    }

    if (!address.country.trim()) {
      newErrors.country = 'El país es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [address]);

  const clearAddress = useCallback(() => {
    setAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      countryCode: '',
      formattedAddress: '',
      coordinates: undefined
    });
    setErrors({});
  }, []);

  const isAddressComplete = useCallback((): boolean => {
    return !!(
      address.street &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.country
    );
  }, [address]);

  return {
    address,
    errors,
    updateAddress,
    updateField,
    validateAddress,
    clearAddress,
    isAddressComplete
  };
}
