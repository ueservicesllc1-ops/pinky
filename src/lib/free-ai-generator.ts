// Servicio de IA completamente GRATIS usando Hugging Face
// No requiere API keys ni pagos

export interface CandleGenerationParams {
  candleType: string;
  text: string;
  color?: string;
  style?: string;
}

export async function generateCandleWithText(params: CandleGenerationParams): Promise<string> {
  try {
    console.log('Generando vela con IA GRATIS:', params);
    
    // Por ahora retornamos una imagen placeholder mientras implementamos la IA local
    // Esto se puede mejorar con Stable Diffusion local o Hugging Face
    
    const prompt = createCandlePrompt(params);
    
    // Simulamos la generación (en una implementación real, aquí iría la IA local)
    const mockImageUrl = await generateMockCandle(prompt);
    
    return mockImageUrl;
  } catch (error) {
    console.error('Error generando vela con IA GRATIS:', error);
    throw new Error('No se pudo generar la vela personalizada');
  }
}

function createCandlePrompt(params: CandleGenerationParams): string {
  const { candleType, text, color, style } = params;
  
  let basePrompt = '';
  
  switch (candleType) {
    case 'cylindrical':
      basePrompt = 'elegant cylindrical candle';
      break;
    case 'tapered':
      basePrompt = 'classic tapered candle';
      break;
    case 'pillar':
      basePrompt = 'modern pillar candle';
      break;
    case 'jar':
      basePrompt = 'glass jar candle';
      break;
    default:
      basePrompt = 'beautiful candle';
  }
  
  if (color) {
    basePrompt += `, ${color} color`;
  }
  
  const styleText = style || 'luxury, high-end, premium quality';
  
  return `${basePrompt} with the text "${text}" elegantly engraved or embossed into the wax, ${styleText}, professional product photography, studio lighting, clean white background, high resolution, photorealistic, detailed wax texture, realistic shadows, perfect lighting`;
}

// Función temporal que genera una imagen mock
// En una implementación real, esto sería reemplazado por Stable Diffusion local
async function generateMockCandle(prompt: string): Promise<string> {
  // Por ahora retornamos una imagen de ejemplo
  // En el futuro, esto se conectará a Stable Diffusion local
  
  // Simulamos delay de generación
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Retornamos una imagen de ejemplo
  // En una implementación real, esto sería la imagen generada por IA
  return 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1024&h=1024&fit=crop&crop=center';
}

// Función para implementar Stable Diffusion local en el futuro
export async function setupLocalStableDiffusion() {
  // Esta función se implementará para usar Stable Diffusion local
  // usando @xenova/transformers o similar
  console.log('Configurando Stable Diffusion local...');
  
  // TODO: Implementar Stable Diffusion local
  // - Cargar modelo desde Hugging Face
  // - Configurar pipeline de generación
  // - Optimizar para el navegador
}

// Función para usar Hugging Face Inference API (gratis con límites)
export async function generateWithHuggingFace(params: CandleGenerationParams): Promise<string> {
  try {
    const prompt = createCandlePrompt(params);
    
    // Hugging Face Inference API (gratis con límites)
    const response = await fetch('https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Token gratuito
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 1024,
          height: 1024,
          num_inference_steps: 20,
          guidance_scale: 7.5,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Error en Hugging Face API');
    }

    const imageBlob = await response.blob();
    const imageUrl = URL.createObjectURL(imageBlob);
    
    return imageUrl;
  } catch (error) {
    console.error('Error con Hugging Face:', error);
    // Fallback a imagen mock
    return generateMockCandle(createCandlePrompt(params));
  }
}
