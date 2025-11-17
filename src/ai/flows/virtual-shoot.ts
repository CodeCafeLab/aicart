'use server';

/**
 * @fileOverview A virtual shoot generation flow that combines models, apparel, and scenes.
 *
 * - generateVirtualShoot - A function that handles the virtual shoot generation process.
 * - GenerateVirtualShootInput - The input type for the generateVirtualShoot function.
 * - GenerateVirtualShootOutput - The return type for the generateVirtualShoot function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const GenerateVirtualShootInputSchema = z.object({
  modelImage: z.string().optional().describe(
    "A photo of a model, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
  modelPrompt: z.string().optional().describe('A text description of the desired model.'),
  apparelImage: z.string().optional().describe(
    "A photo of an apparel item, as a data URI that must include a MIME type and use Base64 encoding."
  ),
  apparelPrompt: z.string().optional().describe('A text description of the apparel.'),
  scenePrompt: z.string().optional().describe('A text description of the desired background scene and style.'),
  numImages: z.number().default(1).describe('The number of images to generate.'),
});
export type GenerateVirtualShootInput = z.infer<typeof GenerateVirtualShootInputSchema>;

export const GenerateVirtualShootOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of URLs for the generated images, returned as data URIs.'),
});
export type GenerateVirtualShootOutput = z.infer<typeof GenerateVirtualShootOutputSchema>;

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
