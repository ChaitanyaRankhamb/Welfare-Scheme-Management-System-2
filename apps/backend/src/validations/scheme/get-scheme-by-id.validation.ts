import { z } from 'zod';

/**
 * @description Validation schema for fetching a scheme by ID
 */
export const getSchemeByIdValidation = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
  }),
});
