'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CustomCandleOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  candleName: string;
  additionalDetails?: string;
  templateName: string;
  templatePrice: number;
  orderImage: string;
  status: 'pending' | 'paid' | 'in_production' | 'completed';
  createdAt: Date;
}

export function useCustomCandleOrders() {
  const [orders, setOrders] = useState<CustomCandleOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar pedidos personalizados desde Firestore
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ordersRef = collection(db, 'customCandleOrders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as CustomCandleOrder[];
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading custom candle orders:', err);
      setError('Error al cargar los pedidos personalizados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear nuevo pedido personalizado
  const createOrder = useCallback(async (orderData: Omit<CustomCandleOrder, 'id' | 'createdAt' | 'status'>) => {
    try {
      setError(null);
      
      const data = {
        ...orderData,
        status: 'pending' as const,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'customCandleOrders'), data);
      
      const newOrder: CustomCandleOrder = {
        id: docRef.id,
        ...data
      };
      
      setOrders(prev => [newOrder, ...prev]);
      return { success: true, id: docRef.id };
    } catch (err) {
      console.error('Error creating custom candle order:', err);
      setError('Error al crear el pedido personalizado');
      return { success: false, error: 'Error al crear el pedido personalizado' };
    }
  }, []);

  // Actualizar estado del pedido
  const updateOrderStatus = useCallback(async (orderId: string, newStatus: CustomCandleOrder['status']) => {
    try {
      setError(null);
      
      await updateDoc(doc(db, 'customCandleOrders', orderId), {
        status: newStatus
      });
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Error al actualizar el estado del pedido');
      return { success: false, error: 'Error al actualizar el estado del pedido' };
    }
  }, []);

  // Obtener conteo de pedidos pendientes (para notificaciones)
  const getPendingCount = useCallback(() => {
    return orders.filter(order => order.status === 'pending').length;
  }, [orders]);

  // Cargar pedidos en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'customCandleOrders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: CustomCandleOrder[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date()
        } as CustomCandleOrder);
      });
      setOrders(ordersData);
      setIsLoading(false);
    }, (err) => {
      console.error('Error in real-time subscription:', err);
      setError('Error en la conexión en tiempo real');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrderStatus,
    getPendingCount,
    loadOrders
  };
}
