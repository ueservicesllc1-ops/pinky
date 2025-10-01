'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Users, Calendar, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getNewsletterSubscribers, NewsletterSubscription } from '@/lib/newsletter';

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    active: 0
  });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    try {
      setIsLoading(true);
      const data = await getNewsletterSubscribers();
      setSubscribers(data);
      
      // Calcular estadísticas
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      setStats({
        total: data.length,
        thisMonth: data.filter(sub => sub.subscribedAt >= thisMonth).length,
        active: data.filter(sub => sub.isActive).length
      });
    } catch (error) {
      console.error('Error al cargar suscriptores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Fecha de Suscripción', 'Estado', 'Fuente'],
      ...subscribers.map(sub => [
        sub.email,
        sub.subscribedAt.toLocaleDateString('es-ES'),
        sub.isActive ? 'Activo' : 'Inactivo',
        sub.source
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando suscriptores...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Panel de Newsletter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gestiona las suscripciones al newsletter de Pinky Flame
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-pink-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
                <div className="text-gray-600">Total Suscriptores</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.thisMonth}</div>
                <div className="text-gray-600">Este Mes</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.active}</div>
                <div className="text-gray-600">Activos</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mb-8"
        >
          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar a CSV
          </Button>
        </motion.div>

        {/* Subscribers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lista de Suscriptores
              </h2>
              
              {subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay suscriptores aún</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Fecha</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Fuente</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((subscriber, index) => (
                        <motion.tr
                          key={subscriber.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4 text-gray-900">{subscriber.email}</td>
                          <td className="py-3 px-4 text-gray-600">
                            {subscriber.subscribedAt.toLocaleDateString('es-ES')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.source === 'homepage' 
                                ? 'bg-pink-100 text-pink-800'
                                : subscriber.source === 'footer'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {subscriber.source}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              subscriber.isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {subscriber.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
