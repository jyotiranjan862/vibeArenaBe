import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors';
import { ApiResponse } from '../utils/api-response';
import { logger } from '../utils/logger';
import { HttpStatus } from '../constants';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    logger.warn({
      path: req.originalUrl,
      method: req.method,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });

    ApiResponse.error({
      res,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  // Handle Mongoose Duplicate Key Error (E11000)
  if ((err as { code?: number }).code === 11000) {
    logger.warn({ path: req.originalUrl, method: req.method }, 'Database duplicate key conflict');
    ApiResponse.error({
      res,
      statusCode: HttpStatus.CONFLICT,
      message: 'Resource with given unique identifier already exists',
    });
    return;
  }

  // Handle Unhandled Internal Exceptions
  logger.error(
    {
      err,
      path: req.originalUrl,
      method: req.method,
    },
    'Unhandled server exception'
  );

  ApiResponse.error({
    res,
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'An unexpected internal error occurred',
  });
};
