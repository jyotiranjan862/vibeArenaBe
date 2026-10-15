import { Request, Response, NextFunction } from 'express';
import { MessageService, messageService } from './message.service';
import { ApiResponse } from '../../utils/api-response';
import { HttpStatus } from '../../constants';

export class MessageController {
  constructor(private readonly messageSvc: MessageService = messageService) {}

  public send = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const senderId = (req.headers['x-user-id'] as string) || (req.body.senderId as string);
      const { chatId, content, type, mediaUrl } = req.body;

      const message = await this.messageSvc.sendMessage(senderId, chatId, content, type, mediaUrl);
      ApiResponse.success({
        res,
        statusCode: HttpStatus.CREATED,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  public getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chatId = req.query.chatId as string;
      const limit = Number(req.query.limit) || 30;
      const beforeCursor = req.query.beforeCursor as string | undefined;

      const result = await this.messageSvc.getChatMessages(chatId, limit, beforeCursor);
      ApiResponse.success({
        res,
        message: 'Messages retrieved',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.headers['x-user-id'] as string) || (req.body.userId as string);
      const { chatId } = req.params;

      await this.messageSvc.markChatAsRead(chatId as string, userId);
      ApiResponse.success({
        res,
        message: 'Chat marked as read',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const messageController = new MessageController();
