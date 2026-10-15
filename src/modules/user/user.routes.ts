import { Router } from 'express';
import { userController } from './user.controller';
import { validateRequest } from '../../middlewares/validate.middleware';
import { userIdParamSchema, userSearchQuerySchema } from './user.validation';

const router = Router();

router.get(
  '/search',
  validateRequest({ query: userSearchQuerySchema }),
  userController.search
);

router.get(
  '/:id',
  validateRequest({ params: userIdParamSchema }),
  userController.getProfile
);

export const userRoutes = router;
