"use server";

import { promises as fs } from "fs";
import { unstable_cache } from "next/cache";
import {
  CONTENT_TYPES,
  LinkTypes,
} from "@/app/chats/_components/content/isLinkType";
// import { getLinksOfType } from "@/app/chats/[page]/_components/content/getLinks";
import { Discord } from "@/app/chats/_types/Discord";

export const getMessages = unstable_cache(
  async (
    folder: string,
    page: string[] | string = ["1"],
    messageIds?: string[][],
    filters?: LinkTypes[]
  ): Promise<{
    data: Discord.Message[][];
    total: number;
    attachments: Discord.Attachment[];
    calls: Required<Discord.Message>["call"][];
    authors: Map<string, Discord.Author>;
    authors1: [string, Discord.Author][];
  }> => {
    const dir = `${process.cwd()}/src/app/_messages/${folder}`;
    const pages = (await fs.readdir(dir)).sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10)
    );

    const pagesArray = Array.isArray(page) ? page : [page];

    const hasFilter = filters?.some((filter) => CONTENT_TYPES.get(filter));
    // const files = hasFilter ? pagesArray : pagesArray.map((i) => `${i}.json`);
    const files = pagesArray;

    const filteredData = await Promise.all(
      files.map(async (file, i) => {
        const data = await fs.readFile(`${dir}/${file}/data.json`, {
          encoding: "utf-8",
          flag: "r",
        });

        const json: Discord.Message[] = JSON.parse(data);

        if (messageIds?.[i]) {
          return json.filter((message) => messageIds[i]?.includes(message.id));
        }

        // return json.filter((message) => message.content.includes("berlin"));

        return json;

        // if (!hasFilter) {
        //   return json;
        // }

        // return json.reduce<Discord.Message[]>((acc, message) => {
        //   const hasLinks = getLinksOfType([message], filter).length;
        //   const hasAttachments = message.attachments.some(
        //     ({ content_type }) => !!content_type.match(/^image/)?.length
        //   );

        //   return hasLinks || hasAttachments ? acc.concat(message) : acc;
        // }, []);
      })
    );

    const authors = new Map<string, Discord.Author>();
    let allAttachments: Discord.Attachment[] = [];
    let allCalls: Required<Discord.Message>["call"][] = [];

    filteredData.forEach((messages) => {
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
      data: filteredData,
      total: pages.length,
      attachments: allAttachments,
      calls: allCalls,
      authors,
      authors1: Array.from(authors),
    };
  }
);
