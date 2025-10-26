// Script para buscar datos de velas en todas las colecciones
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

const collectionsToCheck = [
  'orders', 'test', 'products', 'candles', 'velas', 
  'banners', 'customCandleOrders', 'userImages'
];

async function searchForCandleData() {
  try {
    console.log('🔍 Buscando datos de velas en todas las colecciones...\n');
    
    for (const collectionName of collectionsToCheck) {
      try {
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        if (!snapshot.empty) {
          console.log(`📁 Colección: ${collectionName} (${snapshot.size} documentos)`);
          
          // Buscar documentos que parezcan ser velas/productos
          snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            
            // Verificar si tiene campos que sugieren que es un producto/vela
            if (data.name || data.title || data.price || data.description || data.category) {
              console.log(`   📋 Documento ${index + 1} (${doc.id}):`);
              console.log(`      - Nombre: ${data.name || data.title || 'Sin nombre'}`);
              console.log(`      - Precio: ${data.price || 'Sin precio'}`);
              console.log(`      - Descripción: ${data.description ? data.description.substring(0, 50) + '...' : 'Sin descripción'}`);
              console.log(`      - Categoría: ${data.category || 'Sin categoría'}`);
              console.log(`      - Imagen: ${data.image || data.imageUrl || data.images ? 'Sí' : 'No'}`);
            }
          });
          console.log('');
        }
      } catch (error) {
        // Colección no existe, continuar
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

searchForCandleData();
