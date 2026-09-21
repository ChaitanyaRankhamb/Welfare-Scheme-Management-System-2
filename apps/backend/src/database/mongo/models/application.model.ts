import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IApplication extends Document {
  userId: Types.ObjectId;
  schemeId: Types.ObjectId;
  status: 'INITIATED' | 'APPLIED' | 'REJECTED';
  isDeleted: boolean;
  appliedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  schemeId: { type: Schema.Types.ObjectId, ref: 'Scheme', required: true },
  status: {
    type: String,
    enum: ['INITIATED', 'APPLIED', 'REJECTED'],
    default: 'INITIATED',
  },
  appliedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

applicationSchema.index({ userId: 1, schemeId: 1 }, { unique: true });
applicationSchema.index({ status: 1 });
applicationSchema.index({ isDeleted: 1 });

export const ApplicationModel = mongoose.model<IApplication>('Application', applicationSchema);
