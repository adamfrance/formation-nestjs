import { z } from 'zod';

// Une suggestion d'achat, décrite par un schéma Zod au lieu d'une classe DTO
export const suggestionSchema = z.object({
  titre: z.string().min(1),
  auteur: z.string().min(1),
  pourquoi: z.string().max(200).optional(),
});

export type Suggestion = z.infer<typeof suggestionSchema>; // le type TypeScript, déduit du schéma
