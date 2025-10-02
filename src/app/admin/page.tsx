'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Settings, Upload, BarChart3, Users, Package, Zap, Sparkles, MessageCircle, Truck } from 'lucide-react';

export default function AdminDashboard() {
  const adminMenuItems = [
    {
      title: 'Galería de Velas',
      description: 'Subir y gestionar fotos de velas para personalización',
      href: '/admin/velas',
      icon: Upload,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Plantillas de Velas',
      description: 'Gestionar plantillas base para el editor de personalización',
      href: '/admin/plantillas-velas',
      icon: Package,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
    {
      title: 'Banners',
      description: 'Crear y gestionar banners del carrusel principal',
      href: '/admin/banners',
      icon: Upload,
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600'
    },
    {
      title: 'Promociones',
      description: 'Crear ofertas especiales y descuentos',
      href: '/admin/promociones',
      icon: Users,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      title: 'Ofertas Especiales',
      description: 'Gestionar ofertas limitadas y packs especiales',
      href: '/admin/ofertas',
      icon: Users,
      color: 'bg-emerald-500',
      hoverColor: 'hover:bg-emerald-600'
    },
    {
      title: 'Generador de IA',
      description: 'Configurar y probar el generador de velas con IA',
      href: '/admin/ia-generator',
      icon: Zap,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Popup del Hero',
      description: 'Configurar el popup promocional que aparece al inicio',
      href: '/admin/hero-popup',
      icon: Sparkles,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      title: 'Configuración',
      description: 'Datos de contacto, redes sociales y configuración',
      href: '/admin/configuracion',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    },
    {
      title: 'Órdenes',
      description: 'Gestionar pedidos y personalizaciones de clientes',
      href: '/admin/ordenes',
      icon: Package,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      title: 'Newsletter',
      description: 'Ver suscriptores y gestionar campañas de email',
      href: '/admin/newsletter',
      icon: Users,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      title: 'Testimonios de Clientes',
      description: 'Gestionar comentarios y fotos de clientes satisfechos',
      href: '/admin/testimonios',
      icon: MessageCircle,
      color: 'bg-teal-500',
      hoverColor: 'hover:bg-teal-600'
    },
    {
      title: 'Configuración de Envíos',
      description: 'Configurar credenciales de UPS, USPS, FedEx y DHL',
      href: '/admin/envios',
      icon: Truck,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      title: 'Estadísticas',
      description: 'Analytics y métricas del negocio',
      href: '/admin/estadisticas',
      icon: BarChart3,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600">
            Gestiona tu negocio de velas personalizadas
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Velas en Galería</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Upload className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Órdenes Hoy</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suscriptores</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">IA Generadas</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Admin Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-light text-gray-900 mb-8">
            Herramientas de Administración
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminMenuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link href={item.href}>
                  <div className={`${item.color} ${item.hoverColor} rounded-2xl p-6 text-white transition-all duration-300 hover:shadow-xl cursor-pointer group`}>
                    <div className="flex items-start justify-between mb-4">
                      <item.icon className="h-8 w-8 text-white/80 group-hover:text-white transition-colors" />
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2">
                      {item.title}
                    </h3>
                    
                    <p className="text-white/80 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-light text-gray-900 mb-6">
            Acciones Rápidas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/velas">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Upload className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Subir Nueva Vela</h3>
                    <p className="text-sm text-gray-600">Agregar fotos de velas a la galería</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/ia-generator">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Probar IA</h3>
                    <p className="text-sm text-gray-600">Generar velas con IA para testing</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
