import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ default: Date.now })
  date_of_upload: Date;

  @Prop({ required: true })
  size_of_file: number;

  @Prop({ required: true })
  format_of_file: string;

  @Prop({ type: [String], required: true })
  search_term: string[];
}

export const FileSchema = SchemaFactory.createForClass(File);