import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass, plainToInstance, Transform } from 'class-transformer';

export class CurrencyInfoRes {
  @ApiProperty()
  @Expose()
  name: string;
  @ApiProperty()
  @Expose()
  symbol: string;
}

export class GetCountryRes {
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj[value.key] ?? null)
  name: string;
  @ApiProperty()
  @Expose()
  @Transform((value) => (value.obj[value.key]?.length ? value.obj[value.key] : []))
  capital: string[];
  @ApiProperty()
  @Expose()
  @Transform((value) => (value.obj[value.key]?.length ? value.obj[value.key] : []))
  borders: string[];
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj[value.key] ?? 0)
  population: number;
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj[value.key] ?? null)
  region: string;
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj[value.key] ?? null)
  subregion: string;
  @ApiProperty()
  @Expose()
  @Transform((value) => value.obj[value.key] ?? null)
  flags: string;
  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return plainToInstance(Object, value.obj[value.key]);
  })
  currencies: any;
  @ApiProperty()
  @Expose()
  @Transform((value) => {
    return plainToInstance(Object, value.obj[value.key]);
  })
  languages: any;
}
