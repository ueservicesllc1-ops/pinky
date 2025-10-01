#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Desplegando reglas de Firebase...\n');

// Verificar que Firebase CLI esté instalado
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI encontrado');
} catch (error) {
  console.error('❌ Firebase CLI no está instalado. Instálalo con:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Verificar que estamos logueados en Firebase
try {
  execSync('firebase projects:list', { stdio: 'pipe' });
  console.log('✅ Autenticado en Firebase');
} catch (error) {
  console.error('❌ No estás logueado en Firebase. Ejecuta:');
  console.error('firebase login');
  process.exit(1);
}

// Verificar que los archivos de reglas existen
const firestoreRulesPath = path.join(__dirname, 'firestore.rules');
const storageRulesPath = path.join(__dirname, 'storage.rules');

if (!fs.existsSync(firestoreRulesPath)) {
  console.error('❌ Archivo firestore.rules no encontrado');
  process.exit(1);
}

if (!fs.existsSync(storageRulesPath)) {
  console.error('❌ Archivo storage.rules no encontrado');
  process.exit(1);
}

console.log('✅ Archivos de reglas encontrados');

try {
  // Desplegar reglas de Firestore
  console.log('\n📊 Desplegando reglas de Firestore...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Reglas de Firestore desplegadas');

  // Desplegar reglas de Storage
  console.log('\n💾 Desplegando reglas de Storage...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  console.log('✅ Reglas de Storage desplegadas');

  console.log('\n🎉 ¡Todas las reglas han sido desplegadas exitosamente!');
  console.log('\n📋 Resumen:');
  console.log('• Firestore: Lectura pública, escritura permitida');
  console.log('• Storage: Lectura pública, escritura/eliminación permitida');
  console.log('\n⚠️  Recuerda que estas reglas son para desarrollo.');
  console.log('   En producción, implementa autenticación de usuarios.');

} catch (error) {
  console.error('\n❌ Error desplegando las reglas:', error.message);
  console.log('\n🔧 Solución manual:');
  console.log('1. Ve a https://console.firebase.google.com/');
  console.log('2. Selecciona tu proyecto mysetlistapp-bb4c6');
  console.log('3. Ve a Firestore Database > Rules y copia el contenido de firestore.rules');
  console.log('4. Ve a Storage > Rules y copia el contenido de storage.rules');
  console.log('5. Haz clic en "Publish" en ambos lugares');
  process.exit(1);
}
