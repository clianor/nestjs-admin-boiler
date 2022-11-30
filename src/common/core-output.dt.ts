import { Expose } from 'class-transformer';

export class CoreOutputDto {
  @Expose()
  statusCode: number;

  @Expose()
  message?: string | string[];
}
