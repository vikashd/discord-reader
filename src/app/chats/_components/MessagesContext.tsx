"use client";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { createContext, useCallback, useEffect, useState } from "react";
import { Discord } from "@/app/chats/_types/Discord";
import { Favourites } from "./Favourites";

interface MessagesContextProviderProps {
  channel: string;
  authors?: Map<string, Discord.Author>;
  totalPages: number;
  children?: React.ReactNode;
}

interface ContextProps {
  authors?: Map<string, Discord.Author>;
  channel: string;
  blur?: boolean;
  favourites: Map<string, Map<string, string>>;
  totalPages: number;
  blurMessages(blur: boolean): void;
  toggleBlur(): void;
  closeFavourites(): void;
  addFavouriteMessage({
    page,
    message,
  }: {
    page: string;
    message: Discord.Message;
  }): void;
  removeFavouriteMessage({
    page,
    message,
  }: {
    page: string;
    message: Discord.Message;
  }): void;
  toggleFavouriteMessage({
    page,
    message,
  }: {
    page: string;
    message: Discord.Message;
  }): void;
}

export const MessagesContext = createContext<ContextProps>({
  totalPages: 0,
  channel: "",
  favourites: new Map(),
  blurMessages() {},
  toggleBlur() {},
  addFavouriteMessage() {},
  removeFavouriteMessage() {},
  toggleFavouriteMessage() {},
  closeFavourites() {},
});

const getFavouritesFromLocalStorage = (channel: string) => {
  const favs: { [key: string]: [string, string[]][] } = JSON.parse(
    localStorage.getItem("favourites") || `{ "${channel}": [] }`
  );

  const channelFavs = favs[channel] || [];

  return channelFavs.reduce((acc, [page, messages]) => {
    acc.set(page, new Map(messages.map((id) => [id, id])));

    return acc;
  }, new Map<string, Map<string, string>>());
};

export function MessagesContextProvider({
  channel,
  authors,
  totalPages,
  children,
}: MessagesContextProviderProps) {
  const [blur, setBlur] = useState(false);
  const [favourites, setFavouriteMessage] = useState<
    Map<string, Map<string, string>>
  >(new Map());
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateLocalStorage = (favourites: Map<string, Map<string, string>>) => {
    const localStorageFavs = JSON.parse(
      localStorage.getItem("favourites") || `{ "${channel}": [] }`
    );

    localStorageFavs[channel] = Array.from(favourites).map(
      ([page, messages]) => {
        const arr = Array.from(messages);

        return [page, arr.map(([id]) => id)];
      }
    );

    localStorage.setItem("favourites", JSON.stringify(localStorageFavs));
  };

  const addFavouriteMessage = useCallback(
    ({ page, message }: { page: string; message: Discord.Message }) => {
      setFavouriteMessage((prev) => {
        const messages = prev.get(page) || new Map<string, string>();

        const updated = new Map(prev).set(
          page,
          messages.set(message.id, message.id)
        );

        updateLocalStorage(updated);

        return updated;
      });
    },
    []
  );

  const removeFavouriteMessage = useCallback(
    ({ page, message }: { page: string; message: Discord.Message }) => {
      setFavouriteMessage((prev) => {
        const messages = prev.get(page);
        let updated = new Map(prev);

        messages?.delete(message.id);

        if (messages?.size === 0) {
          updated.delete(page);
        } else {
          updated = updated.set(page, messages!);
        }

        updateLocalStorage(updated);

        return updated;
      });
    },
    []
  );

  const toggleFavouriteMessage = useCallback(
    ({ page, message }: { page: string; message: Discord.Message }) => {
      if (favourites.get(page)?.get(message.id)) {
        removeFavouriteMessage({ page, message });
      } else {
        addFavouriteMessage({ page, message });
      }
    },
    [addFavouriteMessage, removeFavouriteMessage, favourites]
  );

  const closeFavourites = useCallback(() => {
    if (!searchParams.has("menu")) {
      return;
    }

    const updated = new URLSearchParams(searchParams);

    updated.delete("menu");

    router.push(`${pathname}?${updated.toString()}`, { scroll: false });
  }, [pathname, searchParams, router]);

  useEffect(() => {
    setFavouriteMessage(getFavouritesFromLocalStorage(channel));
  }, [channel]);

  useEffect(() => {
    const onKeyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeFavourites();
      }
    };

    window.addEventListener("keyup", onKeyUpHandler);

    return () => {
      window.removeEventListener("keyup", onKeyUpHandler);
    };
  }, [closeFavourites]);

  return (
    <MessagesContext.Provider
      value={{
        channel,
        authors,
        totalPages,
        blur,
        favourites,
        blurMessages: (flag: boolean) => setBlur(flag),
        toggleBlur: () => setBlur((prev) => !prev),
        addFavouriteMessage,
        removeFavouriteMessage,
        toggleFavouriteMessage,
        closeFavourites,
      }}
    >
      {children}
      <Favourites items={favourites} />
    </MessagesContext.Provider>
  );
}
