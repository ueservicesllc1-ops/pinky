import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CustomFont {
  id: string;
  name: string;
  fileName: string;
  downloadURL: string;
  uploadedAt: Date;
  category: string;
}

export const useCustomFonts = () => {
  const [customFonts, setCustomFonts] = useState<CustomFont[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'customFonts'), orderBy('uploadedAt', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fonts: CustomFont[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fonts.push({
            id: doc.id,
            name: data.name,
            fileName: data.fileName,
            downloadURL: data.downloadURL,
            uploadedAt: data.uploadedAt?.toDate() || new Date(),
            category: data.category || 'Personalizada'
          });
        });
        setCustomFonts(fonts);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading custom fonts:', err);
        setError('Error al cargar las fuentes personalizadas');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { customFonts, loading, error };
};
