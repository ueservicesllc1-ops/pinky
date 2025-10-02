'use client';

import { useState, useEffect } from 'react';

interface BusinessInfo {
  businessName: string;
  businessDescription: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  businessHours: string;
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  shippingInfo: {
    freeShippingThreshold: number;
    estimatedDelivery: string;
  };
}

const defaultBusinessInfo: BusinessInfo = {
  businessName: 'Pinky Flame',
  businessDescription: 'Velas artesanales personalizadas que iluminan y aromatizan tus momentos especiales.',
  email: 'info@pinkyflame.com',
  phone: '+1 (555) 123-4567',
  whatsapp: '+1 (555) 123-4567',
  address: '123 Main Street',
  city: 'Newark',
  state: 'New Jersey',
  zipCode: '07102',
  country: 'Estados Unidos',
  businessHours: 'Lunes a Viernes: 9:00 AM - 6:00 PM, Sábados: 10:00 AM - 4:00 PM',
  website: 'https://pinkyflame.com',
  socialMedia: {
    facebook: 'https://facebook.com/pinkyflame',
    instagram: 'https://instagram.com/pinkyflame',
    twitter: 'https://twitter.com/pinkyflame'
  },
  shippingInfo: {
    freeShippingThreshold: 50,
    estimatedDelivery: '5-7 días hábiles'
  }
};

export function useBusinessConfig() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar configuración guardada
    const savedConfig = localStorage.getItem('pinky-flame-business-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setBusinessInfo(parsedConfig);
        console.log('✅ Loaded business config in hook:', parsedConfig);
      } catch (error) {
        console.error('❌ Error loading business config in hook:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const updateField = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBusinessInfo(prev => ({
        ...prev,
        [parent]: {
          ...((prev as unknown) as Record<string, unknown>)[parent] as Record<string, unknown>,
          [child]: value
        }
      }));
    } else {
      setBusinessInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const updateNestedField = (parent: string, child: string, value: string | number) => {
    setBusinessInfo(prev => ({
      ...prev,
      [parent]: {
        ...((prev as unknown) as Record<string, unknown>)[parent] as Record<string, unknown>,
        [child]: value
      }
    }));
  };

  return {
    businessInfo,
    isLoading,
    updateField,
    updateNestedField
  };
}