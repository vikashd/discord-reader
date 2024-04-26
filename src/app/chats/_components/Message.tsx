import cx from "classnames";
import {
  Link as LinkIcon,
  LongArrowUpLeft,
  LongArrowUpRight,
} from "iconoir-react";
import { DateTime } from "luxon";
import Link from "next/link";
import { forwardRef, useCallback, useContext } from "react";
import { Discord } from "@/app/chats/_types/Discord";
import { Attachment } from "./Attachment";
import { Call } from "./content/embeds";
import { renderContent } from "./content/renderContent";
import { MessagesContext } from "./MessagesContext";

interface MessageProps {
  id?: string;
  page: string;
  message: Discord.Message;
  replyToMessage?: Discord.Message | true | null;
  align?: "left" | "right";
  blur?: boolean;
  isFavourite?: boolean;
  url?: string;
  showAuthor?: boolean;
}

export const Message = forwardRef<HTMLDivElement, MessageProps>(
  function MessageComponent(
    {
      id,
      page,
      message,
      replyToMessage,
      align = "left",
      isFavourite,
      url,
      showAuthor,
    },
    ref
  ) {
    const { timestamp, attachments, edited_timestamp, author } = message;
    const date = DateTime.fromISO(timestamp);
    const { authors, blur, favourites, toggleFavouriteMessage } =
      useContext(MessagesContext);

    const toggleFavourite = useCallback(() => {
      toggleFavouriteMessage({ page, message });
    }, [toggleFavouriteMessage, page, message]);

    return (
      <div
        id={id}
        ref={ref}
        data-id={message.id}
        className={cx("text-xs py-1", {
          "pr-6": align === "left",
          "pl-6": align === "right",
          "blur-sm pointer-events-none": blur,
        })}
      >
        {replyToMessage && (
          <p
            className={cx(
              "inline-flex text-[11px] text-slate-500 leading-snug mb-1",
              {
                "flex-row-reverse": align === "right",
              }
            )}
          >
            <span className="flex flex-shrink-0 flex-col justify-end">
              {align === "right" ? (
                <LongArrowUpLeft
                  width={16}
                  height={16}
                  className="mt-[2.5px]"
                />
              ) : (
                <LongArrowUpRight
                  width={16}
                  height={16}
                  className="mt-[2.5px]"
                />
              )}
            </span>
            {replyToMessage === true ? (
              <span className="italic">Message could not be loaded</span>
            ) : (
              <Link href={`#${replyToMessage.id}`}>
                {renderContent(replyToMessage, true, { authors })}
              </Link>
            )}
          </p>
        )}
        <Call message={message} options={{ align: align }} />
        {showAuthor && (
          <div className="mb-1 font-medium">{author.global_name}</div>
        )}
        {renderContent(message, false, {
          align,
          authors,
          hideEmbed: showAuthor,
          onClick: () => toggleFavourite(),
          isFavourite: isFavourite || !!favourites.get(page)?.get(message.id),
        })}
        {attachments.length > 0 && (
          <div
            className={cx("flex flex-wrap gap-2 items-start", {
              "justify-end": align === "right",
            })}
          >
            {attachments.map((attachment) => {
              return <Attachment key={attachment.id} attachment={attachment} />;
            })}
          </div>
        )}
        <div
          className={cx("flex gap-2 items-center leading-none mt-1", {
            "justify-end": align === "right",
          })}
        >
          <span className="flex gap-1 items-center text-[9px]">
            <span className="opacity-60">
              {date.toLocaleString({
                ...DateTime.DATETIME_SHORT,
                second: "2-digit",
              })}
              {edited_timestamp && " (edited)"}
            </span>
            {url && (
              <Link href={url}>
                <LinkIcon width={11} height={11} />
              </Link>
            )}
          </span>
        </div>
      </div>
    );
  }
);
