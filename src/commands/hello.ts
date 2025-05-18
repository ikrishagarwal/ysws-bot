import { client } from "#root/app";
import type { SlackCommandMiddlewareArgs } from "@slack/bolt";

export default async ({
  command,
  ack,
  respond,
}: SlackCommandMiddlewareArgs) => {
  client.logger.info(`Received /hello command from user: ${command.user_id}`);
  await ack();

  await respond({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${command.user_name}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    response_type: "in_channel",
    text: `Hey there <@${command.user}>!`,
  });
};
