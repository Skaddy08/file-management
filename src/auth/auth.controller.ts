import { Body, Controller, Get, Post, Res, Req, UseGuards, Render, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserService } from '../user/user.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Get('')
  @Render('home')
  showHomePage()
  {
    return;
  }

  @Get('register')
  @Render('register')
  showRegisterPage() {
    return;
  }

  @Post('register')
  async register(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response

  ) {
    const user = await this.authService.register(username, email, password);
    response.redirect("/login")
    console.log(user)
  }

  @Get('login')
  @Render('login')
  showLoginPage() {
    return;
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authService.login(user);
    response.cookie('accessToken', tokens.accessToken, { httpOnly: true });
    response.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    response.redirect(`/${user.username}/uploadList`);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const user = req.user as any;
    const refreshToken = req.cookies?.refreshToken;

    await this.authService.logout(user.userId, refreshToken);
    
    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');
    response.redirect("/")
  }
}
