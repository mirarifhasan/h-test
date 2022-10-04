import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetCountriesQuery } from '../dtos/get-countries-query.dto';
import { PutBorderReq } from '../dtos/put-borders.dto';
import { CountryService } from '../service/country.service';

@Controller({ version: '1', path: 'countries' })
@ApiTags('Country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get()
  getCountries(@Query() query: GetCountriesQuery) {
    let res = this.countryService.getCountries(query);
    return res;
  }

  @Get(':name')
  getCountry(@Param('name') name: string) {
    let res = this.countryService.getCountry(name);
    return res;
  }

  @Put(':name')
  addBorders(@Param('name') name: string, @Body() dto: PutBorderReq) {
    let res = this.countryService.addBorders(name, dto);
    return res;
  }
}
