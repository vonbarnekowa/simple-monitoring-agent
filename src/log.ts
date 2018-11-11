import * as path from 'path';
import * as winston from 'winston';

export const log = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: path.join('logs/' , 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('logs/' , 'info.log'), level: 'info' }),
    new winston.transports.File({ filename: path.join('logs/' , 'warning.log'), level: 'warning' }),
    new winston.transports.File({ filename: path.join('logs/' , 'combined.log')}),
  ],
});
