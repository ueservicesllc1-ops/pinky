'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations = {
  es: {
    // Hero Popup
    'hero.title': 'Ilumina tus momentos especiales',
    'hero.subtitle': 'Descubre nuestra colección única de velas personalizadas, creadas con ingredientes naturales y diseñadas para crear la atmósfera perfecta en tu hogar.',
    'hero.offer': '¡Descuento del 20%!',
    'hero.offerDesc': 'En tu primera compra',
    'hero.cta1': 'Explorar Catálogo',
    'hero.cta2': 'Personalizar Ahora',
    
    // Banner Carousel
    'banner.loading': 'Cargando banners...',
    'banner.noBanners': 'No hay banners disponibles',
    
    // Featured Products
    'products.featured': 'Productos Destacados',
    'products.viewAll': 'Ver Todo',
    'products.addToCart': 'Agregar al Carrito',
    'products.customizable': 'Personalizable',
    
    // Customization Section
    'custom.title': 'Personaliza tu Vela',
    'custom.subtitle': 'Crea la vela perfecta para ti',
    'custom.start': 'Comenzar',
    
    // Testimonials
    'testimonials.title': 'Lo que Dicen Nuestros Clientes',
    'testimonials.subtitle': 'Experiencias reales de quienes han elegido Pinky Flames',
    
    // Newsletter
    'newsletter.title': 'Mantente al día',
    'newsletter.subtitle': 'Recibe noticias sobre nuevos productos y ofertas especiales',
    'newsletter.placeholder': 'Tu email',
    'newsletter.subscribe': 'Suscribirse',
    
    // Footer
    'footer.shop': 'Tienda',
    'footer.help': 'Ayuda',
    'footer.company': 'Empresa',
    'footer.catalog': 'Catálogo',
    'footer.custom': 'Velas Personalizadas',
    'footer.ai': 'IA Generator',
    'footer.offers': 'Ofertas',
    'footer.faq': 'Preguntas Frecuentes',
    'footer.guide': 'Guía de Tamaños',
    'footer.care': 'Cuidado de Velas',
    'footer.contact': 'Contacto',
    'footer.about': 'Nosotros',
    'footer.history': 'Nuestra Historia',
    'footer.work': 'Trabaja con Nosotros',
    'footer.press': 'Prensa',
    'footer.newsletter': 'Mantente al día',
    'footer.newsletterDesc': 'Recibe noticias sobre nuevos productos y ofertas especiales',
    'footer.newsletterPlaceholder': 'Tu email',
    'footer.newsletterSubscribe': 'Suscribirse',
    'footer.rights': 'Todos los derechos reservados.',
    'footer.powered': 'Potenciada por Freedom Labs',
    'footer.shipping': 'Políticas de Envío',
    'footer.terms': 'Términos y Condiciones',
    'footer.privacy': 'Privacidad',
  },
  en: {
    // Hero Popup
    'hero.title': 'Illuminate your special moments',
    'hero.subtitle': 'Discover our unique collection of personalized candles, created with natural ingredients and designed to create the perfect atmosphere in your home.',
    'hero.offer': '20% Discount!',
    'hero.offerDesc': 'On your first purchase',
    'hero.cta1': 'Explore Catalog',
    'hero.cta2': 'Customize Now',
    
    // Banner Carousel
    'banner.loading': 'Loading banners...',
    'banner.noBanners': 'No banners available',
    
    // Featured Products
    'products.featured': 'Featured Products',
    'products.viewAll': 'View All',
    'products.addToCart': 'Add to Cart',
    'products.customizable': 'Customizable',
    
    // Customization Section
    'custom.title': 'Customize Your Candle',
    'custom.subtitle': 'Create the perfect candle for you',
    'custom.start': 'Get Started',
    
    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.subtitle': 'Real experiences from those who have chosen Pinky Flames',
    
    // Newsletter
    'newsletter.title': 'Stay Updated',
    'newsletter.subtitle': 'Get news about new products and special offers',
    'newsletter.placeholder': 'Your email',
    'newsletter.subscribe': 'Subscribe',
    
    // Footer
    'footer.shop': 'Shop',
    'footer.help': 'Help',
    'footer.company': 'Company',
    'footer.catalog': 'Catalog',
    'footer.custom': 'Custom Candles',
    'footer.ai': 'AI Generator',
    'footer.offers': 'Offers',
    'footer.faq': 'Frequently Asked Questions',
    'footer.guide': 'Size Guide',
    'footer.care': 'Candle Care',
    'footer.contact': 'Contact',
    'footer.about': 'About Us',
    'footer.history': 'Our History',
    'footer.work': 'Work with Us',
    'footer.press': 'Press',
    'footer.newsletter': 'Stay Updated',
    'footer.newsletterDesc': 'Get news about new products and special offers',
    'footer.newsletterPlaceholder': 'Your email',
    'footer.newsletterSubscribe': 'Subscribe',
    'footer.rights': 'All rights reserved.',
    'footer.powered': 'Powered by Freedom Labs',
    'footer.shipping': 'Shipping Policies',
    'footer.terms': 'Terms and Conditions',
    'footer.privacy': 'Privacy',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/en')) {
        setLanguage('en');
      } else {
        setLanguage('es');
      }
    }
  }, []);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

