import http from 'http';
import { app } from './app';
import { config } from './config';
import { database } from './database';
import { logger } from './utils/logger';
import { socketGateway } from './modules/socket/socket.server';

const server = http.createServer(app);

// Attach Socket.io / WebSocket Gateway
socketGateway.initialize(server);

async function startServer(): Promise<void> {
  try {
    // 1. Establish Database Connection
    await database.connect();

    // 2. Start HTTP Server Listener
    server.listen(config.PORT, () => {
      logger.info(
        `🚀 VibeArena Backend running in [${config.NODE_ENV}] mode on port [${config.PORT}]`
      );
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start application server');
    process.exit(1);
  }
}

// Graceful Shutdown Handler
async function gracefulShutdown(signal: string): Promise<void> {
  logger.info(`Received ${signal}. Commencing graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed');
    await database.disconnect();
    logger.info('Graceful shutdown completed successfully');
    process.exit(0);
  });

  // Force shutdown after timeout if pending operations hang
  setTimeout(() => {
    logger.error('Forced shutdown invoked: timeout reached');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception thrown');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled Rejection detected');
  process.exit(1);
});

startServer();
