/** @jsxImportSource jsx-slack */
import { JSXSlack, Blocks, Section, Actions, Button, Divider } from "jsx-slack";
import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";
import { client } from "#root/app";
import { yswsData } from "#root/config";
import { showData } from "#root/utils/showData";

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

  await respond({
    blocks: JSXSlack(
      <Blocks>
        <Section>
          <b>✨ Active YSWS Programs ✨</b>
        </Section>
        <Divider />
        {data}
        <Actions>
          <Button actionId="next_limited_5_5">Next 5 YSWS</Button>
        </Actions>
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
