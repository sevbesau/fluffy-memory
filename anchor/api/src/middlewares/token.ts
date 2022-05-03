import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';

export default (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (!req.query.authorization) throw new HttpException(400, 'No api token found!');
    if (req.query.authorization.toString() != process.env.API_KEY) throw new HttpException(403, 'Access denied!');
    return next();
  } catch (error) {
    return next(error);
  }
};
