import { ApiProperty } from '@nestjs/swagger';

import { Exclude, Expose } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

import { ValidationEntity } from './validation.entity';

export class CoreEntity extends ValidationEntity {
  @ApiProperty({ type: Date, description: '생성일자' })
  @Expose()
  @IsOptional()
  @IsDate()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ type: Date, description: '업데이트일자' })
  @Expose()
  @IsOptional()
  @IsDate()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({ type: Date, description: '삭제일자' })
  @Exclude()
  @IsOptional()
  @IsDate()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt?: Date;
}
