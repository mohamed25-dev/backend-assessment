import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { WeatherDbModel, WeatherResponse, WeatherService } from './weather.service';
import { PrismaService } from '../prisma/prisma.service';
import { timestampToUTC } from '../utils';

describe('WeatherService', () => {
  let service: WeatherService;

  const prismaServiceMock = {
    weather: {
      findFirst: jest.fn(),
    },
  };

  const httpServiceMock = {
    get: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

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

  const mockedWeatherDbData: WeatherDbModel = {
    cityId: mockedWeatherResponse.id,
    data: mockedWeatherResponse,
    createdAt: timestampToUTC(mockedWeatherResponse.dt),
    createdAtHour: new Date(timestampToUTC(mockedWeatherResponse.dt).setMinutes(0, 0, 0))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
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
        }
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should get weather data based on the date', async () => {
    prismaServiceMock.weather.findFirst.mockResolvedValue(mockedWeatherDbData);

    const result = await service.getWeatherData(null);
    expect(result).toEqual(mockedWeatherResponse);
  });

  it('should throw 404 if no data was found', async () => {
    prismaServiceMock.weather.findFirst.mockResolvedValue(null);
    await expect(service.getWeatherData(null)).rejects.toThrow(new NotFoundException())
  });
});
