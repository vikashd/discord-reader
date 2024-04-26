import { Calendar, MessageText } from "iconoir-react";
import { DateTime } from "luxon";
import { Discord } from "@/app/chats/_types/Discord";

interface ControlsProps {
  messages: Discord.Message[];
}

export function ControlExtras({ messages }: ControlsProps) {
  const from = messages[0]?.timestamp;
  const to = messages[messages.length - 1]?.timestamp;

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="flex items-center gap-1 pl-1">
        {!!(from && to) && (
          <>
            <Calendar width={14} height={14} />
            {DateTime.fromISO(from).toFormat("dd LLL yy")} -{" "}
            {DateTime.fromISO(to).toFormat("dd LLL yy")}
          </>
        )}
      </span>
      <span className="flex items-center gap-1">
        <MessageText width={14} height={14} className="-scale-x-100" />
        {messages.length}
      </span>
    </div>
  );
}
