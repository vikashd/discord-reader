import cx from "classnames";
import Image from "next/image";
import { EmbedProps } from "./Embed";

export const Reactions: EmbedProps = ({ message, options }) => {
  if (!message.reactions) {
    return [];
  }

  return [
    <div
      key={message.id}
      className={cx("flex mb-1", { "justify-end": options?.align === "right" })}
    >
      {message.reactions.map(({ emoji: { id, name }, count }) => {
        return (
          <div
            key={name}
            id={`${message.id}-reactions`}
            className="flex items-center gap-1 bg-slate-600 rounded-md px-1 py-[2px]"
          >
            {id ? (
              <Image
                src={`https://cdn.discordapp.com/emojis/${id}.webp`}
                width={32}
                height={32}
                className="w-4 h-4"
                alt={name}
                title={name}
              />
            ) : (
              <span>{name}</span>
            )}
            {count}
          </div>
        );
      })}
    </div>,
  ];
};
