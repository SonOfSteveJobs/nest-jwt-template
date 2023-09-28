import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto';
import * as argon2 from "argon2";
import { Tokens } from './types';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async signup(authDto: CreateAuthDto): Promise<Tokens> {
        const hashedPassword = await argon2.hash(authDto.password);
        const user = this.prisma.user.create({
            data: {
                email: authDto.email,
                hashedPassword
            }
        })
    }

    async signin() { }

    async logout() { }

    async refreshTokens() { }
}
