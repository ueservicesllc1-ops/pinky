'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactModal from '@/components/ContactModal';

export default function ContactoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@pinkyflame.com',
      action: 'Enviar Email'
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+1 (555) 123-4567',
      action: 'Llamar Ahora'
    },
    {
      icon: MapPin,
      title: 'Dirección',
      content: '123 Main Street, Newark, NJ 07102',
      action: 'Ver en Mapa'
    },
    {
      icon: Clock,
      title: 'Horarios',
      content: 'Lun - Vie: 9:00 AM - 6:00 PM\nSáb: 10:00 AM - 4:00 PM',
      action: 'Contactar'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6">
            Contáctanos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ¿Tienes alguna pregunta sobre nuestras velas personalizadas? 
            Estamos aquí para ayudarte a crear la vela perfecta.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Envíanos un Mensaje
              </h2>
              <p className="text-gray-600">
                Déjanos un mensaje y nosotros te contactaremos lo antes posible. 
                ¡Estamos emocionados de escuchar tus ideas!
              </p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-4 px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Mail className="inline-block mr-2 h-5 w-5" />
              Abrir Formulario de Contacto
            </button>

            <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-700">
                💡 <strong>Tip:</strong> El formulario se abrirá en un modal para que puedas 
                escribir tu mensaje sin salir de esta página.
              </p>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-pink-100 rounded-lg">
                    <item.icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {item.content}
                    </p>
                    <button className="mt-3 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors">
                      {item.action} →
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <strong>¿Cuánto tiempo toma la personalización?</strong>
                  <p className="mt-1">Entre 3-5 días hábiles para velas personalizadas.</p>
                </div>
                <div>
                  <strong>¿Ofrecen envío internacional?</strong>
                  <p className="mt-1">Sí, enviamos a todo Estados Unidos y Canadá.</p>
                </div>
                <div>
                  <strong>¿Puedo cambiar mi pedido?</strong>
                  <p className="mt-1">Sí, puedes hacer cambios hasta 24 horas después del pedido.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              ¿Listo para crear tu vela perfecta?
            </h3>
            <p className="text-pink-100 mb-6 max-w-2xl mx-auto">
              Explora nuestro catálogo de velas personalizadas o usa nuestro 
              generador de IA para crear algo único.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/es/catalogo"
                className="bg-white text-pink-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Ver Catálogo
              </a>
              <a
                href="/es/personalizadas"
                className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors border border-white"
              >
                Personalizar Ahora
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
