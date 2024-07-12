import clsx from "clsx";
import { Star } from "iconoir-react";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getMessages } from "@/app/_actions/getMessages";
import { Discord } from "@/app/chats/_types/Discord";
import { Loading } from "./Loading";
import { Message } from "./Message";

interface FavouritesProps {
  items: Map<string, Map<string, string>>;
}

export function Favourites({ items }: FavouritesProps) {
  const [favMessages, setFavMessages] =
    useState<[string, Discord.Message[]][]>();
  const params = useParams();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const favArray = Array.from(items);
    let mounted = true;

    const { pages, messageIds } = favArray.reduce<{
      pages: string[];
      messageIds: string[][];
    }>(
      (acc, [page, messageIds]) => {
        const messageIdsArray = Array.from(messageIds).map(([id]) => id);

        return {
          pages: acc.pages.concat(page),
          messageIds: acc.messageIds.concat([messageIdsArray]),
        };
      },
      { pages: [], messageIds: [] }
    );

    const load = async () => {
      setLoading(true);

      const response = await getMessages({
        channel: params.channel as string,
        page: pages,
        messageIds,
      });

      if (mounted) {
        setFavMessages(
          response.data.map(([, messages], i) => {
            return [pages[i], messages];
          })
        );

        setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [items, params.channel]);

  const isOpen = searchParams.has("menu");

  return (
    <div
      className={clsx(
        "fixed bg-slate-700/80 top-0 right-0 bottom-0 w-full max-w-[480px] px-4 py-12 transition-transform ease-out duration-200 transform-gpu overflow-y-auto",
        {
          "translate-x-0": isOpen,
          "translate-x-full": !isOpen,
        }
      )}
    >
      {loading && (
        <Loading className="absolute top-0 right-0 bottom-0 left-0 m-auto" />
      )}
      {!loading && !favMessages?.length && (
        <div className="flex gap-1 items-center text-xs">
          <Star width={14} height={14} />
          No favourites added
        </div>
      )}
      {favMessages?.map(([page, messages]) => {
        return (
          <div key={page} className="grid gap-2 mb-2">
            {messages.map((message) => {
              return (
                <Message
                  key={message.id}
                  message={message}
                  page={page}
                  isFavourite
                  showAuthor
                  url={`/chats/${params.channel}/${page}#${message.id}`}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
