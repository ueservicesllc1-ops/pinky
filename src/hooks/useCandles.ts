'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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
        return {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          price: data.price || 0,
          category: data.category || '',
          type: 'cylindrical' as const, // Valor por defecto
          imageUrl: data.image || data.imageUrl || '', // Usar image o imageUrl
          uploadedAt: data.createdAt?.toDate() || data.updatedAt?.toDate() || new Date(),
          isActive: data.active !== false // Asumir activo si no se especifica
        };
      }) as Candle[];
      
      setCandles(candlesData);
    } catch (err) {
      console.error('Error loading candles:', err);
      setError('Error al cargar las velas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nueva vela
  const addCandle = useCallback(async (candleData: Omit<Candle, 'id' | 'uploadedAt'>) => {
    try {
      setError(null);
      
      const data = {
        ...candleData,
        uploadedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'test'), {
        name: candleData.name,
        description: candleData.description,
        price: candleData.price,
        category: candleData.category,
        image: candleData.imageUrl, // Guardar como 'image' para consistencia
        active: candleData.isActive,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newCandle: Candle = {
        id: docRef.id,
        ...data
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
      
      await updateDoc(doc(db, 'test', id), {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        category: updates.category,
        image: updates.imageUrl,
        active: updates.isActive,
        updatedAt: new Date()
      });
      
      setCandles(prev => prev.map(candle => 
        candle.id === id ? { ...candle, ...updates } : candle
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating candle:', err);
      setError('Error al actualizar la vela');
      return { success: false, error: 'Error al actualizar la vela' };
    }
  }, []);

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
