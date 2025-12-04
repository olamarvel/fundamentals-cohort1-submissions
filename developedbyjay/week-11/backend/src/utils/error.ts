export class AppError extends Error {
  status: number;
  code: string;
  constructor(message: string, status = 400, code = 'BAD_REQUEST') {
    super(message);
    this.status = status;
    this.code = code;
  }
}
export const Unauthorized = (msg='Unauthorized') => new AppError(msg, 401, 'UNAUTHORIZED');
export const Forbidden = (msg='Forbidden') => new AppError(msg, 403, 'FORBIDDEN');
export const NotFound = (msg='Not Found') => new AppError(msg, 404, 'NOT_FOUND');
export const Conflict = (msg='Conflict') => new AppError(msg, 409, 'CONFLICT');
