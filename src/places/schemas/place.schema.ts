import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlaceCategory } from '../enums/place-category.enum';
import { PlaceStatus } from '../enums/place-status.enum';
import { Document } from 'mongoose';
import { Record } from '@sinclair/typebox';

@Schema({
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform: (_doc, obj: Record<string, any>) => {
      obj.id = obj._id.toString();
      delete obj._id;
      return obj;
    },
  },
})
export class Place extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: PlaceCategory })
  category: PlaceCategory;

  @Prop({ required: true })
  address: string;

  @Prop({ type: [String], default: [] })
  services: string[];

  @Prop({ enum: PlaceStatus, default: PlaceStatus.ACTIVE })
  status: PlaceStatus;

  @Prop({ type: Number, default: null })
  averageRating: number | null;

  @Prop({ default: 0 })
  reviewCount: number;

  // timestamps s'occupe du createdAt et updatedAt
  createdAt: Date;
  updatedAt: Date;
}

export const PlaceSchema = SchemaFactory.createForClass(Place);
