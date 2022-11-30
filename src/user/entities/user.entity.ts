import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { compare, hash } from 'bcryptjs';
import { Expose } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CoreEntity } from 'src/common/core.entity';

import { Role } from '../enums/role.enum';

@Entity()
export class User extends CoreEntity {
  @ApiProperty({ type: String, description: '유저 고유값' })
  @Expose()
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ type: String, description: '유저 이름' })
  @Expose()
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ type: String, description: '유저 이메일' })
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ type: String, description: '유저 패스워드' })
  @IsString()
  @Column()
  password: string;

  @ApiProperty({ type: Role, description: '유저 권한' })
  @Expose()
  @IsOptional()
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @ApiProperty({ type: Boolean, description: '2fa 활성화 여부' })
  @Expose()
  @IsOptional()
  @IsBoolean()
  @Column({ default: true })
  isTwoFactorEnable: boolean;

  @ApiProperty({ type: Boolean, description: '2fa 고유 키', required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @IsOptional()
  @IsNotEmpty()
  @Max(300)
  @IsString()
  @Column({ nullable: true, length: 300 })
  refreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await hash(this.password, 10);
      } catch {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(comparePassword: string): Promise<boolean> {
    return await compare(comparePassword, this.password);
  }
}
