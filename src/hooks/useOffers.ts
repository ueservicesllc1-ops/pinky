'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  offerPrice: number;
  discount: number;
  category: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  featured: boolean;
  limitedQuantity?: number;
  soldQuantity: number;
  createdAt: Date;
}

export function useOffers() {
  const [offers, setOffers] = useState<SpecialOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar ofertas desde Firestore
  const loadOffers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const offersRef = collection(db, 'special_offers');
      const q = query(offersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const offersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as SpecialOffer[];
      
      setOffers(offersData);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError('Error al cargar las ofertas especiales');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nueva oferta
  const addOffer = useCallback(async (offerData: Omit<SpecialOffer, 'id' | 'createdAt' | 'soldQuantity'>) => {
    try {
      setError(null);
      
      const data = {
        ...offerData,
        soldQuantity: 0,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'special_offers'), data);
      
      const newOffer: SpecialOffer = {
        id: docRef.id,
        ...data
      };
      
      setOffers(prev => [newOffer, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding offer:', err);
      setError('Error al agregar la oferta especial');
      return { success: false, error: 'Error al agregar la oferta especial' };
    }
  }, []);

  // Actualizar oferta
  const updateOffer = useCallback(async (id: string, updates: Partial<SpecialOffer>) => {
    try {
      setError(null);
      
      await updateDoc(doc(db, 'special_offers', id), updates);
      
      setOffers(prev => prev.map(offer => 
        offer.id === id ? { ...offer, ...updates } : offer
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating offer:', err);
      setError('Error al actualizar la oferta especial');
      return { success: false, error: 'Error al actualizar la oferta especial' };
    }
  }, []);

  // Eliminar oferta
  const deleteOffer = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'special_offers', id));
      setOffers(prev => prev.filter(offer => offer.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing offer:', err);
      setError('Error al eliminar la oferta especial');
      return { success: false, error: 'Error al eliminar la oferta especial' };
    }
  }, []);

  // Cargar ofertas al montar el componente
  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  return {
    offers,
    isLoading,
    error,
    addOffer,
    updateOffer,
    deleteOffer,
    loadOffers
  };
}
