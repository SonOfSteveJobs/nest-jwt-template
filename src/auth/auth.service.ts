import { PrismaService } from '@/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto';
import * as argon2 from "argon2";
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async generateTokens(userId: number, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_KEY'),
                    expiresIn: '30m'
                }
            ),
            this.jwtService.signAsync(
                {
                    id: userId,
                    email
                },
                {
                    secret: this.configService.get<string>('JWT_REFRESH_KEY'),
                    expiresIn: '30d'
                }
            )
        ])

        return {
            access_token: accessToken,
            refresh_token: refreshToken
        }
    }

    async updateRefreshTokenInDb(userId: number, refreshToken: string) {
        const hashedRefreshToken = await argon2.hash(refreshToken);
        await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                hashedRefreshToken: hashedRefreshToken
            }
        })
    }

    async updateTokens(id, email) {
        const tokens = await this.generateTokens(id, email);
        await this.updateRefreshTokenInDb(id, tokens.refresh_token);

        return tokens;
    }

    async signup(authDto: CreateAuthDto): Promise<Tokens> {
        const hashedPassword = await argon2.hash(authDto.password);

        const user = await this.prisma.user.create({
            data: {
                email: authDto.email,
                hashedPassword
            }
        });

        return this.updateTokens(user.id, user.email);
    }

    async signin(authDto: CreateAuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findUnique({
            where: {
                email: authDto.email
            }
        });

        if (!user) throw new ForbiddenException('No users with such email');

        const passwordMatch = await argon2.verify(user.hashedPassword, authDto.password);
        if (!passwordMatch) throw new ForbiddenException('Wrong password');

        return this.updateTokens(user.id, user.email);
    }

    async logout(userId: number) {
        await await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRefreshToken: {
                    not: null
                }
            },
            data: {
                hashedRefreshToken: null
            }
        })
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });

        if (!user) throw new ForbiddenException('No user');

        const refreshTokenMatch = await argon2.verify(user.hashedRefreshToken, refreshToken);

        if (!refreshTokenMatch) throw new ForbiddenException('Refresh token is invalid');

        return this.updateTokens(user.id, user.email);
    }
}
