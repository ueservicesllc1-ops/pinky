/**
 * Convierte una URL de Backblaze B2 a una URL del proxy local
 * para evitar problemas de CORS
 */
export function getProxyImageUrl(imageUrl: string): string {
  // Si ya es una URL local o blob, no necesita proxy
  if (imageUrl.startsWith('/') || imageUrl.startsWith('blob:')) {
    return imageUrl;
  }
  
  // Si es una URL de Backblaze B2, usar el proxy
  if (imageUrl.includes('backblazeb2.com')) {
    const encodedUrl = encodeURIComponent(imageUrl);
    return `/api/b2-proxy?url=${encodedUrl}`;
  }
  
  // Si es una URL de Firebase Storage (legacy), usar el proxy de Firebase
  if (imageUrl.includes('firebasestorage.googleapis.com')) {
    const encodedUrl = encodeURIComponent(imageUrl);
    return `/api/image-proxy?url=${encodedUrl}`;
  }
  
  // Para otras URLs, retornar tal como están
  return imageUrl;
}

/**
 * Hook personalizado para cargar imágenes a través del proxy
 */
export function useProxyImage(url: string) {
  const proxyUrl = getProxyImageUrl(url);
  return proxyUrl;
}
