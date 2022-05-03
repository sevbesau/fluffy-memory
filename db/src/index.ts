import mongoose from 'mongoose';

interface DBConnectionOptions {
  quiet?: boolean; // debug logging
  timeout?: number; // connection timeout in ms
}

const defaultOptions: DBConnectionOptions = {
  quiet: false,
  timeout: 4000,
};

class DB {
  /**
   * Connect to a mongodb instance
   * @param {String} mongoUri mongodb connection string
   * @returns {DBConnectionOptions} mongoose connection
   */
  public static async connect(mongoUri: string, options: DBConnectionOptions = defaultOptions) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: options.timeout,
      });
      if (!options.quiet || false) console.log(`[mongodb] connected on ${mongoUri}`);
    } catch (error) {
      if (!options.quiet || false) console.error(`[mongodb] connection failed...\n${error}`);
      else throw error;
    }
  }

  /**
   * Drop all collections
   */
  public static async drop() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
      try {
        // Drop the collection from the current database
        await mongoose.connection.db.dropCollection(collectionName);
      } catch (error) {
        // Sometimes this error happens, but you can safely ignore it
        if (error.message === 'ns not found') return;
        // This error occurs when you use it.todo. You can
        // safely ignore this error too
        if (error.message.includes('a background operation is currently running')) return;
        console.error(`[mongodb] failed to drop db... ${error.message}`);
      }
    }
  }
}

export default DB;
