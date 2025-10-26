import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Configuración de Backblaze B2 (S3 compatible)
const B2_CONFIG = {
  accessKeyId: '005c2b526be0baa000000001c',
  secretAccessKey: 'K005fAx5JipaFKVz4AxAfguok4xkI5E',
  bucketName: 'pinkynewapp',
  region: 'us-east-005',
  endpoint: 'https://s3.us-east-005.backblazeb2.com'
};

// Crear cliente S3 para Backblaze B2
const s3Client = new S3Client({
  region: B2_CONFIG.region,
  endpoint: B2_CONFIG.endpoint,
  credentials: {
    accessKeyId: B2_CONFIG.accessKeyId,
    secretAccessKey: B2_CONFIG.secretAccessKey,
  },
  forcePathStyle: true, // Importante para B2
});

export async function POST(request: NextRequest) {
  try {
    console.log('📤 POST request recibido en /api/upload');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    const fileName = formData.get('fileName') as string;

    console.log('📄 Datos recibidos:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      folder,
      fileNameParam: fileName
    });

    if (!file) {
      console.error('❌ No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!folder) {
      console.error('❌ No folder provided');
      return NextResponse.json({ error: 'No folder provided' }, { status: 400 });
    }

    console.log(`📤 Subiendo imagen a B2 S3: ${file.name} en carpeta ${folder}`);

    // Generar nombre único si no se proporciona
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const finalFileName = fileName || `${timestamp}_${file.name}`;
    const filePath = `${folder}/${finalFileName}`;

    console.log('📁 Ruta del archivo:', filePath);

    // Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('📦 Buffer creado, tamaño:', buffer.length);

    // Crear comando de subida
    const uploadCommand = new PutObjectCommand({
      Bucket: B2_CONFIG.bucketName,
      Key: filePath,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Hacer el archivo público
    });

    console.log('⬆️ Subiendo archivo a B2 S3...');
    
    // Ejecutar comando de subida
    const uploadResult = await s3Client.send(uploadCommand);
    
    console.log('✅ Archivo subido a B2 S3:', uploadResult);

    // Construir URL pública
    const publicUrl = `https://${B2_CONFIG.bucketName}.${B2_CONFIG.endpoint.replace('https://', '')}/${filePath}`;
    console.log('🔗 URL pública:', publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: finalFileName
    });

  } catch (error) {
    console.error('❌ Error subiendo archivo a B2 S3:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Error al subir la imagen a B2 S3',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    console.log(`🗑️ Eliminando imagen de B2 S3: ${imageUrl}`);

    // Verificar si es una URL de B2
    if (!imageUrl.includes(B2_CONFIG.endpoint.replace('https://', ''))) {
      console.warn('La URL no es de B2, no se puede eliminar:', imageUrl);
      return NextResponse.json({ 
        success: true, 
        message: 'URL no es de B2, no se eliminó' 
      });
    }

    // Extraer la ruta del archivo de la URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const filePath = `${folder}/${fileName}`;

    // Crear comando de eliminación
    const deleteCommand = new DeleteObjectCommand({
      Bucket: B2_CONFIG.bucketName,
      Key: filePath,
    });

    // Eliminar archivo
    await s3Client.send(deleteCommand);

    console.log('✅ Archivo eliminado de B2 S3:', filePath);

    return NextResponse.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando archivo de B2 S3:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ 
      error: 'Error al eliminar la imagen de B2 S3',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}