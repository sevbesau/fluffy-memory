import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import AuthController from './controller';
import HttpException from './httpException';

import './env';

import envalidate from '@siliconminds/envalidate';
envalidate(['PORT', 'NODE_ENV']);

const app = express();

// SETUP MIDDLEWARES
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.get('/', (req, res) => res.send('locksmith up and running!'));
app.post('/register', AuthController.register());
app.post('/login', AuthController.login());
app.delete('/logout', AuthController.check(), AuthController.logout());
app.get('/me', AuthController.me(), (req, res) => res.json({ success: true, data: req.user }));

// 404
app.use((_req, _res, next) => {
  return next(new HttpException(404, 'Page not found'));
});

// error handler
app.use((err: HttpException, req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong';
  console.error(`${req.method} ${req.path} ${status} ${message}`);
  return res
    .status(status)
    .json({ success: false, error: process.env.NODE_ENV == 'development' ? message : 'Ooops, something went wrong, please try again later!' });
});

class App {
  /**
   * Start listening for requests on the port in the env
   */
  public static listen = async () =>
    new Promise<void>((resolve, _reject) => {
      app.listen(process.env.PORT, () => {
        console.log(`[express] listening on localhost:${process.env.PORT}`);
        return resolve();
      });
    });
}

export default App;
