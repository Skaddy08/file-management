import { Injectable} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && await this.userService.comparePasswords(pass, user.password)) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user._id };
    const accessToken = this.jwtService.sign(payload, {expiresIn: '2h'});
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.userService.addRefreshToken(user._id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(username: string, email: string, password: string): Promise<User> {
    return this.userService.create(username, email, password);
  }

  async logout(userId: string, refreshToken: string) {
    await this.userService.removeRefreshToken(userId, refreshToken);
  }
}