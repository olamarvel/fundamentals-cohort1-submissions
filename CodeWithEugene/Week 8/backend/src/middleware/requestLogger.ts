import expressWinston from 'express-winston';
import logger from '../config/logger';
import { Request, Response, NextFunction } from 'express';

interface RequestWithId extends Request {
  requestId?: string;
}

export const requestLogger = expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  colorize: false,
  expressFormat: false,
  ignoreRoute: () => false,
  dynamicMeta: (req: RequestWithId, res: Response) => ({
    requestId: req.requestId,
    statusCode: res.statusCode
  })
});

export const errorLogger = expressWinston.errorLogger({
  winstonInstance: logger,
  dynamicMeta: (req?: RequestWithId) => ({
    requestId: req?.requestId
  })
});









