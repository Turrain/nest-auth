import { Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { GoogleUser, GithubUser, YandexUser } from 'src/interfaces/auth.interfaces';
import { PrismaService } from 'src/prisma.service';
import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CookieOptions } from 'express';
import { expiresTimeTokenMilliseconds, COOKIE_NAMES } from './constants/auth.constants';
import { Response } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private configService: ConfigService,
        private jwtService: JwtService,
        private prismaService: PrismaService
    ) { }

    private async findUserByEmail(email: string) {
        const user = await this.prismaService.user.findFirst({
            where: { email }
        });

        if (!user) return null;
        return user;
    }

    setJwtTokenToCookies(@Res() res: Response, user: User) {
        const expirationDateInMilliseconds =
            new Date().getTime() + expiresTimeTokenMilliseconds;
        const cookieOptions: CookieOptions = {
            httpOnly: true, // this ensures that the cookie cannot be accessed through JavaScript!
            expires: new Date(expirationDateInMilliseconds)
        };
        
        res.cookie(
            COOKIE_NAMES.JWT,
            this.jwtService.sign({
                id: user.id,
                sub: {
                    email: user.email
                }
            }),
            cookieOptions
        );
    }
    private encodeUserDataAsJwt(user: User) {
        const { password, ...userData } = user;

        return this.jwtService.sign(userData);
    }


    private async registerGoogleUser(res: Response, user: GoogleUser) {
        try {
            const fullName =
                !user.firstName && !user.lastName
                    ? user.email
                    : `${user.lastName || ''} ${user.firstName || ''}`.trim();

            const newUser = await this.prismaService.user.create({
                data: {
                    email: user.email,
                    fullName,
                    picture: user.picture,
                },
            });

            const encodedUser = this.encodeUserDataAsJwt(newUser);

            this.setJwtTokenToCookies(res, newUser);

            return {
                encodedUser,
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
 
    async signInWithGoogle(
        user: GoogleUser,
        res: Response,
    ): Promise<{
        encodedUser: string;
    }> {
        if (!user) throw new BadRequestException('Unauthenticated');

        const existingUser = await this.findUserByEmail(user.email);

        if (!existingUser) return this.registerGoogleUser(res, user);

        const encodedUser = this.encodeUserDataAsJwt(existingUser);

        this.setJwtTokenToCookies(res, existingUser);

        return {
            encodedUser,
        };
    }

    private async registerYandexUser(res: Response, user: YandexUser) {
        try {
            const fullName =
                !user.firstName && !user.lastName
                    ? user.email
                    : `${user.lastName || ''} ${user.firstName || ''}`.trim();
    
            const newUser = await this.prismaService.user.create({
                data: {
                    email: user.email,
                    fullName,
                    picture: user.picture,
                },
            });
    
            const encodedUser = this.encodeUserDataAsJwt(newUser);
    
            this.setJwtTokenToCookies(res, newUser);
    
            return {
                encodedUser,
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    
    async signInWithYandex(
        user: YandexUser,
        res: Response,
    ): Promise<{
        encodedUser: string;
    }> {
        console.log("AAAAAAAAAAAA")
        if (!user) throw new BadRequestException('Unauthenticated');
    
        const existingUser = await this.findUserByEmail(user.email);
    
        if (!existingUser) return this.registerYandexUser(res, user);
    
        const encodedUser = this.encodeUserDataAsJwt(existingUser);
    
        this.setJwtTokenToCookies(res, existingUser);
    
        return {
            encodedUser,
        };
    }
    
    private async registerGitHubUser(res: Response, user: GithubUser) {
        try {
            const fullName =
                !user.firstName && !user.lastName
                    ? user.email
                    : `${user.lastName || ''} ${user.firstName || ''}`.trim();
    
            const newUser = await this.prismaService.user.create({
                data: {
                    email: user.email,
                    fullName,
                    picture: user.picture, // Adjusted for GitHub's naming
                },
            });
    
            const encodedUser = this.encodeUserDataAsJwt(newUser);
    
            this.setJwtTokenToCookies(res, newUser);
    
            return {
                encodedUser,
            };
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException();
        }
    }
    
    async signInWithGitHub(
        user: GithubUser,
        res: Response,
    ): Promise<{
        encodedUser: string;
    }> {
        if (!user) throw new BadRequestException('Unauthenticated');
    
        const existingUser = await this.findUserByEmail(user.email);
    
        if (!existingUser) return this.registerGitHubUser(res, user);
    
        const encodedUser = this.encodeUserDataAsJwt(existingUser);
    
        this.setJwtTokenToCookies(res, existingUser);
    
        return {
            encodedUser,
        };
    }
}
