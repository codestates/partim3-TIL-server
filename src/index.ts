import app from './server';
import logger from './shared/Logger';

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  logger.info(`사용중인 포트: ${port}`);
});
