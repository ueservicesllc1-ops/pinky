'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar testimonios desde Firebase
  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const testimonialsRef = collection(db, 'testimonials');
      const q = query(testimonialsRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const testimonialsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as Testimonial[];
      
      setTestimonials(testimonialsData);
      console.log('✅ Testimonials loaded from Firebase:', testimonialsData.length);
    } catch (error) {
      console.error('❌ Error loading testimonials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listener en tiempo real para testimonios
  useEffect(() => {
    const testimonialsRef = collection(db, 'testimonials');
    const q = query(testimonialsRef, orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        const testimonialsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Testimonial[];
        
        setTestimonials(testimonialsData);
        setIsLoading(false);
        console.log('🔄 Real-time testimonials update:', testimonialsData.length);
      } catch (error) {
        console.error('❌ Error in real-time listener:', error);
      }
    }, (error) => {
      console.error('❌ Real-time listener error:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Agregar nuevo testimonio
  const addTestimonial = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🧪 Adding testimonial to Firebase:', testimonialData);
      const testimonialsRef = collection(db, 'testimonials');
      const now = new Date();
      
      const docRef = await addDoc(testimonialsRef, {
        ...testimonialData,
        createdAt: now,
        updatedAt: now,
      });
      
      console.log('✅ Testimonial added successfully with ID:', docRef.id);
      // No necesitamos recargar manualmente, el listener en tiempo real se encarga
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('❌ Error adding testimonial:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  // Actualizar testimonio
  const updateTestimonial = async (id: string, testimonialData: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      console.log('🔄 Updating testimonial:', id, testimonialData);
      const testimonialRef = doc(db, 'testimonials', id);
      await updateDoc(testimonialRef, {
        ...testimonialData,
        updatedAt: new Date(),
      });
      
      console.log('✅ Testimonial updated successfully');
      // No necesitamos recargar manualmente, el listener en tiempo real se encarga
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating testimonial:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };

  // Eliminar testimonio
  const deleteTestimonial = async (id: string) => {
    try {
      console.log('🗑️ Deleting testimonial:', id);
      const testimonialRef = doc(db, 'testimonials', id);
      await deleteDoc(testimonialRef);
      
      console.log('✅ Testimonial deleted successfully');
      // No necesitamos recargar manualmente, el listener en tiempo real se encarga
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting testimonial:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
  };


  return {
    testimonials,
    isLoading,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    loadTestimonials,
  };
}
