import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';

export default function handleError(err: HttpException, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  console.error(`${req.method} ${req.path} ${status} ${message}`);
  return res.json({
    success: false,
    error: process.env.NODE_ENV == 'development' ? message : 'Ooops, something went wrong, please try again later!',
  });
}
