import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, unique: true })
  placeId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  // timestamps s'occupe du createdAt et updatedAt
  createdAt: string;
  updatedAt: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
