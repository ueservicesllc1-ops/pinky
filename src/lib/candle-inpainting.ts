// Servicio de IA para combinar fotos de velas reales + texto del cliente
// Usa técnicas de inpainting para agregar texto naturalmente a las velas

export interface CandleInpaintingParams {
  candleImageUrl: string; // URL de tu foto de vela real
  text: string;           // Texto que quiere el cliente
  textPosition?: 'center' | 'top' | 'bottom';
  fontStyle?: 'elegant' | 'modern' | 'classic' | 'bold';
  textColor?: string;
}

export async function addTextToCandle(params: CandleInpaintingParams): Promise<string> {
  try {
    console.log('Agregando texto a vela real:', params);
    
    // Por ahora simulamos el proceso, pero aquí iría la IA real
    // En producción, esto usaría Stable Diffusion Inpainting o similar
    
    const result = await processCandleWithText(params);
    return result;
  } catch (error) {
    console.error('Error agregando texto a vela:', error);
    throw new Error('No se pudo personalizar la vela');
  }
}

async function processCandleWithText(params: CandleInpaintingParams): Promise<string> {
  // Simulamos el proceso de inpainting
  // En una implementación real, aquí iría:
  // 1. Cargar la imagen de la vela
  // 2. Detectar el área donde agregar el texto
  // 3. Usar Stable Diffusion Inpainting para agregar el texto
  // 4. Retornar la imagen final
  
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simular procesamiento
  
  // Por ahora retornamos la imagen original (en producción sería la procesada)
  return params.candleImageUrl;
}

// Función para detectar el área óptima para el texto en la vela
export function detectTextArea(candleImageUrl: string): Promise<{x: number, y: number, width: number, height: number}> {
  // Esta función detectaría automáticamente dónde colocar el texto
  // usando visión por computadora o IA
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Por ahora retornamos un área central por defecto
      resolve({
        x: 0.25,      // 25% desde la izquierda
        y: 0.4,       // 40% desde arriba
        width: 0.5,   // 50% del ancho
        height: 0.2   // 20% del alto
      });
    }, 1000);
  });
}

// Función para generar el prompt de inpainting
export function generateInpaintingPrompt(params: CandleInpaintingParams): string {
  const { text, fontStyle = 'elegant', textColor = 'gold' } = params;
  
  let stylePrompt = '';
  switch (fontStyle) {
    case 'elegant':
      stylePrompt = 'elegant, cursive, sophisticated typography';
      break;
    case 'modern':
      stylePrompt = 'modern, clean, minimalist typography';
      break;
    case 'classic':
      stylePrompt = 'classic, traditional, serif typography';
      break;
    case 'bold':
      stylePrompt = 'bold, strong, impactful typography';
      break;
  }
  
  return `Add the text "${text}" to the candle using ${stylePrompt} in ${textColor} color, engraved into the wax naturally, with realistic shadows and depth, professional quality, seamless integration`;
}

// Función para usar Hugging Face Inpainting (gratis)
export async function useHuggingFaceInpainting(params: CandleInpaintingParams): Promise<string> {
  try {
    // Convertir imagen a base64
    const imageBase64 = await imageToBase64(params.candleImageUrl);
    
    // Detectar área para texto
    const textArea = await detectTextArea(params.candleImageUrl);
    
    // Crear máscara para inpainting
    const mask = createTextMask(textArea, params.text);
    
    // Generar prompt
    const prompt = generateInpaintingPrompt(params);
    
    // Llamar a Hugging Face Inpainting API
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-inpainting', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token gratuito
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          image: imageBase64,
          mask: mask,
          prompt: prompt,
        },
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Error en Hugging Face Inpainting API');
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    
    return imageUrl;
  } catch (error) {
    console.error('Error con Hugging Face Inpainting:', error);
    // Fallback a imagen original
    return params.candleImageUrl;
  }
}

// Función auxiliar para convertir imagen a base64
async function imageToBase64(imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

// Función para crear máscara de texto
function createTextMask(textArea: {x: number, y: number, width: number, height: number}, text: string): string {
  // Crear una máscara que defina dónde agregar el texto
  // Esta sería una imagen en blanco y negro donde el blanco indica dónde inpainting
  // Por simplicidad, retornamos una máscara básica
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
}
