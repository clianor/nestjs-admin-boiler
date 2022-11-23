import { InternalServerErrorException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { compare, hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CoreEntity } from 'src/common/core.entity';

import { Role } from '../enums/role.enum';

@Entity()
export class User extends CoreEntity {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @IsString()
  @Column()
  password: string;

  @ApiProperty()
  @IsBoolean()
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty()
  @IsEnum(Role)
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role[];

  @BeforeInsert()
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
