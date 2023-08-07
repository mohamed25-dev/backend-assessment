import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { timestampToUTC } from '../utils';
import { WeatherResponse } from './dtos/weather.dto';

@Injectable()
export class WeatherService {
    private logger = new Logger(WeatherService.name);

    constructor(
        private prismaService: PrismaService,
        private httpService: HttpService,
        private configService: ConfigService
    ) { }

    async fetchWeatherDataFromApi() {
        try {
            const responseObservable = this.httpService.get(this.configService.get('WEATHER_API'));
            const weatherResponse: WeatherResponse = (await firstValueFrom(responseObservable))?.data;

            await this.prismaService.weather.upsert({
                where: {
                    cityId_createdAtHour: {
                        cityId: weatherResponse.id,
                        createdAtHour: new Date(timestampToUTC(weatherResponse.dt).setMinutes(0, 0, 0))
                    },
                },
                update: {
                    data: { ...weatherResponse },
                    createdAt: timestampToUTC(weatherResponse.dt)
                },
                create: {
                    cityId: weatherResponse.id,
                    data: { ...weatherResponse },
                    createdAt: timestampToUTC(weatherResponse.dt),
                    createdAtHour: new Date(timestampToUTC(weatherResponse.dt).setMinutes(0, 0, 0))
                }
            });

        } catch (error) {
            this.logger.error('something went wrong while fetching weather data', error);
        }
    }


    async getWeatherData(at: Date): Promise<WeatherResponse> {
        const data = await this.prismaService.weather.findFirst({
            where: {
                createdAt: {
                    gte: new Date(at)
                }
            }
        });

        return (data?.data as any) as WeatherResponse;
    }
}
