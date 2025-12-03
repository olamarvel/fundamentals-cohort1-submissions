import { Request, Response, NextFunction } from 'express';
import { AxiosError } from 'axios';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError | AxiosError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (err instanceof Error) {
    message = err.message;

    if ('statusCode' in err && err.statusCode) {
      statusCode = err.statusCode;
    }

    if ('code' in err && err.code) {
      code = err.code;
    }

    if (err instanceof AxiosError) {
      statusCode = err.response?.status || 502;
      message = err.response?.data?.message || err.message || 'Legacy API Error';
      code = 'LEGACY_API_ERROR';
    }
  }

  if (statusCode === 500) {
    console.error('Error:', err);
  }

  res.status(statusCode).json({
    error: {
      code,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.path} not found`,
      timestamp: new Date().toISOString(),
    },
  });
};


