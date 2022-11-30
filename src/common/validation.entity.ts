import { validateOrReject } from 'class-validator';
import { BeforeInsert, BeforeUpdate } from 'typeorm';

export class ValidationEntity {
  @BeforeInsert()
  @BeforeUpdate()
  async validate(): Promise<void> {
    await validateOrReject(this);
  }
}
