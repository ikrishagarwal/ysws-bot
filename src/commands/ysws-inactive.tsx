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
    await respond({
      text: "YSWS data is not available.",
      replace_original: true,
    });
    return;
  }

  const inactivePrograms = yswsData["ended"];
  if (!inactivePrograms || inactivePrograms.length === 0) {
    await respond({
      text: "No inactive YSWS programs found.",
      replace_original: true,
    });
    return;
  }

  const data = showData(inactivePrograms, 0, 5);

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
          <b>✨ Inactive YSWS Programs ✨</b>
        </Section>
        <Divider />
        {data}
        {inactivePrograms.length > 5 && (
          <Actions>
            <Button actionId="ended_5_5">Next 5 YSWS ➡️</Button>
          </Actions>
        )}
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
