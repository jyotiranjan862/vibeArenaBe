import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { HttpStatus } from '../constants';

export const globalRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: HttpStatus.TOO_MANY_REQUESTS,
    message: 'Too many requests created from this IP, please try again later.',
  },
});
