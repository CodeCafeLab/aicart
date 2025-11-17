'use server';

/**
 * @fileOverview This file defines the Genkit flow for scene styling with AI, allowing users to generate scenes,
 * suggest moods, lighting, props, storylines, and camera suggestions from text prompts.
 *
 * - `sceneStylingWithAI` - The main function that orchestrates the scene styling process.
 * - `SceneStylingWithAIInput` - The input type for the `sceneStylingWithAI` function.
 * - `SceneStylingWithAIOutput` - The output type for the `sceneStylingWithAI` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneStylingWithAIInputSchema = z.object({
  prompt: z.string().describe('A text prompt describing the desired scene.'),
});
export type SceneStylingWithAIInput = z.infer<typeof SceneStylingWithAIInputSchema>;

const SceneStylingWithAIOutputSchema = z.object({
  sceneDescription: z.string().describe('A detailed description of the generated scene.'),
  moodSuggestions: z.array(z.string()).describe('Suggestions for the mood of the scene.'),
  lightingSuggestions: z.string().describe('Suggestions for the lighting in the scene.'),
  propSuggestions: z.array(z.string()).describe('Suggestions for props to include in the scene.'),
  storylineSuggestions: z.string().describe('Suggestions for a storyline for the shoot.'),
  cameraSuggestions: z.string().describe('Suggestions for camera angles and settings.'),
});
export type SceneStylingWithAIOutput = z.infer<typeof SceneStylingWithAIOutputSchema>;

export async function sceneStylingWithAI(input: SceneStylingWithAIInput): Promise<SceneStylingWithAIOutput> {
  return sceneStylingWithAIFlow(input);
}

const sceneStylingWithAIPrompt = ai.definePrompt({
  name: 'sceneStylingWithAIPrompt',
  input: {schema: SceneStylingWithAIInputSchema},
  output: {schema: SceneStylingWithAIOutputSchema},
  prompt: `You are an AI Art Director that can style scenes for virtual photoshoots based on a text prompt.

  Based on the prompt, generate a scene description, mood suggestions, lighting suggestions, prop suggestions, storyline suggestions, and camera suggestions.

  Prompt: {{{prompt}}}
  `,
});

const sceneStylingWithAIFlow = ai.defineFlow(
  {
    name: 'sceneStylingWithAIFlow',
    inputSchema: SceneStylingWithAIInputSchema,
    outputSchema: SceneStylingWithAIOutputSchema,
  },
  async input => {
    const {output} = await sceneStylingWithAIPrompt(input);
    return output!;
  }
);
