import { ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Country } from '../dtos/country.dto';
import { GetCountriesQuery } from '../dtos/req/get-countries-query.dto';
import { getName } from 'country-list';
import { findCommonElements } from 'src/shared/utils';
import { PutBorderReq } from '../dtos/req/put-borders.dto';
import { PutSubregionReq } from '../dtos/req/put-subregion.dto';
import { GetCountryRes } from '../dtos/res/get-country-res.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CountryService implements OnModuleInit {
  constructor() {}

  countries: Country[] = [];

  onModuleInit() {
    this.initiateData();
  }

  initiateData() {
    try {
      let jsonData = require('../../../countries.json');
      jsonData.countries.forEach((c) => {
        this.countries.push(c);
      });
    } catch (err) {
      console.log(err);
    }
  }

  getCountries(query: GetCountriesQuery): GetCountryRes[] {
    let responseCountries: Country[] = this.countries;

    if (query.share_borders_queried_country) {
      responseCountries = this.getBorderSharedCountries(query.share_borders_queried_country);
    }

    if (query.population_greater_than) {
      responseCountries = responseCountries.filter((c) => c.population > query.population_greater_than);
    }

    if (query.population_lesser_than) {
      responseCountries = responseCountries.filter((c) => c.population < query.population_lesser_than);
    }

    if (query.languages?.length) {
      responseCountries = responseCountries
        .map((c) => {
          let languagesInCountry = [...Object.keys(c.languages), ...Object.values(c.languages)];
          if (findCommonElements(languagesInCountry, query.languages)) {
            return c;
          }
        })
        .filter((c) => c);
    }

    return plainToInstance(GetCountryRes, responseCountries, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  getBorderSharedCountries(queriedCountry: string): GetCountryRes[] {
    let country = this.getCountry(queriedCountry);

    if (!country.borders) return [];

    let responseCountries = country.borders.map((border) => {
      let countryName = getName(border.substring(0, 2));
      return this.getCountry(countryName);
    });

    return plainToInstance(GetCountryRes, responseCountries, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true
    });
  }

  getCountry(name: string): GetCountryRes {
    let country = this.countries.find((c) => c.name.toLowerCase() === name.toLocaleLowerCase());
    if (!country) throw new NotFoundException(`Country not found`);

    return plainToInstance(GetCountryRes, country, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }

  addBorders(name: string, dto: PutBorderReq): GetCountryRes {
    let country = this.countries.find((c) => c.name.toLowerCase() === name.toLocaleLowerCase());

    if (!country) throw new NotFoundException(`Country not found`);

    if (country.borders?.length) {
      throw new ForbiddenException(`Border already exist in ${country.name}`);
    }

    country.borders = dto.borders;

    return plainToInstance(GetCountryRes, country, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }

  addSubregion(name: string, dto: PutSubregionReq): GetCountryRes {
    let country = this.countries.find((c) => c.name.toLowerCase() === name.toLocaleLowerCase());
    if (!country) throw new NotFoundException(`Country not found`);

    country.subregion = dto.subregion;

    return plainToInstance(GetCountryRes, country, { excludeExtraneousValues: true, enableImplicitConversion: true });
  }
}
