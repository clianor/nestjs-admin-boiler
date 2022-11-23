import { InternalServerErrorException } from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { CoreEntity } from 'src/common/core.entity';

import { Role } from '../enums/role.enum';

@Entity()
export class User extends CoreEntity {
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsString()
  @Column()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @IsString()
  @Column()
  password: string;

  @IsBoolean()
  @Column({ default: true })
  isActive: boolean;

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
