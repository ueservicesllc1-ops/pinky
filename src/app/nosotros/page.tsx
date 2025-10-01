'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Lightbulb, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function NosotrosPage() {
  const values = [
    {
      icon: Heart,
      title: 'Amor en Cada Vela',
      description: 'Cada vela está hecha con amor y dedicación, creando momentos especiales en tu hogar.'
    },
    {
      icon: Star,
      title: 'Calidad Premium',
      description: 'Utilizamos solo los mejores ingredientes naturales para garantizar la máxima calidad.'
    },
    {
      icon: Lightbulb,
      title: 'Creatividad Sin Límites',
      description: 'Personalizamos cada vela según tus gustos y necesidades únicas.'
    },
    {
      icon: Award,
      title: 'Artesanía Tradicional',
      description: 'Mantenemos técnicas tradicionales combinadas con innovación moderna.'
    }
  ];

  const team = [
    {
      name: 'Lugina Annabella',
      role: 'Fundadora & Directora Creativa',
      description: 'Una joven emprendedora de 17 años que transformó su pasión por las velas en un negocio familiar lleno de amor y dedicación.',
      isFounder: true
    },
    {
      name: 'Georgina',
      role: 'Mamá & Co-Fundadora',
      description: 'El corazón y alma de Pinky Flame, brinda apoyo incondicional y sabiduría en cada paso del emprendimiento.',
      isFamily: true
    },
    {
      name: 'Luis',
      role: 'Papá & Asesor',
      description: 'El pilar de fortaleza de la familia, siempre presente con su apoyo y consejos para hacer crecer el negocio.',
      isFamily: true
    },
    {
      name: 'Juan Pablo',
      role: 'Hermano & Apoyo Técnico',
      description: 'El hermano mayor que aporta su energía y creatividad para hacer de Pinky Flame una realidad.',
      isFamily: true
    },
    {
      name: 'Ginita',
      role: 'Hermanita & Inspiración',
      description: 'La pequeña de la familia que inspira con su alegría y amor puro cada vela que creamos.',
      isFamily: true
    },
    {
      name: 'Annabell',
      role: 'Abuelita & Guía Espiritual',
      description: 'La matriarca de la familia que aporta la sabiduría tradicional y el amor infinito que caracteriza a Pinky Flame.',
      isFamily: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center justify-center mb-6"
            >
              <Sparkles className="h-8 w-8 text-pink-500 mr-3" />
              <span className="text-pink-600 font-semibold text-lg">Nuestra Historia</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Somos
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Pinky Flame
              </span>
            </h1>

            <div className="flex items-center justify-center mb-4">
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                🇺🇸 New Jersey, Estados Unidos
              </span>
            </div>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Una empresa dedicada a crear velas aromáticas, decorativas y personalizadas para cada cliente, 
              cada momento y cada ocasión especial. Cada vela que hacemos lleva consigo el calor del hogar 
              y la magia de los momentos únicos que quieres recordar para siempre.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Clientes Felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
                <div className="text-gray-600">Velas Creadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-gray-600">Hecho con Amor</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestra Misión
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Crear velas artesanales que no solo iluminen espacios, sino que también 
              llenen de amor y calidez cada rincón de tu hogar. Queremos que cada vela 
              sea una experiencia única que conecte con tus emociones y recuerdos más preciados.
            </p>
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                &ldquo;Cada llama cuenta una historia, cada fragancia evoca un recuerdo&rdquo;
              </h3>
              <p className="text-gray-600 italic">
                - Pinky Flame
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Los principios que guían cada decisión y cada vela que creamos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Family Story Section */}
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-pink-500 mr-3" />
              <span className="text-pink-600 font-semibold text-lg">Nuestra Historia Familiar</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Una Historia de Amor y Emprendimiento
            </h2>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Todo comenzó con el sueño de <strong>Lugina Annabella</strong>, una joven emprendedora de 17 años 
                que decidió transformar su pasión por las velas en algo más grande. Con el apoyo incondicional 
                de su familia, <strong>Georgina</strong> (mamá), <strong>Luis</strong> (papá), <strong>Juan Pablo</strong> (hermano), 
                <strong>Ginita</strong> (hermanita) y <strong>Annabell</strong> (abuelita), nació Pinky Flame.
              </p>
              
              <p className="text-lg text-gray-700 leading-relaxed">
                Cada miembro de la familia aporta su amor, creatividad y dedicación para crear velas 
                únicas que no solo iluminan espacios, sino que llevan consigo la magia del amor familiar. 
                Es más que un negocio, es una tradición familiar que se extiende a cada cliente que confía en nosotros.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              Nuestra Familia Pinky Flame
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conoce a cada miembro de esta hermosa familia emprendedora
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className={`text-center p-6 hover:shadow-lg transition-shadow ${
                  member.isFounder ? 'ring-2 ring-pink-500 bg-gradient-to-br from-pink-50 to-purple-50' : ''
                }`}>
                  <CardContent className="p-0">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      member.isFounder 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                        : 'bg-gradient-to-br from-purple-400 to-pink-400'
                    }`}>
                      <Users className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {member.name}
                      {member.isFounder && (
                        <span className="ml-2 text-sm bg-pink-500 text-white px-2 py-1 rounded-full">
                          Fundadora
                        </span>
                      )}
                    </h3>
                    <p className="text-pink-600 font-semibold mb-3 text-sm">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-purple-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Únete a Nuestra Historia
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Sé parte de la familia Pinky Flame y descubre cómo nuestras velas 
              pueden iluminar y aromatizar los momentos más especiales de tu vida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/catalogo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-pink-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Nuestros Productos
              </motion.a>
              <motion.a
                href="/contacto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-pink-600 transition-colors"
              >
                Contáctanos
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
