import { yswsData } from "#root/config";

export function autoEnd() {
  if (!yswsData) return;

  const ended = [];
  const now = new Date();

  const limitedTimePrograms = [];

  for (const program of yswsData["limitedTime"]) {
    const deadline = new Date(program.deadline);
    if (program.status !== "ended" && now > deadline) {
      program.status = "ended";
      ended.push({ ...program });
    } else {
      limitedTimePrograms.push(program);
    }
  }

  if (ended.length > 0) {
    yswsData["ended"].push(...ended);
    yswsData["limitedTime"] = limitedTimePrograms;
  }
}
