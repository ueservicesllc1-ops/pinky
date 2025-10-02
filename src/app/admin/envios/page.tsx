'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Settings, Save, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ShippingTest from '@/components/ShippingTest';

interface CarrierCredentials {
  id: string;
  name: string;
  enabled: boolean;
  credentials: {
    [key: string]: string;
  };
  description: string;
  setupUrl: string;
  docsUrl: string;
}

const CARRIERS: CarrierCredentials[] = [
  {
    id: 'usps',
    name: 'USPS (United States Postal Service)',
    enabled: false,
    credentials: {
      username: '',
      password: '',
      accountNumber: '',
    },
    description: 'Servicio postal de Estados Unidos. Ideal para envíos domésticos.',
    setupUrl: 'https://www.usps.com/business/web-tools-apis/',
    docsUrl: 'https://www.usps.com/business/web-tools-apis/documentation.htm'
  },
  {
    id: 'ups',
    name: 'UPS (United Parcel Service)',
    enabled: false,
    credentials: {
      accessKey: '',
      username: '',
      password: '',
      accountNumber: '',
    },
    description: 'Servicio de paquetería internacional. Excelente para envíos internacionales.',
    setupUrl: 'https://developer.ups.com/',
    docsUrl: 'https://developer.ups.com/api/reference'
  },
  {
    id: 'fedex',
    name: 'FedEx',
    enabled: false,
    credentials: {
      apiKey: '',
      secretKey: '',
      accountNumber: '',
      meterNumber: '',
    },
    description: 'Servicio de paquetería premium. Rápido y confiable.',
    setupUrl: 'https://developer.fedex.com/',
    docsUrl: 'https://developer.fedex.com/api/en-us/catalog/rate.html'
  },
  {
    id: 'dhl',
    name: 'DHL Express',
    enabled: false,
    credentials: {
      siteId: '',
      password: '',
      accountNumber: '',
    },
    description: 'Servicio de envío internacional express. Ideal para envíos urgentes.',
    setupUrl: 'https://developer.dhl.com/',
    docsUrl: 'https://developer.dhl.com/docs'
  }
];

export default function EnviosAdminPage() {
  const [carriers, setCarriers] = useState<CarrierCredentials[]>(CARRIERS);
  const [showPasswords, setShowPasswords] = useState<{[key: string]: boolean}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Cargar configuración guardada
  useEffect(() => {
    const savedCarriers = localStorage.getItem('pinky-flame-carriers');
    if (savedCarriers) {
      try {
        setCarriers(JSON.parse(savedCarriers));
      } catch (error) {
        console.error('Error loading saved carriers:', error);
      }
    }
  }, []);

  const togglePasswordVisibility = (carrierId: string, field: string) => {
    const key = `${carrierId}-${field}`;
    setShowPasswords(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateCarrierCredentials = (carrierId: string, field: string, value: string) => {
    setCarriers(prev => prev.map(carrier => 
      carrier.id === carrierId 
        ? {
            ...carrier,
            credentials: {
              ...carrier.credentials,
              [field]: value
            }
          }
        : carrier
    ));
  };

  const toggleCarrierEnabled = (carrierId: string) => {
    setCarriers(prev => prev.map(carrier => 
      carrier.id === carrierId 
        ? { ...carrier, enabled: !carrier.enabled }
        : carrier
    ));
  };

  const saveConfiguration = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // Guardar en localStorage (en producción, esto iría a Firebase)
      localStorage.setItem('pinky-flame-carriers', JSON.stringify(carriers));
      
      setSaveMessage({
        type: 'success',
        text: 'Configuración de envíos guardada exitosamente'
      });

      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: 'error',
        text: 'Error guardando la configuración'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCredentialFields = (carrier: CarrierCredentials) => {
    const fields = Object.keys(carrier.credentials);
    return fields.map(field => ({
      key: field,
      label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
      type: field.toLowerCase().includes('password') || field.toLowerCase().includes('key') || field.toLowerCase().includes('secret') ? 'password' : 'text'
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Configuración de Envíos
          </h1>
          <p className="text-lg text-gray-600">
            Configura las credenciales de las empresas de envío para calcular costos automáticamente
          </p>
        </motion.div>

        {/* Save Message */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              saveMessage.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{saveMessage.text}</span>
          </motion.div>
        )}

        {/* Carriers Configuration */}
        <div className="space-y-6">
          {carriers.map((carrier, index) => (
            <motion.div
              key={carrier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6 text-pink-600" />
                      <div>
                        <CardTitle className="text-xl">{carrier.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{carrier.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={carrier.enabled}
                          onChange={() => toggleCarrierEnabled(carrier.id)}
                          className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                        />
                        <span className="text-sm font-medium">
                          {carrier.enabled ? 'Habilitado' : 'Deshabilitado'}
                        </span>
                      </label>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {carrier.enabled ? (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Credenciales:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getCredentialFields(carrier).map(field => (
                          <div key={field.key} className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              {field.label}
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords[`${carrier.id}-${field.key}`] ? 'text' : field.type}
                                value={carrier.credentials[field.key]}
                                onChange={(e) => updateCarrierCredentials(carrier.id, field.key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 pr-10"
                                placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                              />
                              {field.type === 'password' && (
                                <button
                                  type="button"
                                  onClick={() => togglePasswordVisibility(carrier.id, field.key)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  {showPasswords[`${carrier.id}-${field.key}`] ? (
                                    <EyeOff className="h-4 w-4" />
                                  ) : (
                                    <Eye className="h-4 w-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">
                        Habilita este transportista para configurar sus credenciales
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(carrier.setupUrl, '_blank')}
                        >
                          Guía de Configuración
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(carrier.docsUrl, '_blank')}
                        >
                          Documentación API
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-end"
        >
          <Button
            onClick={saveConfiguration}
            disabled={isSaving}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </>
            )}
          </Button>
        </motion.div>

        {/* Test Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <ShippingTest />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            📋 Cómo obtener las credenciales:
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>1. USPS:</strong> Regístrate en <a href="https://www.usps.com/business/web-tools-apis/" target="_blank" className="underline">USPS Web Tools</a> y obtén tu Username y Password
            </div>
            <div>
              <strong>2. UPS:</strong> Crea una cuenta en <a href="https://developer.ups.com/" target="_blank" className="underline">UPS Developer</a> y genera tus API Keys
            </div>
            <div>
              <strong>3. FedEx:</strong> Regístrate en <a href="https://developer.fedex.com/" target="_blank" className="underline">FedEx Developer</a> y obtén tus credenciales
            </div>
            <div>
              <strong>4. DHL:</strong> Solicita acceso en <a href="https://developer.dhl.com/" target="_blank" className="underline">DHL Developer Portal</a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
