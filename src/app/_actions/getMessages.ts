"use server";

import { promises as fs } from "fs";
import { unstable_cache } from "next/cache";
import { Discord } from "@/app/chats/_types/Discord";

export const getMessages = unstable_cache(
  async ({
    channel,
    page = ["1"],
    messageIds,
    query,
  }: {
    channel: string;
    page?: string | string[];
    messageIds?: string[][];
    query?: string;
  }): Promise<{
    data: [string, Discord.Message[]][];
    total: number;
    attachments: Discord.Attachment[];
    calls: Required<Discord.Message>["call"][];
    authors: [string, Discord.Author][];
  }> => {
    const dir = `${process.cwd()}/src/app/_messages/${channel}`;
    const pages = (await fs.readdir(dir)).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );

    const pagesArray = Array.isArray(page) ? page : [page];
    const hasQuery = query !== undefined && query.length > 3;
    const files = hasQuery ? pages : pagesArray;

    let filteredData = await Promise.all(
      files.map<Promise<[string, Discord.Message[]]>>(async (file, i) => {
        const data = await fs.readFile(`${dir}/${file}/data.json`, {
          encoding: "utf-8",
          flag: "r",
        });

        const json = updatedAttachmentsUrl(
          JSON.parse(data) as Discord.Message[],
          { channel, page: file }
        );

        if (query) {
          return [
            file,
            json.filter((message) =>
              message.content.toLowerCase().includes(query.toLowerCase())
            ),
          ];
        }

        if (messageIds?.[i]) {
          return [
            file,
            json.filter((message) => messageIds[i]?.includes(message.id)),
          ];
        }

        return [file, json];
      })
    );

    filteredData = filteredData.filter(([, messages]) => messages.length);

    const authors = new Map<string, Discord.Author>();
    let allAttachments: Discord.Attachment[] = [];
    let allCalls: Required<Discord.Message>["call"][] = [];

    filteredData.forEach(([_page, messages]) => {
      messages.forEach((message) => {
        const { attachments, call, author } = message;

        if (attachments.length) {
          allAttachments = allAttachments.concat(attachments);
        }

        if (call) {
          allCalls = allCalls.concat(call);
        }

        if (!authors.get(author.id)) {
          authors.set(author.id, author);
        }
      });
    });

    return {
      data: filteredData.length ? filteredData : [["", []]],
      total: pages.length,
      attachments: allAttachments,
      calls: allCalls,
      authors: Array.from(authors),
    };
  }
);

const formatMessages = <T>(
  format: (message: Discord.Message, options?: T) => Discord.Message
) => {
  return (messages: Discord.Message[], options: T) => {
    return messages.map((message) => format(message, options));
  };
};

const updatedAttachmentsUrl = formatMessages<{
  page: string;
  channel: string;
}>((message, options) => {
  if (!options) {
    return message;
  }

  const { attachments } = message;
  const { channel, page } = options;

  return {
    ...message,
    page,
    attachments: attachments.map((attachment) => {
      return {
        ...attachment,
        url: `/img/chats/${channel}/${page}/${attachment.id}_${attachment.filename}`,
      };
    }),
  };
});
