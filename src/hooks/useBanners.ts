'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  showMemberDiscount?: boolean;
  discountText?: string;
}

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar banners desde Firestore
  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const bannersRef = collection(db, 'banners');
      const q = query(bannersRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Banner[];
      
      setBanners(bannersData);
    } catch (err) {
      console.error('Error loading banners:', err);
      setError('Error al cargar los banners');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nuevo banner
  const addBanner = useCallback(async (bannerData: Omit<Banner, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      
      const data = {
        ...bannerData,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'banners'), data);
      
      const newBanner: Banner = {
        id: docRef.id,
        ...data
      };
      
      setBanners(prev => [...prev, newBanner].sort((a, b) => a.order - b.order));
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding banner:', err);
      setError('Error al agregar el banner');
      return { success: false, error: 'Error al agregar el banner' };
    }
  }, []);

  // Actualizar banner
  const updateBanner = useCallback(async (id: string, updates: Partial<Banner>) => {
    try {
      setError(null);
      
      await updateDoc(doc(db, 'banners', id), updates);
      
      setBanners(prev => prev.map(banner => 
        banner.id === id ? { ...banner, ...updates } : banner
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Error al actualizar el banner');
      return { success: false, error: 'Error al actualizar el banner' };
    }
  }, []);

  // Eliminar banner
  const deleteBanner = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'banners', id));
      setBanners(prev => prev.filter(banner => banner.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing banner:', err);
      setError('Error al eliminar el banner');
      return { success: false, error: 'Error al eliminar el banner' };
    }
  }, []);

  // Cargar banners al montar el componente
  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return {
    banners,
    isLoading,
    error,
    addBanner,
    updateBanner,
    deleteBanner,
    loadBanners
  };
}
