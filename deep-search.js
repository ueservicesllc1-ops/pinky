// Script para buscar datos en TODAS las colecciones posibles
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSf8VxrNCfCak5bLdLOWRNbXOCZwlRIYM",
  authDomain: "mysetlistapp-bb4c6.firebaseapp.com",
  projectId: "mysetlistapp-bb4c6",
  storageBucket: "mysetlistapp-bb4c6.firebasestorage.app",
  messagingSenderId: "135682742499",
  appId: "1:135682742499:web:4ee741e5252900ace2cdd6",
  measurementId: "G-C4TEB9010X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function deepSearch() {
  try {
    console.log('🔍 BÚSQUEDA PROFUNDA - Buscando datos de velas...\n');
    
    // Lista completa de colecciones posibles
    const allPossibleCollections = [
      'candles', 'velas', 'products', 'productos', 'items', 'catalog',
      'test', 'orders', 'banners', 'promotions', 'special_offers', 
      'hero-popup', 'categories', 'categorias', 'business_config', 
      'footer_config', 'customCandleOrders', 'userImages', 'contactMessages',
      'testimonials', 'testimonials_es', 'titleConfig', 'settings',
      'appConfig', 'banner2Photos', 'bannerPhotos', 'config', 'fonts',
      'ingredients', 'messages', 'pages', 'popupOffers', 'pushMessages',
      'registeredUsers', 'candle-templates'
    ];
    
    let foundData = false;
    
    for (const collectionName of allPossibleCollections) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        if (!snapshot.empty) {
          console.log(`📁 COLECCIÓN ENCONTRADA: ${collectionName} (${snapshot.size} documentos)`);
          
          snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            
            // Buscar cualquier dato que parezca ser una vela/producto
            const hasProductFields = data.name || data.title || data.price || 
                                   data.description || data.category || 
                                   data.image || data.imageUrl || data.images;
            
            if (hasProductFields) {
              console.log(`   📋 DOCUMENTO ${index + 1} (${doc.id}):`);
              console.log(`      - Nombre: ${data.name || data.title || 'Sin nombre'}`);
              console.log(`      - Precio: ${data.price || 'Sin precio'}`);
              console.log(`      - Descripción: ${data.description ? data.description.substring(0, 100) + '...' : 'Sin descripción'}`);
              console.log(`      - Categoría: ${data.category || 'Sin categoría'}`);
              console.log(`      - Imagen: ${data.image || data.imageUrl || data.images ? 'SÍ' : 'No'}`);
              console.log(`      - Activo: ${data.active !== false ? 'Sí' : 'No'}`);
              console.log(`      - Creado: ${data.createdAt ? data.createdAt.toDate() : 'Sin fecha'}`);
              console.log('');
              foundData = true;
            }
          });
        }
      } catch (error) {
        // Colección no existe, continuar
      }
    }
    
    if (!foundData) {
      console.log('❌ NO SE ENCONTRARON DATOS DE VELAS/PRODUCTOS');
      console.log('🔍 Verifica Firebase Console para backups automáticos');
    } else {
      console.log('✅ DATOS ENCONTRADOS - Revisa arriba');
    }
    
  } catch (error) {
    console.error('❌ Error en búsqueda:', error);
  }
}

deepSearch();
