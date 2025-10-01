'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHeroPopupConfig } from '@/hooks/useHeroPopupConfig';

export default function HeroPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(10);
  
  // Obtener configuración desde Firebase
  const { config: popupConfig, isLoading } = useHeroPopupConfig();

  useEffect(() => {
    if (!popupConfig.isActive) return;

    // Show popup after delay
    const showTimer = setTimeout(() => {
      setIsOpen(true);
    }, popupConfig.showDelay);

    // Auto-close after specified seconds
    const autoCloseTimer = setTimeout(() => {
      setIsOpen(false);
    }, popupConfig.showDelay + (popupConfig.autoCloseSeconds * 1000));

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(autoCloseTimer);
      clearInterval(countdownTimer);
    };
  }, [popupConfig]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>

              {/* Countdown Timer */}
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                  Se cierra en {countdown}s
                </div>
              </div>

              {/* Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                {/* Left Side - Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative">
                  {/* Background Elements */}
                  <div className="absolute top-8 left-8 w-24 h-24 bg-pink-200/30 rounded-full blur-xl"></div>
                  <div className="absolute bottom-8 right-8 w-32 h-32 bg-purple-200/30 rounded-full blur-xl"></div>

                  <div className="relative z-10">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="flex items-center mb-4"
                    >
                      <Sparkles className="h-5 w-5 text-pink-500 mr-2" />
                      <span className="text-pink-600 font-semibold text-sm">¡Oferta Especial!</span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
                    >
                      {popupConfig.title.split(' ').map((word, index) => 
                        index === popupConfig.title.split(' ').length - 2 ? (
                          <span key={index} className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            {' '}{word}
                          </span>
                        ) : (
                          <span key={index}>{index === 0 ? word : ` ${word}`}</span>
                        )
                      )}
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-lg text-gray-600 mb-6"
                    >
                      {popupConfig.subtitle}
                    </motion.p>

                    {/* Offer */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-lg mb-6"
                    >
                      <div className="text-center">
                        <p className="text-lg font-semibold">🎉 {popupConfig.offerTitle}</p>
                        <p className="text-sm opacity-90">{popupConfig.offerDescription}</p>
                      </div>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3"
                    >
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3"
                        onClick={() => {
                          window.location.href = popupConfig.ctaButton1Link;
                        }}
                      >
                        {popupConfig.ctaButton1Text}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-2 border-pink-300 text-pink-600 hover:bg-pink-50 px-6 py-3"
                        onClick={() => {
                          window.location.href = popupConfig.ctaButton2Link;
                        }}
                      >
                        {popupConfig.ctaButton2Text}
                      </Button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-pink-200"
                    >
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">500+</div>
                        <div className="text-xs text-gray-600">Clientes Felices</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">50+</div>
                        <div className="text-xs text-gray-600">Fragancias</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-900">100%</div>
                        <div className="text-xs text-gray-600">Natural</div>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Right Side - Image */}
                <div className="relative bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center overflow-hidden">
                  {popupConfig.imageUrl ? (
                    <div className="w-full h-full relative">
                      <img
                        src={popupConfig.imageUrl}
                        alt="Vela personalizada"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">Velas Artesanales</h3>
                        <p className="text-lg opacity-90">Hechas con amor</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-white p-8">
                      <Heart className="h-32 w-32 mx-auto mb-6 opacity-80" />
                      <h3 className="text-2xl font-bold mb-2">Velas Artesanales</h3>
                      <p className="text-lg opacity-80">Hechas con amor</p>
                    </div>
                  )}

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-8 right-8 w-12 h-12 bg-white/20 rounded-full"
                  />
                  <motion.div
                    animate={{ y: [10, -10, 10] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-8 left-8 w-8 h-8 bg-white/20 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
