/**
 * @fileOverview Schemas for the virtual shoot generation flow.
 */
import { z } from 'zod';

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
  negativePrompt: z.string().optional().describe('Undesired qualities or artifacts to avoid in generation.'),
  numImages: z.number().default(1).describe('The number of images to generate.'),
});
export type GenerateVirtualShootInput = z.infer<typeof GenerateVirtualShootInputSchema>;

export const GenerateVirtualShootOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('An array of URLs for the generated images, returned as data URIs.'),
});
export type GenerateVirtualShootOutput = z.infer<typeof GenerateVirtualShootOutputSchema>;
