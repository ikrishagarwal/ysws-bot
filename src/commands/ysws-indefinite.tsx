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
    `Received /ysws-indefinite command from user: ${command.user_id}`
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
    await respond({
      text: "YSWS data is not available.",
      replace_original: true,
    });
    return;
  }

  const indefinitePrograms = yswsData["indefinite"];
  if (!indefinitePrograms || indefinitePrograms.length === 0) {
    await respond({
      text: "No indefinite YSWS programs found.",
      replace_original: true,
    });
    return;
  }

  const data = showData(indefinitePrograms, 0, 5);

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
          <b>✨ Indefinite YSWS Programs ✨</b>
        </Section>
        <Divider />
        {data}
        {indefinitePrograms.length > 5 && (
          <Actions>
            <Button actionId="indefinite_5_5">Next 5 YSWS ➡️</Button>
          </Actions>
        )}
      </Blocks>
    ),
    response_type: "in_channel",
    replace_original: true,
  });
};
