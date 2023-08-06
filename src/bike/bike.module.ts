import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BikeService } from './bike.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BikeController } from './bike.controller';
import { WeatherModule } from '../weather/weather.module';

@Module({
  providers: [BikeService ],
  exports: [BikeService],
  imports: [PrismaModule, HttpModule, ConfigModule, WeatherModule],
  controllers: [BikeController]
})
export class BikeModule {}
