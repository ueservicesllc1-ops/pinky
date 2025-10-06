'use client';

import { useState, useCallback, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  preview: {
    gradient: string;
    description: string;
  };
}

export interface AppearanceConfig {
  colorScheme: ColorScheme;
  mode: 'light' | 'dark' | 'elegant';
  customColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
}

const defaultColorSchemes: ColorScheme[] = [
  {
    id: 'pinky-classic',
    name: 'Pinky Clásico',
    primary: '#ec4899',
    secondary: '#8b5cf6',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    preview: {
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
      description: 'Colores vibrantes y llamativos'
    }
  },
  {
    id: 'elegant-black',
    name: 'Elegante Negro',
    primary: '#000000',
    secondary: '#1f2937',
    accent: '#d4af37',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#000000',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    preview: {
      gradient: 'linear-gradient(135deg, #000000, #1f2937)',
      description: 'Sofisticado y minimalista'
    }
  },
  {
    id: 'rose-gold',
    name: 'Rosa Dorado',
    primary: '#e11d48',
    secondary: '#f59e0b',
    accent: '#ec4899',
    background: '#fefefe',
    surface: '#fdf2f8',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#fce7f3',
    preview: {
      gradient: 'linear-gradient(135deg, #e11d48, #f59e0b)',
      description: 'Lujoso y elegante'
    }
  },
  {
    id: 'midnight-blue',
    name: 'Azul Medianoche',
    primary: '#1e40af',
    secondary: '#3730a3',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f1f5f9',
    text: '#0f172a',
    textSecondary: '#475569',
    border: '#cbd5e1',
    preview: {
      gradient: 'linear-gradient(135deg, #1e40af, #3730a3)',
      description: 'Profesional y confiable'
    }
  },
  {
    id: 'forest-green',
    name: 'Verde Bosque',
    primary: '#059669',
    secondary: '#047857',
    accent: '#10b981',
    background: '#ffffff',
    surface: '#f0fdf4',
    text: '#064e3b',
    textSecondary: '#6b7280',
    border: '#bbf7d0',
    preview: {
      gradient: 'linear-gradient(135deg, #059669, #047857)',
      description: 'Natural y relajante'
    }
  },
  {
    id: 'warm-orange',
    name: 'Naranja Cálido',
    primary: '#ea580c',
    secondary: '#dc2626',
    accent: '#f59e0b',
    background: '#ffffff',
    surface: '#fff7ed',
    text: '#9a3412',
    textSecondary: '#a16207',
    border: '#fed7aa',
    preview: {
      gradient: 'linear-gradient(135deg, #ea580c, #dc2626)',
      description: 'Cálido y acogedor'
    }
  }
];

export function useAppearanceConfig() {
  const [config, setConfig] = useState<AppearanceConfig>({
    colorScheme: defaultColorSchemes[0],
    mode: 'light'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración desde Firestore
  const loadConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const docRef = doc(db, 'appearance', 'config');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as AppearanceConfig;
        setConfig(data);
      }
    } catch (err) {
      console.error('Error loading appearance config:', err);
      setError('Error al cargar la configuración');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar configuración en Firestore
  const saveConfig = useCallback(async (newConfig: AppearanceConfig) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const docRef = doc(db, 'appearance', 'config');
      await setDoc(docRef, newConfig);
      
      setConfig(newConfig);
      
      // Aplicar cambios inmediatamente
      applyAppearanceConfig(newConfig);
      
      return { success: true };
    } catch (err) {
      console.error('Error saving appearance config:', err);
      setError('Error al guardar la configuración');
      return { success: false, error: 'Error al guardar la configuración' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Aplicar configuración de apariencia al DOM
  const applyAppearanceConfig = useCallback((appearanceConfig: AppearanceConfig) => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const { colorScheme, mode } = appearanceConfig;
    
    // Aplicar variables CSS personalizadas
    root.style.setProperty('--color-primary', colorScheme.primary);
    root.style.setProperty('--color-secondary', colorScheme.secondary);
    root.style.setProperty('--color-accent', colorScheme.accent);
    root.style.setProperty('--color-background', colorScheme.background);
    root.style.setProperty('--color-surface', colorScheme.surface);
    root.style.setProperty('--color-text', colorScheme.text);
    root.style.setProperty('--color-text-secondary', colorScheme.textSecondary);
    root.style.setProperty('--color-border', colorScheme.border);
    
    // Aplicar modo
    root.classList.remove('light', 'dark', 'elegant');
    root.classList.add(mode);
    
    // Guardar en localStorage para persistencia
    localStorage.setItem('pinky-appearance', JSON.stringify(appearanceConfig));
  }, []);

  // Cargar configuración al montar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Aplicar configuración al cambiar
  useEffect(() => {
    if (config) {
      applyAppearanceConfig(config);
    }
  }, [config, applyAppearanceConfig]);

  return {
    config,
    colorSchemes: defaultColorSchemes,
    isLoading,
    error,
    saveConfig,
    loadConfig
  };
}
