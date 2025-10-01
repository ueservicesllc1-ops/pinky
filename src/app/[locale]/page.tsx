'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Shield, Truck, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import BannerCarousel from '@/components/BannerCarousel';
import HeroPopup from '@/components/HeroPopup';
import FeaturedProducts from '@/components/sections/FeaturedProducts';
import CustomizationSection from '@/components/sections/CustomizationSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { useTranslations } from 'next-intl';

export default function HomePage() {
  const t = useTranslations();
  
  const features = [
    {
      icon: Heart,
      title: t('features.custom.title'),
      description: t('features.custom.description')
    },
    {
      icon: Shield,
      title: t('features.quality.title'),
      description: t('features.quality.description')
    },
    {
      icon: Truck,
      title: t('features.shipping.title'),
      description: t('features.shipping.description')
    },
    {
      icon: Star,
      title: t('features.support.title'),
      description: t('features.support.description')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Popup */}
      <HeroPopup />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Pinky Flame?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Creemos que cada momento especial merece ser iluminado con la fragancia perfecta
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Customization Section */}
      <CustomizationSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Newsletter */}
      <NewsletterSection />
    </div>
  );
}