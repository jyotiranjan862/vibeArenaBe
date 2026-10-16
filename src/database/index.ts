import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

class MongoDatabase {
  private static instance: MongoDatabase;
  private isConnected = false;

  private constructor() {
    this.setupListeners();
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }

  private setupListeners(): void {
    mongoose.connection.on('connected', () => {
      this.isConnected = true;
      logger.info('MongoDB connection successfully established');
    });

    mongoose.connection.on('error', (err) => {
      this.isConnected = false;
      logger.error({ err }, 'MongoDB connection error encountered');
    });

    mongoose.connection.on('disconnected', () => {
      this.isConnected = false;
      logger.warn('MongoDB connection disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      this.isConnected = true;
      logger.info('MongoDB reconnected successfully');
    });
  }

  public async connect(): Promise<void> {
    if (this.isConnected || mongoose.connection.readyState === 1) {
      logger.debug('MongoDB already connected');
      return;
    }

    try {
      await mongoose.connect(config.MONGODB_URI, {
        maxPoolSize: config.MONGODB_MAX_POOL_SIZE,
        minPoolSize: config.MONGODB_MIN_POOL_SIZE,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
    } catch (error) {
      logger.error({ error }, 'Failed to connect to MongoDB on startup');
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected && mongoose.connection.readyState === 0) return;
    try {
      await mongoose.connection.close();
      this.isConnected = false;
      logger.info('MongoDB connection closed gracefully');
    } catch (error) {
      logger.error({ error }, 'Error while closing MongoDB connection');
    }
  }

  public getStatus(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const mongoDatabase = MongoDatabase.getInstance();
export const database = mongoDatabase;
export { MongoDatabase };

