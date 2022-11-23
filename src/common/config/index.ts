import { dbConfig } from './database';

export default () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  database: dbConfig(),
});
