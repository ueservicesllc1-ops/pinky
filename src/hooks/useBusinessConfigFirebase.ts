'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export function useBusinessConfigFirebase() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(defaultBusinessInfo);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Cargar configuración desde Firebase
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setIsLoading(true);
        const configRef = doc(db, 'business_config', 'main');
        const configSnap = await getDoc(configRef);
        
        if (configSnap.exists()) {
          const data = configSnap.data();
          setBusinessInfo(data as BusinessInfo);
          setLastUpdated(data.updatedAt?.toDate() || new Date());
          console.log('✅ Loaded business config from Firebase:', data);
        } else {
          // Si no existe, crear con datos por defecto
          await setDoc(configRef, {
            ...defaultBusinessInfo,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          console.log('✅ Created default business config in Firebase');
        }
      } catch (error) {
        console.error('❌ Error loading business config from Firebase:', error);
        // Fallback a localStorage si Firebase falla
        const savedConfig = localStorage.getItem('pinky-flame-business-config');
        if (savedConfig) {
          try {
            const parsedConfig = JSON.parse(savedConfig);
            setBusinessInfo(parsedConfig);
            console.log('✅ Fallback to localStorage config');
          } catch (parseError) {
            console.error('❌ Error parsing localStorage config:', parseError);
          }
        }
      } finally {
          setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Escuchar cambios en tiempo real
  useEffect(() => {
    const configRef = doc(db, 'business_config', 'main');
    const unsubscribe = onSnapshot(configRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setBusinessInfo(data as BusinessInfo);
        setLastUpdated(data.updatedAt?.toDate() || new Date());
        setIsLoading(false); // ✅ Marcar como cargado
        console.log('🔄 Real-time update received:', data);
      } else {
        setIsLoading(false); // ✅ Marcar como cargado aunque no exista
        console.log('⚠️ business_config document does not exist');
      }
    }, (error) => {
      console.error('❌ Real-time listener error:', error);
      setIsLoading(false); // ✅ Marcar como cargado aunque haya error
    });

    return () => unsubscribe();
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

  const saveConfig = async () => {
    try {
      setIsSaving(true);
      const configRef = doc(db, 'business_config', 'main');
      const now = new Date();
      
      await setDoc(configRef, {
        ...businessInfo,
        updatedAt: now
      }, { merge: true });

      // También guardar en localStorage como backup
      localStorage.setItem('pinky-flame-business-config', JSON.stringify(businessInfo));
      
      setLastUpdated(now);
      console.log('✅ Business config saved to Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error saving to Firebase:', error);
      
      // Fallback: guardar solo en localStorage
      try {
        localStorage.setItem('pinky-flame-business-config', JSON.stringify(businessInfo));
        console.log('⚠️ Saved to localStorage as fallback');
        return { success: true, fallback: true };
      } catch (localError) {
        console.error('❌ Error saving to localStorage:', localError);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    businessInfo,
    isLoading,
    isSaving,
    lastUpdated,
    updateField,
    updateNestedField,
    saveConfig
  };
}
