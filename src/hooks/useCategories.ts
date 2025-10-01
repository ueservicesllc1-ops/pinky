'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías desde Firestore con listener en tiempo real
  const loadCategories = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const categoriesRef = collection(db, 'categories');
      const q = query(categoriesRef, orderBy('createdAt', 'desc'));
      
      // Usar onSnapshot para actualizaciones en tiempo real
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as Category[];
        
        console.log('Categorías actualizadas desde Firestore:', categoriesData);
        setCategories(categoriesData);
        setIsLoading(false);
      }, (err) => {
        console.error('Error loading categories:', err);
        setError('Error al cargar las categorías');
        setIsLoading(false);
      });
      
      // Retornar función de limpieza
      return unsubscribe;
    } catch (err) {
      console.error('Error setting up categories listener:', err);
      setError('Error al configurar el listener de categorías');
      setIsLoading(false);
      return () => {};
    }
  }, []);

  // Agregar nueva categoría
  const addCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      console.log('Intentando agregar categoría:', categoryData);
      
      const data = {
        name: categoryData.name.trim(),
        description: categoryData.description?.trim() || '',
        createdAt: new Date()
      };
      
      console.log('Datos a enviar a Firestore:', data);
      const docRef = await addDoc(collection(db, 'categories'), data);
      console.log('Categoría creada en Firestore con ID:', docRef.id);
      
      // El listener en tiempo real se encargará de actualizar el estado
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Error al agregar la categoría: ' + (err as Error).message);
      return { success: false, error: 'Error al agregar la categoría: ' + (err as Error).message };
    }
  }, []);

  // Eliminar categoría
  const deleteCategory = useCallback(async (id: string) => {
    try {
      setError(null);
      console.log('Intentando eliminar categoría con ID:', id);
      
      await deleteDoc(doc(db, 'categories', id));
      console.log('Categoría eliminada de Firestore');
      
      // El listener en tiempo real se encargará de actualizar el estado
      return { success: true };
    } catch (err) {
      console.error('Error removing category:', err);
      setError('Error al eliminar la categoría: ' + (err as Error).message);
      return { success: false, error: 'Error al eliminar la categoría: ' + (err as Error).message };
    }
  }, []);

  // Cargar categorías al montar el componente
  useEffect(() => {
    const unsubscribe = loadCategories();
    
    // Función de limpieza para desuscribirse del listener
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    error,
    addCategory,
    deleteCategory,
    loadCategories
  };
}