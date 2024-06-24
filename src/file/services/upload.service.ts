import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import { UserUploads, UserUploadsDocument } from '../schemas/user-uploads.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(UserUploads.name) private userUploadsModel: Model<UserUploadsDocument>,
  ) {}

  async create(file: Express.Multer.File, searchTerms: string[], userId: string): Promise<File> {
    console.log(userId);
    const userIdObject = new Types.ObjectId(userId)

    console.log(userIdObject);
    
    const createdFile = new this.fileModel({
      name: file.filename,
      path: file.path,
      size_of_file: file.size,
      format_of_file: file.mimetype,
      search_term: searchTerms,
      userId: userIdObject,
    });
    await createdFile.save();
    console.log(userIdObject);
    

    await this.userUploadsModel.updateOne(
      { userId: userIdObject },
      { $push: { fileIds: createdFile._id } },
      { upsert: true },
    );

    return createdFile;
  }

  async findAllByUserId(userId: string): Promise<File[]> {
    const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId) }).populate('fileIds').exec();
    console.log(userId)
    return userUploads ? (userUploads.fileIds as unknown as File[]) : [];
  }

  async getTotalCountByUserId(userId: string): Promise<number> {
    const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    return userUploads ? userUploads.fileIds.length : 0;
  }

  async findPaginatedByUserId(userId: string, page: number = 1, limit: number = 10): Promise<File[]> {
    // console.log("call 1");
    // const skip = (page - 1) * limit;
    // console.log('UserID:', userId);
    // const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId) }).populate({

    //   path: 'fileIds',
    //   options: { skip, limit }
    // }).exec();
    // console.log('UserUploads:', userUploads);
    // return userUploads ? (userUploads.fileIds as unknown as File[]) : [];
    console.log("Fetching files for user:", userId);
  const skip = (page - 1) * limit;

  const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId)}).populate({
    path: 'fileIds',
    model: 'File',
    options: { skip, limit }
  }).exec();

  console.log('UserUploads:', userUploads);
  if (userUploads && userUploads.fileIds) {
    const files = userUploads.fileIds as unknown as File[];
    console.log('Populated Files:', files);
    return files;
  } else {
    return [];
  }
}



  async findPaginatedBySearchTermAndUserId(userId: string, searchTerm: string, page: number = 1, limit: number = 10): Promise<File[]> {
    const skip = (page - 1) * limit;
    const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId) }).populate({
      path: 'fileIds',
      model: 'File',
      match: { search_term: searchTerm.toLocaleLowerCase() },
      options: { skip, limit }
    }).exec();
    
    if (userUploads && userUploads.fileIds) {
      const files = userUploads.fileIds as unknown as File[];
      console.log('Populated Files:', files);
      return files;
    } else {
      return [];
    }
  }

  async getTotalCountBySearchTermAndUserId(userId: string, searchTerm: string): Promise<number> {
    const userUploads = await this.userUploadsModel.findOne({ userId: new Types.ObjectId(userId) }).populate({
      path: 'fileIds',
      match: { search_term: searchTerm },

    }).exec();
    return userUploads ? (userUploads.fileIds as unknown as File[]).length : 0;
  }
}
