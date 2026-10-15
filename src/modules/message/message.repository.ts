import { Types } from 'mongoose';
import { MessageModel, IMessage } from './message.model';

export interface CursorPaginationParams {
  chatId: string;
  limit?: number;
  beforeCursor?: string; // ISO date string of oldest message currently loaded
}

export interface CursorPaginationResult {
  messages: IMessage[];
  nextCursor: string | null;
  hasMore: boolean;
}

export class MessageRepository {
  public async create(messageData: Partial<IMessage>): Promise<IMessage> {
    const message = new MessageModel(messageData);
    return message.save();
  }

  public async findByCursor({
    chatId,
    limit = 30,
    beforeCursor,
  }: CursorPaginationParams): Promise<CursorPaginationResult> {
    const query: { chatId: Types.ObjectId; createdAt?: { $lt: Date } } = {
      chatId: new Types.ObjectId(chatId),
    };

    if (beforeCursor) {
      query.createdAt = { $lt: new Date(beforeCursor) };
    }

    // Fetch limit + 1 to detect whether there are subsequent pages without an extra count query
    const results = await MessageModel.find(query)
      .populate('senderId', 'username avatarUrl')
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean<IMessage[]>()
      .exec();

    const hasMore = results.length > limit;
    const messages = hasMore ? results.slice(0, limit) : results;

    const nextCursor =
      hasMore && messages.length > 0 ? messages[messages.length - 1]!.createdAt.toISOString() : null;

    return {
      messages,
      nextCursor,
      hasMore,
    };
  }

  public async markAsRead(chatId: string, userId: string): Promise<void> {
    await MessageModel.updateMany(
      {
        chatId: new Types.ObjectId(chatId),
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      {
        $addToSet: { readBy: new Types.ObjectId(userId) },
      }
    ).exec();
  }
}

export const messageRepository = new MessageRepository();
