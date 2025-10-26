// Script para verificar qué hay en la colección products
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

async function checkProducts() {
  try {
    console.log('🔍 Verificando colección products...');
    
    const productsRef = collection(db, 'test');
    const snapshot = await getDocs(productsRef);
    
    console.log(`📄 Total documentos en products: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      console.log('\n📋 Primeros 3 productos:');
      snapshot.docs.slice(0, 3).forEach((doc, index) => {
        const data = doc.data();
        console.log(`\n${index + 1}. ID: ${doc.id}`);
        console.log(`   Nombre: ${data.name || 'Sin nombre'}`);
        console.log(`   Precio: ${data.price || 'Sin precio'}`);
        console.log(`   Categoría: ${data.category || 'Sin categoría'}`);
        console.log(`   Imagen: ${data.image || data.imageUrl || 'Sin imagen'}`);
        console.log(`   Activo: ${data.active !== false ? 'Sí' : 'No'}`);
        console.log(`   Creado: ${data.createdAt ? data.createdAt.toDate() : 'Sin fecha'}`);
      });
    } else {
      console.log('❌ No hay productos en la colección products');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProducts();
