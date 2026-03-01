import { NextResponse } from 'next/server';
import { SHIPPING_CONFIG } from '@/lib/shipping-config';

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { destination, weight } = body;

        if (!destination) {
            return NextResponse.json({ error: 'Falta la dirección de destino' }, { status: 400 });
        }

        const payload = {
            address_from: {
                name: "Pinky Flame",
                street1: SHIPPING_CONFIG.businessAddress.street,
                city: SHIPPING_CONFIG.businessAddress.city,
                state: SHIPPING_CONFIG.businessAddress.state,
                zip: SHIPPING_CONFIG.businessAddress.zipCode,
                country: SHIPPING_CONFIG.businessAddress.country,
            },
            address_to: {
                name: "Cliente",
                street1: destination.street,
                city: destination.city,
                state: destination.state,
                zip: destination.zipCode,
                country: destination.country,
            },
            parcels: [
                {
                    length: SHIPPING_CONFIG.package.dimensions.length.toString(),
                    width: SHIPPING_CONFIG.package.dimensions.width.toString(),
                    height: SHIPPING_CONFIG.package.dimensions.height.toString(),
                    distance_unit: "in",
                    weight: weight.toString(),
                    mass_unit: "lb",
                },
            ],
            async: false,
        };

        console.log("Enviando petición a Shippo...", JSON.stringify(payload, null, 2));

        const response = await fetch('https://api.goshippo.com/shipments/', {
            method: 'POST',
            headers: {
                'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shippo API Error:', response.status, errorText);
            return NextResponse.json({ error: 'Error del proveedor de envíos' }, { status: response.status });
        }

        const data = await response.json();

        // Transformar los "rates" (tarifas) que Shippo devuelve a nuestro modelo unificado
        const rates = data.rates.map((rate: any) => ({
            carrier: rate.provider,
            service: rate.servicelevel.name,
            price: parseFloat(rate.amount),
            estimatedDays: rate.estimated_days || 5,
            description: `Shippo: ${rate.provider} ${rate.servicelevel.name}`,
            carrierId: rate.provider.toLowerCase(),
            serviceId: rate.servicelevel.token
        }));

        return NextResponse.json({ rates });
    } catch (error: any) {
        console.error('Error en el proxy de Shippo:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
