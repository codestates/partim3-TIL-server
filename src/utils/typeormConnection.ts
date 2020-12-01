import { createConnection } from 'typeorm';
import logger from '../shared/Logger';
import connectionOptions from '../ormconfig';

export default class {
  static connection = async (): Promise<void> => {
    return await createConnection(connectionOptions)
      .then(() => {
        logger.info('=======>TIL 데이터베이스 연결<=======');
      })
      .catch((error) => logger.info(error));
  };
}
