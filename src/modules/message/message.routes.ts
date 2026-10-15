import { Router } from 'express';
import { messageController } from './message.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { sendMessageSchema, getMessagesQuerySchema } from './message.validation';
import { chatIdParamSchema } from '../chat/chat.validation';

const router = Router();

router.get(
  '/',
  validateRequest({ query: getMessagesQuerySchema }),
  messageController.getHistory
);

router.post(
  '/',
  validateRequest({ body: sendMessageSchema }),
  messageController.send
);

router.patch(
  '/:chatId/read',
  validateRequest({ params: chatIdParamSchema }),
  messageController.markAsRead
);

export const messageRoutes = router;
