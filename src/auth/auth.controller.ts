import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';
import { Tokens } from './types';
import { AuthGuard } from '@nestjs/passport';

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

    @UseGuards(AuthGuard('access-jwt'))
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logout() {
        // this.authService.logout();
    }

    @UseGuards(AuthGuard('refresh-jwt'))
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens() {
        this.authService.refreshTokens()
    }
}
