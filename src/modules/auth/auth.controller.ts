import { Request, Response, NextFunction } from 'express';
import { AuthService, authService } from './auth.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpStatus } from '../../constants';

export class AuthController {
  constructor(private readonly authSvc: AuthService = authService) {}

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.authSvc.register(req.body);
      ApiResponse.success({
        res,
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authSvc.login(req.body);
      ApiResponse.success({
        res,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
