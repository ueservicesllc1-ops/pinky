import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadImage(
  file: File, 
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup' | 'candle-templates',
  fileName?: string
): Promise<UploadResult> {
  try {
    // Generar nombre único si no se proporciona
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}_${file.name}`;
    
    // Crear referencia en Firebase Storage
    const storageRef = ref(storage, `${folder}/${finalFileName}`);
    
    // Subir archivo
    const snapshot = await uploadBytes(storageRef, file);
    
    // Obtener URL de descarga
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Error al subir la imagen');
  }
}

export async function uploadMultipleImages(
  files: File[], 
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup' | 'candle-templates'
): Promise<UploadResult[]> {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error('Error al subir las imágenes');
  }
}

export async function deleteImage(imagePath: string): Promise<void> {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Error al eliminar la imagen');
  }
}

export async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    // Verificar si es una URL de Firebase Storage
    if (!imageUrl.includes('firebasestorage.googleapis.com')) {
      console.warn('La URL no es de Firebase Storage, no se puede eliminar:', imageUrl);
      return; // No es una imagen de Firebase, no intentar eliminar
    }

    // Extraer la ruta del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const encodedFileName = encodeURIComponent(fileName);
    
    // Buscar en todas las carpetas posibles
    const folders = ['banners', 'candles', 'promotions', 'offers', 'categories', 'hero-popup', 'candle-templates'];
    
    for (const folder of folders) {
      try {
        const imageRef = ref(storage, `${folder}/${encodedFileName}`);
        await deleteObject(imageRef);
        console.log(`Imagen eliminada de ${folder}/${encodedFileName}`);
        return; // Si se encuentra y elimina, salir
      } catch (error) {
        // Continuar con la siguiente carpeta si no se encuentra
        continue;
      }
    }
    
    console.warn('Imagen no encontrada en Firebase Storage:', imageUrl);
    // No lanzar error, solo mostrar advertencia
  } catch (error) {
    console.error('Error deleting file by URL:', error);
    // No lanzar error para URLs externas
    console.warn('No se pudo eliminar la imagen (puede ser una URL externa)');
  }
}
