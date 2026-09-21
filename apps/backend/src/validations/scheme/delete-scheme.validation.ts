import { z } from 'zod';

/**
 * @description Validation schema for deleting a scheme
 */
export const deleteSchemeValidation = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
  }),
});
