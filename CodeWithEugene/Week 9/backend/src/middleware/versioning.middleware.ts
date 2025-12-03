import { Request, Response, NextFunction } from 'express';

export interface VersionedRequest extends Request {
  apiVersion?: string;
}

export const versioningMiddleware = (
  req: VersionedRequest,
  res: Response,
  next: NextFunction
): void => {
  const version = req.headers['api-version'] || req.query.version || 'v2';
  req.apiVersion = version as string;
  next();
};

export const validateVersion = (
  req: VersionedRequest,
  res: Response,
  next: NextFunction
): void => {
  const supportedVersions = ['v1', 'v2'];
  const version = req.apiVersion;

  if (version && !supportedVersions.includes(version)) {
    res.status(400).json({
      error: 'Unsupported API version',
      supportedVersions,
      requestedVersion: version,
    });
    return;
  }

  next();
};


