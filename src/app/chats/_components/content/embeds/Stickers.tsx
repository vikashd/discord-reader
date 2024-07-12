import clsx from "clsx";
import Image from "next/image";
import { EmbedProps } from "./Embed";

export const Stickers: EmbedProps = ({ message, options }) => {
  const { sticker_items } = message;

  if (!sticker_items) {
    return [];
  }

  return sticker_items.map(({ id, name }) => {
    return (
      <div
        key={id}
        className={clsx("flex mb-1 max-w-[160px]", {
          "ml-auto": options?.align === "right",
        })}
      >
        <Image
          src={`https://media.discordapp.net/stickers/${id}.webp?size=320`}
          width={160}
          height={160}
          className="max-w-full"
          alt={name}
        />
      </div>
    );
  });
};
