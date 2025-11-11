'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Locale = 'es' | 'en';

export interface BannerTranslations {
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  buttonText: Record<Locale, string>;
  discountText?: Record<Locale, string>;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageUrl: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  showMemberDiscount?: boolean;
  discountText?: string;
  imageZoom?: number;
  imagePosition?: { x: number; y: number };
  translations?: BannerTranslations;
}

const cloneTranslations = (valueEs: string, existing?: Record<Locale, string>): Record<Locale, string> => {
  const es = valueEs || existing?.es || '';
  const en = existing?.en || es;
  return { es, en };
};

export function useBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar banners desde Firestore
  const loadBanners = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const bannersRef = collection(db, 'banners');
      const q = query(bannersRef, orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const bannersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const translations = (data.translations || {}) as BannerTranslations | undefined;

        const titleTranslations = cloneTranslations(data.title || '', translations?.title);
        const subtitleTranslations = cloneTranslations(data.subtitle || '', translations?.subtitle);
        const buttonTextTranslations = cloneTranslations(data.buttonText || '', translations?.buttonText);
        const discountTextTranslations = data.showMemberDiscount
          ? cloneTranslations(data.discountText || '', translations?.discountText)
          : undefined;

        return {
          id: doc.id,
          title: titleTranslations.es,
          subtitle: subtitleTranslations.es,
          buttonText: buttonTextTranslations.es,
          buttonLink: data.buttonLink || '',
          imageUrl: data.imageUrl || '',
          isActive: data.isActive !== false,
          order: data.order ?? 1,
          createdAt: data.createdAt?.toDate() || new Date(),
          showMemberDiscount: data.showMemberDiscount || false,
          discountText: discountTextTranslations?.es || data.discountText,
          imageZoom: data.imageZoom,
          imagePosition: data.imagePosition,
          translations: {
            title: titleTranslations,
            subtitle: subtitleTranslations,
            buttonText: buttonTextTranslations,
            discountText: discountTextTranslations,
          },
        } as Banner;
      });
      
      setBanners(bannersData);
    } catch (err) {
      console.error('Error loading banners:', err);
      setError('Error al cargar los banners');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Agregar nuevo banner
  const addBanner = useCallback(async (bannerData: Omit<Banner, 'id' | 'createdAt' | 'translations'>) => {
    try {
      setError(null);

      const translations: BannerTranslations = {
        title: cloneTranslations(bannerData.title),
        subtitle: cloneTranslations(bannerData.subtitle),
        buttonText: cloneTranslations(bannerData.buttonText),
        discountText: bannerData.showMemberDiscount
          ? cloneTranslations(bannerData.discountText || '')
          : undefined,
      };

      const data = {
        ...bannerData,
        createdAt: new Date(),
        translations,
      };
      
      const docRef = await addDoc(collection(db, 'banners'), data);
      
      const newBanner: Banner = {
        id: docRef.id,
        ...data,
        translations,
      };
      
      setBanners(prev => [...prev, newBanner].sort((a, b) => a.order - b.order));
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error adding banner:', err);
      setError('Error al agregar el banner');
      return { success: false, error: 'Error al agregar el banner' };
    }
  }, []);

  // Actualizar banner
  const updateBanner = useCallback(async (id: string, updates: Partial<Banner>) => {
    try {
      setError(null);

      const current = banners.find((banner) => banner.id === id);
      if (!current) {
        throw new Error('Banner not found');
      }

      const titleEs = updates.title ?? current.title;
      const subtitleEs = updates.subtitle ?? current.subtitle;
      const buttonTextEs = updates.buttonText ?? current.buttonText;
      const discountTextEs =
        updates.showMemberDiscount ?? current.showMemberDiscount
          ? updates.discountText ?? current.discountText ?? ''
          : undefined;

      const newTranslations: BannerTranslations = {
        title: cloneTranslations(titleEs, current.translations?.title),
        subtitle: cloneTranslations(subtitleEs, current.translations?.subtitle),
        buttonText: cloneTranslations(buttonTextEs, current.translations?.buttonText),
        discountText:
          updates.showMemberDiscount ?? current.showMemberDiscount
            ? cloneTranslations(discountTextEs || '', current.translations?.discountText)
            : undefined,
      };

      const updatesToSave: Record<string, unknown> = {
        ...updates,
        title: titleEs,
        subtitle: subtitleEs,
        buttonText: buttonTextEs,
        discountText: discountTextEs,
        translations: newTranslations,
      };

      if (!(updates.showMemberDiscount ?? current.showMemberDiscount)) {
        delete updatesToSave.discountText;
        delete newTranslations.discountText;
      }

      await updateDoc(doc(db, 'banners', id), updatesToSave);

      setBanners((prev) =>
        prev.map((banner) =>
          banner.id === id
            ? {
                ...banner,
                ...updates,
                title: titleEs,
                subtitle: subtitleEs,
                buttonText: buttonTextEs,
                discountText: discountTextEs,
                translations: newTranslations,
              }
            : banner
        )
      );
      
      return { success: true };
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Error al actualizar el banner');
      return { success: false, error: 'Error al actualizar el banner' };
    }
  }, [banners]);

  // Eliminar banner
  const deleteBanner = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'banners', id));
      setBanners(prev => prev.filter(banner => banner.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing banner:', err);
      setError('Error al eliminar el banner');
      return { success: false, error: 'Error al eliminar el banner' };
    }
  }, []);

  // Cargar banners al montar el componente
  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return {
    banners,
    isLoading,
    error,
    addBanner,
    updateBanner,
    deleteBanner,
    loadBanners
  };
}
