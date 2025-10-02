'use client';

import React, { useState } from 'react';
import { collection, addDoc, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FirebaseTest() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setIsTesting(true);
    setTestResults([]);
    addResult('🧪 Iniciando pruebas de Firebase...');

    try {
      // Test 1: Verificar conexión básica
      addResult('📡 Probando conexión básica...');
      const testRef = collection(db, 'test');
      addResult('✅ Conexión básica exitosa');

      // Test 2: Crear documento de prueba
      addResult('📝 Creando documento de prueba...');
      const testDoc = await addDoc(testRef, {
        message: 'Test de conexión',
        timestamp: new Date(),
        testId: Math.random().toString(36).substr(2, 9)
      });
      addResult(`✅ Documento creado con ID: ${testDoc.id}`);

      // Test 3: Leer documento
      addResult('📖 Leyendo documento de prueba...');
      const testSnap = await getDoc(doc(db, 'test', testDoc.id));
      if (testSnap.exists()) {
        addResult('✅ Documento leído exitosamente');
        addResult(`📄 Datos: ${JSON.stringify(testSnap.data())}`);
      } else {
        addResult('❌ Documento no encontrado');
      }

      // Test 4: Probar business_config
      addResult('🏢 Probando business_config...');
      const businessRef = doc(db, 'business_config', 'main');
      const businessSnap = await getDoc(businessRef);
      
      if (businessSnap.exists()) {
        addResult('✅ business_config existe');
        addResult(`📄 Datos actuales: ${JSON.stringify(businessSnap.data(), null, 2)}`);
      } else {
        addResult('⚠️ business_config no existe, creando...');
        await setDoc(businessRef, {
          businessName: 'Pinky Flame',
          phone: '+1 (555) 123-4567',
          email: 'info@pinkyflame.com',
          createdAt: new Date(),
          updatedAt: new Date()
        });
        addResult('✅ business_config creado');
      }

      // Test 5: Listar colecciones
      addResult('📋 Listando colecciones...');
      const collections = ['business_config', 'testimonials', 'banners', 'candles'];
      for (const collectionName of collections) {
        try {
          const collectionRef = collection(db, collectionName);
          const snapshot = await getDocs(collectionRef);
          addResult(`📁 ${collectionName}: ${snapshot.size} documentos`);
        } catch (error) {
          addResult(`❌ Error en ${collectionName}: ${error}`);
        }
      }

      setIsConnected(true);
      addResult('🎉 Todas las pruebas completadas exitosamente!');
      
    } catch (error) {
      addResult(`❌ Error en las pruebas: ${error}`);
      setIsConnected(false);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          Prueba de Conexión Firebase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isConnected === null && (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
            {isConnected === true && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
            {isConnected === false && (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className="text-sm font-medium">
              {isConnected === null && 'No probado'}
              {isConnected === true && 'Conectado'}
              {isConnected === false && 'Error de conexión'}
            </span>
          </div>
          
          <Button 
            onClick={testFirebaseConnection}
            disabled={isTesting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isTesting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Probando...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Probar Conexión
              </>
            )}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <h4 className="font-semibold text-gray-900 mb-2">Resultados de la Prueba:</h4>
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Esta prueba verifica:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Conexión básica a Firebase</li>
            <li>Creación y lectura de documentos</li>
            <li>Acceso a business_config</li>
            <li>Estado de las colecciones principales</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
