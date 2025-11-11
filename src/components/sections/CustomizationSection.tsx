'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Sparkles, Gift, Heart, Star, Zap, Award, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCustomizationConfig } from '@/hooks/useCustomizationConfig';
import { useLanguage } from '@/contexts/LanguageContext';

// Mapeo de iconos disponibles
const iconMap = {
  Palette,
  Sparkles,
  Gift,
  Heart,
  Star,
  Zap,
  Award,
  Crown
};

export default function CustomizationSection() {
  const { config, isLoading } = useCustomizationConfig();
  const { language, t } = useLanguage();
  const localePrefix = language === 'en' ? '/en' : '/es';

  // Si no está activa la sección, no mostrar nada
  if (!config.isActive) {
    return null;
  }

  // Mientras carga, mostrar un placeholder
  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-6 w-48"></div>
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-20 bg-gray-200 rounded mb-8"></div>
              <div className="h-12 bg-gray-200 rounded w-48"></div>
            </div>
            <div className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const titleText = language === 'en' ? t('custom.title') : config.title;
  const subtitleText = language === 'en' ? t('custom.subtitle') : config.subtitle;
  const descriptionText = language === 'en' ? t('custom.description') : config.description;
  const buttonText = language === 'en' ? t('custom.button') : config.buttonText;

  const buttonLinkPath =
    config.buttonLink?.replace(/^\/(es|en)/, '').replace(/^\/+/, '') || 'personalizadas';
  const localizedButtonLink = `${localePrefix}/${buttonLinkPath}`;

  const featureTranslations = {
    Palette: {
      title: t('custom.feature.colors.title'),
      description: t('custom.feature.colors.description'),
    },
    Heart: {
      title: t('custom.feature.messages.title'),
      description: t('custom.feature.messages.description'),
    },
    Sparkles: {
      title: t('custom.feature.fragrances.title'),
      description: t('custom.feature.fragrances.description'),
    },
    Gift: {
      title: t('custom.feature.packaging.title'),
      description: t('custom.feature.packaging.description'),
    },
  } as const;

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
              <span className="text-pink-600 font-semibold">{subtitleText}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {titleText.split(' ').map((word, index) => {
                const words = titleText.split(' ');
                const isLastWord = index === words.length - 1;
                return isLastWord ? (
                  <span key={index} className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                    {' '}{word}
                  </span>
                ) : (
                  <span key={index}>{word} </span>
                );
              })}
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              {descriptionText}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {config.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Sparkles;
                const translated = featureTranslations[feature.icon as keyof typeof featureTranslations];
                const featureTitle =
                  language === 'en' && translated?.title ? translated.title : feature.title;
                const featureDescription =
                  language === 'en' && translated?.description
                    ? translated.description
                    : feature.description;

                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {featureTitle}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {featureDescription}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link href={localizedButtonLink}>
              <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                {buttonText}
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
            {/* Main Image */}
            <div className="aspect-square rounded-3xl shadow-2xl relative overflow-hidden">
              {config.imageUrl ? (
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center">
                  <div className="text-center text-white z-10">
                    <Gift className="h-20 w-20 mx-auto mb-4 opacity-80" />
                    <p className="text-lg font-semibold">Vela Personalizada</p>
                    <p className="text-sm opacity-80">Tu diseño único</p>
                  </div>
                </div>
              )}
              
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              
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
