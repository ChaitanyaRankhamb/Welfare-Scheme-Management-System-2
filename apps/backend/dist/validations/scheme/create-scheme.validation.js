"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchemeValidation = void 0;
const zod_1 = require("zod");
/**
 * @description Validation schema for creating a new scheme
 */
exports.createSchemeValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(5).max(200),
        description: zod_1.z.string().min(20),
        ministry: zod_1.z.string(),
        category: zod_1.z.enum([
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
        tags: zod_1.z.array(zod_1.z.string()).min(1),
        state: zod_1.z.string(),
        eligibilityCriteria: zod_1.z.object({
            age: zod_1.z.object({
                min: zod_1.z.number().min(0).optional(),
                max: zod_1.z.number().min(0).optional(),
            }).optional(),
            income: zod_1.z.object({
                min: zod_1.z.number().min(0).optional(),
                max: zod_1.z.number().min(0).optional(),
            }).optional(),
            gender: zod_1.z.enum(['male', 'female', 'any']).optional(),
            location: zod_1.z.object({
                country: zod_1.z.string().optional(),
                states: zod_1.z.array(zod_1.z.string()).optional(),
                districts: zod_1.z.array(zod_1.z.string()).optional(),
                ruralOnly: zod_1.z.boolean().optional(),
                urbanOnly: zod_1.z.boolean().optional(),
            }).optional(),
            social: zod_1.z.object({
                religion: zod_1.z.array(zod_1.z.string()).optional(),
                caste: zod_1.z.array(zod_1.z.string()).optional(),
                minority: zod_1.z.boolean().optional(),
                disability: zod_1.z.boolean().optional(),
            }).optional(),
            employment: zod_1.z.object({
                occupations: zod_1.z.array(zod_1.z.string()).optional(),
                employmentStatus: zod_1.z.array(zod_1.z.enum([
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
        benefits: zod_1.z.array(zod_1.z.string()).min(1),
        documentsRequired: zod_1.z.array(zod_1.z.string()).min(1),
        applicationUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional(),
        status: zod_1.z.enum(['drafted', 'published', 'archived']).default('drafted'),
    }),
});
