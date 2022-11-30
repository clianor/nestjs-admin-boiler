import { config } from 'dotenv';
import { DataSource } from 'typeorm';

import { dbConfig } from './database';

config({
  path: '.env',
});

export default new DataSource(dbConfig());
