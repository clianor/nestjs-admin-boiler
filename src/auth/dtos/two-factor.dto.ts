import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class TwoFactorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
}
