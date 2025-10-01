'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const bannerSlides = [
  {
    id: 1,
    title: 'Nueva Colección Otoño',
    subtitle: 'Velas aromáticas que capturan la esencia del otoño',
    description: 'Descubre fragancias cálidas de canela, manzana y especias que llenarán tu hogar de calidez',
    image: '/banner-1.jpg',
    ctaText: 'Explorar Colección',
    ctaLink: '/catalogo',
    badge: 'Nuevo',
    badgeColor: 'bg-pink-500'
  },
  {
    id: 2,
    title: 'Personaliza tu Vela',
    subtitle: 'Crea la vela perfecta para momentos especiales',
    description: 'Elige fragancia, color y personaliza con mensajes únicos. Perfecta para regalos especiales',
    image: '/banner-2.jpg',
    ctaText: 'Personalizar Ahora',
    ctaLink: '/personalizadas',
    badge: 'Personalizable',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 3,
    title: 'Envío Gratis +$50',
    subtitle: 'Oferta especial por tiempo limitado',
    description: 'Aprovecha nuestro envío gratuito en pedidos superiores a $50. ¡No dejes pasar esta oportunidad!',
    image: '/banner-3.jpg',
    ctaText: 'Ver Ofertas',
    ctaLink: '/ofertas',
    badge: 'Oferta',
    badgeColor: 'bg-green-500'
  },
  {
    id: 4,
    title: 'Velas de Temporada',
    subtitle: 'Fragancias que evocan recuerdos especiales',
    description: 'Desde aromas navideños hasta fragancias de primavera, encuentra la vela perfecta para cada momento',
    image: '/banner-4.jpg',
    ctaText: 'Descubrir',
    ctaLink: '/temporada',
    badge: 'Temporada',
    badgeColor: 'bg-orange-500'
  }
];

export default function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
  };

  return (
    <section className="relative w-full h-[400px] md:h-[480px] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl"></div>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center"
          >
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-10 gap-12 items-center">
                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-center lg:text-left lg:col-span-3"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium mb-4 ${bannerSlides[currentSlide].badgeColor}`}
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    {bannerSlides[currentSlide].badge}
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
                  >
                    {bannerSlides[currentSlide].title}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.h3
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="text-xl md:text-2xl text-gray-700 mb-4"
                  >
                    {bannerSlides[currentSlide].subtitle}
                  </motion.h3>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0"
                  >
                    {bannerSlides[currentSlide].description}
                  </motion.p>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 text-lg"
                    >
                      {bannerSlides[currentSlide].ctaText}
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Image Placeholder */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="relative lg:col-span-7"
                >
                  <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-center text-white z-10">
                      <Heart className="h-24 w-24 mx-auto mb-4 opacity-80" />
                      <p className="text-lg font-semibold">Imagen de Vela</p>
                      <p className="text-sm opacity-80">{bannerSlides[currentSlide].title}</p>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute top-8 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-6 left-8 w-4 h-4 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 w-16 h-16 bg-pink-400/60 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-400/60 rounded-full"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10"
        >
          <ChevronLeft className="h-6 w-6 text-gray-700" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10"
        >
          <ChevronRight className="h-6 w-6 text-gray-700" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full">
          <motion.div
            key={currentSlide}
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600"
          />
        </div>
      </div>
    </section>
  );
}
