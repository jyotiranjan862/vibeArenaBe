import { Types } from 'mongoose';
import { ChatModel, IChat } from './chat.model';

export class ChatRepository {
  public async findById(id: string): Promise<IChat | null> {
    return ChatModel.findById(id)
      .populate('participants', 'username avatarUrl isOnline lastSeenAt')
      .populate('lastMessageId')
      .lean<IChat | null>()
      .exec();
  }

  public async findUserChats(userId: string, limit = 50, skip = 0): Promise<IChat[]> {
    return ChatModel.find({ participants: new Types.ObjectId(userId) })
      .populate('participants', 'username avatarUrl isOnline lastSeenAt')
      .populate('lastMessageId')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean<IChat[]>()
      .exec();
  }

  public async findDirectChat(userId1: string, userId2: string): Promise<IChat | null> {
    return ChatModel.findOne({
      type: 'direct',
      participants: { $all: [new Types.ObjectId(userId1), new Types.ObjectId(userId2)] },
    })
      .populate('participants', 'username avatarUrl isOnline lastSeenAt')
      .lean<IChat | null>()
      .exec();
  }

  public async create(chatData: Partial<IChat>): Promise<IChat> {
    const chat = new ChatModel(chatData);
    return chat.save();
  }

  public async updateLastMessage(chatId: string, messageId: string): Promise<void> {
    await ChatModel.findByIdAndUpdate(chatId, {
      $set: {
        lastMessageId: new Types.ObjectId(messageId),
        updatedAt: new Date(),
      },
    }).exec();
  }
}

export const chatRepository = new ChatRepository();
