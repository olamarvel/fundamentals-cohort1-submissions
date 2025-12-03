import { Request, Response } from 'express';
import packageJson from '../../package.json';

interface StatusPayload {
  status: string;
  service: string;
  version: string;
  description: string;
  releasedAt: string | null;
  commit: string | null;
  environment: string;
}

export const getStatus = (req: Request, res: Response): void => {
  const payload: StatusPayload = {
    status: 'ok',
    service: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
    releasedAt: process.env.RELEASED_AT || null,
    commit: process.env.GIT_SHA || null,
    environment: process.env.NODE_ENV || 'development'
  };
  res.json(payload);
};









