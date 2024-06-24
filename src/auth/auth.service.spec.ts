import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/schemas/user.schema';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    comparePasswords: jest.fn(),
    create: jest.fn(),
    addRefreshToken: jest.fn(),
    removeRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user data excluding password if validation is successful', async () => {
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        toObject: jest.fn().mockReturnValue({
          _id: '123',
          username: 'testuser',
          email: 'test@example.com',
        }),
      };
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      mockUserService.comparePasswords.mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
      });
    });

    it('should return null if validation fails', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return accessToken and refreshToken', async () => {
      const user = { _id: '123', username: 'testuser' };
      mockJwtService.sign
        .mockReturnValueOnce('accessToken')
        .mockReturnValueOnce('refreshToken');
      mockUserService.addRefreshToken.mockResolvedValue(undefined);

      const result = await authService.login(user);
      expect(result).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(mockUserService.addRefreshToken).toHaveBeenCalledWith(user._id, 'refreshToken');
    });
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const userDto = { username: 'testuser', email: 'test@example.com', password: 'password' };
      const mockUser = {
        _id: '123',
        username: 'testuser',
        email: 'test@example.com',
      };
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await authService.register(userDto.username, userDto.email, userDto.password);
      expect(result).toEqual(mockUser);
      expect(mockUserService.create).toHaveBeenCalledWith(userDto.username, userDto.email, userDto.password);
    });
  });

  describe('logout', () => {
    it('should remove refreshToken for the user', async () => {
      const userId = '123';
      const refreshToken = 'refreshToken';
      mockUserService.removeRefreshToken.mockResolvedValue(undefined);

      await authService.logout(userId, refreshToken);
      expect(mockUserService.removeRefreshToken).toHaveBeenCalledWith(userId, refreshToken);
    });
  });
});