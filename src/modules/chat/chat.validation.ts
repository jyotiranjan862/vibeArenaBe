import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createDirectChatSchema = z.object({
  recipientId: z.string().regex(objectIdRegex, 'Invalid recipient ID'),
});

export const createGroupChatSchema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters').max(100),
  participantIds: z
    .array(z.string().regex(objectIdRegex, 'Invalid participant ID'))
    .min(2, 'A group chat must have at least 2 other participants'),
});

export const chatIdParamSchema = z.object({
  chatId: z.string().regex(objectIdRegex, 'Invalid chat ID'),
});
