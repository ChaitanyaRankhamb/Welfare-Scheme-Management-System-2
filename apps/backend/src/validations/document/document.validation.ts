import { z } from 'zod';

/**
 * @description Validation schema for document uploads
 */
export const documentValidationSchema = z.object({
  body: z.object({
    documentType: z.string().min(1, 'Document type is required'),
    originalFileName: z.string().min(1, 'Original file name is required'),
    mimeType: z.string().min(1, 'Mime type is required'),
    size: z.number().positive('Size must be a positive number'),
    storage: z.object({
      provider: z.string().min(1, 'Storage provider is required'),
      bucket: z.string().min(1, 'Storage bucket is required'),
      objectKey: z.string().min(1, 'Storage object key is required'),
    }),
    status: z.string().default('uploaded'),
  }),
});
