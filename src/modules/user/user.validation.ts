import { z } from 'zod';

export const userSearchQuerySchema = z.object({
  q: z.string().min(1, 'Search term must contain at least 1 character').max(50),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Math.min(parseInt(val, 10) || 20, 50) : 20)),
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID format'),
});
