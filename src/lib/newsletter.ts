import { db } from './firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

export interface NewsletterSubscription {
  id?: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source: 'homepage' | 'footer' | 'popup';
}

export const subscribeToNewsletter = async (
  email: string, 
  source: 'homepage' | 'footer' | 'popup' = 'homepage'
): Promise<{ success: boolean; message: string }> => {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, message: 'Por favor ingresa un email válido' };
    }

    // Verificar si ya existe
    const subscriptionsRef = collection(db, 'newsletter_subscriptions');
    const q = query(subscriptionsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, message: 'Este email ya está suscrito a nuestro newsletter' };
    }

    // Agregar nueva suscripción
    const subscriptionData: Omit<NewsletterSubscription, 'id'> = {
      email: email.toLowerCase().trim(),
      subscribedAt: new Date(),
      isActive: true,
      source
    };

    await addDoc(subscriptionsRef, subscriptionData);

    return { 
      success: true, 
      message: '¡Gracias por suscribirte! Recibirás nuestras novedades pronto.' 
    };

  } catch (error) {
    console.error('Error al suscribir al newsletter:', error);
    return { 
      success: false, 
      message: 'Hubo un error al procesar tu suscripción. Por favor intenta de nuevo.' 
    };
  }
};

export const getNewsletterSubscribers = async (): Promise<NewsletterSubscription[]> => {
  try {
    const subscriptionsRef = collection(db, 'newsletter_subscriptions');
    const querySnapshot = await getDocs(subscriptionsRef);
    
    const subscribers: NewsletterSubscription[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      subscribers.push({
        id: doc.id,
        email: data.email,
        subscribedAt: data.subscribedAt.toDate(),
        isActive: data.isActive,
        source: data.source
      });
    });

    return subscribers;
  } catch (error) {
    console.error('Error al obtener suscriptores:', error);
    return [];
  }
};
