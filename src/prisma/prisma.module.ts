import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, {
    provide: PrismaClient,
    useFactory: async (configService: ConfigService) => {

      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: configService.get('DATABASE_URL')
          }
        }
      });

      return prisma;
    },
    inject: [ConfigService]
  }],
  exports: [PrismaService],
  imports: [ConfigModule],
})
export class PrismaModule { }
