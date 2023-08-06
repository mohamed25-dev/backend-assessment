import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BikeService } from '../bike/bike.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(
        private weatherService: WeatherService,
        private bikeService: BikeService,
    ){}

    // @Cron('45 * * * * *')
    // async getWeatherData () {
    //     await this.weatherService.getWeatherDataFromApi();
    //     this.logger.log('Done Updating weather data');
    // }

    // @Cron('45 * * * * *')
    // async getBikesData () {
    //     await this.bikeService.getBikeDataFromApi();
    //     this.logger.log('Done Updating bikes data');
    // }
}
