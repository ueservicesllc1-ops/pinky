import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }
    
    // Validar que la URL sea de Backblaze B2
    if (!imageUrl.includes('backblazeb2.com')) {
      return NextResponse.json({ error: 'Invalid URL - must be from Backblaze B2' }, { status: 400 });
    }
    
    // Fetch de la imagen desde Backblaze B2
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*',
      },
    });
    
    if (!response.ok) {
      console.error('Error fetching image from B2:', response.status, response.statusText);
      return NextResponse.json({ 
        error: 'Failed to fetch image from B2',
        status: response.status,
        statusText: response.statusText
      }, { status: response.status });
    }
    
    // Obtener el contenido de la imagen
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';
    
    // Retornar la imagen con headers CORS habilitados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=3600', // Cache por 1 hora
        'X-Image-Source': 'backblaze-b2', // Header personalizado para identificar la fuente
      },
    });
    
  } catch (error) {
    console.error('Error in B2 image proxy:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Manejar OPTIONS para CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
