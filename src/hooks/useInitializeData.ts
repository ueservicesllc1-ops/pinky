'use client';

import { useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const defaultCategories = [
  { name: 'Velas Románticas', description: 'Para momentos especiales' },
  { name: 'Velas Elegantes', description: 'Para ocasiones formales' },
  { name: 'Velas Casuales', description: 'Para uso diario' },
  { name: 'Velas Aromáticas', description: 'Con fragancias especiales' },
  { name: 'Velas Decorativas', description: 'Para decorar tu hogar' },
  { name: 'Velas Personalizadas', description: 'Hechas a tu medida' }
];

export function useInitializeData() {
  useEffect(() => {
    const initializeCategories = async () => {
      try {
        // Verificar si ya existen categorías
        const categoriesRef = collection(db, 'categories');
        const snapshot = await getDocs(categoriesRef);
        
        // Si no hay categorías, crear las por defecto
        if (snapshot.empty) {
          console.log('Inicializando categorías por defecto...');
          
          for (const category of defaultCategories) {
            await addDoc(categoriesRef, {
              ...category,
              createdAt: new Date()
            });
          }
          
          console.log('Categorías inicializadas correctamente');
        }
      } catch (error) {
        console.error('Error inicializando categorías:', error);
      }
    };

    initializeCategories();
  }, []);
}
