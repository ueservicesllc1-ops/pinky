// Configuración de envíos para Pinky Flame

// Función para obtener credenciales de carriers guardadas
const getCarrierCredentials = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const saved = localStorage.getItem('pinky-flame-carriers');
    if (saved) {
      const carriers = JSON.parse(saved);
      return carriers.reduce((acc: any, carrier: any) => {
        if (carrier.enabled) {
          acc[carrier.id] = carrier.credentials;
        }
        return acc;
      }, {});
    }
  } catch (error) {
    console.error('Error loading carrier credentials:', error);
  }
  
  return {};
};

export const SHIPPING_CONFIG = {
  // API Configuration
  karrio: {
    baseUrl: process.env.NEXT_PUBLIC_KARRIO_URL || 'https://api.karrio.com',
    apiKey: process.env.KARRIO_API_KEY || 'your-karrio-api-key-here',
  },
  
  // Carrier Credentials (se cargan dinámicamente)
  carriers: getCarrierCredentials(),
  
  // Free Shipping
  freeShipping: {
    threshold: Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD) || 50,
    enabled: true,
  },
  
  // Business Address (Pinky Flame)
  businessAddress: {
    street: process.env.NEXT_PUBLIC_BUSINESS_STREET || "123 Main Street",
    city: process.env.NEXT_PUBLIC_BUSINESS_CITY || "Newark",
    state: process.env.NEXT_PUBLIC_BUSINESS_STATE || "NJ",
    zipCode: process.env.NEXT_PUBLIC_BUSINESS_ZIP || "07102",
    country: process.env.NEXT_PUBLIC_BUSINESS_COUNTRY || "US",
  },
  
  // Package Configuration
  package: {
    defaultWeight: 1.5, // lbs - peso promedio de una vela
    dimensions: {
      length: 6, // inches
      width: 4,
      height: 4,
    },
  },
  
  // Shipping Options
  shippingOptions: {
    standard: {
      name: "Envío Estándar",
      description: "Entrega en 5-7 días hábiles",
      estimatedDays: 6,
    },
    express: {
      name: "Envío Express",
      description: "Entrega en 2-3 días hábiles",
      estimatedDays: 3,
    },
    overnight: {
      name: "Envío Overnight",
      description: "Entrega al día siguiente",
      estimatedDays: 1,
    },
  },
};
