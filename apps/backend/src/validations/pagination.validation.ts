import { z } from 'zod';

/**
 * @description Common pagination validation schema
 */
export const paginationSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});
