import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id) || id <= 0) {
    throw new AppError('Invalid ID parameter', 400);
  }
  
  req.params.id = id.toString();
  next();
};

export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  if (page < 1) {
    throw new AppError('Page must be greater than 0', 400);
  }
  
  if (limit < 1 || limit > 100) {
    throw new AppError('Limit must be between 1 and 100', 400);
  }
  
  req.query.page = page.toString();
  req.query.limit = limit.toString();
  next();
};