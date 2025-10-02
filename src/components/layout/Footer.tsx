'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useBusinessConfig } from '@/hooks/useBusinessConfig';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { businessInfo, isLoading } = useBusinessConfig();
  
  // Debug: mostrar datos actuales
  console.log('🔍 Footer - businessInfo:', businessInfo);
  console.log('🔍 Footer - isLoading:', isLoading);

  // Mostrar loading si aún está cargando
  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando...</p>
          </div>
        </div>
      </footer>
    );
  }

  const footerSections = [
    {
      title: 'Tienda',
      links: [
        { label: 'Catálogo', href: '/es/catalogo' },
        { label: 'Velas Personalizadas', href: '/es/personalizadas' },
        { label: 'IA Generator', href: '/es/ia-generator' },
        { label: 'Ofertas', href: '/ofertas' },
      ]
    },
    {
      title: 'Ayuda',
      links: [
        { label: 'Preguntas Frecuentes', href: '/faq' },
        { label: 'Guía de Tamaños', href: '/guias' },
        { label: 'Cuidado de Velas', href: '/cuidado' },
        { label: 'Contacto', href: '/contacto' },
      ]
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Nosotros', href: '/es/nosotros' },
        { label: 'Nuestra Historia', href: '/historia' },
        { label: 'Trabaja con Nosotros', href: '/trabajo' },
        { label: 'Prensa', href: '/prensa' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: businessInfo.socialMedia.instagram, label: 'Instagram' },
    { icon: Facebook, href: businessInfo.socialMedia.facebook, label: 'Facebook' },
    { icon: Twitter, href: businessInfo.socialMedia.twitter, label: 'Twitter' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/es" className="block -mt-24">
              <img 
                src="/images/logo2.png" 
                alt="Pinky Flame Logo" 
                className="h-64 w-64 object-contain hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-gray-400 mb-4 max-w-sm -mt-16">
              {businessInfo.businessDescription}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{businessInfo.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{businessInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{businessInfo.address}, {businessInfo.city}, {businessInfo.state} {businessInfo.zipCode}</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-pink-400 transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-white mb-2">Mantente al día</h3>
            <p className="text-gray-400 text-sm mb-4">
              Recibe noticias sobre nuevos productos y ofertas especiales
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all">
                Suscribirse
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <p className="text-gray-400 text-sm">
              © {currentYear} {businessInfo.businessName}. Todos los derechos reservados.
            </p>
            <p className="text-gray-500 text-xs">
              Potenciada por Freedom Labs
            </p>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-pink-400 transition-colors"
                aria-label={social.label}
              >
                <social.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/politicas-envio" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Políticas de Envío
            </Link>
            <Link href="/terminos" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Términos y Condiciones
            </Link>
            <Link href="/privacidad" className="text-gray-400 hover:text-pink-400 transition-colors text-sm">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
