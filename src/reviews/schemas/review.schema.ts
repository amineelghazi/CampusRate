import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
export class Review extends Document {
  @Prop({ required: true })
  placeId: string;

  @Prop({ required: true })
  authorName: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  // timestamps s'occupe du createdAt et updatedAt
  createdAt: Date;
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Allows us to find the reviews quickly and it filters them by date
ReviewSchema.index({ placeId: 1, createdAt: 1})