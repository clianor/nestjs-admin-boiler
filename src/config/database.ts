import { join } from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const dbConfig = (): MysqlConnectionOptions => ({
  type: 'mariadb',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  // We are using migrations, synchronize should be set to false.
  synchronize: false,
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: false,
  // migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  // cli: {
  //   migrationsDir: join(__dirname, '../migrations'),
  //   entitiesDir: join(__dirname, '../**/*.entity{.ts,.js}'),
  // },
});

export default dbConfig();
