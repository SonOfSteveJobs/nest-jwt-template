import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() authDto: CreateAuthDto): Promise<Tokens> {
        this.authService.signup(authDto);
    }

    @Post('signin')
    signin() {
        this.authService.signin();
    }

    @Post('logout')
    logout() {
        this.authService.logout();
    }

    @Post('refresh')
    refreshTokens() {
        this.authService.refreshTokens()
    }
}
