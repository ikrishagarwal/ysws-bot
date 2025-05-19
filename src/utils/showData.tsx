/** @jsxImportSource jsx-slack */
import { Section, Divider, Context } from "jsx-slack";

import { Program } from "./fetchData";

export function showData(data: Program[], start: number, count: number) {
  if (data.length === 0 || start >= data.length) {
    return "No more data available.";
  }

  if (count <= 0) {
    return "Invalid count. Please provide a positive number.";
  }

  const end = Math.min(start + count, data.length);
  const slicedData = data.slice(start, end);

  return slicedData.map((program) => (
    <>
      <Section>
        🎓 <b>{program.name}</b>
        <br />
        {program.description}
      </Section>

      {program.detailedDescription && (
        <>
          <Context>{program.detailedDescription}</Context>
        </>
      )}

      <Divider />

      <Context>
        {/* deadline */}
        {program.deadline &&
          `🕓 ${formatDeadline(program.deadline, program.status)}  |  `}
        {/* status */}
        💬{"  "}
        {program.slack ? (
          <>
            <a href={`#${program.slack.split("/").at(-1)}`}>
              {<code>{program.slackChannel}</code>}
            </a>{" "}
            (<code>{program.slackChannel}</code>)
          </>
        ) : (
          <a href={program.slackChannel.replace("#", "@")} />
        )}
        {/* website */}
        {program.website && (
          <>
            {"  |  🌐 "}
            <a href={program.website}>Visit {program.name}</a>
          </>
        )}
      </Context>

      <Divider />
    </>
  ));
}

function formatDeadline(timeStr: string, status: string) {
  const now = new Date();

  switch (status) {
    case "draft":
      const opensDate = new Date(timeStr);
      if (now < opensDate) {
        return `Opens ${opensDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year:
            opensDate.getFullYear() !== new Date().getFullYear()
              ? "numeric"
              : undefined,
        })}`;
      }
      return "";

    case "ended":
      if (timeStr.match(/^\d{4}-\d{2}-\d{2}/) || timeStr.includes("T")) {
        const endedDate = new Date(timeStr);
        if (!isNaN(endedDate.getTime())) {
          return `Ended on ${endedDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year:
              endedDate.getFullYear() !== new Date().getFullYear()
                ? "numeric"
                : undefined,
          })}`;
        }
      }
      return timeStr;

    case "active":
      const deadline = new Date(timeStr);
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Ended";
      if (diffDays === 0) return "Ends today";
      if (diffDays === 1) return "Ends tomorrow";
      if (diffDays <= 7) return `${diffDays} days left`;
      if (diffDays <= 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} left`;
      }

      return `Ends ${deadline.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year:
          deadline.getFullYear() !== new Date().getFullYear()
            ? "numeric"
            : undefined,
      })}`;

    default:
      return "";
  }
}
