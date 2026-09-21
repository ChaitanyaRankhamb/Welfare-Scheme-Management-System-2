import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IDocument extends Document {
  userId: Types.ObjectId;
  documentType: string;
  originalFileName: string;
  mimeType: string;
  size: number;
  storage: {
    provider: string;
    bucket: string;
    objectKey: string;
  };
  status: string;
  uploadedAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentType: { type: String, required: true },
  originalFileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  storage: {
    provider: { type: String, required: true },
    bucket: { type: String, required: true },
    objectKey: { type: String, required: true },
  },
  status: { type: String, required: true, default: 'uploaded' },
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });

documentSchema.index({ userId: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
