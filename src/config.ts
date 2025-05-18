declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_TOKEN: string;
      BOT_TOKEN: string;
      SIGNING_SECRET: string;
      PORT?: string;
    }
  }
}

export {};
