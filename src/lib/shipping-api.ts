// Servicio para calcular costos de envío usando Karrio API
import { SHIPPING_CONFIG } from './shipping-config';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingRate {
  carrier: string;
  service: string;
  price: number;
  estimatedDays: number;
  description: string;
  carrierId: string;
  serviceId: string;
}

export interface ShippingCalculation {
  rates: ShippingRate[];
  freeShippingEligible: boolean;
  freeShippingThreshold: number;
}

/**
 * Calcula el costo de envío usando Karrio API
 */
export async function calculateShipping(
  destination: ShippingAddress,
  packageWeight: number = SHIPPING_CONFIG.package.defaultWeight,
  packageValue: number = 0
): Promise<ShippingCalculation> {
  try {
    // Verificar si califica para envío gratis
    const freeShippingEligible = packageValue >= SHIPPING_CONFIG.freeShipping.threshold;

    // Si califica para envío gratis, retornar directamente
    if (freeShippingEligible) {
      return {
        rates: [{
          carrier: "Pinky Flame",
          service: "Envío Gratis",
          price: 0,
          estimatedDays: 5,
          description: `Envío gratis por compra superior a $${SHIPPING_CONFIG.freeShipping.threshold}`,
          carrierId: "pinky-flame",
          serviceId: "free"
        }],
        freeShippingEligible: true,
        freeShippingThreshold: SHIPPING_CONFIG.freeShipping.threshold
      };
    }

    // Usar Karrio API para obtener tarifas reales
    const karrioRates = await getKarrioShippingRates(destination, packageWeight);
    
    return {
      rates: karrioRates,
      freeShippingEligible: false,
      freeShippingThreshold: SHIPPING_CONFIG.freeShipping.threshold
    };

  } catch (error) {
    console.error('Error calculating shipping with Karrio:', error);
    
    // Retornar tarifa por defecto en caso de error
    return {
      rates: [{
        carrier: "Pinky Flame",
        service: "Envío Estándar",
        price: 7.99,
        estimatedDays: 7,
        description: "Envío estándar (error en cálculo)",
        carrierId: "pinky-flame",
        serviceId: "standard"
      }],
      freeShippingEligible: false,
      freeShippingThreshold: SHIPPING_CONFIG.freeShipping.threshold
    };
  }
}

/**
 * Obtiene tarifas de envío usando Karrio API
 */
async function getKarrioShippingRates(
  destination: ShippingAddress,
  weight: number
): Promise<ShippingRate[]> {
  try {
    const response = await fetch(`${SHIPPING_CONFIG.karrio.baseUrl}/api/v1/rates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SHIPPING_CONFIG.karrio.apiKey}`,
      },
      body: JSON.stringify({
        shipper: {
          street_number: SHIPPING_CONFIG.businessAddress.street.split(' ')[0],
          street_name: SHIPPING_CONFIG.businessAddress.street.split(' ').slice(1).join(' '),
          city: SHIPPING_CONFIG.businessAddress.city,
          state_code: SHIPPING_CONFIG.businessAddress.state,
          postal_code: SHIPPING_CONFIG.businessAddress.zipCode,
          country_code: SHIPPING_CONFIG.businessAddress.country,
        },
        recipient: {
          street_number: destination.street.split(' ')[0],
          street_name: destination.street.split(' ').slice(1).join(' '),
          city: destination.city,
          state_code: destination.state,
          postal_code: destination.zipCode,
          country_code: destination.country,
        },
        parcels: [{
          weight: weight,
          weight_unit: "LB",
          dimension_unit: "IN",
          length: SHIPPING_CONFIG.package.dimensions.length,
          width: SHIPPING_CONFIG.package.dimensions.width,
          height: SHIPPING_CONFIG.package.dimensions.height,
        }],
        services: [], // Obtener todos los servicios disponibles
        // Incluir credenciales de carriers configurados
        carriers: SHIPPING_CONFIG.carriers,
      }),
    });

    if (!response.ok) {
      throw new Error(`Karrio API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transformar respuesta de Karrio a nuestro formato
    return data.rates?.map((rate: { carrier_name?: string; carrier_id?: string; service?: string; service_name?: string; total_charge?: string; rate?: string; transit_days?: string; delivery_days?: string }) => ({
      carrier: rate.carrier_name || rate.carrier_id,
      service: rate.service || rate.service_name,
      price: parseFloat(rate.total_charge || rate.rate || '0'),
      estimatedDays: parseInt(rate.transit_days || rate.delivery_days || '5'),
      description: rate.service_name || `${rate.carrier_name} ${rate.service}`,
      carrierId: rate.carrier_id,
      serviceId: rate.service,
    })) || [];

  } catch (error) {
    console.error('Error fetching Karrio rates:', error);
    
    // En caso de error, usar tarifas simuladas como fallback
    return getFallbackRates(destination, weight);
  }
}

/**
 * Tarifas de fallback cuando Karrio no está disponible
 */
function getFallbackRates(destination: ShippingAddress, weight: number): ShippingRate[] {
  const baseRate = 5.50 + (weight * 0.50);
  
  return [
    {
      carrier: "USPS",
      service: "Priority Mail",
      price: Math.round(baseRate * 100) / 100,
      estimatedDays: 3,
      description: "Entrega rápida con seguimiento",
      carrierId: "usps",
      serviceId: "priority"
    },
    {
      carrier: "UPS",
      service: "Ground",
      price: Math.round((baseRate + 2) * 100) / 100,
      estimatedDays: 5,
      description: "Entrega terrestre confiable",
      carrierId: "ups",
      serviceId: "ground"
    },
    {
      carrier: "FedEx",
      service: "Ground",
      price: Math.round((baseRate + 3) * 100) / 100,
      estimatedDays: 4,
      description: "Entrega terrestre rápida",
      carrierId: "fedex",
      serviceId: "ground"
    }
  ];
}


/**
 * Obtiene el costo de envío más económico
 */
export function getCheapestRate(rates: ShippingRate[]): ShippingRate | null {
  if (rates.length === 0) return null;
  
  return rates.reduce((cheapest, current) => 
    current.price < cheapest.price ? current : cheapest
  );
}

/**
 * Obtiene el costo de envío más rápido
 */
export function getFastestRate(rates: ShippingRate[]): ShippingRate | null {
  if (rates.length === 0) return null;
  
  return rates.reduce((fastest, current) => 
    current.estimatedDays < fastest.estimatedDays ? current : fastest
  );
}

/**
 * Valida una dirección de envío
 */
export async function validateAddress(address: ShippingAddress): Promise<{
  valid: boolean;
  normalized?: ShippingAddress;
  suggestions?: ShippingAddress[];
}> {
  try {
    // En producción, usarías una API de validación de direcciones como:
    // - Google Maps Geocoding API
    // - USPS Address Validation API
    // - SmartyStreets API
    
    // Simulación de validación
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Validación básica
    const isValid = !!(
      address.street &&
      address.city &&
      address.state &&
      address.zipCode &&
      address.country
    );
    
    if (!isValid) {
      return { valid: false };
    }
    
    // Simular normalización de dirección
    return {
      valid: true,
      normalized: {
        street: address.street.trim(),
        city: address.city.trim(),
        state: address.state.trim(),
        zipCode: address.zipCode.trim(),
        country: address.country.trim()
      }
    };
    
  } catch (error) {
    console.error('Error validating address:', error);
    return { valid: false };
  }
}
