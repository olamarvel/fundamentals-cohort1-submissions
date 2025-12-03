import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';

interface RequestWithId extends Request {
  requestId?: string;
}

export default (req: RequestWithId, res: Response, next: NextFunction): void => {
  const incomingId =
    req.headers['x-request-id'] || req.headers['x-correlation-id'] || randomUUID();

  req.requestId = incomingId as string;
  res.setHeader('x-request-id', incomingId as string);

  next();
};









