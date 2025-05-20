/** @jsxImportSource jsx-slack */
import type {
  AllMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from "@slack/bolt";
import { populateYswsData } from "#root/config";
import { loadPrograms } from "#root/utils/fetchData";

export default async ({
  ack,
  respond,
}: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
  await ack();

  const data = await loadPrograms();
  if (!data) {
    await respond({
      text: "YSWS data is not available.",
      replace_original: true,
    });
    return;
  }

  const programs = [];

  for (const programList of Object.values(data)) {
    programs.push(...programList);
  }

  if (!programs || programs.length === 0) {
    await respond({
      text: "YSWS API gave no data.",
      replace_original: true,
    });
    return;
  }

  populateYswsData(data);

  await respond({
    text: "YSWS data has been refreshed.",
    response_type: "in_channel",
    replace_original: true,
  });
};
