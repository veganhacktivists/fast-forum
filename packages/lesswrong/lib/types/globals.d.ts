declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      NODE_ENV?: "development" | "production" | "test";
      ROOT_URL?: string;
    }
  }
}

export {};
