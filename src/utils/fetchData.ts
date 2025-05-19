import { yswsDataUri } from "#root/config";
import { parse } from "yaml";

export async function loadPrograms() {
  let programs: ProgramData = {};
  try {
    const response = await fetch(yswsDataUri).then((res) => res.text());
    const rawPrograms: ProgramData = parse(response);

    const ended: Program[] = [];

    programs = Object.fromEntries(
      Object.entries(rawPrograms).map(([category, programsList]) => [
        category,
        programsList && Array.isArray(programsList)
          ? programsList.filter((program) => {
              if (
                program.status === "ended" ||
                isEventEnded(program.deadline)
              ) {
                ended.push({ ...program, status: "ended" });
                return false;
              }
              return true;
            })
          : [],
      ])
    );

    delete programs["ended"];
    if (ended.length > 0) {
      programs["ended"] = ended;
    }

    programs = Object.fromEntries(
      Object.entries(programs).filter(
        ([_, programsList]) => (programsList as Array<any>).length > 0
      )
    );

    return programs;
  } catch (error) {
    console.error("Error loading programs:", error);
  }

  return null;
}

function isEventEnded(deadline: string) {
  if (!deadline) return false;
  const now = new Date();
  const deadlineDate = new Date(deadline);
  return now > deadlineDate;
}

export interface Program {
  name: string;
  description: string;
  detailedDescription: string;
  website: string | null;
  slack: string;
  slackChannel: string;
  status: string;
  deadline: string;
}

export type ProgramData = {
  [key in
    | "limitedTime"
    | "indefinite"
    | "drafts"
    | "ended"
    | string]: Program[];
};
