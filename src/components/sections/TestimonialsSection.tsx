'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    id: 1,
    name: 'María González',
    location: 'Madrid, España',
    rating: 5,
    text: 'Las velas de Pinky Flame son absolutamente increíbles. La fragancia dura horas y la calidad es excepcional. ¡Mi favorita es la de lavanda!',
    avatar: 'MG'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    location: 'Barcelona, España',
    rating: 5,
    text: 'Pedí una vela personalizada para el cumpleaños de mi esposa y quedó perfecta. El servicio al cliente es excelente y el producto superó mis expectativas.',
    avatar: 'CR'
  },
  {
    id: 3,
    name: 'Ana Martín',
    location: 'Valencia, España',
    rating: 5,
    text: 'Me encanta que sean 100% naturales. Como tengo alergias, es difícil encontrar velas que no me afecten. Pinky Flame es la solución perfecta.',
    avatar: 'AM'
  },
  {
    id: 4,
    name: 'David López',
    location: 'Sevilla, España',
    rating: 5,
    text: 'El proceso de personalización fue muy fácil y el resultado final fue espectacular. Definitivamente volveré a pedir más velas.',
    avatar: 'DL'
  },
  {
    id: 5,
    name: 'Laura Sánchez',
    location: 'Bilbao, España',
    rating: 5,
    text: 'La vela de vainilla que pedí huele exactamente como esperaba. La duración es increíble y el embalaje es precioso. ¡Altamente recomendado!',
    avatar: 'LS'
  },
  {
    id: 6,
    name: 'Miguel Torres',
    location: 'Málaga, España',
    rating: 5,
    text: 'Excelente calidad y servicio. Las velas llegaron perfectamente empaquetadas y la fragancia es deliciosa. Sin duda volveré a comprar.',
    avatar: 'MT'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que dicen nuestros clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Miles de clientes felices han transformado sus espacios con nuestras velas artesanales
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <Quote className="h-8 w-8 text-pink-400 mb-4" />
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9</div>
              <div className="text-gray-600">Valoración Promedio</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Velas Vendidas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Fragancias Disponibles</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
