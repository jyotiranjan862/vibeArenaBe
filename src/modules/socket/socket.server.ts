import { Server as HttpServer } from 'http';
import { logger } from '../../utils/logger';

export class SocketGateway {
  private static instance: SocketGateway;

  private constructor() {}

  public static getInstance(): SocketGateway {
    if (!SocketGateway.instance) {
      SocketGateway.instance = new SocketGateway();
    }
    return SocketGateway.instance;
  }

  public initialize(_server: HttpServer): void {
    logger.info('Real-time Socket Gateway registered on HTTP server');
    // Once socket.io or ws is installed, attach socket server listener here
  }
}

export const socketGateway = SocketGateway.getInstance();
