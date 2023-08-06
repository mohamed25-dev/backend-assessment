import { Module } from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { WeatherController } from './weather.controller';


@Module({
  providers: [WeatherService],
  exports: [WeatherService],
  imports: [HttpModule, PrismaModule, ConfigModule],
  controllers: [WeatherController]
})
export class WeatherModule {}


