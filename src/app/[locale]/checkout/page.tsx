'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import confetti from 'canvas-confetti';
import { useOrders } from '@/hooks/useOrders';

export default function CheckoutPage() {
    const { items, total, itemCount, clearCart, shippingRate, shippingOption, customerDetails } = useCart();
    const router = useRouter();
    const { createOrder } = useOrders();
    const [success, setSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const PAYPAL_CLIENT_ID = "AdCQESMaFUTqWbyPEaRLFMkHAX2AqeYk8l1r8oDAOnJDzBM7bma-nHt1dg-GBHPz7x6BS7fl4enOh492";

    // Usamos el costo de envío seleccionado en el carrito, o $9.99 como base/estimado si no eligieron
    const actualShippingCost = total >= 50 ? 0 : (shippingRate !== null ? shippingRate : 9.99);
    const totalWithShipping = total + actualShippingCost;

    // Redirigir si el carrito está vacío y no estamos en estado de éxito
    useEffect(() => {
        if (items.length === 0 && !success) {
            router.push('/es/carrito');
        }
    }, [items, success, router]);

    const handleApprove = async (data: any, actions: any) => {
        try {
            setIsProcessing(true);
            const order = await actions.order.capture();

            console.log('Orden completada por:', order.payer.name.given_name);

            // Lanzar confeti!
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#a855f7', '#3b82f6'] // Pink, Purple, Blue
            });

            // Guardar orden en Firebase usando el hook useOrders
            try {
                // Obtener dirección de envío de PayPal
                const paypalShipping = order.purchase_units[0]?.shipping?.address;
                const shippingAddress = {
                    street: paypalShipping?.address_line_1 || 'No especificada',
                    city: paypalShipping?.admin_area_2 || 'No especificada',
                    state: paypalShipping?.admin_area_1 || 'No especificado',
                    zipCode: paypalShipping?.postal_code || '00000',
                    country: paypalShipping?.country_code || 'US'
                };

                await createOrder({
                    customerName: (customerDetails?.firstName && customerDetails?.lastName)
                        ? `${customerDetails.firstName} ${customerDetails.lastName}`
                        : `${order.payer.name.given_name} ${order.payer.name.surname}`,
                    customerEmail: customerDetails?.email || order.payer.email_address,
                    customerPhone: customerDetails?.phone || '',
                    subtotal: total,
                    shipping: actualShippingCost,
                    total: totalWithShipping,
                    status: 'pending',
                    paymentStatus: 'paid',
                    paymentMethod: 'paypal',
                    shippingAddress,
                    items: items.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        imageUrl: item.product.images?.[0] || '',
                        customizations: item.customizations || null
                    })),
                    // Si el usuario escogió un método exacto, lo registramos para que sepas por dónde mandarlo
                    notes: `PayPal Order ID: ${order.id}. Envío seleccionado: ${shippingOption?.carrier || 'Estándar'} ${shippingOption?.service || ''}.`
                });
            } catch (fbError) {
                console.error('Error guardando en firebase:', fbError);
                // Continuamos igual aunque Firebase falle para no arruinarle la pantalla de éxito al cliente
            }

            setSuccess(true);
            clearCart();

        } catch (error) {
            console.error('Error al capturar la orden:', error);
            alert('Hubo un problema al procesar el pago. Por favor, intenta de nuevo.');
        } finally {
            setIsProcessing(false);
        }
    };

    // FUNCIÓN PROVISIONAL: Simula un pago exitoso
    const simulateSuccessfulPayment = async () => {
        setIsProcessing(true);
        try {
            // Simulamos el tiempo de espera de la red
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Pago simulado exitosamente');

            // Lanzar confeti
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ec4899', '#a855f7', '#3b82f6'] // Pink, Purple, Blue
            });

            // Guardar orden de prueba en Firebase
            try {
                await createOrder({
                    customerName: (customerDetails?.firstName && customerDetails?.lastName)
                        ? `${customerDetails.firstName} ${customerDetails.lastName}`
                        : "Usuario de Prueba",
                    customerEmail: customerDetails?.email || "prueba@pinkyflames.com",
                    customerPhone: customerDetails?.phone || '555-0000',
                    subtotal: total,
                    shipping: actualShippingCost,
                    total: totalWithShipping,
                    status: 'pending',
                    paymentStatus: 'paid',
                    paymentMethod: 'simulated',
                    shippingAddress: {
                        street: '123 Calle Falsa',
                        city: 'Ciudad de Prueba',
                        state: 'Estado de Prueba',
                        zipCode: '12345',
                        country: 'US'
                    },
                    items: items.map(item => ({
                        id: item.product.id,
                        name: item.product.name,
                        price: item.product.price,
                        quantity: item.quantity,
                        imageUrl: item.product.images?.[0] || '',
                        customizations: item.customizations || null
                    })),
                    notes: `Esta es una orden generada desde el Modo Prueba/Desarrollo. Envío seleccionado: ${shippingOption?.carrier || 'Estándar'} ${shippingOption?.service || ''}.`
                });
            } catch (err) {
                console.error('Error guardando orden simulada:', err);
            }

            setSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Error al simular pago:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Si la compra fue exitosa, mostrar modal de agradecimiento
    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
                >
                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Gracias por tu compra!</h1>
                    <p className="text-gray-600 mb-8">
                        Tu pedido en <span className="font-semibold text-pink-600">PinkyFlames</span> ha sido procesado exitosamente. Recibirás un correo electrónico con los detalles.
                    </p>
                    <Button
                        onClick={() => router.push('/es')}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 h-12 text-lg"
                    >
                        Volver al Inicio
                    </Button>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) return null; // Evitar parpadeos antes del redirect

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center mb-8">
                    <Link href="/es/carrito" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Carrito
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Columna Izquierda: Formulario de Pago */}
                    <div>
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
                            <p className="text-gray-600">Completa tu compra de forma segura con PayPal en PinkyFlames.</p>
                        </div>

                        <Card className="shadow-md">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <ShieldCheck className="h-6 w-6 text-green-600" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Pago Seguro</h3>
                                        <p className="text-sm text-gray-500">Tus datos están protegidos y cifrados</p>
                                    </div>
                                </div>

                                {isProcessing ? (
                                    <div className="flex items-center justify-center h-48">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                                    </div>
                                ) : (
                                    <div className="relative z-0">
                                        <PayPalScriptProvider options={{
                                            "clientId": PAYPAL_CLIENT_ID,
                                            currency: "USD",
                                            intent: "capture",
                                        }}>
                                            <PayPalButtons
                                                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        intent: "CAPTURE",
                                                        purchase_units: [
                                                            {
                                                                description: `Compra en PinkyFlames - ${itemCount} artículos`,
                                                                amount: {
                                                                    currency_code: "USD",
                                                                    value: totalWithShipping.toString(),
                                                                    breakdown: {
                                                                        item_total: {
                                                                            currency_code: "USD",
                                                                            value: total.toFixed(2)
                                                                        },
                                                                        shipping: {
                                                                            currency_code: "USD",
                                                                            value: actualShippingCost.toFixed(2)
                                                                        }
                                                                    }
                                                                },
                                                            },
                                                        ],
                                                        application_context: {
                                                            shipping_preference: "GET_FROM_FILE", // Usar dirección registrada en PayPal
                                                            brand_name: "PinkyFlames" // Muestra el nombre "PinkyFlames" en la ventana de PayPal
                                                        }
                                                    });
                                                }}
                                                onApprove={handleApprove}
                                                onError={(err) => {
                                                    console.error('PayPal Error:', err);
                                                    alert('Ocurrió un error al cargar o procesar PayPal.');
                                                }}
                                            />
                                        </PayPalScriptProvider>

                                        {/* BOTÓN PROVISIONAL PARA PRUEBAS (Se puede eliminar después) */}
                                        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                                            <p className="text-sm text-gray-500 mb-3 font-semibold text-center mt-4">
                                                — MODO PRUEBAS / DESARROLLO —
                                            </p>
                                            <Button
                                                onClick={simulateSuccessfulPayment}
                                                variant="outline"
                                                className="w-full border-dashed border-2 border-pink-300 text-pink-600 hover:bg-pink-50"
                                            >
                                                Simular Pago Exitoso
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Columna Derecha: Resumen del Pedido */}
                    <div>
                        <Card className="bg-white sticky top-8 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Resumen del Pedido
                                </h2>

                                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                                    {items.map((item, index) => (
                                        <div key={`${item.product.id}-${index}`} className="flex gap-4">
                                            {/* Imagen Mini */}
                                            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                                {item.product.images && item.product.images.length > 0 ? (
                                                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                                                )}
                                            </div>

                                            {/* Detalles mini */}
                                            <div className="flex-1 text-sm">
                                                <p className="font-semibold text-gray-900 line-clamp-2">{item.product.name}</p>
                                                <p className="text-gray-500">Cant: {item.quantity}</p>
                                            </div>

                                            <div className="font-semibold text-gray-900">
                                                ${(item.product.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Envío</span>
                                        <span className={total >= 50 ? "text-green-600 font-medium" : ""}>
                                            {total >= 50 ? 'Gratis' : `$${actualShippingCost.toFixed(2)}${shippingRate === null ? ' (Estimado)' : ''}`}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-900">Total a Pagar</span>
                                        <span className="text-2xl font-bold text-pink-600">${totalWithShipping.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-center text-gray-500 mt-4">
                                        Al completar la compra, aceptas nuestros Términos de Servicio y Políticas de Privacidad.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
