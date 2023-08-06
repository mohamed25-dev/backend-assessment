import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import { timestampToUTC } from '../utils';

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

export interface WeatherDbModel {
    cityId: number,
    data: WeatherResponse,
    createdAt: Date,
    createdAtHour: Date,
}

export interface WeatherResponse {
    coord: { lon: number, lat: number },
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ],
    base: string,
    main: {
        temp: number,
        feels_like: number,
        temp_min: number,
        temp_max: number,
        pressure: number,
        humidity: number
    },
    visibility: number,
    wind?: {
        speed: number,
        deg: number,
        gust: number
    },
    rain?: {
        '3h'?: number,
        '1h'?: number,
    },
    clouds?: {
        all?: number,
        '3h'?: number,
        '1h'?: number,
    },
    dt: number,
    sys: {
        type: number,
        id: number,
        country: string,
        sunrise: number,
        sunset: number
    },
    timezone: number,
    id: number,
    name: string,
    cod: number
}
