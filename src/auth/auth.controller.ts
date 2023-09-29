import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AccessTokenGuard, RefreshTokenGuard } from './guards';
import { GetCurrentUser, GetCurrentUserId } from './decorators';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @HttpCode(HttpStatus.CREATED)
    signup(@Body() authDto: CreateAuthDto): Promise<Tokens> {
        return this.authService.signup(authDto);
    }

    @Post('signin')
    @HttpCode(HttpStatus.OK)
    signin(@Body() authDto: CreateAuthDto): Promise<Tokens> {
        return this.authService.signin(authDto);
    }

    @UseGuards(AccessTokenGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: number): Promise<boolean> {
        return this.authService.logout(userId);
    }

    @UseGuards(RefreshTokenGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(
        @GetCurrentUserId() userId: number,
        @GetCurrentUser('refreshToken') refreshToken: string,
    ): Promise<Tokens> {
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
