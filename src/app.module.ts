import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BikeModule } from './bike/bike.module';
import { WeatherModule } from './weather/weather.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { configValidationSchema } from './config.schema';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
    }),
    ScheduleModule.forRoot(),
    BikeModule,
    WeatherModule,
    PrismaModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
  ],
})
export class AppModule { }
