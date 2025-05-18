import { App } from "@slack/bolt";

require("dotenv").config();

export const client = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  port: Number(process.env["PORT"]) || 3000,
});
