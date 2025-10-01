@echo off
echo 🚀 Desplegando reglas de Firebase para Pinky Flame...
echo.

echo 🔍 Verificando Firebase CLI...
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI no está instalado.
    echo 📦 Instalando Firebase CLI...
    npm install -g firebase-tools
    if %errorlevel% neq 0 (
        echo ❌ Error instalando Firebase CLI
        echo 💡 Instala manualmente con: npm install -g firebase-tools
        pause
        exit /b 1
    )
    echo ✅ Firebase CLI instalado correctamente
) else (
    echo ✅ Firebase CLI encontrado
)

echo.
echo 🔐 Verificando autenticación en Firebase...
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ No estás logueado en Firebase.
    echo 🔑 Iniciando sesión...
    firebase login
    if %errorlevel% neq 0 (
        echo ❌ Error iniciando sesión
        pause
        exit /b 1
    )
    echo ✅ Sesión iniciada correctamente
) else (
    echo ✅ Autenticado en Firebase
)

echo.
echo 📁 Verificando archivos de reglas...
if not exist "firestore.rules" (
    echo ❌ Archivo firestore.rules no encontrado
    pause
    exit /b 1
)
if not exist "storage.rules" (
    echo ❌ Archivo storage.rules no encontrado
    pause
    exit /b 1
)
echo ✅ Archivos de reglas encontrados

echo.
echo 🚀 Desplegando reglas...

echo 📊 Desplegando reglas de Firestore...
firebase deploy --only firestore:rules --project mysetlistapp-bb4c6
if %errorlevel% neq 0 (
    echo ❌ Error desplegando Firestore
    goto :manual
)
echo ✅ Reglas de Firestore desplegadas

echo.
echo 💾 Desplegando reglas de Storage...
firebase deploy --only storage --project mysetlistapp-bb4c6
if %errorlevel% neq 0 (
    echo ❌ Error desplegando Storage
    goto :manual
)
echo ✅ Reglas de Storage desplegadas

echo.
echo 🎉 ¡Todas las reglas han sido desplegadas exitosamente!
echo.
echo 📋 Resumen:
echo • Firestore: Lectura pública, escritura permitida
echo • Storage: Lectura pública, escritura/eliminación permitida
echo.
echo ⚠️  Nota: Estas reglas son para desarrollo.
echo    En producción, implementa autenticación de usuarios.
echo.
echo 🔗 Ve a tu proyecto: https://console.firebase.google.com/project/mysetlistapp-bb4c6
echo.
echo ✨ ¡Listo! Ahora puedes usar tu aplicación sin errores 403.
pause
exit /b 0

:manual
echo.
echo 🔧 Solución manual:
echo 1. Ve a https://console.firebase.google.com/
echo 2. Selecciona tu proyecto mysetlistapp-bb4c6
echo 3. Ve a Firestore Database ^> Rules y copia el contenido de firestore.rules
echo 4. Ve a Storage ^> Rules y copia el contenido de storage.rules
echo 5. Haz clic en 'Publish' en ambos lugares
pause
exit /b 1
