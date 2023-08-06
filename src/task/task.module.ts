import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { WeatherModule } from '../weather/weather.module';
import { BikeModule } from '../bike/bike.module';

@Module({
  providers: [TaskService],
  imports: [WeatherModule, BikeModule]
})
export class TaskModule {}
