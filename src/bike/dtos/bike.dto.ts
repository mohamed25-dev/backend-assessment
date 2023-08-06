import { ApiProperty } from "@nestjs/swagger";
import { WeatherResponse } from "../../weather/dtos/weather.dto";
import { IsDateString } from "class-validator";

export class GetDataFilterDto {
    @IsDateString()
    at: Date
}

export class IndegoResponse {
    last_updated: Date;
    features: StationData[];
    type: string;
}

export class AccumulatedDataDTO {
    @ApiProperty({
        type: Date,
        description: 'Data last updated at',
    })
    at: Date;

    @ApiProperty({
        type: WeatherResponse,
        description: 'Weather Open API Saved Data',
    })
    weather: WeatherResponse;

    @ApiProperty({
        type: IndegoResponse,
        description: 'Indego API Saved Data',
    })
    station: IndegoResponse;
}

export class StationsDbModel {
    kioskId: number;
    data: any;
    type: string;
    createdAt: Date;
    createdAtHour: Date;
}


export class StationData {
    geometry: { coordinates: number[], type: string };
    properties: {
        id: number;
        name: string;
        coordinates: number[];
        totalDocks: number;
        docksAvailable: number;
        bikesAvailable: number;
        classicBikesAvailable: number;
        smartBikesAvailable: number;
        electricBikesAvailable: number;
        rewardBikesAvailable: number;
        rewardDocksAvailable: number;
        kioskStatus: string;
        kioskPublicStatus: string;
        kioskConnectionStatus: string;
        kioskType: number;
        addressStreet: string;
        addressCity: string;
        addressState: string;
        addressZipCode: string;
        bikes: Bike[];
        closeTime: Date;
        eventEnd: Date;
        eventStart: Date;
        isEventBased: boolean;
        isVirtual: boolean;
        kioskId: number;
        notes: string;
        openTime: Date;
        publicText: string;
        timeZone: number;
        trikesAvailable: number;
        latitude: number;
        longitude: number
    };
    type: string
}

export class Bike {
    battery: number;
    dockNumber: number;
    isElectric: boolean;
    isAvailable: boolean;
}