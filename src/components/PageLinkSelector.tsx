'use client';

import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Home, ShoppingBag, Sparkles, Users, FileText, Settings } from 'lucide-react';

interface PageLinkSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

interface PageOption {
  value: string;
  label: string;
  category: string;
  icon: React.ComponentType<any>;
}

const pageOptions: PageOption[] = [
  // Páginas principales
  {
    value: '/',
    label: 'Página Principal',
    category: 'Principal',
    icon: Home
  },
  {
    value: '/es',
    label: 'Inicio (Español)',
    category: 'Principal',
    icon: Home
  },
  
  // Catálogo y productos (solo español)
  {
    value: '/es/catalogo',
    label: 'Catálogo',
    category: 'Productos',
    icon: ShoppingBag
  },
  
  // Personalización (solo español)
  {
    value: '/es/personalizadas',
    label: 'Velas Personalizadas',
    category: 'Personalización',
    icon: Sparkles
  },
  {
    value: '/es/ia-generator',
    label: 'Generador con IA',
    category: 'Personalización',
    icon: Sparkles
  },
  
  // Carrito (solo español)
  {
    value: '/es/carrito',
    label: 'Carrito de Compras',
    category: 'Compras',
    icon: ShoppingBag
  },
  
  // Información (solo español)
  {
    value: '/es/nosotros',
    label: 'Nosotros',
    category: 'Información',
    icon: Users
  },
  {
    value: '/terminos',
    label: 'Términos y Condiciones',
    category: 'Información',
    icon: FileText
  },
  {
    value: '/politicas-envio',
    label: 'Políticas de Envío',
    category: 'Información',
    icon: FileText
  },
  
  // Administración (para enlaces internos)
  {
    value: '/admin',
    label: 'Panel de Administración',
    category: 'Administración',
    icon: Settings
  },
  {
    value: '/admin/velas',
    label: 'Galería de Velas',
    category: 'Administración',
    icon: Settings
  },
  {
    value: '/admin/banners',
    label: 'Banners',
    category: 'Administración',
    icon: Settings
  },
  {
    value: '/admin/promociones',
    label: 'Promociones',
    category: 'Administración',
    icon: Settings
  },
  {
    value: '/admin/ofertas',
    label: 'Ofertas Especiales',
    category: 'Administración',
    icon: Settings
  },
  {
    value: '/admin/configuracion',
    label: 'Configuración',
    category: 'Administración',
    icon: Settings
  }
];

const categories = [...new Set(pageOptions.map(page => page.category))];

export default function PageLinkSelector({ 
  value, 
  onChange, 
  placeholder = "Seleccionar página...",
  label = "Enlace"
}: PageLinkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedPage = pageOptions.find(page => page.value === value);
  
  const filteredPages = pageOptions.filter(page => 
    page.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (pageValue: string) => {
    onChange(pageValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCustomLink = () => {
    const customLink = prompt('Ingresa un enlace personalizado:');
    if (customLink) {
      onChange(customLink);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-left flex items-center justify-between"
        >
          <div className="flex items-center">
            {selectedPage && (
              <>
                <selectedPage.icon className="h-4 w-4 text-gray-500 mr-2" />
                <span className="text-gray-900">{selectedPage.label}</span>
              </>
            )}
            {!selectedPage && (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-hidden">
            {/* Barra de búsqueda */}
            <div className="p-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Buscar página..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                autoFocus
              />
            </div>

            {/* Lista de páginas */}
            <div className="max-h-60 overflow-y-auto">
              {filteredPages.length === 0 ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No se encontraron páginas
                </div>
              ) : (
                <>
                  {/* Enlace personalizado */}
                  <button
                    onClick={handleCustomLink}
                    className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 flex items-center text-sm text-purple-600"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Enlace personalizado...
                  </button>

                  {/* Páginas agrupadas por categoría */}
                  {categories.map(category => {
                    const categoryPages = filteredPages.filter(page => page.category === category);
                    if (categoryPages.length === 0) return null;

                    return (
                      <div key={category}>
                        <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-600 uppercase tracking-wide">
                          {category}
                        </div>
                        {categoryPages.map(page => (
                          <button
                            key={page.value}
                            onClick={() => handleSelect(page.value)}
                            className={`w-full p-3 text-left hover:bg-gray-50 flex items-center text-sm ${
                              value === page.value ? 'bg-purple-50 text-purple-700' : 'text-gray-900'
                            }`}
                          >
                            <page.icon className="h-4 w-4 mr-3 text-gray-500" />
                            <div>
                              <div className="font-medium">{page.label}</div>
                              <div className="text-xs text-gray-500">{page.value}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mostrar valor actual si es un enlace personalizado */}
      {value && !selectedPage && (
        <div className="mt-2 p-2 bg-purple-50 rounded-lg">
          <div className="flex items-center text-sm">
            <ExternalLink className="h-4 w-4 text-purple-600 mr-2" />
            <span className="text-purple-700 font-medium">Enlace personalizado:</span>
            <span className="text-purple-600 ml-2">{value}</span>
          </div>
        </div>
      )}
    </div>
  );
}
