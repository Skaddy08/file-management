import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from '../services/upload.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';

const mockUploadService = {
  findPaginatedByUserId: jest.fn(),
  getTotalCountByUserId: jest.fn(),
  findPaginatedBySearchTermAndUserId: jest.fn(),
  getTotalCountBySearchTermAndUserId: jest.fn(),
  create: jest.fn(),
};

describe('UploadController', () => {
  let controller: UploadController;
  let uploadService: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [{ provide: UploadService, useValue: mockUploadService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request = context.switchToHttp().getRequest();
          request.user = { userId: '1', username: 'testuser' };
          return true;
        },
      })
      .compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUploadList', () => {
    it('should call uploadService methods with correct params', async () => {
      const req = { user: { userId: '1', username: 'testuser' } } as any;
      const res = { render: jest.fn() } as any;
      const page = 1;
      const limit = 7;
      const searchTerm = 'test';

      mockUploadService.findPaginatedBySearchTermAndUserId.mockResolvedValue(
        [],
      );
      mockUploadService.getTotalCountBySearchTermAndUserId.mockResolvedValue(0);

      await controller.getUploadList(
        'testuser',
        res,
        req,
        page,
        limit,
        searchTerm,
      );

      expect(
        mockUploadService.findPaginatedBySearchTermAndUserId,
      ).toHaveBeenCalledWith('1', searchTerm, page, limit);
      expect(
        mockUploadService.getTotalCountBySearchTermAndUserId,
      ).toHaveBeenCalledWith('1', searchTerm);
      expect(res.render).toHaveBeenCalledWith('uploadList', {
        files: [],
        username: 'testuser',
        totalCount: 0,
        currentPage: page,
        totalPages: 0,
      });
    });

    it('should throw ForbiddenException if user is not the same as in param', async () => {
      const req = { user: { userId: '1', username: 'otheruser' } } as any;
      const res = { render: jest.fn() } as any;

      await expect(
        controller.getUploadList('testuser', res, req),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getUploadForm', () => {
    it("should render upload form if username matches'", async () => {
      const req = {user: {username: 'testuser'}} as any
      const res = {render: jest.fn()} as any

      await controller.getUploadForm('testuser', res, req)

      expect(res.render).toHaveBeenCalledWith('uploadForm', {username: 'testuser'})

    })

    it("should return 403 if username does not match", async () => {
      const req = {user: {username: "otherusername"}} as any
      const res = {status: jest.fn().mockReturnThis(), send: jest.fn()} as any

      await controller.getUploadForm('otheruser', res, req)

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.send).toHaveBeenCalledWith("Forbidden")
    })
  })

  describe('uploadFile', () => {
    it("should call upload.create if username matches", async () => {
      const req = {user: {userId:"1", username: "testuser"}} as any
      const res = {redirect: jest.fn()} as any
      const file = {} as Express.Multer.File
      const searchTerms = "term 1, term 2"

      await controller.uploadFile("testuser", file, searchTerms, res, req)

      expect(mockUploadService.create).toHaveBeenCalledWith(file, ['term 1', 'term 2'], '1')
      expect(res.redirect).toHaveBeenCalledWith("/testuser/uploadList/")
    })

    it('should return 403 if username does not match', async () => {
      const req = { user: { username: 'otheruser' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
      const file = {} as Express.Multer.File;
      const searchTerms = 'term1,term2';

      await controller.uploadFile('testuser', file, searchTerms, res, req);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('Forbidden');
    });
  })

  describe('search', () => {
    it("should redirect the user to search url", async () => {
      const req = {user: {username: "testuser"}} as any
      const res = {redirect: jest.fn()} as any
      const searchTerm = "searchTerm"

      await controller.searchFiles("testuser", res, searchTerm, req)
      expect(res.redirect).toHaveBeenCalledWith('/testuser/uploadList?searchTerm=searchTerm');
    })

    it('should return 403 if username does not match', async () => {
      const req = { user: { username: 'otheruser' } } as any;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as any;
      const searchTerm = 'searchTerm';

      await controller.searchFiles('testuser', res, searchTerm, req);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith('Forbidden');
    });
  })

});