import { loadPrograms, ProgramData } from "./utils/fetchData";

export const yswsDataUri = "https://ysws.hackclub.com/data.yml";
export const participantsCountUri =
  "https://api2.hackclub.com/v0.1/Unified%20YSWS%20Projects%20DB/YSWS%20Programs?cache=true";

export let yswsData: ProgramData | null = null;

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

export const setup = async () => {
  yswsData = await loadPrograms();
};
