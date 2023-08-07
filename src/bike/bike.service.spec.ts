import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { BikeService } from './bike.service';
import { PrismaService } from '../prisma/prisma.service';
import { WeatherService } from '../weather/weather.service';
import { AccumulatedDataDTO, IndegoResponse, StationsDbModel } from './dtos/bike.dto';
import { WeatherResponse } from '../weather/dtos/weather.dto';

describe('BikeService', () => {
  let service: BikeService;

  const prismaServiceMock = {
    bike: {
      findMany: jest.fn(),
      createMany: jest.fn()
    },
  };

  const httpServiceMock = {
    get: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const weatherServiceMock = {
    getWeatherData: jest.fn(),
  };

  const mockedBikeDbData: StationsDbModel[] = [
    {
      kioskId: 123,
      data: [{
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [
            -75.20311,
            39.9522
          ]
        },
        properties: {
          id: 3006,
          name: "40th & Spruce",
          bikes: [
            {
              battery: 85,
              dockNumber: 1,
              isElectric: true,
              isAvailable: true
            }
          ],
          notes: null,
          kioskId: 3006,
          eventEnd: null,
          latitude: 39.9522,
          openTime: null,
          timeZone: null,
          closeTime: null,
          isVirtual: false,
          kioskType: 1,
          longitude: -75.20311,
          eventStart: null,
          publicText: "",
          totalDocks: 17,
          addressCity: "Philadelphia",
          coordinates: [
            -75.20311,
            39.9522
          ],
          kioskStatus: "FullService",
          addressState: "PA",
          isEventBased: false,
          addressStreet: "246 S. 40th St.",
          addressZipCode: "19104",
          bikesAvailable: 4,
          docksAvailable: 12,
          trikesAvailable: 0,
          kioskPublicStatus: "Active",
          smartBikesAvailable: 0,
          rewardBikesAvailable: 4,
          rewardDocksAvailable: 12,
          classicBikesAvailable: 0,
          kioskConnectionStatus: "Active",
          electricBikesAvailable: 4
        },
      }],
      type: 'Feature',
      createdAt: new Date(),
      createdAtHour: new Date()
    }
  ];

  const mockedStationsReturnedata: IndegoResponse = {
    last_updated: mockedBikeDbData[0].createdAt,
    features: mockedBikeDbData.map(d => d.data),
    type: mockedBikeDbData[0].type,
  }

  const mockedWeatherResponse: WeatherResponse = {
    coord: {
      lon: -0.1257,
      lat: 51.5085
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01n"
      }
    ],
    base: "stations",
    main: {
      temp: 283.99,
      feels_like: 283.51,
      temp_min: 283.07,
      temp_max: 284.72,
      pressure: 1010,
      humidity: 91
    },
    visibility: 10000,
    wind: {
      speed: 2.24,
      deg: 291,
      gust: 2.68
    },
    clouds: {
      all: 5
    },
    dt: 1691294641,
    sys: {
      type: 2,
      id: 2075535,
      country: "GB",
      sunrise: 1691296273,
      sunset: 1691350899
    },
    timezone: 3600,
    id: 2643743,
    name: "London",
    cod: 200
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BikeService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock
        },
        {
          provide: HttpService,
          useValue: httpServiceMock
        },
        {
          provide: ConfigService,
          useValue: configServiceMock
        },
        {
          provide: WeatherService,
          useValue: weatherServiceMock
        }
      ],
    }).compile();

    service = module.get<BikeService>(BikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should get all stations data by a specific date', async () => {
    prismaServiceMock.bike.findMany.mockResolvedValue(mockedBikeDbData);

    const result = await service.getStationsData(null);
    expect(result).toEqual(mockedStationsReturnedata);
  });

  it('should throw 404 error if no data is returned', async () => {
    prismaServiceMock.bike.findMany.mockResolvedValue([]);
    await expect(service.getStationsData(null)).rejects.toThrow(new NotFoundException());
  });

  it('should return weather and bikes accumulated data', async () => {
    prismaServiceMock.bike.findMany.mockResolvedValue(mockedBikeDbData);
    weatherServiceMock.getWeatherData.mockResolvedValue(mockedWeatherResponse);

    const expectedResult: AccumulatedDataDTO = {
      at: mockedBikeDbData[0].createdAt,
      station: {
        last_updated: mockedBikeDbData[0].createdAt,
        features: mockedBikeDbData.map(d => d.data as any),
        type: mockedBikeDbData[0].type
      },
      weather: mockedWeatherResponse,
    }

    const result = await service.getAccomulatedData(null);
    expect(result).toEqual(expectedResult);
  });
});
