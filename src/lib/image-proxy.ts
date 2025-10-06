/**
 * Convierte una URL de Firebase Storage a una URL del proxy local
 * para evitar problemas de CORS
 */
export function getProxyImageUrl(firebaseUrl: string): string {
  // Si ya es una URL local o blob, no necesita proxy
  if (firebaseUrl.startsWith('/') || firebaseUrl.startsWith('blob:')) {
    return firebaseUrl;
  }
  
  // Si es una URL de Firebase Storage, usar el proxy
  if (firebaseUrl.includes('firebasestorage.googleapis.com')) {
    const encodedUrl = encodeURIComponent(firebaseUrl);
    return `/api/image-proxy?url=${encodedUrl}`;
  }
  
  // Para otras URLs, retornar tal como están
  return firebaseUrl;
}

/**
 * Hook personalizado para cargar imágenes a través del proxy
 */
export function useProxyImage(url: string) {
  const proxyUrl = getProxyImageUrl(url);
  return proxyUrl;
}
