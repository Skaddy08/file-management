import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class UserUploads {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'File' }] })
  fileIds: Types.ObjectId[];
}

export type UserUploadsDocument = UserUploads & Document;

export const UserUploadsSchema = SchemaFactory.createForClass(UserUploads);

