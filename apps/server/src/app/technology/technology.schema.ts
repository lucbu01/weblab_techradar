import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TechnologyCategory, TechnologyRing } from '@techradar/libs';

export type TechnologyDocument = HydratedDocument<Technology>;

@Schema({ collection: 'technologies' })
export class Technology {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Boolean, required: true, index: true })
  published: boolean;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;

  @Prop({ type: Date, required: false })
  publishedAt?: Date;

  @Prop({ type: String, required: true })
  category: TechnologyCategory;

  @Prop({ type: String, required: false })
  ring?: TechnologyRing;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: false })
  classificationDescription?: string;
}

export const TechnologySchema = SchemaFactory.createForClass(Technology);
