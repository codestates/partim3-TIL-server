import { createConnection } from 'typeorm';
import logger from '../shared/Logger';

export default class {
  static connection = async (): Promise<void> => {
    return await createConnection()
      .then(() => {
        logger.info('=============>데이터베이스 연결<=============');
      })
      .catch((error) => logger.info(error));
  };
}
