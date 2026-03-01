import { NextResponse } from 'next/server';

const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { address } = body;

        if (!address) {
            return NextResponse.json({ error: 'Falta la dirección para validar' }, { status: 400 });
        }

        const payload = {
            name: "Validacion Cliente",
            street1: address.street,
            city: address.city,
            state: address.state,
            zip: address.zipCode,
            country: address.country || 'US',
            validate: true // Esto le dice a Shippo que obligatoriamente valide si la calle existe
        };

        console.log("Enviando dirección a Shippo para validación...");

        const response = await fetch('https://api.goshippo.com/addresses/', {
            method: 'POST',
            headers: {
                'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Shippo Validation Error:', response.status, errorText);
            return NextResponse.json({ error: 'Error del proveedor de envíos' }, { status: response.status });
        }

        const data = await response.json();

        // Analizar la respuesta de Shippo sobre la validez
        const isValid = data.validation_results?.is_valid || false;
        const messages = data.validation_results?.messages || [];

        // Si Shippo corrigió la calle o el código postal en sus bases de datos postales (ej: añadió un zip+4)
        const normalized = {
            street: data.street1 || address.street,
            city: data.city || address.city,
            state: data.state || address.state,
            zipCode: data.zip || address.zipCode,
            country: data.country || address.country
        };

        return NextResponse.json({
            valid: isValid,
            messages: messages,
            normalized: normalized
        });
    } catch (error: any) {
        console.error('Error en el proxy de validación Shippo:', error);
        return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
    }
}
