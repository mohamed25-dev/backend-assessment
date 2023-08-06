import { Controller, Get, Param, ParseIntPipe, Post, Query, HttpCode } from '@nestjs/common';
import { IsDateString } from 'class-validator';
import { BikeService } from './bike.service';
import { ApiForbiddenResponse, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AccumulatedDataDTO, GetDataFilterDto } from './dtos/bike.dto';




@ApiTags('Bike Controller')
@Controller()
export class BikeController {
    constructor(
        private bikesService: BikeService
    ) { }

    @Post('indego-data-fetch-and-store-it-db')
    @HttpCode(201)
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    async fetchBikeDataFromApi() {
        await this.bikesService.fetchBikeDataFromApi();
    }

    @Get('stations')
    @ApiOkResponse({type: AccumulatedDataDTO})
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiQuery({ name: 'at', description: 'Date to fetch data based one', required: true })
    getAccomulatedData(@Query() query: GetDataFilterDto) {
        return this.bikesService.getAccomulatedData(query.at);
    }

    @Get('stations/:id')
    @ApiOkResponse({type: AccumulatedDataDTO})
    @ApiForbiddenResponse({ description: 'Unauthorized Request' })
    @ApiQuery({ name: 'at', description: 'Date to fetch data based one', required: true })
    
    getAccomulatedDataByStationId(@Query() query: GetDataFilterDto, @Param('id', ParseIntPipe) id: number) {
        return this.bikesService.getAccomulatedDataByStationId(query.at, id);
    }
}
