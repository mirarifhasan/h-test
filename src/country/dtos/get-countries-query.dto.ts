import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetCountriesQuery {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  share_borders_queried_country: string;
}
