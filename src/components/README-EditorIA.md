# 🕯️ Editor de Velas con IA - Sistema Completo

## 🎯 Funcionalidades Principales

### 1. **Layout de 3 Columnas**
- **Izquierda**: Controles de texto (fuente, color, tamaño)
- **Centro**: Vista previa del canvas con Fabric.js
- **Derecha**: Plantillas de velas desde Firebase

### 2. **Detección Automática con IA**
- **Hook `useTextAreaDetection`**: Simula detección de áreas de texto
- **Análisis de imagen**: Detecta automáticamente dónde colocar el texto
- **Posicionamiento inteligente**: Coloca el texto en el área óptima

### 3. **Fusión Inteligente**
- **Botón "Fusionar"**: Crea imagen final con texto integrado
- **Vista previa final**: Muestra resultado como vela real
- **Efectos visuales**: Mejora la apariencia del resultado

## 🔧 Componentes

### `EditorVelasIA.tsx`
- Componente principal con layout de 3 columnas
- Integración con Fabric.js para manipulación de canvas
- Controles de texto en tiempo real
- Botones de IA para detección y fusión

### `useTextAreaDetection.ts`
- Hook personalizado para detección de áreas de texto
- Simula análisis de IA con delays realistas
- Retorna coordenadas y confianza de detección

### `FinalResultPreview.tsx`
- Componente para mostrar resultado final
- Efectos visuales y controles de descarga
- Botón de reset para nueva vela

## 🚀 Flujo de Trabajo

1. **Seleccionar plantilla**: Click en plantilla de la derecha
2. **Escribir texto**: Usar controles de la izquierda
3. **Detectar área**: Click "🎯 Detectar Área IA"
4. **Ajustar posición**: Si es necesario
5. **Fusionar**: Click "✨ Fusionar"
6. **Ver resultado**: Vista previa final con efectos
7. **Descargar**: Botón de descarga

## 🎨 Características Técnicas

- **Fabric.js**: Canvas interactivo para manipulación de objetos
- **Firebase**: Plantillas almacenadas en Firestore
- **IA Simulada**: Detección automática de áreas de texto
- **Responsive**: Layout adaptativo
- **Tiempo real**: Actualizaciones instantáneas

## 🔮 Próximas Mejoras

- **IA Real**: Integración con APIs de visión computacional
- **Más efectos**: Filtros y mejoras visuales
- **Plantillas dinámicas**: Carga desde admin
- **Colaboración**: Compartir diseños
- **Exportación**: Múltiples formatos

## 📱 Uso

```typescript
// En la página de personalizadas
import EditorVelasIA from '@/components/EditorVelasIA';

export default function PersonalizadasPage() {
  return <EditorVelasIA />;
}
```

## 🎯 Resultado

Sistema completo de personalización de velas con:
- ✅ Layout intuitivo de 3 columnas
- ✅ Detección automática de áreas de texto
- ✅ Fusión inteligente con IA
- ✅ Vista previa final con efectos
- ✅ Descarga de alta calidad
