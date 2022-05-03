import DB from '@siliconminds/db';

import app from './app';

import envalidate from '@siliconminds/envalidate';
envalidate(['MONGO_URI']);

class Server {
  /**
   * Start up the server
   */
  public static async start() {
    // connect to our db
    await DB.connect(process.env.MONGO_URI, { timeout: 10000 });

    // start listening for requests
    await app.listen();

    return true;
  }
}

export default Server;
