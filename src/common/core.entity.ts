import { ApiProperty } from '@nestjs/swagger';

import { Exclude } from 'class-transformer';
import { IsDate } from 'class-validator';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CoreEntity {
  @ApiProperty({ type: Date, description: '생성일자' })
  @IsDate()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ApiProperty({ type: Date, description: '업데이트일자' })
  @IsDate()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ApiProperty({ type: Date, description: '삭제일자' })
  @Exclude()
  @IsDate()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;
}
