'use client';

import React, { useState } from 'react';
import { onSnapshot, collection, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Eye, CheckCircle, Clock, Package, DollarSign, User, Calendar } from 'lucide-react';

interface CustomCandleOrder {
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

const statusConfig = {
  pending: { 
    label: 'Pendiente', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock 
  },
  paid: { 
    label: 'Pagado', 
    color: 'bg-green-100 text-green-800', 
    icon: DollarSign 
  },
  in_production: { 
    label: 'En Producción', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Package 
  },
  completed: { 
    label: 'Completado', 
    color: 'bg-purple-100 text-purple-800', 
    icon: CheckCircle 
  }
};

export default function PedidosPersonalizadosPage() {
  const [orders, setOrders] = useState<CustomCandleOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<CustomCandleOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar pedidos en tiempo real
  React.useEffect(() => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: CustomCandleOrder['status']) => {
    try {
      await updateDoc(doc(db, 'customCandleOrders', orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error al actualizar el estado del pedido');
    }
  };

  const getStatusCounts = () => {
    return orders.reduce((counts, order) => {
      counts[order.status] = (counts[order.status] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Package className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pedidos Personalizados</h1>
                <p className="text-gray-600">Gestiona los pedidos de velas personalizadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(statusConfig).map(([status, config]) => {
            const Icon = config.icon;
            const count = statusCounts[status] || 0;
            
            return (
              <div key={status} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {config.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lista de pedidos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Todos los Pedidos ({orders.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay pedidos personalizados
                </h3>
                <p className="text-gray-500">
                  Los pedidos de velas personalizadas aparecerán aquí.
                </p>
              </div>
            ) : (
              orders.map((order) => {
                const statusInfo = statusConfig[order.status];
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      {/* Imagen del pedido */}
                      <div className="flex-shrink-0">
                        <img
                          src={order.orderImage}
                          alt={order.candleName}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                      
                      {/* Información del pedido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {order.candleName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              <User className="h-4 w-4 inline mr-1" />
                              {order.customerName}
                            </p>
                            <p className="text-sm text-gray-600">
                              <Calendar className="h-4 w-4 inline mr-1" />
                              {order.createdAt.toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ${order.templatePrice}
                              </p>
                              <p className="text-sm text-gray-500">
                                {order.templateName}
                              </p>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                              <StatusIcon className="h-4 w-4 inline mr-1" />
                              {statusInfo.label}
                            </div>
                          </div>
                        </div>
                        
                        {order.additionalDetails && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">
                              <strong>Detalles:</strong> {order.additionalDetails}
                            </p>
                          </div>
                        )}
                        
                        {/* Botones de acción */}
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver Detalles
                          </button>
                          
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'paid')}
                              className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Marcar como Pagado
                            </button>
                          )}
                          
                          {order.status === 'paid' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'in_production')}
                              className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                              <Package className="h-4 w-4 mr-1" />
                              Enviar a Producción
                            </button>
                          )}
                          
                          {order.status === 'in_production' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'completed')}
                              className="inline-flex items-center px-3 py-1 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Marcar como Completado
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Modal de detalles del pedido */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Detalles del Pedido
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Eye className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedOrder.orderImage}
                    alt={selectedOrder.candleName}
                    className="w-full h-64 object-contain rounded-lg border border-gray-200"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Información del Cliente</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Nombre:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      {selectedOrder.customerPhone && (
                        <p><strong>Teléfono:</strong> {selectedOrder.customerPhone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">Detalles del Pedido</h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p><strong>Nombre de la vela:</strong> {selectedOrder.candleName}</p>
                      <p><strong>Plantilla:</strong> {selectedOrder.templateName}</p>
                      <p><strong>Precio:</strong> ${selectedOrder.templatePrice}</p>
                      <p><strong>Fecha:</strong> {selectedOrder.createdAt.toLocaleString('es-ES')}</p>
                    </div>
                  </div>
                  
                  {selectedOrder.additionalDetails && (
                    <div>
                      <h3 className="font-medium text-gray-900">Detalles Adicionales</h3>
                      <p className="mt-2 text-sm text-gray-600">
                        {selectedOrder.additionalDetails}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
