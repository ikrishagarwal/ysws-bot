/** @jsxImportSource jsx-slack */
import { JSXSlack, Blocks, Section, Actions, Button, Divider } from "jsx-slack";
import type { BlockAction, SlackActionMiddlewareArgs } from "@slack/bolt";
import { yswsData } from "#root/config";
import { showData } from "#root/utils/showData";

export const name = /[a-zA-Z]+_\d+_\d+/;
export default async ({
  body,
  ack,
  respond,
}: SlackActionMiddlewareArgs<BlockAction>) => {
  await ack();

  if (!yswsData) {
    await respond({
      text: "YSWS data is unavailable.",
      replace_original: true,
    });
    return;
  }

  const label = body.actions[0].action_id.split("_")[0];
  const start = parseInt(body.actions[0].action_id.split("_")[1]);
  const count = parseInt(body.actions[0].action_id.split("_")[2]);

  if (!["limitedTime", "drafts", "ended", "indefinite"].includes(label)) return;

  const programs = yswsData[label];
  if (!programs || programs.length === 0) {
    await respond({
      text: `No ${label} YSWS programs found.`,
      replace_original: true,
    });
    return;
  }

  const data = showData(programs, start, count);

  if (typeof data === "string") {
    await respond({
      text: data,
      replace_original: true,
    });
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
          {start > 0 && (
            <Button
              actionId={`${label}_${Math.max(start - count, 0)}_${count}`}
            >
              ⬅️ Previous 5 YSWS
            </Button>
          )}
          {yswsData[label].length > start + count && (
            <Button actionId={`${label}_${start + count}_${count}`}>
              Next 5 YSWS ➡️
            </Button>
          )}
        </Actions>
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
