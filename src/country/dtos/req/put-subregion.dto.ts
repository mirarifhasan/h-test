import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PutSubregionReq {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subregion: string;
}
