import cx from "classnames";
import { MicrophoneSolid } from "iconoir-react";
import { DateTime } from "luxon";
import { Discord } from "@/app/chats/_types/Discord";

interface CallProps {
  message: Discord.Message;
  options?: { align?: "left" | "right" };
}

export function Call({ message, options }: CallProps) {
  if (!message.call) {
    return null;
  }

  const { call, timestamp } = message;
  const { hours, minutes } = DateTime.fromISO(call.ended_timestamp)
    .diff(DateTime.fromISO(timestamp), ["hours", "minutes"])
    .toObject();

  return (
    <div
      className={cx("flex gap-1 items-center", {
        "justify-end": options?.align === "right",
      })}
    >
      <MicrophoneSolid className="text-green-600" />
      <span className="opacity-80">
        Started a call that lasted {hours ? `${hours} hr(s)` : undefined}
        {minutes ? ` ${Math.ceil(minutes)} minute(s)` : undefined}
      </span>
    </div>
  );
}
