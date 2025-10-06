'use client';

import { useState } from 'react';
import { Mail, Eye, EyeOff, CheckCircle, Clock, User, MessageSquare, Calendar } from 'lucide-react';
import { useContactMessages } from '@/hooks/useContactMessages';
import SuccessModal from '@/components/SuccessModal';

export default function MensajesPage() {
  const { messages, loading, error, unreadCount, markAsRead, markAllAsRead } = useContactMessages();
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markAsRead(messageId);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error marking all messages as read:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessagePreview = (mensaje: string) => {
    return mensaje.length > 100 ? mensaje.substring(0, 100) + '...' : mensaje;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-pink-100 rounded-lg">
                <Mail className="h-8 w-8 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mensajes de Usuarios</h1>
                <p className="text-gray-600">
                  {messages.length} mensaje{messages.length !== 1 ? 's' : ''} total
                  {unreadCount > 0 && (
                    <span className="ml-2 text-pink-600 font-medium">
                      • {unreadCount} nuevo{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </p>
              </div>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Marcar todos como leídos</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        {messages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensajes</h3>
            <p className="text-gray-500">Los mensajes de contacto aparecerán aquí cuando los usuarios los envíen.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-white rounded-xl shadow-sm border transition-all hover:shadow-md ${
                  !message.leido ? 'border-pink-200 bg-pink-50/30' : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        !message.leido ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        <User className={`h-5 w-5 ${
                          !message.leido ? 'text-pink-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {message.nombre} {message.apellido}
                        </h3>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                      {!message.leido && (
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(message.timestamp)}</span>
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          {message.leido ? (
                            <>
                              <Eye className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-600">Leído</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-pink-600" />
                              <span className="text-xs text-pink-600">Nuevo</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                      <p className="text-gray-700 leading-relaxed">
                        {getMessagePreview(message.mensaje)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMessage(message)}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors"
                    >
                      Ver mensaje completo
                    </button>
                    
                    {!message.leido && (
                      <button
                        onClick={() => handleMarkAsRead(message.id)}
                        className="bg-pink-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-pink-700 transition-colors flex items-center space-x-1"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Marcar como leído</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Mensaje de {selectedMessage.nombre}</h2>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <p className="text-gray-900">{selectedMessage.nombre} {selectedMessage.apellido}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedMessage.email}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.mensaje}
                    </p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500">
                  Enviado el {formatDate(selectedMessage.timestamp)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message="Acción completada exitosamente"
        />
      </div>
    </div>
  );
}
