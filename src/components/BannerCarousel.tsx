'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';

export default function BannerCarousel() {
  const { banners, isLoading } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Convertir banners de Firebase al formato esperado
  const bannerSlides = banners
    .filter(banner => banner.isActive) // Solo banners activos
    .map(banner => ({
      id: banner.id,
      image: banner.imageUrl,
      title: banner.title,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink
    }));

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || bannerSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, bannerSlides.length]);

  // Mostrar loading si está cargando
  if (isLoading) {
    return (
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando banners...</p>
          </div>
        </div>
      </section>
    );
  }

  // Si no hay banners, mostrar mensaje
  if (bannerSlides.length === 0) {
    return (
      <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <Heart className="h-16 w-16 mx-auto mb-4 text-pink-400 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pronto tendremos banners disponibles</h2>
            <p className="text-gray-600">Mientras tanto, explora nuestro catálogo de velas</p>
          </div>
        </div>
      </section>
    );
  }

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
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      <div className="relative w-full h-full flex">
        {/* Sección de texto - 35% */}
        <div className="w-[35%] h-full bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col justify-center items-start px-8 text-white relative overflow-hidden">
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 opacity-10">
            {/* Flores abstractas */}
            <div className="absolute top-4 right-8 w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-full h-full text-white">
                <path d="M32 8c-4 0-8 2-10 6-2-4-6-6-10-6s-8 2-10 6c-2-4-6-6-10-6v4c4 0 8 2 10 6-2 4-6 6-10 6s-8-2-10-6c2 4 6 6 10 6v4c-4 0-8-2-10-6 2-4 6-6 10-6s8 2 10 6c2-4 6-6 10-6s8 2 10 6c2-4 6-6 10-6v-4c-4 0-8 2-10 6 2 4 6 6 10 6s8-2 10-6c-2-4-6-6-10-6z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Mariposas */}
            <div className="absolute top-12 right-4 w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-full h-full text-white">
                <path d="M24 4c-8 0-16 4-20 12 4 8 12 12 20 12s16-4 20-12c-4-8-12-12-20-12zm0 4c6 0 12 2 16 6-4 4-10 6-16 6s-12-2-16-6c4-4 10-6 16-6z" fill="currentColor"/>
                <circle cx="20" cy="20" r="2" fill="currentColor"/>
                <circle cx="28" cy="20" r="2" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Corazones */}
            <div className="absolute bottom-8 right-6 w-10 h-10">
              <svg viewBox="0 0 40 40" className="w-full h-full text-white">
                <path d="M20 36c-1-1-2-2-3-3-4-4-8-8-8-12 0-4 3-7 7-7 2 0 4 1 5 3 1-2 3-3 5-3 4 0 7 3 7 7 0 4-4 8-8 12-1 1-2 2-3 3z" fill="currentColor"/>
              </svg>
            </div>
            
            {/* Líneas elegantes */}
            <div className="absolute top-1/3 left-4 w-20 h-1 bg-white/20 rounded-full"></div>
            <div className="absolute top-1/2 left-6 w-16 h-1 bg-white/15 rounded-full"></div>
            <div className="absolute bottom-1/3 left-8 w-12 h-1 bg-white/25 rounded-full"></div>
            
            {/* Círculos decorativos */}
            <div className="absolute top-6 left-6 w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="absolute top-16 left-4 w-2 h-2 bg-white/40 rounded-full"></div>
            <div className="absolute bottom-12 left-10 w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="absolute bottom-6 left-2 w-2 h-2 bg-white/35 rounded-full"></div>
          </div>
          
          {/* Contenido principal */}
          <div className="max-w-sm relative z-10">
            {/* Etiqueta de descuento para miembros */}
            {(bannerSlides[currentSlide] as any)?.showMemberDiscount && (
              <div className="mb-4">
                <div className="inline-flex items-center px-4 py-2 bg-yellow-400 text-yellow-900 text-sm font-bold rounded-full shadow-lg animate-pulse">
                  🎉 {(bannerSlides[currentSlide] as any)?.discountText || 'Solo para miembros registrados el 30% de descuentos'}
                </div>
              </div>
            )}
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {bannerSlides[currentSlide]?.title || 'Personaliza tus velas'}
            </h2>
            <p className="text-lg md:text-xl mb-6 text-purple-100 leading-relaxed">
              {bannerSlides[currentSlide]?.subtitle || 'Crea velas únicas con tus propios diseños. Desde aromas personalizados hasta imágenes especiales.'}
            </p>
            <a 
              href={bannerSlides[currentSlide]?.buttonLink || '/personalizadas'}
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              {bannerSlides[currentSlide]?.buttonText || 'Crear ahora'}
            </a>
          </div>
        </div>

        {/* Sección de imagen - 65% */}
        <div className="relative w-[65%] h-full">
          <AnimatePresence mode="wait">
            {bannerSlides.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                {bannerSlides[currentSlide].image ? (
                  <div 
                    className="w-full h-full bg-no-repeat bg-center"
                    style={{
                      backgroundImage: `url(${bannerSlides[currentSlide].image})`,
                      backgroundSize: `${100 * ((bannerSlides[currentSlide] as any).imageZoom || 1)}%`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      transform: `translate(${(bannerSlides[currentSlide] as any).imagePosition?.x || 0}px, ${(bannerSlides[currentSlide] as any).imagePosition?.y || 0}px)`
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Heart className="h-24 w-24 mx-auto mb-4 opacity-50" />
                      <p className="text-lg">No hay imagen disponible</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Arrows - Solo si hay más de un banner */}
          {bannerSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-300 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-3 rounded-full transition-all duration-300 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Dots Indicator - Solo si hay más de un banner */}
          {bannerSlides.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {bannerSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white shadow-lg' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}