import { Request, Response, NextFunction } from 'express';
import { ChatService, chatService } from './chat.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpStatus } from '../../constants';

export class ChatController {
  constructor(private readonly chatSvc: ChatService = chatService) {}

  public createDirect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // In production with auth middleware, currentUserId comes from req.user.id
      const currentUserId = (req.headers['x-user-id'] as string) || (req.body.currentUserId as string);
      const { recipientId } = req.body;

      const chat = await this.chatSvc.getOrCreateDirectChat(currentUserId, recipientId);
      ApiResponse.success({
        res,
        statusCode: HttpStatus.CREATED,
        message: 'Direct chat initialized',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  public createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const adminId = (req.headers['x-user-id'] as string) || (req.body.adminId as string);
      const { name, participantIds } = req.body;

      const chat = await this.chatSvc.createGroupChat(adminId, name, participantIds);
      ApiResponse.success({
        res,
        statusCode: HttpStatus.CREATED,
        message: 'Group chat created',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
      const chats = await this.chatSvc.getUserChats(userId);

      ApiResponse.success({
        res,
        message: 'User chats retrieved',
        data: chats,
      });
    } catch (error) {
      next(error);
    }
  };

  public getChatById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.headers['x-user-id'] as string) || (req.query.userId as string);
      const { chatId } = req.params;

      const chat = await this.chatSvc.getChatDetails(chatId as string, userId);
      ApiResponse.success({
        res,
        message: 'Chat details retrieved',
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const chatController = new ChatController();
