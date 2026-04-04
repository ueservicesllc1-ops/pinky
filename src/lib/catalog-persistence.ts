import { db } from './firebase';
import { collection, addDoc, getDoc, doc, setDoc, query, where, getDocs } from 'firebase/firestore';
import { uploadImage } from './storage-service';
import { CatalogData, CatalogPage } from '@/types/catalog';

/**
 * Converte una DataURL (base64) en un objeto File
 */
export function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Guarda un catálogo completo en B2 y Firestore
 */
export async function saveCatalog(
  pdfFile: File,
  catalogTitle: string,
  pagesDataURLs: string[],
  onProgress?: (msg: string) => void
): Promise<string> {
  const shareToken = Math.random().toString(36).substring(2, 12);
  
  try {
    // 1. Subir PDF a B2
    onProgress?.('Subiendo PDF original a B2...');
    const pdfUpload = await uploadImage(pdfFile, 'pdfs', `catalog_${shareToken}.pdf`);
    
    // 2. Subir imágenes de páginas a B2
    onProgress?.(`Subiendo ${pagesDataURLs.length} páginas a B2...`);
    const pageUrls: string[] = [];
    
    // Lo hacemos en secuencia para no saturar con demasiadas peticiones paralelas si hay muchas páginas
    for (let i = 0; i < pagesDataURLs.length; i++) {
       onProgress?.(`Subiendo página ${i + 1}/${pagesDataURLs.length}...`);
       const file = dataURLtoFile(pagesDataURLs[i], `p${i}.jpg`);
       const result = await uploadImage(file, 'catalogs', `page_${shareToken}_${i}.jpg`);
       pageUrls.push(result.url);
       // Attempt to lock orientation if API is available
       const orientation = (window.screen as any)?.orientation;
       if (orientation?.lock) {
         orientation.lock('landscape').catch(() => {});
       }
    }
    
    // 3. Preparar documento de Firestore
    const catalogData: CatalogData = {
      id: shareToken,
      title: catalogTitle,
      subtitle: `${pagesDataURLs.length} páginas · Pinky Flame`,
      pages: pageUrls.map((url, idx) => ({
        id: `p${idx}`,
        image: url,
        pageNumber: idx,
        title: `Página ${idx + 1}`
      })),
      createdAt: new Date(),
      pdfUrl: pdfUpload.url,
      shareToken: shareToken
    };
    
    onProgress?.('Guardando configuración en Firestore...');
    await setDoc(doc(db, 'catalogos', shareToken), catalogData);
    
    return shareToken;
  } catch (error) {
    console.error('Error in saveCatalog:', error);
    throw error;
  }
}

/**
 * Recupera un catálogo de Firestore por su token
 */
export async function getCatalogByToken(token: string): Promise<CatalogData | null> {
  try {
    const docSnap = await getDoc(doc(db, 'catalogos', token));
    if (docSnap.exists()) {
      return docSnap.data() as CatalogData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching catalog:', error);
    return null;
  }
}

/**
 * Recupera los últimos catálogos guardados
 */
export async function getRecentCatalogs(limitNum: number = 10): Promise<CatalogData[]> {
  try {
    const q = query(
      collection(db, 'catalogos'),
      where('createdAt', '!=', null)
    );
    const querySnapshot = await getDocs(q);
    const results: CatalogData[] = [];
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as CatalogData);
    });
    
    return results.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, limitNum);
  } catch (error) {
    console.error('Error fetching recent catalogs:', error);
    return [];
  }
}
