import { Controller, Post, HttpCode } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
    constructor(
        private bikesService: WeatherService
    ) { }

    @HttpCode(201)
    @Post('weather-data-fetch-and-store-it-db')
    async fetchBikeDataFromApi() {
        await this.bikesService.fetchWeatherDataFromApi();
    }
}
