const express = require('express');
const multer = require('multer');
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const cors = require('cors');

const app = express();
const PORT = 3001;

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
  forcePathStyle: true,
});

// Middleware
app.use(cors());
app.use(express.json());

// Configurar multer para manejar archivos
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  }
});

// Ruta para subir archivos
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('📤 POST request recibido en proxy S3');
    
    const file = req.file;
    const folder = req.body.folder;
    const fileName = req.body.fileName;

    console.log('📄 Datos recibidos:', {
      fileName: file?.originalname,
      fileSize: file?.size,
      fileType: file?.mimetype,
      folder,
      fileNameParam: fileName
    });

    if (!file) {
      console.error('❌ No file provided');
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!folder) {
      console.error('❌ No folder provided');
      return res.status(400).json({ error: 'No folder provided' });
    }

    console.log(`📤 Subiendo imagen a B2 S3: ${file.originalname} en carpeta ${folder}`);

    // Generar nombre único si no se proporciona
    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop();
    const finalFileName = fileName || `${timestamp}_${file.originalname}`;
    const filePath = `${folder}/${finalFileName}`;

    console.log('📁 Ruta del archivo:', filePath);

    // Crear comando de subida
    const uploadCommand = new PutObjectCommand({
      Bucket: B2_CONFIG.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    console.log('⬆️ Subiendo archivo a B2 S3...');
    
    // Ejecutar comando de subida
    const uploadResult = await s3Client.send(uploadCommand);
    
    console.log('✅ Archivo subido a B2 S3:', uploadResult);

    // Construir URL pública
    const publicUrl = `https://${B2_CONFIG.bucketName}.${B2_CONFIG.endpoint.replace('https://', '')}/${filePath}`;
    console.log('🔗 URL pública:', publicUrl);

    res.json({
      success: true,
      url: publicUrl,
      path: filePath,
      fileName: finalFileName
    });

  } catch (error) {
    console.error('❌ Error subiendo archivo a B2 S3:', error);
    res.status(500).json({ 
      error: 'Error al subir la imagen a B2 S3',
      details: error.message
    });
  }
});

// Ruta para eliminar archivos
app.delete('/delete', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    console.log(`🗑️ Eliminando imagen de B2 S3: ${url}`);

    // Verificar si es una URL de B2
    if (!url.includes(B2_CONFIG.endpoint.replace('https://', ''))) {
      console.warn('La URL no es de B2, no se puede eliminar:', url);
      return res.json({ 
        success: true, 
        message: 'URL no es de B2, no se eliminó' 
      });
    }

    // Extraer la ruta del archivo de la URL
    const urlParts = url.split('/');
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

    res.json({
      success: true,
      message: 'Archivo eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error eliminando archivo de B2 S3:', error);
    res.status(500).json({ 
      error: 'Error al eliminar la imagen de B2 S3',
      details: error.message
    });
  }
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'S3 Proxy Server running' });
});

app.listen(PORT, () => {
  console.log(`🚀 S3 Proxy Server running on port ${PORT}`);
  console.log(`📡 Upload endpoint: http://localhost:${PORT}/upload`);
  console.log(`🗑️ Delete endpoint: http://localhost:${PORT}/delete`);
  console.log(`❤️ Health check: http://localhost:${PORT}/health`);
});
