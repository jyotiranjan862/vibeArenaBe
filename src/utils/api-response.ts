import { Response } from 'express';
import { HttpStatus, HttpStatusCode } from '../constants';

export interface ApiResponseOptions<T> {
  res: Response;
  statusCode?: HttpStatusCode;
  message?: string;
  data?: T;
}

export class ApiResponse {
  public static success<T>({
    res,
    statusCode = HttpStatus.OK,
    message = 'Success',
    data,
  }: ApiResponseOptions<T>): Response {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      ...(data !== undefined && { data }),
    });
  }

  public static error({
    res,
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    message = 'Internal Server Error',
    errors,
  }: {
    res: Response;
    statusCode?: HttpStatusCode;
    message?: string;
    errors?: unknown;
  }): Response {
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      ...(errors !== undefined && { errors }),
    });
  }
}
