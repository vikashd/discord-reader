import { Discord } from "@/app/chats/_types/Discord";
import {
  type LinkTypeFunction,
  type LinkTypes,
  CONTENT_TYPES,
  getType,
  getUrls,
} from "./isLinkType";

export const getLinks = (
  messages: Discord.Message[],
  checks?: LinkTypeFunction[]
) => {
  const list = new Map<LinkTypes, { messageId: string; url: string }[]>();

  messages.forEach((message) => {
    const urls = getUrls(message.content);

    if (!urls?.length) {
      return;
    }

    urls.forEach((url) => {
      const key = getType({ message, url, checks });

      if (key) {
        let items = list.get(key);

        if (!items) {
          items = [];
          list.set(key, items);
        }

        items.push({ messageId: message.id, url: url.replace("~~", "") });
      }
    });
  });

  return list;
};

export const getLinksOfType = (
  messages: Discord.Message[],
  type: LinkTypes
) => {
  const check = CONTENT_TYPES.get(type);

  return (check ? getLinks(messages, [check]).get(type) : []) || [];
};
