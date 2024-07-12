"use client";

import {
  useVirtuosoMethods,
  VirtuosoMessageList,
  VirtuosoMessageListLicense,
  VirtuosoMessageListMethods,
  VirtuosoMessageListProps,
} from "@virtuoso.dev/message-list";
import clsx from "clsx";
import { DateTime } from "luxon";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Discord } from "@/app/chats/_types/Discord";
import { useMeasure } from "@/app/_hooks";
import { Message } from "./Message";
import { MessagesContext } from "./MessagesContext";

interface MessageContext {
  references: Map<string, Discord.Message | null>;
  channel: string;
  page: string;
  blur?: boolean;
  showLink?: boolean;
}

interface MessagesListProps {
  pages: [string, Discord.Message[]][];
}

export function MessagesList({ pages }: MessagesListProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const { blur } = useContext(MessagesContext);
  const messageListRef =
    useRef<VirtuosoMessageListMethods<Discord.Message, MessageContext>>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [listHeight, setListHeight] = useState<number | undefined>(undefined);
  const [show, setShow] = useState(false);
  const updated = useRef(false);

  const messages = useMemo(() => {
    return pages.map(([, messages]) => messages).flat();
  }, [pages]);

  const references = useMemo(() => {
    const messagesReversed = [...messages].reverse();

    const references = messagesReversed.reduce<
      Map<string, Discord.Message | null>
    >((acc, message) => {
      if (message.message_reference) {
        acc.set(message.message_reference.message_id, null);
      }

      if (acc.has(message.id)) {
        acc.set(message.id, message);
      }

      return acc;
    }, new Map<string, Discord.Message | null>());

    return references;
  }, [messages]);

  useEffect(() => {
    if (!updated.current) {
      updated.current = true;
      messageListRef.current?.data.append(messages);
    }
  }, [messages]);

  useEffect(() => {
    let index = -1;

    if (window.location.hash === "#top") {
      index = 0;
    } else if (window.location.hash === "#bottom") {
      index = messages.length - 1;
    } else {
      index = messages.findIndex(
        ({ id, attachments }) =>
          `#${id}` === window.location.hash ||
          attachments.some(({ id }) => `#${id}` === window.location.hash)
      );
    }

    if (index > -1 && show) {
      messageListRef.current?.scrollToItem({
        index,
        align: window.location.hash === "#bottom" ? "end" : "start",
      });
    }
  }, [params, messages, show]);

  useEffect(() => {
    function onResize() {
      setListHeight(window.innerHeight - (ref.current?.offsetTop || 0) - 32);
    }

    window.addEventListener("resize", onResize);
    onResize();

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const showLink = (searchParams.get("query")?.length || 0) >= 3;

  return (
    <div ref={ref} style={{ height: listHeight }}>
      <VirtuosoMessageListLicense licenseKey="">
        <VirtuosoMessageList<Discord.Message, MessageContext>
          ref={messageListRef}
          className={clsx(
            "px-4 mt-8 transition-opacity duration-500 delay-150 h-full",
            {
              "opacity-0": !show,
            }
          )}
          computeItemKey={({ data }) => data.id}
          ItemContent={ItemContent}
          context={{
            references,
            channel: params.channel as string,
            page: params.page as string,
            blur,
            showLink,
          }}
          EmptyPlaceholder={() => <Empty callback={() => setShow(true)} />}
        />
      </VirtuosoMessageListLicense>
    </div>
  );
}

const Empty = ({ callback }: { callback(): void }) => {
  useEffect(() => {
    return () => {
      callback();
    };
  }, [callback]);

  return <span className="text-xs">No messages</span>;
};

const ItemContent: VirtuosoMessageListProps<
  Discord.Message,
  MessageContext
>["ItemContent"] = ({
  data: message,
  prevData: prevMessage,
  context: { references, channel, page, blur, showLink },
}) => {
  const { id, message_reference, author } = message;
  const hasReply = references.has(message_reference?.message_id!);
  const replyMessage = references.get(message_reference?.message_id!);
  const alignRight =
    message.author.id === process.env.NEXT_PUBLIC_DISCORD_USER_ID;
  const showAuthor = author.id !== prevMessage?.author.id;
  const currentDay = DateTime.fromISO(message.timestamp);
  const prevDay = prevMessage && DateTime.fromISO(prevMessage?.timestamp);
  const searchParams = useSearchParams();

  const methods = useVirtuosoMethods<Discord.Message, {}>();
  const [ref, bounds] = useMeasure<HTMLDivElement>();

  useEffect(() => {
    methods.data.map((item) => {
      return item.id === ref.current?.getAttribute("id") &&
        (item.embeds || item.attachments)
        ? { ...item }
        : item;
    });
  }, [bounds?.height]);

  return (
    <div>
      {currentDay.toISODate() !== prevDay?.toISODate() && (
        <div className="flex justify-center my-4">
          <span className="rounded-xl bg-slate-500 text-slate-200 px-4 py-1 text-[9px]">
            {currentDay.toFormat("dd LLLL yyyy")}
          </span>
        </div>
      )}
      <div className={clsx({ "text-right": alignRight })}>
        {showAuthor && (
          <div
            className={clsx("flex gap-2 items-center pt-3 mt-2 mb-2 z-10", {
              "justify-start flex-row-reverse": alignRight,
              "blur-sm": blur,
            })}
          >
            <Image
              src={`https://cdn.discordapp.com/avatars/${author.id}/${author.avatar}.webp?size=160`}
              width={40}
              height={40}
              className="rounded-full"
              alt={author.username}
            />
            <span className="text-xs font-medium">{author.global_name}</span>
          </div>
        )}
        <Message
          ref={ref}
          key={id}
          id={id}
          message={message}
          page={page}
          align={alignRight ? "right" : "left"}
          replyToMessage={replyMessage || (hasReply ? true : null)}
          url={
            showLink
              ? `/chats/${channel}/${message.page}#${message.id}`
              : undefined
          }
        />
      </div>
    </div>
  );
};
