import { Types } from 'mongoose';
import { ChatRepository, chatRepository } from './chat.repository';
import { IChat } from './chat.model';
import { BadRequestError, NotFoundError, ForbiddenError } from '../../errors';

export class ChatService {
  constructor(private readonly chatRepo: ChatRepository = chatRepository) {}

  public async getOrCreateDirectChat(currentUserId: string, recipientId: string): Promise<IChat> {
    if (currentUserId === recipientId) {
      throw new BadRequestError('Cannot start a direct chat with yourself');
    }

    const existingChat = await this.chatRepo.findDirectChat(currentUserId, recipientId);
    if (existingChat) {
      return existingChat;
    }

    return this.chatRepo.create({
      type: 'direct',
      participants: [new Types.ObjectId(currentUserId), new Types.ObjectId(recipientId)],
    });
  }

  public async createGroupChat(adminId: string, name: string, participantIds: string[]): Promise<IChat> {
    const allParticipants = Array.from(new Set([adminId, ...participantIds])).map(
      (id) => new Types.ObjectId(id)
    );

    return this.chatRepo.create({
      type: 'group',
      name,
      adminId: new Types.ObjectId(adminId),
      participants: allParticipants,
    });
  }

  public async getUserChats(userId: string): Promise<IChat[]> {
    return this.chatRepo.findUserChats(userId);
  }

  public async getChatDetails(chatId: string, userId: string): Promise<IChat> {
    const chat = await this.chatRepo.findById(chatId);
    if (!chat) {
      throw new NotFoundError('Chat not found');
    }

    const isParticipant = chat.participants.some(
      (p) => (p as unknown as { _id?: Types.ObjectId })._id?.toString() === userId || p.toString() === userId
    );

    if (!isParticipant) {
      throw new ForbiddenError('You are not a participant of this chat');
    }

    return chat;
  }
}

export const chatService = new ChatService();
