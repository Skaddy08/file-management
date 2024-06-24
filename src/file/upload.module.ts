import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadService } from './services/upload.service';
import { UploadController } from './controllers/upload.controller';
import { File, FileSchema } from './schemas/file.schema';
import { UserUploads, UserUploadsSchema } from './schemas/user-uploads.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }, {name: UserUploads.name, schema: UserUploadsSchema}])],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
