import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  publicMessage?: string;
}

export default (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.status || err.statusCode || 500;
  const response = {
    status: 'error',
    message: err.publicMessage || 'Internal server error',
    traceId: (req as Request & { requestId?: string }).requestId || req.headers['x-request-id'] || null
  };

  logger.error('Unhandled error: %s', err.message, {
    statusCode,
    stack: err.stack
  });

  res.status(statusCode).json(response);
};









