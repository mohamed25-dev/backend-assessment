import { Controller, Post, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';

@Controller('weather')
@ApiTags('WeatherController')
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
