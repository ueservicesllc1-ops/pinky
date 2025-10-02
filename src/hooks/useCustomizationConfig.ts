'use client';

import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CustomizationConfig {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  isActive: boolean;
  updatedAt: Date;
}

const defaultConfig: CustomizationConfig = {
  title: "Crea la vela perfecta",
  subtitle: "Personalización Total",
  description: "Cada vela puede ser completamente personalizada según tus gustos y necesidades. Desde el color y la fragancia hasta mensajes especiales y embalaje.",
  buttonText: "Personalizar Ahora",
  buttonLink: "/es/personalizadas",
  imageUrl: "/velas/vela-cilindrica-rosa.jpg",
  features: [
    {
      icon: "Palette",
      title: "Colores únicos",
      description: "Elige entre más de 20 colores diferentes"
    },
    {
      icon: "Heart",
      title: "Mensajes especiales",
      description: "Añade texto personalizado a tu vela"
    },
    {
      icon: "Sparkles",
      title: "Fragancias premium",
      description: "Selecciona entre nuestras fragancias exclusivas"
    },
    {
      icon: "Gift",
      title: "Embalaje especial",
      description: "Presentación perfecta para regalar"
    }
  ],
  isActive: true,
  updatedAt: new Date()
};

export function useCustomizationConfig() {
  const [config, setConfig] = useState<CustomizationConfig>(defaultConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const docRef = doc(db, 'customization-config', 'main');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          id: docSnap.id,
          ...data,
          updatedAt: data.updatedAt?.toDate() || new Date()
        } as CustomizationConfig);
      } else {
        // Si no existe, usar la configuración por defecto
        setConfig(defaultConfig);
      }
    } catch (err) {
      console.error('Error loading customization config:', err);
      setError('Error al cargar la configuración');
      setConfig(defaultConfig);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: Partial<CustomizationConfig>) => {
    try {
      setError(null);
      
      const configToSave = {
        ...config,
        ...newConfig,
        updatedAt: new Date()
      };
      
      const docRef = doc(db, 'customization-config', 'main');
      await setDoc(docRef, configToSave);
      
      setConfig(configToSave);
      return { success: true };
    } catch (err) {
      console.error('Error saving customization config:', err);
      setError('Error al guardar la configuración');
      return { success: false, error: 'Error al guardar la configuración' };
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return {
    config,
    isLoading,
    error,
    saveConfig,
    loadConfig
  };
}
