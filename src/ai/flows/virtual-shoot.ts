'use server';

/**
 * @fileOverview A virtual shoot generation flow that combines models, apparel, and scenes.
 *
 * - generateVirtualShoot - A function that handles the virtual shoot generation process.
 */

import { ai } from '@/ai/genkit';
import {
    GenerateVirtualShootInputSchema,
    GenerateVirtualShootOutputSchema,
    type GenerateVirtualShootInput,
    type GenerateVirtualShootOutput,
} from './virtual-shoot-schemas';


export async function generateVirtualShoot(input: GenerateVirtualShootInput): Promise<GenerateVirtualShootOutput> {
  return virtualShootFlow(input);
}

const virtualShootFlow = ai.defineFlow(
  {
    name: 'virtualShootFlow',
    inputSchema: GenerateVirtualShootInputSchema,
    outputSchema: GenerateVirtualShootOutputSchema,
  },
  async (input) => {
    const { modelImage, modelPrompt, apparelImage, apparelPrompt, scenePrompt, numImages } = input;

    let fullPrompt = "Generate a photorealistic image for a fashion shoot. ";

    const promptParts: any[] = [];
    
    // Model handling
    if (modelImage) {
        promptParts.push({ media: { url: modelImage } });
        promptParts.push({ text: "Use the model from this image. "});
    }
    if (modelPrompt) {
        promptParts.push({ text: `The model should be: ${modelPrompt}. `});
    }

    // Apparel handling
    if (apparelImage) {
        promptParts.push({ media: { url: apparelImage } });
        promptParts.push({ text: "The model should be wearing the apparel from this image. "});
    }
    if (apparelPrompt) {
        promptParts.push({ text: `The apparel is: ${apparelPrompt}. `});
    }

    // Scene handling
    if (scenePrompt) {
        promptParts.push({ text: `The scene is: ${scenePrompt}. `});
    } else {
        promptParts.push({ text: "The background should be a clean, minimalist studio setting." });
    }

    promptParts.push({ text: "The final image should be high-quality, professional, and ready for an e-commerce website." });

    const generatedImages: string[] = [];
    for (let i = 0; i < numImages; i++) {
        const { media } = await ai.generate({
          prompt: promptParts,
          model: 'googleai/gemini-1.5-flash-latest', // Using a powerful multi-modal model
           config: {
              responseModalities: ['TEXT', 'IMAGE'],
            },
        });
        if (media.url) {
            generatedImages.push(media.url);
        }
    }

    return {
      imageUrls: generatedImages,
    };
  }
);
