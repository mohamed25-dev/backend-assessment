import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BikeService } from '../bike/bike.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(
        private weatherService: WeatherService,
        private bikeService: BikeService,
    ) { }

    @Cron(CronExpression.EVERY_HOUR)
    async getWeatherData() {
        await this.weatherService.fetchWeatherDataFromApi();
        this.logger.log('Done Updating weather data');
    }

    @Cron(CronExpression.EVERY_HOUR)
    async getBikesData() {
        await this.bikeService.fetchBikeDataFromApi();
        this.logger.log('Done Updating bikes data');
    }
}
