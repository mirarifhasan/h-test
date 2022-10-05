import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetCountriesQuery {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  share_borders_queried_country: string;

  @Type(() => Number)
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population_greater_than: number;

  @Type(() => Number)
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  population_lesser_than: number;

  @Transform((v) => {
    if (typeof v.obj[v.key] == 'string') {
      return [v.obj[v.key]];
    }
    return v.obj[v.key];
  })
  @ApiPropertyOptional()
  @IsOptional()
  languages: string[];
}
