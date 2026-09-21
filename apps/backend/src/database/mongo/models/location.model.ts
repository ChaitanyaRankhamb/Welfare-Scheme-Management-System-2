import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  state: string;
  district: string;
  taluka: string;
  village: string;
}

const locationSchema = new Schema<ILocation>({
  state: { type: String, required: true },
  district: { type: String, required: true },
  taluka: { type: String, required: true },
  village: { type: String, required: true },
});

// Using 'village_data' as the collection name
export const LocationModel = mongoose.model<ILocation>('Location', locationSchema, 'village_data');
