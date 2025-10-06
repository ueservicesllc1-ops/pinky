import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ContactMessage {
  id: string;
  nombre: string;
  apellido?: string;
  email: string;
  mensaje: string;
  fecha: any;
  leido: boolean;
  timestamp: number;
}

export function useContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const messagesRef = collection(db, 'contactMessages');
    const q = query(messagesRef, orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const messagesData: ContactMessage[] = [];
        snapshot.forEach((doc) => {
          messagesData.push({
            id: doc.id,
            ...doc.data()
          } as ContactMessage);
        });
        setMessages(messagesData);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching messages:', error);
        setError('Error al cargar mensajes');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const markAsRead = async (messageId: string) => {
    try {
      const messageRef = doc(db, 'contactMessages', messageId);
      await updateDoc(messageRef, {
        leido: true
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter(msg => !msg.leido);
      const updatePromises = unreadMessages.map(msg => 
        updateDoc(doc(db, 'contactMessages', msg.id), { leido: true })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  };

  const unreadCount = messages.filter(msg => !msg.leido).length;
  const hasUnread = unreadCount > 0;

  return {
    messages,
    loading,
    error,
    unreadCount,
    hasUnread,
    markAsRead,
    markAllAsRead
  };
}
