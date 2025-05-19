import fs from "node:fs";
import path from "node:path";

import { setup } from "#root/config";
import { client } from "#root/lib/client";

setup();

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

client.action("button_click", async ({ body, ack, respond }) => {
  await ack();
  await respond(`<@${body.user.id}> clicked the button`);
});

const main = async () => {
  client.logger.info("⚡️ Starting Bolt app...");
  await client.start();
  client.logger.info("⚡️ Bolt app is running!");
};

main();

export { client };
