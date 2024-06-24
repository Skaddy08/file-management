import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            validateUser: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {},
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('showHomePage', () => {
    it('should render home page', () => {
      expect(authController.showHomePage()).toBeUndefined();
    });
  });

  describe('showRegisterPage', () => {
    it('should render register page', () => {
      expect(authController.showRegisterPage()).toBeUndefined();
    });
  });

  describe('register', () => {
    it('should register a user and redirect to login page', async () => {
      const response = { redirect: jest.fn() } as any;
      const user: any = { id: 1, username: 'test', email: 'test@test.com', password: 'hashedpassword', refreshTokens: [] };
      jest.spyOn(authService, 'register').mockResolvedValue(user);

      await authController.register('test', 'test@test.com', 'password', response);

      expect(authService.register).toHaveBeenCalledWith('test', 'test@test.com', 'password');
      expect(response.redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('showLoginPage', () => {
    it('should render login page', () => {
      expect(authController.showLoginPage()).toBeUndefined();
    });
  });

  describe('login', () => {
    it('should login a user and set cookies', async () => {
      const response = { cookie: jest.fn(), redirect: jest.fn() } as any;
      const user: any = { id: 1, username: 'testuser', email: 'test@test.com', password: 'hashedpassword', refreshTokens: [] };
      const tokens = { accessToken: 'access_token', refreshToken: 'refresh_token' };

      jest.spyOn(authService, 'validateUser').mockResolvedValue(user);
      jest.spyOn(authService, 'login').mockResolvedValue(tokens);

      await authController.login('test@test.com', 'password', response);

      expect(authService.validateUser).toHaveBeenCalledWith('test@test.com', 'password');
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(response.cookie).toHaveBeenCalledWith('accessToken', 'access_token', { httpOnly: true });
      expect(response.cookie).toHaveBeenCalledWith('refreshToken', 'refresh_token', { httpOnly: true });
      expect(response.redirect).toHaveBeenCalledWith(`/${user.username}/uploadList`);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const response = { cookie: jest.fn(), redirect: jest.fn() } as any;
      jest.spyOn(authService, 'validateUser').mockResolvedValue(null);

      await expect(authController.login('test@test.com', 'wrong_password', response))
        .rejects
        .toThrow(new UnauthorizedException('Invalid credentials'));
    });
  });

  describe('logout', () => {
    it('should logout a user and clear cookies', async () => {
      const request: any = { user: { userId: 1 }, cookies: { refreshToken: 'refresh_token' } };
      const response = { clearCookie: jest.fn(), redirect: jest.fn() } as any;

      await authController.logout(request, response);

      expect(authService.logout).toHaveBeenCalledWith(1, 'refresh_token');
      expect(response.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(response.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(response.redirect).toHaveBeenCalledWith('/');
    });
  });
});
