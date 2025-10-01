# Script de PowerShell para desplegar reglas de Firebase
# Ejecuta este script como administrador si es necesario

Write-Host "🚀 Desplegando reglas de Firebase para Pinky Flame..." -ForegroundColor Green
Write-Host ""

# Verificar que Firebase CLI esté instalado
Write-Host "🔍 Verificando Firebase CLI..." -ForegroundColor Yellow
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase CLI encontrado: $firebaseVersion" -ForegroundColor Green
    } else {
        throw "Firebase CLI no encontrado"
    }
} catch {
    Write-Host "❌ Firebase CLI no está instalado." -ForegroundColor Red
    Write-Host "📦 Instalando Firebase CLI..." -ForegroundColor Yellow
    npm install -g firebase-tools
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase CLI instalado correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error instalando Firebase CLI" -ForegroundColor Red
        Write-Host "💡 Instala manualmente con: npm install -g firebase-tools" -ForegroundColor Cyan
        exit 1
    }
}

# Verificar login en Firebase
Write-Host ""
Write-Host "🔐 Verificando autenticación en Firebase..." -ForegroundColor Yellow
try {
    firebase projects:list 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Autenticado en Firebase" -ForegroundColor Green
    } else {
        throw "No autenticado"
    }
} catch {
    Write-Host "❌ No estás logueado en Firebase." -ForegroundColor Red
    Write-Host "🔑 Iniciando sesión..." -ForegroundColor Yellow
    firebase login
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Sesión iniciada correctamente" -ForegroundColor Green
    } else {
        Write-Host "❌ Error iniciando sesión" -ForegroundColor Red
        exit 1
    }
}

# Verificar archivos de reglas
Write-Host ""
Write-Host "📁 Verificando archivos de reglas..." -ForegroundColor Yellow
if (-not (Test-Path "firestore.rules")) {
    Write-Host "❌ Archivo firestore.rules no encontrado" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path "storage.rules")) {
    Write-Host "❌ Archivo storage.rules no encontrado" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Archivos de reglas encontrados" -ForegroundColor Green

# Desplegar reglas
Write-Host ""
Write-Host "🚀 Desplegando reglas..." -ForegroundColor Yellow

try {
    # Desplegar reglas de Firestore
    Write-Host "📊 Desplegando reglas de Firestore..." -ForegroundColor Cyan
    firebase deploy --only firestore:rules --project mysetlistapp-bb4c6
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Reglas de Firestore desplegadas" -ForegroundColor Green
    } else {
        throw "Error desplegando Firestore"
    }

    # Desplegar reglas de Storage
    Write-Host ""
    Write-Host "💾 Desplegando reglas de Storage..." -ForegroundColor Cyan
    firebase deploy --only storage --project mysetlistapp-bb4c6
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Reglas de Storage desplegadas" -ForegroundColor Green
    } else {
        throw "Error desplegando Storage"
    }

    Write-Host ""
    Write-Host "🎉 ¡Todas las reglas han sido desplegadas exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Resumen:" -ForegroundColor Yellow
    Write-Host "• Firestore: Lectura pública, escritura permitida" -ForegroundColor White
    Write-Host "• Storage: Lectura pública, escritura/eliminación permitida" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  Nota: Estas reglas son para desarrollo." -ForegroundColor Yellow
    Write-Host "   En producción, implementa autenticación de usuarios." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔗 Ve a tu proyecto: https://console.firebase.google.com/project/mysetlistapp-bb4c6" -ForegroundColor Cyan

} catch {
    Write-Host ""
    Write-Host "❌ Error desplegando las reglas: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Solución manual:" -ForegroundColor Yellow
    Write-Host "1. Ve a https://console.firebase.google.com/" -ForegroundColor White
    Write-Host "2. Selecciona tu proyecto mysetlistapp-bb4c6" -ForegroundColor White
    Write-Host "3. Ve a Firestore Database > Rules y copia el contenido de firestore.rules" -ForegroundColor White
    Write-Host "4. Ve a Storage > Rules y copia el contenido de storage.rules" -ForegroundColor White
    Write-Host "5. Haz clic en 'Publish' en ambos lugares" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✨ ¡Listo! Ahora puedes usar tu aplicación sin errores 403." -ForegroundColor Green
