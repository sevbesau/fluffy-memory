declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_URI: string;
      PORT: string;
      API_URL: string;
      API_KEY: string;
      PROJECTS_ROOT: string;
      NGINX_ROOT: string;
      WWW_ROOT: string;
    }
  }
}

export {};
