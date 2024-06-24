import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Res, Param, Req, UseGuards, Query, ForbiddenException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../services/upload.service';
import { multerConfig } from '../../config/multer.config';
import { Response, Request } from 'express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller(':username/uploadList')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get()
  async getUploadList(
    @Param('username') username: string,
    @Res() res: Response,
    @Req() req: Request,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 7,
    @Query('searchTerm') searchTerm?: string,
  ) {
    console.log(req.user)
    const currentUser = req.user;
    if (!currentUser || currentUser.username !== username) {
      throw new ForbiddenException('Forbidden');
    }

    const userId = currentUser.userId;
    
    let files;
    let totalCount;
    
    console.log(userId);
    if (searchTerm) {
      files = await this.uploadService.findPaginatedBySearchTermAndUserId(userId, searchTerm, page, limit);
      totalCount = await this.uploadService.getTotalCountBySearchTermAndUserId(userId, searchTerm);
    } else {
      console.log("In else")
      files = await this.uploadService.findPaginatedByUserId(userId, page, limit);
      totalCount = await this.uploadService.getTotalCountByUserId(userId);
    }
    
    console.log("Files:", files);

  res.render('uploadList', {
    files,
    username,
    totalCount,
    currentPage: page,
    totalPages: Math.ceil(totalCount / limit)
  });

  console.log("From the get list controller", page, Math.ceil(totalCount / limit))

  console.log("Rendered uploadList with files:", files);
  }

  @Get('uploadForm')
  async getUploadForm(@Param('username') username: string, @Res() res: Response, @Req() req: Request) {
    if (req.user.username !== username) {
      return res.status(403).send('Forbidden');
    }
    res.render('uploadForm', { username });
  }

  @Post('uploadFile')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @Param('username') username: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('searchTerms') searchTerms: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const userId = req.user._id;

    console.log(req.user);
    console.log(`This is the console log from uploadFile function ${req.user.userId}`)

    if (req.user.username !== username) {
      return res.status(403).send('Forbidden');
    }

    const searchTermArray = typeof searchTerms === 'string' ? searchTerms.split(',').map(term => term.trim()) : [];
    await this.uploadService.create(file, searchTermArray, req.user.userId);
    res.redirect(`/${username}/uploadList/`);
  }

  @Get('search')
  async searchFiles(
    @Param('username') username: string,
    @Res() res: Response,
    @Query('searchTerm') searchTerm: string,
    @Req() req: Request,
  ) {
    if (req.user.username !== username) {
      return res.status(403).send('Forbidden');
    }
    res.redirect(`/${username}/uploadList?searchTerm=${searchTerm}`);
  }
}
