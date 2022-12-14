import { Body, Controller, Get, NotFoundException, Param, Put, Query, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { GetCountriesQuery } from '../dtos/req/get-countries-query.dto';
import { PutBorderReq } from '../dtos/req/put-borders.dto';
import { PutSubregionReq } from '../dtos/req/put-subregion.dto';
import { GetCountryRes } from '../dtos/res/get-country-res.dto';
import { CountryService } from '../service/country.service';

@Controller({ version: '1', path: 'countries' })
@ApiTags('Country')
export class CountryController {
  constructor(private countryService: CountryService) {}

  @Get()
  @ApiOkResponse({ type: [GetCountryRes] })
  getCountries(@Query() query: GetCountriesQuery) {
    let res = this.countryService.getCountries(query);
    return res;
  }

  @Get(':name')
  @ApiOkResponse({ type: GetCountryRes })
  getCountry(@Param('name') name: string) {
    let res = this.countryService.getCountry(name);
    return res;
  }

  @Put(':name/borders')
  @ApiOkResponse({ type: GetCountryRes })
  addBorders(@Param('name') name: string, @Body() dto: PutBorderReq) {
    let res = this.countryService.addBorders(name, dto);
    return res;
  }

  @Put(':name/subregion')
  @ApiOkResponse({ type: GetCountryRes })
  addSubregion(@Param('name') name: string, @Body() dto: PutSubregionReq) {
    let res = this.countryService.addSubregion(name, dto);
    return res;
  }
}
