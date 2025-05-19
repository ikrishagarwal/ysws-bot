/** @jsxImportSource jsx-slack */
import { JSXSlack, Blocks, Section, Actions, Button, Divider } from "jsx-slack";
import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";
import { client } from "#root/app";
import { yswsData } from "#root/config";
import { showData } from "#root/utils/showData";
import fs from "node:fs";
import path from "node:path";

export default async ({
  command,
  ack,
  respond,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  client.logger.info(
    `Received /ysws-programs command from user: ${command.user_id}`
  );

  await ack({
    blocks: JSXSlack(
      <Blocks>
        <Section>
          <b>Fetching YSWS Programs...</b>
          <br />
        </Section>
      </Blocks>
    ),
    response_type: "in_channel",
  });

  if (!yswsData) {
    await respond("YSWS data is not available.");
    return;
  }

  const activePrograms = yswsData["limitedTime"];
  if (!activePrograms || activePrograms.length === 0) {
    await respond("No active YSWS programs found.");
    return;
  }

  const data = showData(activePrograms, 0, 5);

  if (typeof data === "string") {
    await respond(data);
    return;
  }

  // write this in a file
  const filePath = path.join(__dirname, "..", "..", "ysws-programs.json");

  fs.writeFileSync(
    filePath,
    JSON.stringify(
      JSXSlack(
        <Blocks>
          <Section>
            <b>Active YSWS Programs</b>
            <br />
          </Section>
          {data}
          <Actions>
            <Button url="https://ysws.hackclub.com/">Visit YSWS</Button>
          </Actions>
        </Blocks>
      ),
      null,
      2
    )
  );

  await respond({
    blocks: JSXSlack(
      <Blocks>
        <Section>
          <b>✨ Active YSWS Programs ✨</b>
        </Section>
        <Divider />
        {data}
        <Actions>
          <Button actionId="next_5">Next 5 YSWS</Button>
        </Actions>
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
