import dotenv from "dotenv";
dotenv.config();
// production: {
//   type: process.env.TYPEORM_CONNECTION,
//   host: process.env.TYPEORM_HOST,
//   port: process.env.TYPEORM_PORT,
//   username: process.env.TYPEORM_USERNAME,
//   password: process.env.TYPEORM_PASSWORD,
//   database: process.env.TYPEORM_DATABASE,
//   synchronize: true,
//   logging: false,
//   entities: ["src/entities/**/*.ts"],
//   migrations: ["src/migrations/**/*.ts"],
//   subscribers: ["src/subscriber/**/*.ts"],
//   cli: {
//     entitiesDir: "src/entity",
//     migrationsDir: "src/migration",
//     subscribersDir: "src/subscriber",
//   },
// },
export default {
  type: process.env.LOCAL_CONNECTION,
  host: process.env.LOCAL_HOST,
  port: process.env.LOCAL_PORT,
  username: process.env.LOCAL_USERNAME,
  password: process.env.LOACL_PASSWORD,
  database: process.env.LOCAL_DATABASE,
  synchronize: true,
  logging: false,
  entities: ["src/db/entities/**/*.ts"],
  migrations: ["src/db/migrations/**/*.ts"],
  subscribers: ["src/subscriber/**/*.ts"],
  cli: {
    entitiesDir: "src/entity",
    migrationsDir: "src/migration",
    subscribersDir: "src/subscriber",
  },
};
