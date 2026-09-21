import { z } from 'zod';

/**
 * @description Validation schema for updating a scheme
 */
export const updateSchemeValidation = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Scheme ID format'),
  }),
  body: z.object({
    title: z.string().min(5).max(200).optional(),
    description: z.string().min(20).optional(),
    ministry: z.string().optional(),
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
    ]).optional(),
    tags: z.array(z.string()).min(1).optional(),
    state: z.string().optional(),
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
      }).optional(),
    }).optional(),
    benefits: z.array(z.string()).min(1).optional(),
    documentsRequired: z.array(z.string()).min(1).optional(),
    applicationUrl: z.string().url().or(z.literal('')).optional(),
    // Updated scheme status system: active/deactive → drafted/published/archived
    status: z.enum(['drafted', 'published', 'archived']).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }),
});
