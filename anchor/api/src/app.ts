import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import routes from './routes';
import ErrorHandler from './middlewares/error';
import Catch404 from './middlewares/404';

import './env';

import envalidate from '@siliconminds/envalidate';
envalidate(['PORT', 'NODE_ENV']);

const app = express();

// SETUP MIDDLEWARES
app.use(cors({ origin: '*' }));
app.use(morgan('tiny'));
app.use(express.json());

// ROUTES
app.use('/', routes);

app.use(Catch404);
app.use(ErrorHandler);

class App {
  /**
   * Start listening for requests on the port in the env
   */
  public static listen = async () =>
    new Promise<void>((resolve, _reject) => {
      // required env key
      app.listen(process.env.PORT, () => {
        console.log(`[express] listening on localhost:${process.env.PORT}`);
        return resolve();
      });
    });
}

export default App;
