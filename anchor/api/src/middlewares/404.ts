import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';

export default function catch404(_req: Request, _res: Response, next: NextFunction) {
  return next(new HttpException(404, 'Page not found'));
}
