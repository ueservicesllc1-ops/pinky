import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Testimonios originales hardcodeados
const originalTestimonials = [
  {
    name: 'María González',
    location: 'Madrid, España',
    rating: 5,
    text: 'Las velas de Pinky Flames son absolutamente increíbles. La fragancia dura horas y la calidad es excepcional. ¡Mi favorita es la de lavanda!',
    avatar: 'MG',
    isActive: true,
    order: 1
  },
  {
    name: 'Carlos Rodríguez',
    location: 'Barcelona, España',
    rating: 5,
    text: 'Pedí una vela personalizada para el cumpleaños de mi esposa y quedó perfecta. El servicio al cliente es excelente y el producto superó mis expectativas.',
    avatar: 'CR',
    isActive: true,
    order: 2
  },
  {
    name: 'Ana Martín',
    location: 'Valencia, España',
    rating: 5,
    text: 'Me encanta que sean 100% naturales. Como tengo alergias, es difícil encontrar velas que no me afecten. Pinky Flames es la solución perfecta.',
    avatar: 'AM',
    isActive: true,
    order: 3
  },
  {
    name: 'David López',
    location: 'Sevilla, España',
    rating: 5,
    text: 'El proceso de personalización fue muy fácil y el resultado final fue espectacular. Definitivamente volveré a pedir más velas.',
    avatar: 'DL',
    isActive: true,
    order: 4
  },
  {
    name: 'Laura Sánchez',
    location: 'Bilbao, España',
    rating: 5,
    text: 'La vela de vainilla que pedí huele exactamente como esperaba. La duración es increíble y el embalaje es precioso. ¡Altamente recomendado!',
    avatar: 'LS',
    isActive: true,
    order: 5
  },
  {
    name: 'Miguel Torres',
    location: 'Málaga, España',
    rating: 5,
    text: 'Excelente calidad y servicio. Las velas llegaron perfectamente empaquetadas y la fragancia es deliciosa. Sin duda volveré a comprar.',
    avatar: 'MT',
    isActive: true,
    order: 6
  }
];

export async function migrateTestimonials() {
  try {
    console.log('🔄 Iniciando migración de testimonios...');
    
    const testimonialsRef = collection(db, 'testimonials');
    const now = new Date();
    
    for (const testimonial of originalTestimonials) {
      await addDoc(testimonialsRef, {
        ...testimonial,
        createdAt: now,
        updatedAt: now,
      });
      console.log(`✅ Testimonio de ${testimonial.name} migrado`);
    }
    
    console.log('🎉 Migración de testimonios completada exitosamente');
    return { success: true, count: originalTestimonials.length };
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}
