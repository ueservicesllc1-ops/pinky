'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, Shield, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PoliticasEnvioPage() {
  const policies = [
    {
      icon: Clock,
      title: 'Pedidos 24/7',
      content: 'Aceptamos pedidos las 24 horas del día, los 7 días de la semana.',
      details: [
        'Puedes hacer tu pedido en cualquier momento',
        'Procesamos todos los pedidos recibidos',
        'Horario flexible para nuestros clientes'
      ]
    },
    {
      icon: Truck,
      title: 'Días de Envío',
      content: 'Todos los envíos se realizan únicamente los jueves de cada semana.',
      details: [
        'Enviamos todos los jueves sin excepción',
        'El tiempo de entrega depende del servicio de paquetería',
        'Recibirás tu número de seguimiento por email'
      ]
    },
    {
      icon: Shield,
      title: 'Responsabilidad de Entrega',
      content: 'Una vez que el paquete es entregado por el servicio de paquetería, no nos responsabilizamos por robos o pérdidas.',
      details: [
        'Verifica que el paquete llegue en buen estado al momento de la entrega',
        'Reporta cualquier daño inmediatamente al servicio de paquetería',
        'No nos hacemos responsables por robos post-entrega'
      ]
    },
    {
      icon: Package,
      title: 'Tiempos de Entrega',
      content: 'Los tiempos de entrega varían según tu ubicación y el servicio de paquetería utilizado.',
      details: [
        'Ciudad de México: 1-2 días hábiles',
        'Interior de la República: 3-5 días hábiles',
        'Zonas rurales: 5-7 días hábiles'
      ]
    }
  ];

  const importantNotes = [
    'Las velas son productos frágiles, manejamos con cuidado especial',
    'Enviamos únicamente a direcciones verificadas',
    'El cliente debe estar presente al momento de la entrega',
    'No se realizan reembolsos por robos post-entrega',
    'Los pedidos se pueden hacer 24/7, pero envíos solo jueves',
    'Los tiempos pueden variar en temporadas altas (días festivos)'
  ];

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
            Políticas de Envío
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Información importante sobre nuestros procesos de envío y entrega de velas artesanales
          </p>
        </motion.div>

        {/* Main Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <policy.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {policy.content}
                      </p>
                      <ul className="space-y-2">
                        {policy.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Notas Importantes
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Proceso de Envío
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Haces Pedido</h3>
                  <p className="text-sm text-gray-600">24/7 en línea</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Procesamos</h3>
                  <p className="text-sm text-gray-600">Preparamos tu vela</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enviamos</h3>
                  <p className="text-sm text-gray-600">Todos los jueves</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recibes</h3>
                  <p className="text-sm text-gray-600">En tu domicilio</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                ¿Tienes dudas sobre tu envío?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Contáctanos y te ayudaremos con cualquier pregunta sobre tu pedido
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center space-x-2">
                  <span>📧</span>
                  <span>hola@pinkyflame.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📱</span>
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
