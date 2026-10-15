import { Router } from 'express';
import { chatController } from './chat.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { createDirectChatSchema, createGroupChatSchema, chatIdParamSchema } from './chat.validation';

const router = Router();

router.get('/', chatController.getUserChats);

router.post(
  '/direct',
  validateRequest({ body: createDirectChatSchema }),
  chatController.createDirect
);

router.post(
  '/group',
  validateRequest({ body: createGroupChatSchema }),
  chatController.createGroup
);

router.get(
  '/:chatId',
  validateRequest({ params: chatIdParamSchema }),
  chatController.getChatById
);

export const chatRoutes = router;
