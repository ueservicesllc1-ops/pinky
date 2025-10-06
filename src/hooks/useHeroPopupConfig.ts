'use client';

import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface HeroPopupConfig {
  id: string;
  isActive: boolean;
  title: string;
  subtitle: string;
  offerTitle: string;
  offerDescription: string;
  discount: number;
  imageUrl: string;
  autoCloseSeconds: number;
  showDelay: number;
  ctaButton1Text: string;
  ctaButton1Link: string;
  ctaButton2Text: string;
  ctaButton2Link: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultConfig: HeroPopupConfig = {
  id: 'hero-popup-config',
  isActive: true,
  title: 'Ilumina tus momentos especiales',
  subtitle: 'Descubre nuestra colección única de velas personalizadas, creadas con ingredientes naturales y diseñadas para crear la atmósfera perfecta en tu hogar.',
  offerTitle: '¡Descuento del 20%!',
  offerDescription: 'En tu primera compra',
  discount: 20,
  imageUrl: '',
  autoCloseSeconds: 10,
  showDelay: 1000,
  ctaButton1Text: 'Explorar Catálogo',
  ctaButton1Link: '/es/catalogo',
  ctaButton2Text: 'Personalizar Ahora',
  ctaButton2Link: '/es/personalizadas',
  createdAt: new Date(),
  updatedAt: new Date()
};

export function useHeroPopupConfig() {
  const [config, setConfig] = useState<HeroPopupConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración desde Firebase
  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const configRef = doc(db, 'hero-popup', 'config');
      const configSnap = await getDoc(configRef);

      if (configSnap.exists()) {
        const data = configSnap.data();
        setConfig({
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as HeroPopupConfig);
      } else {
        // Si no existe la configuración, usar la configuración por defecto
        setConfig(defaultConfig);
      }
    } catch (err) {
      console.error('Error loading hero popup config:', err);
      setError('Error al cargar la configuración');
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  // Guardar configuración en Firebase
  const saveConfig = async (newConfig: Partial<HeroPopupConfig>) => {
    try {
      setError(null);

      const configToSave = {
        ...config,
        ...newConfig,
        updatedAt: new Date()
      };

      const configRef = doc(db, 'hero-popup', 'config');
      await setDoc(configRef, {
        ...configToSave,
        createdAt: configToSave.createdAt,
        updatedAt: configToSave.updatedAt
      });

      setConfig(configToSave);
      return true;
    } catch (err) {
      console.error('Error saving hero popup config:', err);
      setError('Error al guardar la configuración');
      return false;
    }
  };

  // Actualizar campo específico
  const updateField = (field: keyof HeroPopupConfig, value: string | number | boolean | Date) => {
    setConfig(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    error,
    saveConfig,
    updateField,
    reloadConfig: loadConfig
  };
}
