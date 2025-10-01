'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function TerminosPage() {
  const sections = [
    {
      icon: FileText,
      title: 'Aceptación de Términos',
      content: 'Al acceder y utilizar este sitio web, aceptas estar sujeto a estos términos y condiciones.',
      details: [
        'El uso del sitio implica aceptación automática de estos términos',
        'Si no estás de acuerdo, no debes utilizar nuestros servicios',
        'Estos términos pueden ser modificados sin previo aviso'
      ]
    },
    {
      icon: Package,
      title: 'Productos y Servicios',
      content: 'Ofrecemos velas artesanales personalizadas y productos relacionados.',
      details: [
        'Todos los productos son hechos a mano con ingredientes naturales',
        'Las imágenes son ilustrativas y pueden variar ligeramente',
        'Nos reservamos el derecho de modificar precios sin previo aviso'
      ]
    },
    {
      icon: Shield,
      title: 'Política de Devoluciones',
      content: 'Manejamos devoluciones bajo condiciones específicas.',
      details: [
        'Devoluciones solo por defectos de fabricación',
        'Producto debe estar sin usar y en empaque original',
        'Contactar dentro de 48 horas posteriores a la entrega',
        'No se aceptan devoluciones por cambio de opinión'
      ]
    },
    {
      icon: Clock,
      title: 'Política de Cancelaciones',
      content: 'Las cancelaciones están sujetas a restricciones de tiempo.',
      details: [
        'Cancelaciones permitidas hasta 24 horas después del pedido',
        'Una vez procesado el pedido, no se pueden cancelar',
        'Cancelaciones por defectos: procedimiento especial'
      ]
    }
  ];

  const importantClauses = [
    {
      title: 'Responsabilidad Limitada',
      content: 'Pinky Flame no se hace responsable por daños indirectos, incidentales o consecuenciales.',
      details: [
        'No nos responsabilizamos por robos post-entrega',
        'Limitación de responsabilidad al valor del producto',
        'El cliente es responsable de verificar el estado al recibir'
      ]
    },
    {
      title: 'Propiedad Intelectual',
      content: 'Todos los contenidos del sitio son propiedad de Pinky Flame.',
      details: [
        'Diseños, textos e imágenes están protegidos por derechos de autor',
        'No se permite reproducción sin autorización expresa',
        'Las marcas comerciales son propiedad exclusiva'
      ]
    },
    {
      title: 'Privacidad de Datos',
      content: 'Protegemos la información personal de nuestros clientes.',
      details: [
        'Recopilamos solo información necesaria para el servicio',
        'No compartimos datos con terceros sin consentimiento',
        'Implementamos medidas de seguridad apropiadas'
      ]
    },
    {
      title: 'Fuerza Mayor',
      content: 'No seremos responsables por retrasos o incumplimientos debido a circunstancias fuera de nuestro control.',
      details: [
        'Desastres naturales, pandemias, huelgas',
        'Problemas de servicios de paquetería',
        'Restricciones gubernamentales'
      ]
    }
  ];

  const legalNotes = [
    'Estos términos se rigen por las leyes mexicanas',
    'Cualquier disputa será resuelta en tribunales competentes',
    'Si alguna cláusula es inválida, el resto permanece vigente',
    'La versión en español prevalece sobre traducciones',
    'Última actualización: Diciembre 2024'
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
            Términos y Condiciones
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Términos de uso y condiciones de servicio de Pinky Flame
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Última actualización: Diciembre 2024
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <section.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {section.content}
                      </p>
                      <ul className="space-y-2">
                        {section.details.map((detail, idx) => (
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

        {/* Important Legal Clauses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Cláusulas Legales Importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {importantClauses.map((clause, index) => (
              <motion.div
                key={clause.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      <AlertTriangle className="h-6 w-6 text-orange-500 mt-1" />
                      <h3 className="text-xl font-bold text-gray-900">
                        {clause.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {clause.content}
                    </p>
                    <ul className="space-y-2">
                      {clause.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-pink-500" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Aspectos Legales
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legalNotes.map((note, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact for Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-pink-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                ¿Tienes preguntas sobre estos términos?
              </h2>
              <p className="text-lg mb-6 opacity-90">
                Contáctanos para cualquier aclaración sobre nuestros términos y condiciones
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center justify-center space-x-2">
                  <span>📧</span>
                  <span>legal@pinkyflame.com</span>
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
