import { Schema, model, Document, Types } from 'mongoose';

export type ChatType = 'direct' | 'group';

export interface IChat extends Document {
  type: ChatType;
  name?: string;
  avatarUrl?: string;
  adminId?: Types.ObjectId;
  participants: Types.ObjectId[];
  lastMessageId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'direct',
      required: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound Index: Optimizes fetching a user's chats ordered by recent activity
chatSchema.index({ participants: 1, updatedAt: -1 });

export const ChatModel = model<IChat>('Chat', chatSchema);
