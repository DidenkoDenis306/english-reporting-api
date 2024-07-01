import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';

import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: await hash(dto.password),
      },
    });

    const tokens = this.generateTokens(user.id);

    return {
      user: this.getUserData(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (!user) {
      throw new NotFoundException({ login: 'User not found' });
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new UnauthorizedException({ password: 'Invalid password' });
    }

    const tokens = this.generateTokens(user.id);

    return {
      user: this.getUserData(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    try {
      const result = await this.jwtService.verifyAsync(refreshToken);

      if (!result) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: Number(result.id) },
      });

      const newTokens = this.generateTokens(user.id);

      return {
        user: this.getUserData(user),
        ...newTokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private getUserData(user: User) {
    return {
      id: user.id,
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      isSpecial: user.isSpecial,
    };
  }
}
