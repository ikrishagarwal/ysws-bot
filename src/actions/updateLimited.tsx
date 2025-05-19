/** @jsxImportSource jsx-slack */
import { JSXSlack, Blocks, Section, Actions, Button, Divider } from "jsx-slack";
import type { BlockAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { client } from "#root/app";
import { yswsData } from "#root/config";
import { showData } from "#root/utils/showData";

export const name = /limited_\d+_\d+/;
export default async ({
  body,
  ack,
  respond,
}: SlackActionMiddlewareArgs<BlockAction>) => {
  client.logger.info(`Received button response from user: ${body.user.id}`);

  await ack();

  if (!yswsData) {
    await respond("YSWS data is not available.");
    return;
  }

  const activePrograms = yswsData["limitedTime"];
  if (!activePrograms || activePrograms.length === 0) {
    await respond("No active YSWS programs found.");
    return;
  }

  const start = parseInt(body.actions[0].action_id.split("_")[1]);
  const count = parseInt(body.actions[0].action_id.split("_")[2]);

  const data = showData(activePrograms, start, count);

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
          {yswsData["limitedTime"].length > start + count && (
            <Button actionId={`limited_${start + count}_${count}`}>
              Next 5 YSWS ➡️
            </Button>
          )}
          {start > 0 && (
            <Button actionId={`limited_${start - count}_${count}`}>
              ⬅️ Previous 5 YSWS
            </Button>
          )}
        </Actions>
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
