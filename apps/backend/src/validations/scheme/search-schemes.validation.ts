import { z } from 'zod';

/**
 * @description Validation schema for searching schemes
 */
export const searchSchemesValidation = z.object({
  query: z.object({
    keyword: z.string().optional(),
    category: z.enum([
      'Agriculture',
      'Education',
      'Health',
      'Housing',
      'Finance',
      'Social Welfare',
      'Employment',
      'Other'
    ]).optional(),
    state: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});
