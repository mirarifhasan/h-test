import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Country } from '../dtos/country.dto';
import { GetCountriesQuery } from '../dtos/get-countries-query.dto';
import { getName } from 'country-list';
import { findCommonElements } from 'src/shared/utils';

@Injectable()
export class CountryService implements OnModuleInit {
  constructor() {}

  countries: Country[] = [];

  onModuleInit() {
    let jsonData = require('../../../countries.json');
    jsonData.countries.forEach((c) => {
      this.countries.push(c);
    });
  }

  getCountries(query: GetCountriesQuery): Country[] {
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

    return responseCountries;
  }

  getBorderSharedCountries(queriedCountry: string): Country[] {
    let country = this.getCountry(queriedCountry);

    if (!country.borders) return [];

    return country.borders.map((border) => {
      let countryName = getName(border.substring(0, 2));
      return this.getCountry(countryName);
    });
  }

  getCountry(name: string): Country {
    let country = this.countries.find((c) => c.name.toLowerCase() === name.toLocaleLowerCase());
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }
}
