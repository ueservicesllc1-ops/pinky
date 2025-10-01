'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Gift, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CustomizationSection() {
  const customizationFeatures = [
    {
      icon: Palette,
      title: 'Colores Personalizados',
      description: 'Elige entre más de 20 colores vibrantes o crea tu propio tono único'
    },
    {
      icon: Sparkles,
      title: 'Fragancias Exclusivas',
      description: 'Más de 50 fragancias premium para crear la atmósfera perfecta'
    },
    {
      icon: Gift,
      title: 'Mensajes Especiales',
      description: 'Graba nombres, fechas especiales o mensajes personalizados'
    },
    {
      icon: Heart,
      title: 'Embalaje Único',
      description: 'Presentación elegante perfecta para regalos especiales'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-pink-500 mr-2" />
              <span className="text-pink-600 font-semibold">Personalización Total</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Crea la vela
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {' '}perfecta
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Cada vela puede ser completamente personalizada según tus gustos y necesidades. 
              Desde el color y la fragancia hasta mensajes especiales y embalaje.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {customizationFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/personalizadas">
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                Personalizar Ahora
              </Button>
            </Link>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white z-10">
                <Gift className="h-20 w-20 mx-auto mb-4 opacity-80" />
                <p className="text-lg font-semibold">Vela Personalizada</p>
                <p className="text-sm opacity-80">Tu diseño único</p>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 w-16 h-16 bg-pink-400 rounded-full opacity-60"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 w-12 h-12 bg-purple-400 rounded-full opacity-60"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
