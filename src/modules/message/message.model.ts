import { Schema, model, Document, Types } from 'mongoose';

export type MessageType = 'text' | 'image' | 'file';

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  readBy: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
      required: true,
      index: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    type: {
      type: String,
      enum: ['text', 'image', 'file'],
      default: 'text',
      required: true,
    },
    mediaUrl: {
      type: String,
      default: '',
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound Index: Essential for ultra-fast, constant-time cursor-based pagination
messageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel = model<IMessage>('Message', messageSchema);
