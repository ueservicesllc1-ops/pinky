'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  startDate: string;
  endDate: string;
  imageUrl: string;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
}

export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar promociones desde Firestore
  const loadPromotions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const promotionsRef = collection(db, 'promotions');
      const q = query(promotionsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const promotionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Promotion[];
      
      setPromotions(promotionsData);
    } catch (err) {
      console.error('Error loading promotions:', err);
      setError('Error al cargar las promociones');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nueva promoción
  const addPromotion = useCallback(async (promotionData: Omit<Promotion, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      const data = {
        ...promotionData,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'promotions'), data);
      
      const newPromotion: Promotion = {
        id: docRef.id,
        ...data
      };
      
      setPromotions(prev => [newPromotion, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding promotion:', err);
      setError('Error al agregar la promoción');
      return { success: false, error: 'Error al agregar la promoción' };
    }
  }, []);

  // Actualizar promoción
  const updatePromotion = useCallback(async (id: string, updates: Partial<Promotion>) => {
    try {
      setError(null);
      
      await updateDoc(doc(db, 'promotions', id), updates);
      
      setPromotions(prev => prev.map(promotion => 
        promotion.id === id ? { ...promotion, ...updates } : promotion
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating promotion:', err);
      setError('Error al actualizar la promoción');
      return { success: false, error: 'Error al actualizar la promoción' };
    }
  }, []);

  // Eliminar promoción
  const deletePromotion = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'promotions', id));
      setPromotions(prev => prev.filter(promotion => promotion.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing promotion:', err);
      setError('Error al eliminar la promoción');
      return { success: false, error: 'Error al eliminar la promoción' };
    }
  }, []);

  // Cargar promociones al montar el componente
  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  return {
    promotions,
    isLoading,
    error,
    addPromotion,
    updatePromotion,
    deletePromotion,
    loadPromotions
  };
}
