import { createConnection } from "typeorm";

export default async () => {
  const connection = await createConnection()
    .then(() => {
      console.log("Database Connected");
    })
    .catch((error) => console.log(error));

  return connection;
};
