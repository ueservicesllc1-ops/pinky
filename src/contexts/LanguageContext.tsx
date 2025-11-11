'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface LanguageContextType {
  language: 'es' | 'en';
  setLanguage: (lang: 'es' | 'en') => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  es: {
    // Header
    'header.home': 'Inicio',
    'header.catalog': 'Catálogo',
    'header.custom': 'Personalizadas',
    'header.about': 'Nosotros',
    'header.admin': 'Admin',
    'header.searchPlaceholder': 'Buscar velas...',

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
    'products.loading': 'Cargando productos destacados...',
    'products.comingSoon': 'Pronto tendremos productos destacados disponibles',
    'products.featuredDescription': 'Descubre nuestras velas más populares, creadas con los mejores ingredientes naturales.',
    'products.buy': 'Comprar',
    'products.viewAllProducts': 'Ver Todos los Productos',
    'products.imagePlaceholder': 'Imagen de',

    // Customization Section
    'custom.title': 'Personaliza tu Vela',
    'custom.subtitle': 'Crea la vela perfecta para ti',
    'custom.description': 'Cada vela puede ser completamente personalizada según tus gustos y necesidades. Desde el color y la fragancia hasta mensajes especiales y embalaje.',
    'custom.start': 'Comenzar',
    'custom.button': 'Personalizar Ahora',
    'custom.feature.colors.title': 'Colores únicos',
    'custom.feature.colors.description': 'Elige entre más de 20 colores diferentes',
    'custom.feature.messages.title': 'Mensajes especiales',
    'custom.feature.messages.description': 'Añade texto personalizado a tu vela',
    'custom.feature.fragrances.title': 'Fragancias premium',
    'custom.feature.fragrances.description': 'Selecciona entre nuestras fragancias exclusivas',
    'custom.feature.packaging.title': 'Embalaje especial',
    'custom.feature.packaging.description': 'Presentación perfecta para regalar',

    // Testimonials
    'testimonials.title': 'Lo que Dicen Nuestros Clientes',
    'testimonials.subtitle': 'Experiencias reales de quienes han elegido Pinky Flames',
    'testimonials.description': 'Miles de clientes felices han transformado sus espacios con nuestras velas artesanales.',
    'testimonials.loading': 'Cargando testimonios...',
    'testimonials.emptyTitle': 'Próximamente testimonios',
    'testimonials.emptyDescription': 'Estamos recopilando las experiencias de nuestros clientes',
    'testimonials.stats.clients': 'Clientes Satisfechos',
    'testimonials.stats.rating': 'Valoración Promedio',
    'testimonials.stats.sales': 'Velas Vendidas',
    'testimonials.stats.fragrances': 'Fragancias Disponibles',

    // Newsletter
    'newsletter.title': 'Mantente al día',
    'newsletter.subtitle': 'Recibe noticias sobre nuevos productos y ofertas especiales',
    'newsletter.placeholder': 'Tu email',
    'newsletter.subscribe': 'Suscribirse',
    'newsletter.headline': 'Mantente al día con Pinky Flame',
    'newsletter.descriptionExtended': 'Recibe noticias exclusivas sobre nuevos productos, ofertas especiales y consejos para crear la atmósfera perfecta en tu hogar.',
    'newsletter.emailPlaceholderDetailed': 'Tu dirección de email',
    'newsletter.subscribing': 'Suscribiendo...',
    'newsletter.success': '¡Gracias por suscribirte!',
    'newsletter.errorRequired': 'Por favor ingresa tu email',
    'newsletter.errorGeneric': 'Hubo un error. Por favor intenta de nuevo.',
    'newsletter.policyNotice': 'Al suscribirte, aceptas recibir emails promocionales.',
    'newsletter.policyDetail': 'Puedes cancelar tu suscripción en cualquier momento.',
    'newsletter.benefit.exclusive.title': 'Ofertas Exclusivas',
    'newsletter.benefit.exclusive.description': 'Descuentos especiales solo para suscriptores',
    'newsletter.benefit.products.title': 'Nuevos Productos',
    'newsletter.benefit.products.description': 'Sé el primero en conocer nuestras novedades',
    'newsletter.benefit.tips.title': 'Consejos Útiles',
    'newsletter.benefit.tips.description': 'Tips para crear ambientes perfectos',

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
    // Header
    'header.home': 'Home',
    'header.catalog': 'Catalog',
    'header.custom': 'Custom',
    'header.about': 'About',
    'header.admin': 'Admin',
    'header.searchPlaceholder': 'Search candles...',

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
    'products.loading': 'Loading featured products...',
    'products.comingSoon': 'We will soon have featured products available.',
    'products.featuredDescription': 'Discover our most popular candles, crafted with the finest natural ingredients.',
    'products.buy': 'Buy',
    'products.viewAllProducts': 'View All Products',
    'products.imagePlaceholder': 'Image of',

    // Customization Section
    'custom.title': 'Customize Your Candle',
    'custom.subtitle': 'Create the perfect candle for you',
    'custom.description': 'Each candle can be fully customized to match your style and needs—from color and fragrance to special messages and packaging.',
    'custom.start': 'Get Started',
    'custom.button': 'Customize Now',
    'custom.feature.colors.title': 'Unique colors',
    'custom.feature.colors.description': 'Choose from more than 20 different colors',
    'custom.feature.messages.title': 'Special messages',
    'custom.feature.messages.description': 'Add personalized text to your candle',
    'custom.feature.fragrances.title': 'Premium fragrances',
    'custom.feature.fragrances.description': 'Select from our exclusive fragrance collection',
    'custom.feature.packaging.title': 'Special packaging',
    'custom.feature.packaging.description': 'Perfect presentation for gifting',

    // Testimonials
    'testimonials.title': 'What Our Customers Say',
    'testimonials.subtitle': 'Real experiences from those who have chosen Pinky Flames',
    'testimonials.description': 'Thousands of happy customers have transformed their spaces with our handcrafted candles.',
    'testimonials.loading': 'Loading testimonials...',
    'testimonials.emptyTitle': 'Testimonials coming soon',
    'testimonials.emptyDescription': 'We are gathering the experiences of our customers.',
    'testimonials.stats.clients': 'Happy Customers',
    'testimonials.stats.rating': 'Average Rating',
    'testimonials.stats.sales': 'Candles Sold',
    'testimonials.stats.fragrances': 'Available Fragrances',

    // Newsletter
    'newsletter.title': 'Stay Updated',
    'newsletter.subtitle': 'Get news about new products and special offers',
    'newsletter.placeholder': 'Your email',
    'newsletter.subscribe': 'Subscribe',
    'newsletter.headline': 'Stay up to date with Pinky Flame',
    'newsletter.descriptionExtended': 'Receive exclusive news about new products, special offers, and tips to create the perfect atmosphere at home.',
    'newsletter.emailPlaceholderDetailed': 'Your email address',
    'newsletter.subscribing': 'Subscribing...',
    'newsletter.success': 'Thank you for subscribing!',
    'newsletter.errorRequired': 'Please enter your email address',
    'newsletter.errorGeneric': 'Something went wrong. Please try again.',
    'newsletter.policyNotice': 'By subscribing, you agree to receive promotional emails.',
    'newsletter.policyDetail': 'You can unsubscribe at any time.',
    'newsletter.benefit.exclusive.title': 'Exclusive Offers',
    'newsletter.benefit.exclusive.description': 'Special discounts only for subscribers',
    'newsletter.benefit.products.title': 'New Products',
    'newsletter.benefit.products.description': 'Be the first to hear about our new releases',
    'newsletter.benefit.tips.title': 'Helpful Tips',
    'newsletter.benefit.tips.description': 'Ideas to create perfect moments',

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
  },
} as const;

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<'es' | 'en'>('es');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    if (pathname.startsWith('/en')) {
      setLanguageState('en');
    } else {
      setLanguageState('es');
    }
  }, [pathname]);

  const changeLanguage = (target: 'es' | 'en') => {
    if (target === language && pathname?.startsWith(`/${target}`)) {
      return;
    }

    setLanguageState(target);

    if (!pathname) {
      router.push(target === 'en' ? '/en' : '/es');
      return;
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'es' || segments[0] === 'en') {
      segments.shift();
    }

    const restPath = segments.join('/');
    const localePrefix = target === 'en' ? '/en' : '/es';
    const newPath = restPath ? `${localePrefix}/${restPath}` : localePrefix;

    const queryString = searchParams?.toString();
    const finalUrl = queryString && queryString.length > 0 ? `${newPath}?${queryString}` : newPath;

    router.push(finalUrl);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.es] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
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

