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

    // Usar API propia (/api/shipping/rates) conectada a Shippo para obtener tarifas reales
    const shippoRates = await fetchShippingRates(destination, packageWeight);

    return {
      rates: shippoRates,
      freeShippingEligible: false,
      freeShippingThreshold: SHIPPING_CONFIG.freeShipping.threshold
    };

  } catch (error) {
    console.error('Error calculating shipping with Shippo:', error);
    throw error;
  }
}

/**
 * Obtiene tarifas de envío nuestro servidor usando Shippo
 */
async function fetchShippingRates(
  destination: ShippingAddress,
  weight: number
): Promise<ShippingRate[]> {
  try {
    const response = await fetch('/api/shipping/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destination,
        weight,
      }),
    });

    if (!response.ok) {
      throw new Error(`Shipping proxy error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.rates || [];

  } catch (error) {
    console.error('Error fetching Shippo rates:', error);
    throw error;
  }
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
    const response = await fetch('/api/shipping/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      throw new Error(`Shipping validation proxy error: ${response.status}`);
    }

    const data = await response.json();

    return {
      valid: data.valid,
      normalized: data.normalized,
      suggestions: data.messages // Podríamos enviar los mensajes de error/sugerencias aquí temporalmente para mostrarlos en consola
    };

  } catch (error) {
    console.error('Error validating address:', error);
    return { valid: false };
  }
}
