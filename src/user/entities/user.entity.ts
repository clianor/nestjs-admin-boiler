import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { compare, hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CoreEntity } from 'src/common/core.entity';

import { Role } from '../enums/role.enum';

@Entity()
export class User extends CoreEntity {
  @ApiProperty({ type: String, description: '유저 고유값' })
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty({ type: String, description: '유저 이름' })
  @IsString()
  @Column()
  name: string;

  @ApiProperty({ type: String, description: '유저 이메일' })
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ type: String, description: '유저 패스워드' })
  @Exclude()
  @IsString()
  @Column()
  password: string;

  @ApiProperty({ type: Role, description: '유저 권한' })
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @ApiProperty({ type: Boolean, description: '2fa 활성화 여부' })
  @IsBoolean()
  @Column({ default: true })
  isTwoFactorEnable: boolean;

  @ApiProperty({ type: Boolean, description: '2fa 고유 키', required: false })
  @Exclude()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
  twoFactorAuthSecret?: string;

  @Exclude()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: true })
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
