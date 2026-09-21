import { z } from 'zod';

/**
 * @description Validation schema for creating a new scheme
 */
export const createSchemeValidation = z.object({
  body: z.object({
    title: z.string().min(5).max(200),
    description: z.string().min(20),
    ministry: z.string(),
    category: z.enum([
      'Agriculture',
      'Education',
      'Health',
      'Housing',
      'Finance',
      'Social Welfare',
      'Women Welfare',
      'Employment',
      'Other'
    ]),
    tags: z.array(z.string()).min(1),
    state: z.string(),
    eligibilityCriteria: z.object({
      age: z.object({
        min: z.number().min(0).optional(),
        max: z.number().min(0).optional(),
      }).optional(),
      income: z.object({
        min: z.number().min(0).optional(),
        max: z.number().min(0).optional(),
      }).optional(),
      gender: z.enum(['male', 'female', 'any']).optional(),
      location: z.object({
        country: z.string().optional(),
        states: z.array(z.string()).optional(),
        districts: z.array(z.string()).optional(),
        ruralOnly: z.boolean().optional(),
        urbanOnly: z.boolean().optional(),
      }).optional(),
      social: z.object({
        religion: z.array(z.string()).optional(),
        caste: z.array(z.string()).optional(),
        minority: z.boolean().optional(),
        disability: z.boolean().optional(),
      }).optional(),
      employment: z.object({
        occupations: z.array(z.string()).optional(),
        employmentStatus: z.array(z.enum([
          'student',
          'employed',
          'self_employed',
          'unemployed',
          'farmer',
          'laborer',
          'homemaker',
          'other'
        ])).min(1, 'At least one employmentStatus is required'),
      }),
    }),
    benefits: z.array(z.string()).min(1),
    documentsRequired: z.array(z.string()).min(1),
    applicationUrl: z.string().url().or(z.literal('')).optional(),
    status: z.enum(['drafted', 'published', 'archived']).default('drafted'),
  }),
});
