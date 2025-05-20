/** @jsxImportSource jsx-slack */
import { JSXSlack, Blocks, Section, Actions, Button, Divider } from "jsx-slack";
import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";
import { yswsData } from "#root/config";
import { showData } from "#root/utils/showData";

export default async ({
  ack,
  respond,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  await ack();

  if (!yswsData) {
    await respond({
      text: "YSWS data is not available.",
      replace_original: true,
    });
    return;
  }

  const draftPrograms = yswsData["drafts"];
  if (!draftPrograms || draftPrograms.length === 0) {
    await respond({
      text: "No draft YSWS programs found.",
      replace_original: true,
    });
    return;
  }

  const data = showData(draftPrograms, 0, 5);

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
          <b>✨ Draft YSWS Programs ✨</b>
        </Section>
        <Divider />
        {data}
        {draftPrograms.length > 5 && (
          <Actions>
            <Button actionId="drafts_5_5">Next 5 YSWS ➡️</Button>
          </Actions>
        )}
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
