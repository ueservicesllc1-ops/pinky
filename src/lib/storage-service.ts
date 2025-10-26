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
    console.log(`📤 Subiendo imagen a B2 via API: ${file.name} en carpeta ${folder}`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    if (fileName) {
      formData.append('fileName', fileName);
    }

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al subir la imagen');
    }

    const result = await response.json();
    
    console.log('✅ Imagen subida exitosamente a B2:', result);
    
    return {
      url: result.url,
      path: result.path
    };
  } catch (error) {
    console.error('❌ Error uploading file to B2:', error);
    throw new Error('Error al subir la imagen a B2');
  }
}

export async function uploadMultipleImages(
  files: File[], 
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup' | 'candle-templates'
): Promise<UploadResult[]> {
  try {
    console.log(`📤 Subiendo ${files.length} imágenes a B2 via API en carpeta ${folder}`);
    
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    
    console.log('✅ Imágenes subidas exitosamente a B2:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Error uploading multiple files to B2:', error);
    throw new Error('Error al subir las imágenes a B2');
  }
}

export async function deleteImage(imagePath: string): Promise<void> {
  try {
    console.log(`🗑️ Eliminando imagen de B2 via API: ${imagePath}`);
    
    // Construir URL completa para la eliminación
    const imageUrl = `https://pinkyflameapp.s3.us-east-005.backblazeb2.com/${imagePath}`;
    
    const response = await fetch(`http://localhost:3001/delete?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la imagen');
    }
    
    console.log('✅ Imagen eliminada exitosamente de B2');
  } catch (error) {
    console.error('❌ Error deleting file from B2:', error);
    throw new Error('Error al eliminar la imagen de B2');
  }
}

export async function deleteImageByUrl(imageUrl: string): Promise<void> {
  try {
    console.log(`🗑️ Eliminando imagen por URL de B2 via API: ${imageUrl}`);
    
    const response = await fetch(`http://localhost:3001/delete?url=${encodeURIComponent(imageUrl)}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la imagen');
    }
    
    console.log('✅ Imagen eliminada exitosamente de B2 por URL');
  } catch (error) {
    console.error('❌ Error deleting file by URL from B2:', error);
    console.warn('No se pudo eliminar la imagen (puede ser una URL externa)');
  }
}
