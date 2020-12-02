import { ConnectionOptions } from 'typeorm';
import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: `./env/development.env`,
  });
}
if (process.env.NODE_ENV === 'production') {
  dotenv.config({
    path: `./env/development.env`,
  });
}

export default {
  type: process.env.DB_CONNECTION,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [process.env.ENTITIES],
  migrations: ['db/migrations/**/*.ts'],
  subscribers: ['subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'db/entities',
    migrationsDir: 'db/migrations',
    subscribersDir: 'subscriber',
  },
} as ConnectionOptions;
