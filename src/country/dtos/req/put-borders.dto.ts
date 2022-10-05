import { ApiProperty } from '@nestjs/swagger';
import { MinLength, IsString } from 'class-validator';

export class PutBorderReq {
  @ApiProperty()
  @MinLength(1, { each: true })
  borders: string[];
}
