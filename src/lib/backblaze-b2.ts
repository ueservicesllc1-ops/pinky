import B2 from 'backblaze-b2';

// Configuración de Backblaze B2
const B2_CONFIG = {
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '005c2b526be0baa000000001c',
  applicationKey: process.env.B2_APPLICATION_KEY || 'K005fAx5JipaFKVz4AxAfguok4xkI5E',
  bucketId: process.env.B2_BUCKET_ID || '7ce28b55e2762b1e90ab0a1a',
  bucketName: process.env.B2_BUCKET_NAME || 'pinkyflameapp',
  endpoint: process.env.B2_ENDPOINT || 's3.us-east-005.backblazeb2.com'
};

// Inicializar cliente B2
const b2 = new B2({
  applicationKeyId: B2_CONFIG.applicationKeyId,
  applicationKey: B2_CONFIG.applicationKey,
});

export interface B2UploadResult {
  url: string;
  path: string;
  fileName: string;
}

export interface B2Config {
  applicationKeyId: string;
  applicationKey: string;
  bucketId: string;
  bucketName: string;
  endpoint: string;
}

// Función para autorizar B2
async function authorizeB2() {
  try {
    await b2.authorize();
    console.log('✅ B2 autorizado correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error autorizando B2:', error);
    return false;
  }
}

// Función para subir imagen a B2
export async function uploadImageToB2(
  file: File, 
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup' | 'candle-templates',
  fileName?: string
): Promise<B2UploadResult> {
  try {
    // Autorizar B2
    const authorized = await authorizeB2();
    if (!authorized) {
      throw new Error('No se pudo autorizar con B2');
    }

    // Generar nombre único si no se proporciona
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}_${file.name}`;
    const filePath = `${folder}/${finalFileName}`;

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir archivo a B2
    const uploadResponse = await b2.uploadFile({
      bucketId: B2_CONFIG.bucketId,
      fileName: filePath,
      data: buffer,
      contentType: file.type,
    });

    console.log('✅ Archivo subido a B2:', uploadResponse);

    // Construir URL pública
    const publicUrl = `https://${B2_CONFIG.bucketName}.${B2_CONFIG.endpoint}/${filePath}`;

    return {
      url: publicUrl,
      path: filePath,
      fileName: finalFileName
    };

  } catch (error) {
    console.error('❌ Error subiendo archivo a B2:', error);
    throw new Error('Error al subir la imagen a B2');
  }
}

// Función para subir múltiples imágenes
export async function uploadMultipleImagesToB2(
  files: File[], 
  folder: 'banners' | 'candles' | 'promotions' | 'offers' | 'categories' | 'hero-popup' | 'candle-templates'
): Promise<B2UploadResult[]> {
  try {
    const uploadPromises = files.map(file => uploadImageToB2(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('❌ Error subiendo múltiples archivos a B2:', error);
    throw new Error('Error al subir las imágenes a B2');
  }
}

// Función para eliminar imagen de B2
export async function deleteImageFromB2(filePath: string): Promise<void> {
  try {
    // Autorizar B2
    const authorized = await authorizeB2();
    if (!authorized) {
      throw new Error('No se pudo autorizar con B2');
    }

    // Obtener información del archivo
    const fileInfo = await b2.getFileInfo({
      bucketId: B2_CONFIG.bucketId,
      fileName: filePath
    });

    // Eliminar archivo
    await b2.deleteFileVersion({
      fileId: fileInfo.fileId,
      fileName: filePath
    });

    console.log('✅ Archivo eliminado de B2:', filePath);

  } catch (error) {
    console.error('❌ Error eliminando archivo de B2:', error);
    throw new Error('Error al eliminar la imagen de B2');
  }
}

// Función para eliminar imagen por URL
export async function deleteImageByUrlFromB2(imageUrl: string): Promise<void> {
  try {
    // Verificar si es una URL de B2
    if (!imageUrl.includes(B2_CONFIG.endpoint)) {
      console.warn('La URL no es de B2, no se puede eliminar:', imageUrl);
      return;
    }

    // Extraer la ruta del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    await deleteImageFromB2(filePath);

  } catch (error) {
    console.error('❌ Error eliminando archivo por URL:', error);
    console.warn('No se pudo eliminar la imagen (puede ser una URL externa)');
  }
}

// Función para obtener URL pública de un archivo
export function getB2PublicUrl(filePath: string): string {
  return `https://${B2_CONFIG.bucketName}.${B2_CONFIG.endpoint}/${filePath}`;
}

// Exportar configuración para uso en otros archivos
export { B2_CONFIG };
