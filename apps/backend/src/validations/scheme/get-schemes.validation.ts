import { z } from 'zod';

/**
 * @description Validation schema for fetching all schemes with pagination
 */
export const getSchemesValidation = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
