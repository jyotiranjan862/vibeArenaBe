import { Request, Response, NextFunction } from 'express';
import { UserService, userService } from './user.service';
import { ApiResponse } from '../../utils/api-response';

export class UserController {
  constructor(private readonly userSvc: UserService = userService) {}

  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userSvc.getUserProfile(req.params.id as string);
      ApiResponse.success({
        res,
        message: 'User profile retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = (req.query.q as string) || '';
      const limit = Number(req.query.limit) || 20;
      const users = await this.userSvc.searchUsers(query, limit);

      ApiResponse.success({
        res,
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
