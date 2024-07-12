import clsx from "clsx";
import { StarSolid } from "iconoir-react";
import React from "react";
import { Discord } from "@/app/chats/_types/Discord";
import {
  Emotes,
  format,
  Gif,
  Image,
  Instagram,
  Mentions,
  Stickers,
  Twitter,
  YouTube,
} from "./embeds";
import { getLinks } from "./getLinks";
import { LinkTypes } from "./isLinkType";

const RENDER_AS_LINKS: LinkTypes[] = [
  "gif",
  "href",
  "instagram",
  "twitch",
  "twitter",
  "youtube",
];

export function renderContent(
  message: Discord.Message,
  isReply?: boolean,
  options?: {
    align?: "left" | "right";
    authors?: Map<string, Discord.Author>;
    onClick?(id: string): void;
    isFavourite?: boolean;
    hideEmbed?: boolean;
  }
) {
  let updated = message.content;
  let embeds: React.ReactNode[] = [];

  if (isReply && !updated) {
    return <span className="italic">Reply to {message.id}</span>;
  }

  if (!isReply) {
    const map = getLinks([message]);

    RENDER_AS_LINKS.forEach((type) => {
      map.get(type)?.forEach(({ url }) => {
        updated = updated.replace(
          url,
          `<a href="${url}" target="_blank" class="text-blue-400" />${url}</a>`
        );
      });
    });

    const images = map.get("image") || [];

    const updatedImageUrlsRemoved = images.reduce((acc, image) => {
      return acc.replace(image.url, "");
    }, updated);

    if (images.length && !updatedImageUrlsRemoved) {
      updated = updatedImageUrlsRemoved;
    }

    embeds = [
      { component: Gif, hide: options?.hideEmbed },
      { component: Image },
      { component: Instagram, hide: options?.hideEmbed },
      { component: YouTube, hide: options?.hideEmbed },
      { component: Twitter, hide: options?.hideEmbed },
      { component: Stickers },
    ].reduce((acc, { component: Embed, hide }, i) => {
      if (hide) {
        return acc;
      }

      return acc.concat(
        <React.Fragment key={`${Embed.name}-${i}`}>
          {Embed({
            message,
            options: { align: options?.align },
          })}
        </React.Fragment>
      );
    }, embeds);
  }

  updated = Emotes({ content: updated, message });
  updated = options?.authors
    ? Mentions({ content: updated, authors: options.authors })
    : updated;

  updated = format({ content: updated });

  const content = (
    <span
      className={clsx("break-words whitespace-pre-line", {
        "line-clamp-2": isReply && !options?.hideEmbed,
        "line-clamp-3": options?.hideEmbed,
      })}
      dangerouslySetInnerHTML={{ __html: updated }}
    />
  );

  if (isReply) {
    return content;
  }

  const favButton = (
    <button
      type="button"
      className={clsx("align-sub px-1", {
        "-ml-1": options?.hideEmbed || options?.align === "right",
        "my-1": options?.hideEmbed && updated,
      })}
      onClick={() => options?.onClick?.(message.id)}
    >
      <StarSolid
        className={clsx(
          "opacity-0",
          { "group-hover:opacity-50": !options?.isFavourite },
          {
            "opacity-100 text-yellow-300 group-hover:text-white group-hover:opacity-100 transition-opacity":
              options?.isFavourite,
          }
        )}
        width={16}
        height={16}
      />
    </button>
  );

  return (
    <div className={clsx("group flex flex-col gap-1")}>
      {updated && (
        <span dir={options?.align === "right" ? "rtl" : "ltr"}>
          <span dir="ltr">{content}</span>
          {favButton}
        </span>
      )}
      {!updated ? (
        <Render align={options?.align}>
          {embeds}
          <div className="absolute top-0 right-0 bottom-0 left-0 w-4 h-4 m-auto">
            <span className="">{favButton}</span>
          </div>
        </Render>
      ) : (
        embeds
      )}
    </div>
  );
}

const Render = ({
  children,
  align,
}: {
  align?: "left" | "right";
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={clsx("relative mb-1", {
        "ml-auto": align === "right",
        "mr-auto": align !== "right",
      })}
    >
      {children}
    </div>
  );
};
