// Script para probar la creación de testimonios
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function testTestimonialCreation() {
  try {
    console.log('🧪 Testing testimonial creation...');
    
    const testimonialData = {
      name: 'Test User',
      location: 'Test City',
      rating: 5,
      text: 'Este es un testimonio de prueba para verificar que Firebase funciona correctamente.',
      avatar: 'https://via.placeholder.com/150',
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(collection(db, 'testimonials'), testimonialData);
    console.log('✅ Testimonial created successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('❌ Error creating testimonial:', error);
    return { success: false, error: error };
  }
}
