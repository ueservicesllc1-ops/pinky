'use client';

import { useState } from 'react';
import { X, ShoppingCart, User, MessageSquare, Tag } from 'lucide-react';
import SuccessModal from './SuccessModal';
import { useCart } from '@/contexts/CartContext';
import { Product, CartItem } from '@/types';

interface CustomCandleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: () => void;
  candleImage: string; // La imagen generada con el diseño
  templateName: string;
  templatePrice: number;
}

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  candleName: string;
  additionalDetails: string;
  templateName: string;
  templatePrice: number;
  orderImage: string;
  status: 'pending' | 'paid' | 'in_production' | 'completed';
  createdAt: Date;
}

export default function CustomCandleOrderModal({
  isOpen,
  onClose,
  onOrderPlaced,
  candleImage,
  templateName,
  templatePrice
}: CustomCandleOrderModalProps) {
  const { addItem } = useCart();
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    candleName: '',
    additionalDetails: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.candleName) {
      alert('Por favor completa el nombre de tu vela');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear producto personalizado para el carrito
      const customProduct: Product = {
        id: `custom-candle-${Date.now()}`,
        name: formData.candleName || `Vela Personalizada - ${templateName}`,
        description: `Vela personalizada con diseño único. ${formData.additionalDetails || ''}`,
        price: templatePrice,
        images: [candleImage],
        category: 'personalizada',
        stock: 1,
        isCustomizable: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Agregar al carrito
      const cartItem: CartItem = {
        product: customProduct,
        quantity: 1,
        customizations: {
          message: formData.additionalDetails,
          candleType: templateName,
          customText: formData.candleName
        }
      };

      addItem(cartItem);

      setShowSuccessModal(true);

      // Cerrar modal después de 2 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        onOrderPlaced();
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert('Error al agregar tu diseño al carrito. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      candleName: '',
      additionalDetails: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] backdrop-blur-sm">
        <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pedido de Vela Personalizada</h2>
                <p className="text-sm text-gray-600">Plantilla: {templateName} - ${templatePrice}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Vista previa de la vela */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Tu Diseño Personalizado</h3>

              {/* Diseño personalizado del usuario */}
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <img
                  src={candleImage}
                  alt="Diseño personalizado"
                  className="w-full h-64 object-contain rounded-lg"
                />
              </div>

              {/* Información adicional */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">🎨 Diseño Completo</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>✅ Plantilla de vela base</li>
                  <li>✅ Texto personalizado</li>
                  <li>✅ Imágenes subidas por ti</li>
                  <li>✅ Posición y estilo personalizados</li>
                  <li>📦 Listo para producción</li>
                </ul>
              </div>

              {/* Información del pedido */}
              <div className="bg-pink-50 rounded-lg p-4">
                <h4 className="font-medium text-pink-900 mb-2">Resumen del Pedido</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Plantilla:</span> {templateName}</p>
                  <p><span className="font-medium">Precio:</span> ${templatePrice}</p>
                  <p className="text-xs text-pink-700 mt-2">
                    💡 El pago se procesará después de confirmar tu pedido
                  </p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datos del Pedido</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Detalles de la vela */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Detalles de la Vela
                  </h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre para la vela *
                    </label>
                    <input
                      type="text"
                      name="candleName"
                      value={formData.candleName}
                      onChange={handleInputChange}
                      placeholder="ej. Vela de Cumpleaños de María"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Detalles adicionales
                    </label>
                    <textarea
                      name="additionalDetails"
                      value={formData.additionalDetails}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Instrucciones especiales, mensaje personalizado, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 bg-gray-200 text-gray-800 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Añadir al Carrito
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="¡Diseño guardado! Redirigiendo al carrito para que finalices tu compra..."
      />
    </>
  );
}
