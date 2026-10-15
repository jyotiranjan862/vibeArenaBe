import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { config } from './config';
import { logger } from './utils/logger';
import { database } from './database';
import { globalRateLimiter, errorHandler } from './middlewares';
import { NotFoundError } from './errors';
import { ApiResponse } from './utils/api-response';

// Route Imports
import { authRoutes } from './modules/auth';
import { userRoutes } from './modules/user';
import { chatRoutes } from './modules/chat';
import { messageRoutes } from './modules/message';

const app: Application = express();

// 1. Security & Core Middlewares
app.use(helmet());
app.use(
  cors({
    origin: config.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(compression());
app.use(
  pinoHttp({
    logger,
    autoLogging: config.NODE_ENV !== 'test',
  })
);

// 2. Request Parsers & Rate Limiter
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(globalRateLimiter);

// 3. Health Check
app.get('/health', (_req: Request, res: Response) => {
  ApiResponse.success({
    res,
    message: 'VibeArena Backend Service is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      databaseConnected: database.getStatus(),
    },
  });
});

// 4. API Domain Routes
const apiPrefix = config.API_PREFIX;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/chats`, chatRoutes);
app.use(`${apiPrefix}/messages`, messageRoutes);

// 5. 404 Route Catch-all
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError(`Resource at ${req.method} ${req.originalUrl} not found`));
});

// 6. Centralized Error Boundary
app.use(errorHandler);

export { app };
