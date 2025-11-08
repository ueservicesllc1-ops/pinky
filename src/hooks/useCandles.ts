'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Locale = 'es' | 'en';

export interface CandleTranslations {
  name: Partial<Record<Locale, string>>;
  description: Partial<Record<Locale, string>>;
  category: Partial<Record<Locale, string>>;
}

export interface Candle {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  type: 'cylindrical' | 'tapered' | 'pillar' | 'jar';
  imageUrl: string;
  uploadedAt: Date;
  isActive: boolean;
  translations?: CandleTranslations;
}

async function translateTextToEnglish(text: string) {
  if (!text || !text.trim()) {
    return text;
  }

  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(
        text
      )}`
    );

    if (!response.ok) {
      throw new Error(`Translation request failed with status ${response.status}`);
    }

    const data = await response.json();
    const translated = Array.isArray(data?.[0])
      ? data[0].map((segment: unknown[]) => segment?.[0]).join('')
      : null;

    if (translated && typeof translated === 'string') {
      return translated;
    }

    return text;
  } catch (error) {
    console.error('Error translating text to English:', error);
    return text;
  }
}

export function useCandles() {
  const [candles, setCandles] = useState<Candle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar velas desde Firestore
  const loadCandles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const productsRef = collection(db, 'test');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const candlesData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const translations = (data.translations || {}) as CandleTranslations | undefined;

        const nameEs = translations?.name?.es ?? data.name ?? '';
        const nameEn = translations?.name?.en ?? translations?.name?.es ?? data.name ?? '';

        const descriptionEs = translations?.description?.es ?? data.description ?? '';
        const descriptionEn =
          translations?.description?.en ?? translations?.description?.es ?? data.description ?? '';

        const categoryEs = translations?.category?.es ?? data.category ?? '';
        const categoryEn =
          translations?.category?.en ?? translations?.category?.es ?? data.category ?? '';

        return {
          id: doc.id,
          name: nameEs,
          description: descriptionEs,
          price: data.price || 0,
          category: categoryEs,
          type: (data.type as Candle['type']) || 'cylindrical', // Valor por defecto
          imageUrl: data.image || data.imageUrl || '', // Usar image o imageUrl
          uploadedAt: data.createdAt?.toDate() || data.updatedAt?.toDate() || new Date(),
          isActive: data.active !== false, // Asumir activo si no se especifica
          translations: {
            name: { es: nameEs, en: nameEn },
            description: { es: descriptionEs, en: descriptionEn },
            category: { es: categoryEs, en: categoryEn },
          },
        } as Candle;
      });
      
      setCandles(candlesData);
    } catch (err) {
      console.error('Error loading candles:', err);
      setError('Error al cargar las velas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nueva vela
  const addCandle = useCallback(async (candleData: Omit<Candle, 'id' | 'uploadedAt' | 'translations'>) => {
    try {
      setError(null);
      
      const data = {
        ...candleData,
        uploadedAt: new Date()
      };
      
      const [nameEn, descriptionEn, categoryEn] = await Promise.all([
        translateTextToEnglish(candleData.name),
        translateTextToEnglish(candleData.description),
        translateTextToEnglish(candleData.category),
      ]);

      const docRef = await addDoc(collection(db, 'test'), {
        name: candleData.name,
        description: candleData.description,
        price: candleData.price,
        category: candleData.category,
        image: candleData.imageUrl, // Guardar como 'image' para consistencia
        active: candleData.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
        translations: {
          name: {
            es: candleData.name,
            en: nameEn,
          },
          description: {
            es: candleData.description,
            en: descriptionEn,
          },
          category: {
            es: candleData.category,
            en: categoryEn,
          },
        },
      });
      
      const newCandle: Candle = {
        id: docRef.id,
        ...data,
        translations: {
          name: { es: candleData.name, en: nameEn },
          description: { es: candleData.description, en: descriptionEn },
          category: { es: candleData.category, en: categoryEn },
        },
      };
      
      setCandles(prev => [newCandle, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding candle:', err);
      setError('Error al agregar la vela');
      return { success: false, error: 'Error al agregar la vela' };
    }
  }, []);

  // Actualizar vela
  const updateCandle = useCallback(async (id: string, updates: Partial<Candle>) => {
    try {
      setError(null);

      const existingCandle = candles.find((candle) => candle.id === id);

      const nameEs = updates.name ?? existingCandle?.name ?? '';
      const descriptionEs = updates.description ?? existingCandle?.description ?? '';
      const categoryEs = updates.category ?? existingCandle?.category ?? '';

      const [nameEn, descriptionEn, categoryEn] = await Promise.all([
        updates.name !== undefined
          ? translateTextToEnglish(updates.name)
          : existingCandle?.translations?.name?.en ?? existingCandle?.name ?? '',
        updates.description !== undefined
          ? translateTextToEnglish(updates.description)
          : existingCandle?.translations?.description?.en ?? existingCandle?.description ?? '',
        updates.category !== undefined
          ? translateTextToEnglish(updates.category)
          : existingCandle?.translations?.category?.en ?? existingCandle?.category ?? '',
      ]);

      await updateDoc(doc(db, 'test', id), {
        name: nameEs,
        description: descriptionEs,
        price: updates.price ?? existingCandle?.price ?? 0,
        category: categoryEs,
        image: updates.imageUrl ?? existingCandle?.imageUrl ?? '',
        active: updates.isActive ?? existingCandle?.isActive ?? true,
        updatedAt: new Date(),
        translations: {
          name: {
            es: nameEs,
            en: nameEn,
          },
          description: {
            es: descriptionEs,
            en: descriptionEn,
          },
          category: {
            es: categoryEs,
            en: categoryEn,
          },
        },
      });

      setCandles((prev) =>
        prev.map((candle) =>
          candle.id === id
            ? {
                ...candle,
                ...updates,
                name: nameEs,
                description: descriptionEs,
                category: categoryEs,
                translations: {
                  name: { es: nameEs, en: nameEn },
                  description: { es: descriptionEs, en: descriptionEn },
                  category: { es: categoryEs, en: categoryEn },
                },
              }
            : candle
        )
      );

      return { success: true };
    } catch (err) {
      console.error('Error updating candle:', err);
      setError('Error al actualizar la vela');
      return { success: false, error: 'Error al actualizar la vela' };
    }
  }, [candles]);

  // Eliminar vela
  const deleteCandle = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'test', id));
      setCandles(prev => prev.filter(candle => candle.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing candle:', err);
      setError('Error al eliminar la vela');
      return { success: false, error: 'Error al eliminar la vela' };
    }
  }, []);

  // Cargar velas al montar el componente
  useEffect(() => {
    loadCandles();
  }, [loadCandles]);

  return {
    candles,
    isLoading,
    error,
    addCandle,
    updateCandle,
    deleteCandle,
    loadCandles
  };
}
