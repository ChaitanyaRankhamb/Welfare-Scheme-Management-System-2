import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    schemeId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
  }),
});

export const applicationIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Application ID format'),
  }),
});
