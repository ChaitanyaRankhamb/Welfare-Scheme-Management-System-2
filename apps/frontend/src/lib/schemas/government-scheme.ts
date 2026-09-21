import { z } from 'zod';

export const EmploymentStatusEnum = z.enum([
  'student',
  'employed',
  'self_employed',
  'unemployed',
  'farmer',
  'laborer',
  'homemaker',
  'other'
]);

export const GovernmentSchemeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  ministry: z.string().min(1, 'Ministry is required'),
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
  tags: z.array(z.string()).default([]),
  state: z.string().min(1, 'State is required'),
  status: z.enum(['drafted', 'published', 'archived']).default('drafted'),
  benefits: z.array(z.string()).min(1, 'At least one benefit is required'),
  documentsRequired: z.array(z.string()).min(1, 'At least one document is required'),
  eligibilityCriteria: z.object({
    age: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    income: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
    }).optional(),
    gender: z.enum(['any', 'male', 'female']).default('any'),
    location: z.object({
      country: z.string().default('India'),
      states: z.array(z.string()).optional(),
      districts: z.array(z.string()).optional(),
      ruralOnly: z.boolean().default(false),
      urbanOnly: z.boolean().default(false),
    }).optional(),
    social: z.object({
      religion: z.array(z.string()).optional(),
      caste: z.array(z.string()).optional(),
      minority: z.boolean().default(false),
      disability: z.boolean().default(false),
    }).optional(),
    employment: z.object({
      occupations: z.array(z.string()).optional(),
      employmentStatus: z.array(EmploymentStatusEnum).min(1, 'At least one employment status is required'),
    }),
  }),
  applicationUrl: z.string().url().or(z.literal('')).optional(),
  trackingMeta: z.object({
    type: z.enum(['direct', 'multi_step', 'login_required', 'none']).default('none'),
    instructions: z.array(z.string()).optional(),
  }).optional(),
});

export type GovernmentSchemeFormData = z.infer<typeof GovernmentSchemeSchema>;
