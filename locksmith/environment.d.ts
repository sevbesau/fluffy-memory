declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      PORT: string;
      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;
    }
  }
}

export { };
