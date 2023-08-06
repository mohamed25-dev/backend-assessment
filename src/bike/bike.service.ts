import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherResponse, WeatherService } from '../weather/weather.service';

@Injectable()
export class BikeService {
    private logger = new Logger(BikeService.name)
    constructor(
        private prismaService: PrismaService,
        private httpService: HttpService,
        private configService: ConfigService,
        private weatherService: WeatherService
    ) { }

    async fetchBikeDataFromApi() {
        try {
            const responseObservable = this.httpService.get(this.configService.get('BIKES_API'));
            const responseData: IndegoResponse = (await firstValueFrom(responseObservable)).data;

            const stationsData: StationData[] = responseData.features;
            const dataToBeSaved: StationsDbModel[] = stationsData.map(stationData => {
                const createdAt = new Date(responseData.last_updated);

                return {
                    kioskId: stationData.properties.kioskId,
                    data: stationData,
                    type: responseData.type,
                    createdAt,
                    createdAtHour: new Date(createdAt.setMinutes(0, 0, 0))
                }
            });

            // @NOTE: a tradeof between performance and data fresheness, the other option is to delete all 
            // duplicate data and use the newly retrieved one but that will impact the performance, the current
            // solution is skipping duplicate key that will give us better performance however the data for a specific hour will 
            // be retrieved only once
            await this.prismaService.bike.createMany({
                data: dataToBeSaved,
                skipDuplicates: true
            });

        } catch (error) {
            this.logger.error('something went wrong while fetching bike data', error);
        }
    }

    async getStationsData(at: Date, stationId?: number): Promise<IndegoResponse> {
        const filter: { kioskId?: number, createdAt: Date | any } = {
            createdAt: {
                gte: new Date(at)
            }
        };

        if (stationId) {
            filter.kioskId = stationId
        }

        const data = await this.prismaService.bike.findMany({
            where: {
                AND: filter
            }
        });

        if (!data || !data.length) {
            throw new NotFoundException();
        }

        // @NOTE: Prisma does not support type safety on json columns, issue: https://github.com/prisma/prisma/issues/3219
        return {
            last_updated: data[0].createdAt,
            features: data.map(d => d.data as any),
            type: data[0].type
        };
    }

    async getAccomulatedData(at: Date): Promise<AccumulatedDataDTO> {
        const weatherDataPromise = this.weatherService.getWeatherData(at);
        const stationsDataPromise = this.getStationsData(at);

        // @NOTE: awaiting promises in paraller for better performance
        const [weatherData, stationsData] = await Promise.all([weatherDataPromise, stationsDataPromise]);

        return {
            at: stationsData.last_updated,
            station: stationsData,
            weather: weatherData
        };
    }

    async getAccomulatedDataByStationId(at: Date, stationId: number): Promise<AccumulatedDataDTO> {
        const weatherDataPromise = this.weatherService.getWeatherData(at);
        const stationsDataPromise = this.getStationsData(at, stationId);

        // @NOTE: awaiting promises in paraller for better performance
        const [weatherData, stationsData] = await Promise.all([weatherDataPromise, stationsDataPromise]);

        return {
            at: stationsData.last_updated,
            station: stationsData,
            weather: weatherData || null
        };
    }
}

export class AccumulatedDataDTO {
    at: Date;
    weather: WeatherResponse;
    station: IndegoResponse;
}

export interface StationsDbModel {
    kioskId: number,
    data: any,
    type: string,
    createdAt: Date,
    createdAtHour: Date
}

export interface IndegoResponse {
    last_updated: Date,
    features: StationData[],
    type: string
}

export interface StationData {
    geometry: { coordinates: number[], type: string },
    properties: {
        id: number,
        name: string,
        coordinates: number[],
        totalDocks: number,
        docksAvailable: number,
        bikesAvailable: number,
        classicBikesAvailable: number,
        smartBikesAvailable: number,
        electricBikesAvailable: number,
        rewardBikesAvailable: number,
        rewardDocksAvailable: number,
        kioskStatus: string,
        kioskPublicStatus: string,
        kioskConnectionStatus: string,
        kioskType: number,
        addressStreet: string,
        addressCity: string,
        addressState: string,
        addressZipCode: string,
        bikes: Bike[],
        closeTime: Date,
        eventEnd: Date,
        eventStart: Date,
        isEventBased: boolean,
        isVirtual: boolean,
        kioskId: number,
        notes: string,
        openTime: Date,
        publicText: string,
        timeZone: number,
        trikesAvailable: number,
        latitude: number,
        longitude: number
    },
    type: string
}

export interface Bike {
    battery: number,
    dockNumber: number,
    isElectric: boolean,
    isAvailable: boolean
}