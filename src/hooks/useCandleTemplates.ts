import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CandleTemplate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  type: string;
  variants?: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useCandleTemplates() {
  const [templates, setTemplates] = useState<CandleTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTemplates = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Cargando plantillas desde Firebase...');
      
      const templatesRef = collection(db, 'candle-templates');
      
      // Cargar todas las plantillas sin filtros para debuggear
      const snapshot = await getDocs(templatesRef);
      console.log('📊 Documentos encontrados:', snapshot.docs.length);
      
      const templatesData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Documento:', doc.id, data);
        return {
          id: doc.id,
          name: data.name || 'Sin nombre',
          description: data.description || 'Sin descripción',
          imageUrl: data.imageUrl || '',
          category: data.category || 'Sin categoría',
          type: data.type || 'cylindrical',
          isActive: data.isActive !== false, // Si no está definido, asumir true
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      }).filter(template => template.isActive); // Filtrar solo las activas

      console.log('✅ Plantillas cargadas:', templatesData.length);
      setTemplates(templatesData);
    } catch (err) {
      console.error('❌ Error loading candle templates:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window !== 'undefined') {
      loadTemplates();
    }
  }, []);

  return {
    templates,
    isLoading,
    error,
    refetch: loadTemplates
  };
}
