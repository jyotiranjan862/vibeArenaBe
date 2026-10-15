import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const sendMessageSchema = z.object({
  chatId: z.string().regex(objectIdRegex, 'Invalid chat ID'),
  content: z.string().min(1, 'Message content cannot be empty').max(4000),
  type: z.enum(['text', 'image', 'file']).default('text'),
  mediaUrl: z.string().url().optional(),
});

export const getMessagesQuerySchema = z.object({
  chatId: z.string().regex(objectIdRegex, 'Invalid chat ID'),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(parseInt(val, 10) || 30, 100) : 30)),
  beforeCursor: z.string().datetime().optional(),
});
