import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
  path: '.env',
});

export const dbConfig = (): DataSourceOptions =>
  ({
    type: 'mariadb',
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT, 10),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    migrations: [join(__dirname, '../../migrations/**/*{.ts,.js}')],
    synchronize: false,
    dropSchema: false,
    migrationsRun: false,
    logging: process.env.NODE_ENV !== 'production',
    cli: {
      migrationsDir: join(__dirname, '../../migrations'),
      entitiesDir: join(__dirname, '../../**/*.entity{.ts,.js}'),
    },
  } as any);

console.log(dbConfig());

export default new DataSource(dbConfig());
