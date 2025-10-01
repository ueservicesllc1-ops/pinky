'use client';

import { useState, useCallback, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  customizations?: {
    text?: string;
    font?: string;
    color?: string;
  };
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar órdenes desde Firestore
  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Order[];
      
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Error al cargar las órdenes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Crear nueva orden
  const createOrder = useCallback(async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) => {
    try {
      setError(null);
      
      // Generar número de orden único
      const orderNumber = `PF-${Date.now().toString().slice(-6)}`;
      
      const data = {
        ...orderData,
        orderNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'orders'), data);
      
      const newOrder: Order = {
        id: docRef.id,
        ...data
      };
      
      setOrders(prev => [newOrder, ...prev]);
      return { success: true, id: docRef.id, orderNumber };
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Error al crear la orden');
      return { success: false, error: 'Error al crear la orden' };
    }
  }, []);

  // Actualizar orden
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    try {
      setError(null);
      
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'orders', id), updateData);
      
      setOrders(prev => prev.map(order => 
        order.id === id ? { ...order, ...updateData } : order
      ));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Error al actualizar la orden');
      return { success: false, error: 'Error al actualizar la orden' };
    }
  }, []);

  // Eliminar orden
  const deleteOrder = useCallback(async (id: string) => {
    try {
      setError(null);
      
      await deleteDoc(doc(db, 'orders', id));
      setOrders(prev => prev.filter(order => order.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error removing order:', err);
      setError('Error al eliminar la orden');
      return { success: false, error: 'Error al eliminar la orden' };
    }
  }, []);

  // Buscar órdenes por email
  const getOrdersByEmail = useCallback(async (email: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('customerEmail', '==', email),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      const ordersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Order[];
      
      return ordersData;
    } catch (err) {
      console.error('Error searching orders:', err);
      setError('Error al buscar las órdenes');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar órdenes al montar el componente
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    getOrdersByEmail,
    loadOrders
  };
}
