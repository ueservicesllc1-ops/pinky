'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface BusinessInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  description: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  shippingInfo: {
    freeShippingThreshold: number;
    estimatedDelivery: string;
  };
  updatedAt: Date;
}

const defaultBusinessInfo: BusinessInfo = {
  id: 'business-config',
  name: 'Pinky Flame',
  email: 'info@pinkyflame.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'Estados Unidos',
  description: 'Somos una empresa creada en New Jersey, dedicada a hacer velas aromáticas decorativas y personalizadas para cada cliente, cada momento, cada ocasión.',
  socialMedia: {
    facebook: '',
    instagram: '',
    twitter: '',
    tiktok: '',
    whatsapp: ''
  },
  shippingInfo: {
    freeShippingThreshold: 50,
    estimatedDelivery: '5-7 días hábiles'
  },
  updatedAt: new Date()
};

export function useBusinessConfig() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración desde Firestore
  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const configRef = doc(db, 'business_config', 'main');
      const configSnap = await getDoc(configRef);
      
      if (configSnap.exists()) {
        const data = configSnap.data();
        setBusinessInfo({
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as BusinessInfo);
      } else {
        // Si no existe, crear con configuración por defecto
        await setDoc(configRef, {
          ...defaultBusinessInfo,
          updatedAt: new Date()
        });
        setBusinessInfo(defaultBusinessInfo);
      }
    } catch (err) {
      console.error('Error loading business config:', err);
      setError('Error al cargar la configuración');
      setBusinessInfo(defaultBusinessInfo);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar configuración en Firestore
  const saveConfig = useCallback(async (newConfig: Partial<BusinessInfo>) => {
    try {
      setError(null);
      
      const configToSave = {
        ...businessInfo,
        ...newConfig,
        updatedAt: new Date()
      };
      
      const configRef = doc(db, 'business_config', 'main');
      await setDoc(configRef, {
        ...configToSave,
        updatedAt: configToSave.updatedAt
      });
      
      setBusinessInfo(configToSave);
      return true;
    } catch (err) {
      console.error('Error saving business config:', err);
      setError('Error al guardar la configuración');
      return false;
    }
  }, [businessInfo]);

  // Actualizar campo específico
  const updateField = useCallback((field: keyof BusinessInfo, value: string | number | boolean | Date | Record<string, unknown>) => {
    setBusinessInfo(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  }, []);

  // Actualizar campo anidado (como socialMedia)
  const updateNestedField = useCallback((path: string, value: string | number | boolean) => {
    setBusinessInfo(prev => {
      const keys = path.split('.');
      const newInfo = { ...prev };
      let current: Record<string, unknown> = newInfo as Record<string, unknown>;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return {
        ...newInfo,
        updatedAt: new Date()
      };
    });
  }, []);

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    businessInfo,
    isLoading,
    error,
    saveConfig,
    updateField,
    updateNestedField,
    reloadConfig: loadConfig
  };
}
