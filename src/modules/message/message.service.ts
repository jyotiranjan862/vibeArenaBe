import { Types } from 'mongoose';
import { MessageRepository, messageRepository, CursorPaginationResult } from './message.repository';
import { ChatRepository, chatRepository } from '../chat/chat.repository';
import { IMessage } from './message.model';
import { NotFoundError } from '../../errors';

export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository = messageRepository,
    private readonly chatRepo: ChatRepository = chatRepository
  ) {}

  public async sendMessage(
    senderId: string,
    chatId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text',
    mediaUrl?: string
  ): Promise<IMessage> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    const message = await this.messageRepo.create({
      chatId: new Types.ObjectId(chatId),
      senderId: new Types.ObjectId(senderId),
      content,
      type,
      mediaUrl,
      readBy: [new Types.ObjectId(senderId)],
    });

    // Update conversation metadata
    await this.chatRepo.updateLastMessage(chatId, message._id.toString());

    return message;
  }

  public async getChatMessages(
    chatId: string,
    limit: number,
    beforeCursor?: string
  ): Promise<CursorPaginationResult> {
    return this.messageRepo.findByCursor({
      chatId,
      limit,
      beforeCursor,
    });
  }

  public async markChatAsRead(chatId: string, userId: string): Promise<void> {
    await this.messageRepo.markAsRead(chatId, userId);
  }
}

export const messageService = new MessageService();
