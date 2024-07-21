import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import * as process from 'process';
import { AuthModule } from './auth/auth.module';
import { LessonsModule } from './lessons/lessons.module';
import { PrismaService } from './prisma.service';
import { StudentsModule } from './students/students.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'redis',
      port: 6379,
    }),
    StudentsModule,
    LessonsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
