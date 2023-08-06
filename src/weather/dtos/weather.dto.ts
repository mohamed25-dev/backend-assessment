export class WeatherDbModel {
    cityId: number;
    data: WeatherResponse;
    createdAt: Date;
    createdAtHour: Date;
}

export class WeatherResponse {
    coord: { lon: number, lat: number };
    weather: [
        {
            id: number,
            main: string,
            description: string,
            icon: string
        }
    ];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number
    };
    visibility: number;
    wind?: {
        speed: number;
        deg: number;
        gust: number
    };
    rain?: {
        '3h'?: number;
        '1h'?: number;
    };
    clouds?: {
        all?: number;
        '3h'?: number;
        '1h'?: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number
    };
    timezone: number;
    id: number;
    name: string;
    cod: number
}
