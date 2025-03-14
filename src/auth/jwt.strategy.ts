import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { isDivisibleBy } from 'class-validator';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { where } from 'sequelize';
import { PrismaService } from '../prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: configService.get('JWT_SECRET'),
    });

    console.log('JWT_SECRET:', configService.get('JWT_SECRET'));
  }

  async validate({ id }: Pick<User, 'id'>) {
    return this.prisma.user.findUnique({ where: { id: Number(id) } });
  }
}
