const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('firebase/firestore');

// Configuración de Firebase (usa las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

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

async function migrateTestimonials() {
  try {
    console.log('🔄 Iniciando migración de testimonios...');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Verificar si ya existen testimonios
    const testimonialsRef = collection(db, 'testimonials');
    const existingTestimonials = await getDocs(testimonialsRef);
    
    if (existingTestimonials.size > 0) {
      console.log(`⚠️  Ya existen ${existingTestimonials.size} testimonios en Firebase. ¿Deseas continuar? (Ctrl+C para cancelar)`);
      // Esperar 3 segundos para que el usuario pueda cancelar
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    const now = new Date();
    let migratedCount = 0;
    
    for (const testimonial of originalTestimonials) {
      await addDoc(testimonialsRef, {
        ...testimonial,
        createdAt: now,
        updatedAt: now,
      });
      migratedCount++;
      console.log(`✅ Testimonio de ${testimonial.name} migrado`);
    }
    
    console.log(`🎉 Migración de testimonios completada exitosamente. ${migratedCount} testimonios migrados.`);
    return { success: true, count: migratedCount };
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    return { success: false, error: error.message };
  }
}

// Ejecutar la migración
migrateTestimonials()
  .then(result => {
    if (result.success) {
      console.log('✅ Migración completada exitosamente');
      process.exit(0);
    } else {
      console.error('❌ Error en la migración:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('❌ Error inesperado:', error);
    process.exit(1);
  });
