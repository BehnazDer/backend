import dotenv from 'dotenv';
import { connectToDatabase } from './utils/database';
import app from './app';
import logger from './logger';
import { HTTP_PORT, HTTPS_PORT } from './constants';
import https from 'https';
import fs from 'fs';
dotenv.config();

const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(HTTP_PORT, '0.0.0.0', () => {
      /* eslint-disable no-console */
      logger.info(
        `Http server is running on http://localhost:${HTTP_PORT}/api`,
      );
    });
    // https server running in dev mode
    if (process.env.NODE_ENV === 'development') {
      const https_server = https.createServer(
        {
          cert: fs.readFileSync('./certificate.crt'),
          key: fs.readFileSync('./private.key'),
          passphrase: process.env.KEY_PASSPHRASE,
        },
        app,
      );

      https_server.listen(HTTPS_PORT, () => {
        /* eslint-disable no-console */
        logger.info(
          `Https server is running on https://localhost:${HTTPS_PORT}/api`,
        );
      });
    }
  } catch (e) {
    logger.error(e);
  }
};

startServer();
