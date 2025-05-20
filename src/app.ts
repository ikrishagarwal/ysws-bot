import fs from "node:fs";
import path from "node:path";

import { populateYswsData } from "#root/config";
import { client } from "#root/lib/client";
import { autoEnd } from "./utils/autoEnd";

populateYswsData();

const commandsDir = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx"));

for (const file of commandFiles) {
  const commandPath = path.join(commandsDir, file);
  const commandModule = require(commandPath);
  const command = path.basename(file, path.extname(file));

  if (commandModule.default) {
    client.logger.info(`Registering command: ${command}`);
    client.command(`/${command}`, commandModule.default);
  }
}

const actionsDir = path.join(__dirname, "actions");
const actionFiles = fs
  .readdirSync(actionsDir)
  .filter((file) => file.endsWith(".js") || file.endsWith(".jsx"));

for (const file of actionFiles) {
  const actionPath = path.join(actionsDir, file);
  const actionModule = require(actionPath);

  if (actionModule.default && actionModule.name) {
    client.logger.info(`Registering action: ${actionModule.name}`);
    client.action(actionModule.name, actionModule.default);
  }
}

const main = async () => {
  client.logger.info("⚡️ Starting Bolt app...");
  await client.start();
  client.logger.info("⚡️ Bolt app is running!");

  setInterval(() => {
    autoEnd();
  }, 30 * 60 * 1000);
};

main();

export { client };
