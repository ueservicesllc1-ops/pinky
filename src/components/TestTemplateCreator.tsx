'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestTemplateCreator() {
  const [isCreating, setIsCreating] = useState(false);

  const createTestTemplate = async () => {
    try {
      setIsCreating(true);
      
      const templateData = {
        name: 'Vela Cilíndrica Rosa - Prueba',
        description: 'Vela cilíndrica rosa para personalización',
        category: 'Cilíndrica',
        isActive: true,
        imageUrl: 'https://firebasestorage.googleapis.com/v0/b/mysetlistapp-bb4c6.firebasestorage.app/o/candle-templates%2F1759360747278_Whisk_162121c4f5a4faba9fd4c3a540a13724eg.png?alt=media&token=7cd4d925-6a89-4f44-8f61-e5393aea89f1',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('🔄 Creando plantilla de prueba...');
      const docRef = await addDoc(collection(db, 'candle-templates'), templateData);
      console.log('✅ Plantilla creada con ID:', docRef.id);
      
      alert('Plantilla de prueba creada exitosamente!');
    } catch (error) {
      console.error('❌ Error creando plantilla:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-pink-600">Crear Plantilla de Prueba</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Esto creará una plantilla de prueba en Firebase para verificar que todo funciona.
        </p>
        <Button 
          onClick={createTestTemplate}
          disabled={isCreating}
          className="w-full bg-pink-500 hover:bg-pink-600"
        >
          {isCreating ? 'Creando...' : 'Crear Plantilla de Prueba'}
        </Button>
      </CardContent>
    </Card>
  );
}
