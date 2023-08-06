import { Controller, Get, Param, ParseIntPipe, Post, Query, HttpCode } from '@nestjs/common';
import { IsDateString } from 'class-validator';
import { BikeService } from './bike.service';

class GetDataFilterDto {
    @IsDateString()
    at: Date
}


@Controller()
export class BikeController {
    constructor(
        private bikesService: BikeService
    ) { }

    @Post('indego-data-fetch-and-store-it-db')
    @HttpCode(201)
    async fetchBikeDataFromApi() {
        await this.bikesService.fetchBikeDataFromApi();
    }

    @Get('stations')
    getAccomulatedData(@Query() query: GetDataFilterDto) {
        return this.bikesService.getAccomulatedData(query.at);
    }

    @Get('stations/:id')
    getAccomulatedDataByStationId(@Query() query: GetDataFilterDto, @Param('id', ParseIntPipe) id: number) {
        return this.bikesService.getAccomulatedDataByStationId(query.at, id);
    }
}
