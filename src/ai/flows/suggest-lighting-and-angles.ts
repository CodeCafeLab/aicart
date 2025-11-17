'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting lighting and camera angles for product shoots.
 *
 * The flow takes a description of the desired product shoot and returns suggestions for lighting and camera angles.
 * It exports:
 *   - suggestLightingAndAngles: The main function to call to get lighting and camera angle suggestions.
 *   - SuggestLightingAndAnglesInput: The input type for the suggestLightingAndAngles function.
 *   - SuggestLightingAndAnglesOutput: The output type for the suggestLightingAndAngles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLightingAndAnglesInputSchema = z.object({
  productDescription: z
    .string()
    .describe('A description of the product being photographed.'),
  shootDescription: z
    .string()
    .describe('A description of the desired product shoot style.'),
});
export type SuggestLightingAndAnglesInput = z.infer<
  typeof SuggestLightingAndAnglesInputSchema
>;

const SuggestLightingAndAnglesOutputSchema = z.object({
  lightingSuggestions: z
    .array(z.string())
    .describe('Suggestions for lighting the product shoot.'),
  cameraAngleSuggestions: z
    .array(z.string())
    .describe('Suggestions for camera angles for the product shoot.'),
  conceptIdeas: z
    .array(z.string())
    .describe('Suggestions for shoot concept ideas.'),
});
export type SuggestLightingAndAnglesOutput = z.infer<
  typeof SuggestLightingAndAnglesOutputSchema
>;

export async function suggestLightingAndAngles(
  input: SuggestLightingAndAnglesInput
): Promise<SuggestLightingAndAnglesOutput> {
  return suggestLightingAndAnglesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLightingAndAnglesPrompt',
  input: {schema: SuggestLightingAndAnglesInputSchema},
  output: {schema: SuggestLightingAndAnglesOutputSchema},
  prompt: `You are an AI art director specializing in product photography.  A photographer is planning a shoot and needs your creative assistance.

You are provided a description of the product and a description of the shoot.

Product Description: {{{productDescription}}}
Shoot Description: {{{shootDescription}}}

Based on the product and shoot descriptions, please provide several suggestions for lighting, camera angles, and overall concept ideas to rapidly prototype multiple shoot styles and converge on the preferred configuration. Return each suggestion in an array.

Output format: JSON
`,
});

const suggestLightingAndAnglesFlow = ai.defineFlow(
  {
    name: 'suggestLightingAndAnglesFlow',
    inputSchema: SuggestLightingAndAnglesInputSchema,
    outputSchema: SuggestLightingAndAnglesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
