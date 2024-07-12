import { Calendar, MessageText } from "iconoir-react";
import { DateTime } from "luxon";
import { Discord } from "@/app/chats/_types/Discord";

interface ControlsProps {
  messages: [string, Discord.Message[]][];
}

export function ControlExtras({ messages }: ControlsProps) {
  const from = messages[0][1][0]?.timestamp;
  const lastPage = messages[messages.length - 1][1];
  const to = lastPage[lastPage.length - 1]?.timestamp;

  const total = messages.reduce((acc, [, messages]) => {
    return acc + messages.length;
  }, 0);

  return (
    <div className="flex items-center gap-2 text-[11px]">
      {!!(from && to) && (
        <span className="flex items-center gap-1 pl-1">
          <Calendar width={14} height={14} />
          {DateTime.fromISO(from).toFormat("dd LLL yy")} -{" "}
          {DateTime.fromISO(to).toFormat("dd LLL yy")}
        </span>
      )}
      <span className="flex items-center gap-1">
        <MessageText width={14} height={14} className="-scale-x-100" />
        {total}
      </span>
    </div>
  );
}
