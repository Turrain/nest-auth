import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { Response as ExpressResponse } from 'express';
import { JwtGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { GithubOAuthGuard } from './guards/github-oauth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google')
  async googleAuth(@Req() req) {}

  @UseGuards(GoogleOAuthGuard)
  @Get('google-auth-redirect')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user,
      res,
    );
    return res.redirect(
      `${process.env.GOOGLE_REDIRECT_URL_CLIENT_REACT}?jwtUser=${encodedUser}`,
    );
  }

  @UseGuards(GithubOAuthGuard)
  @Get('github')
  async githubAuth(@Req() req) {}


  @UseGuards(GithubOAuthGuard)
  @Get('github-auth-redirect')
  async githubAuthRedirect(@Req() req, @Res() res: Response) {
    const { encodedUser } = await this.authService.signInWithGoogle(
      req.user,
      res,
    );
    return res.redirect(
      `${process.env.GITHUB_REDIRECT_URL_CLIENT_REACT}?jwtUser=${encodedUser}`,
    );
  }


  @UseGuards(JwtGuard)
  @Get('protected-route')
  async protectedAuthRoute() {
    return 'I am protected';
  }
  
}
