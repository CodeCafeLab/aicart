'use server';

/**
 * @fileOverview An AI shoot generation flow.
 *
 * - generateAiShoot - A function that generates a virtual product photoshoot from a textual prompt.
 * - GenerateAiShootInput - The input type for the generateAiShoot function.
 * - GenerateAiShootOutput - The return type for the generateAiShoot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiShootInputSchema = z.object({
  prompt: z.string().describe('The textual prompt for generating the virtual product photoshoot.'),
});
export type GenerateAiShootInput = z.infer<typeof GenerateAiShootInputSchema>;

const GenerateAiShootOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});
export type GenerateAiShootOutput = z.infer<typeof GenerateAiShootOutputSchema>;

export async function generateAiShoot(input: GenerateAiShootInput): Promise<GenerateAiShootOutput> {
  return generateAiShootFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiShootPrompt',
  input: {schema: GenerateAiShootInputSchema},
  output: {schema: GenerateAiShootOutputSchema},
  prompt: `Generate a high-quality image based on the following prompt: {{{prompt}}}. The image should be suitable for product photography. Return the URL of the image.`, // Changed prompt to request a URL
});

const generateAiShootFlow = ai.defineFlow(
  {
    name: 'generateAiShootFlow',
    inputSchema: GenerateAiShootInputSchema,
    outputSchema: GenerateAiShootOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: input.prompt,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });
    return {
      imageUrl: media.url,
    };
  }
);
