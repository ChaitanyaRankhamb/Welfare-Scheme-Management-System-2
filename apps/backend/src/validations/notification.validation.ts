import { z } from "zod";

export const createNotificationSchema = z.object({
  body: z.object({
    schemeId: z.string().optional(),
    type: z.enum(["scheme_match", "system"]).default("system"),
    title: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(1000),
    data: z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      benefits: z.array(z.string()).default([]),
      requiredDocuments: z.array(z.string()).default([]),
      applicationUrl: z.string().url().or(z.literal("")),
      username: z.string().optional(),
    }),
    workflowId: z.string().trim().min(1),
  }),
});

export const notificationIdSchema = z.object({
  params: z.object({
    id: z.string().trim().min(1, "Notification ID is required"),
  }),
});
